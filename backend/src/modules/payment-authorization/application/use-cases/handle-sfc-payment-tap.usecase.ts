import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import {
  PaymentAuthorization,
  PaymentAuthorizationChannel,
  PaymentAuthorizationMethod,
} from "../../domain/entities/payment-authorization.entity.js";

import type { SfcDeviceVerifier } from "../ports/sfc-device-verifier.js";
import type { PaymentAuthorizationNotifier } from "../ports/payment-authorization-notifier.js";
import UnauthorizedError from "@/shared/errors/unauthorized.js";
import NotFoundError from "@/shared/errors/not-found.js";
import ConflictError from "@/shared/errors/conflict.js";
import ForbiddenError from "@/shared/errors/forbidden.js";

export class HandleSfcPaymentTapUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly sfcDeviceVerifier: SfcDeviceVerifier,
    private readonly notifier: PaymentAuthorizationNotifier,
  ) {}

  async execute(params: { paymentRequestId: string; tagData: string }) {
    const verification = await this.sfcDeviceVerifier.verify({
      tagData: params.tagData,
    });

    if (!verification.verified) {
      throw new UnauthorizedError(undefined, "SFC device verification failed.");
    }

    return this.unitOfWork.execute(async (repos) => {
      const paymentRequest = await repos.paymentRequest.findById(
        params.paymentRequestId,
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

      const method =
        verification.securityTier === "SECURE"
          ? PaymentAuthorizationMethod.SECURE_SFC
          : PaymentAuthorizationMethod.PIN;

      const channel = PaymentAuthorizationChannel.APP; // TODO: APP or USSD

      const authorization = PaymentAuthorization.create({
        paymentRequestId: paymentRequest.id,
        userId: verification.userId,
        method,
        channel,
        expiresAt: new Date(Date.now() + 30_000),
      });

      if (verification.securityTier === "SECURE") {
        authorization.authorize();
      }

      const created = await repos.paymentAuthorization.create(authorization);

      if (verification.securityTier === "BASIC") {
        await this.notifier.notifyAuthorizationRequired({
          paymentRequestId: paymentRequest.id,
          userId: verification.userId,
          authorizationId: created.id,
          expiresAt: created.expiresAt,
        });
      } else {
        await this.notifier.notifyAuthorizationResult({
          paymentRequestId: paymentRequest.id,
          userId: verification.userId,
          authorized: true,
        });
      }

      return created;
    });
  }
}
