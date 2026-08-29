import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import type { PinVerifier } from "../ports/pin-verifier.js";

import type { PaymentAuthorizationNotifier } from "../ports/payment-authorization-notifier.js";

import {
  PaymentAuthorization,
  PaymentAuthorizationChannel,
  PaymentAuthorizationMethod,
} from "../../domain/entities/payment-authorization.entity.js";

import type { AuthorizeBasicPaymentDto } from "../dto/authorize-basic-payment.dto.js";
import NotFoundError from "@/shared/errors/not-found.js";
import UnauthorizedError from "@/shared/errors/unauthorized.js";
import ConflictError from "@/shared/errors/conflict.js";
import ForbiddenError from "@/shared/errors/forbidden.js";

export class BasicPaymentAuthorizationervice {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly pinVerifier: PinVerifier,
    private readonly notifier: PaymentAuthorizationNotifier,
  ) {}

  async requestAuthorization(params: {
    paymentRequestId: string;
    userId: string;
    expiresAt: Date;
  }): Promise<PaymentAuthorization> {
    return this.unitOfWork.execute(async (repos) => {
      /** find payment requeset */
      const paymentRequest = await repos.paymentRequest.findById(
        params.paymentRequestId,
      );

      /** validate payment request */
      if (!paymentRequest) {
        throw new NotFoundError(undefined, "Payment request not found.");
      }

      if (!paymentRequest.isPending()) {
        throw new ConflictError(undefined, "Payment request is not pending.");
      }

      if (paymentRequest.isExpired()) {
        throw new ConflictError(undefined, "Payment request has expired.");
      }

      if (paymentRequest.requesterId === params.userId) {
        throw new ForbiddenError(
          undefined,
          "Merchant cannot authorize their own payment request.",
        );
      }

      /*** create authorization entity for basic */
      const authorization = PaymentAuthorization.create({
        paymentRequestId: params.paymentRequestId,
        userId: params.userId,
        method: PaymentAuthorizationMethod.PIN,
        channel: PaymentAuthorizationChannel.APP,
        expiresAt: params.expiresAt,
      });

      /*** persist pending authorization */
      const created = await repos.paymentAuthorization.create(authorization);

      /**** notify sender to authorize request */
      await this.notifier.notifyAuthorizationRequired({
        paymentRequestId: params.paymentRequestId,
        userId: params.userId,
        authorizationId: created.id,
        expiresAt: created.expiresAt,
      });

      return created;
    });
  }

  async authorize(
    userId: string,
    dto: AuthorizeBasicPaymentDto,
  ): Promise<PaymentAuthorization> {
    /*** verify pin */
    const valid = await this.pinVerifier.verify({
      userId,
      pin: dto.pin,
    });

    if (!valid) {
      throw new UnauthorizedError(undefined, "Invalid PIN.");
    }

    /*** authorize payment uow */
    return this.unitOfWork.execute(async (repos) => {
      const authorization =
        await repos.paymentAuthorization.findByPaymentRequestIdAndUserId(
          dto.paymentRequestId,
          userId,
        );

      if (!authorization) {
        throw new NotFoundError(undefined, "Payment authorization not found.");
      }

      if (!authorization.isPending()) {
        throw new ConflictError(
          undefined,
          "Payment authorization is no longer pending.",
        );
      }

      authorization.authorize();

      const updated = await repos.paymentAuthorization.update(authorization);

      /*** notify sender of successful auth */
      await this.notifier.notifyAuthorizationResult({
        paymentRequestId: dto.paymentRequestId,
        userId,
        authorized: true,
      });

      return updated;
    });
  }
}
