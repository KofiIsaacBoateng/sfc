import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import {
  PaymentAuthorization,
  PaymentAuthorizationChannel,
  PaymentAuthorizationMethod,
} from "../../domain/entities/payment-authorization.entity.js";

import type { SfcDeviceVerifier } from "../../../devices/application/ports/sfc-device-verifier.port.js";
import UnauthorizedError from "@/shared/errors/unauthorized.js";
import NotFoundError from "@/shared/errors/not-found.js";
import ConflictError from "@/shared/errors/conflict.js";
import ForbiddenError from "@/shared/errors/forbidden.js";
import type { PaymentRealtimeChannel } from "../ports/payment-realtime-channel.port.js";
import type { PaymentAuthorizationPolicy } from "../../domain/policies/payment-authorization.policy.js";
import type { HandleSfcTapDto } from "../dto/handle-sfc-tap.dto.js";

export class HandleSfcPaymentTapUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly sfcDeviceVerifier: SfcDeviceVerifier,
    private readonly authorizationPolicy: PaymentAuthorizationPolicy,
    private readonly realtimeChannel: PaymentRealtimeChannel,
  ) {}

  async execute(dto: HandleSfcTapDto): Promise<PaymentAuthorization> {
    /** VERIFY DEVICE */
    const verification = await this.sfcDeviceVerifier.verify({
      tagData: dto.tagData,
      secureSfcProof: dto.secureSfcProof,
    });

    if (!verification.verified) {
      throw new UnauthorizedError(undefined, "SFC device verification failed.");
    }

    return this.unitOfWork.execute(
      async (repos): Promise<PaymentAuthorization> => {
        const paymentRequest = await repos.paymentRequest.findById(
          dto.paymentRequestId,
        );

        if (!paymentRequest) {
          throw new NotFoundError(undefined, "Payment request not found.");
        }

        if (!paymentRequest.isPending()) {
          throw new ConflictError(undefined, "Payment request is not pending.");
        }

        if (paymentRequest.isExpired()) {
          throw new ConflictError(undefined, "Payment request has expired.");
        }

        if (paymentRequest.requesterId === verification.userId) {
          throw new ForbiddenError(
            undefined,
            "Merchant cannot authorize their own payment request.",
          );
        }

        const requiresAuthorization =
          this.authorizationPolicy.requiresCustomerAuthorization({
            amount: paymentRequest.amount,
            currency: paymentRequest.currency,
            securityTier: verification.securityTier,
          });

        const authorization = PaymentAuthorization.create({
          paymentRequestId: paymentRequest.id,
          userId: verification.userId,
          method: requiresAuthorization
            ? PaymentAuthorizationMethod.PIN
            : PaymentAuthorizationMethod.SECURE_SFC,
          channel: PaymentAuthorizationChannel.APP,
          duration: dto.authorizationDuration,
        });

        if (!requiresAuthorization) {
          authorization.authorize(); // authorize immediately
        }

        const created = await repos.paymentAuthorization.create(authorization);

        if (requiresAuthorization) {
          await this.realtimeChannel.notifyMerchantWaiting({
            paymentRequestId: paymentRequest.id,
            merchantUserId: paymentRequest.requesterId,
          });

          await this.realtimeChannel.notifyAuthorizationRequired({
            paymentRequestId: paymentRequest.id,
            authorizationId: created.id,
            userId: verification.userId,
            expiresAt: created.expiresAt,
          });
        } else {
          await this.realtimeChannel.notifyAuthorizationResult({
            paymentRequestId: created.paymentRequestId,
            userId: created.userId,
            authorized: created.isAuthorized(),
          });
        }

        return created;
      },
    );
  }
}
