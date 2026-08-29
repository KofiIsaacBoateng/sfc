import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import type { SfcDeviceVerifier } from "../ports/sfc-device-verifier.js";

import type { PaymentAuthorizationNotifier } from "../ports/payment-authorization-notifier.js";

import {
  PaymentAuthorization,
  PaymentAuthorizationChannel,
  PaymentAuthorizationMethod,
} from "../../domain/entities/payment-authorization.entity.js";

import type { AuthorizeSecurePaymentDto } from "../dto/authorize-secure-payment.dto.js";
import UnauthorizedError from "@/shared/errors/unauthorized.js";
import ForbiddenError from "@/shared/errors/forbidden.js";
import NotFoundError from "@/shared/errors/not-found.js";
import ConflictError from "@/shared/errors/conflict.js";

export class SecureSfcPaymentAuthorizationService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly sfcDeviceVerifier: SfcDeviceVerifier,
    private readonly notifier: PaymentAuthorizationNotifier,
  ) {}

  async authorize(
    userId: string,
    dto: AuthorizeSecurePaymentDto,
  ): Promise<PaymentAuthorization> {
    const verification = await this.sfcDeviceVerifier.verify({
      tagData: dto.tagData,
    });

    if (!verification.verified) {
      throw new UnauthorizedError(undefined, "SFC device verification failed.");
    }

    if (verification.securityTier !== "SECURE") {
      throw new ForbiddenError(
        undefined,
        "SFC device does not support secure payment authorization.",
      );
    }

    if (verification.userId !== userId) {
      throw new ForbiddenError(
        undefined,
        "SFC device does not belong to the authenticated user.",
      );
    }

    return this.unitOfWork.execute(async (repos) => {
      const paymentRequest = await repos.paymentRequest.findById(
        dto.paymentRequestId,
      );

      if (!paymentRequest) {
        throw new NotFoundError(undefined, "Payment request not found.");
      }

      if (!paymentRequest.isPending()) {
        throw new ConflictError(
          undefined,
          "Payment request is no longer pending.",
        );
      }

      if (paymentRequest.isExpired()) {
        throw new ConflictError(undefined, "Payment request has expired.");
      }

      if (paymentRequest.requesterId === userId) {
        throw new ForbiddenError(
          undefined,
          "Merchant cannot authorize their own payment request.",
        );
      }

      const authorization = PaymentAuthorization.create({
        paymentRequestId: dto.paymentRequestId,
        userId,
        method: PaymentAuthorizationMethod.SECURE_SFC,
        channel: PaymentAuthorizationChannel.APP,
        expiresAt: new Date(Date.now() + 30_000),
      });

      authorization.authorize();

      const created = await repos.paymentAuthorization.create(authorization);

      await this.notifier.notifyAuthorizationResult({
        paymentRequestId: dto.paymentRequestId,
        userId,
        authorized: true,
      });

      return created;
    });
  }
}
