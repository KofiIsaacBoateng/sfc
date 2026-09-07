import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/shared/errors/index.js";

import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import { PaymentAuthorizationMethod } from "../../domain/entities/payment-authorization.entity.js";

import type { PinVerifier } from "../ports/pin-verifier.js";
import type { PaymentRealtimeChannel } from "../ports/payment-realtime-channel.js";

export class BasicPaymentAuthorizationService {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly pinVerifier: PinVerifier,
    private readonly realtimeChannel: PaymentRealtimeChannel,
  ) {}

  async authorize(params: {
    paymentRequestId: string;
    authorizationId: string;
    userId: string;
    pin: string;
  }) {
    const valid = await this.pinVerifier.verify({
      userId: params.userId,
      pin: params.pin,
    });

    if (!valid) {
      throw new UnauthorizedError(undefined, "Invalid PIN.");
    }

    let result = await this.unitOfWork.execute(async (repos) => {
      const authorization = await repos.paymentAuthorization.findById(
        params.authorizationId,
      );

      if (!authorization) {
        throw new NotFoundError(undefined, "Payment authorization not found.");
      }

      if (authorization.paymentRequestId !== params.paymentRequestId) {
        throw new ConflictError(
          undefined,
          "Authorization does not belong to this payment request.",
        );
      }

      if (authorization.userId !== params.userId) {
        throw new UnauthorizedError(
          undefined,
          "Payment authorization does not belong to the authenticated user.",
        );
      }

      if (authorization.method !== PaymentAuthorizationMethod.PIN) {
        throw new ConflictError(
          undefined,
          "This payment does not require PIN authorization.",
        );
      }

      if (!authorization.isPending()) {
        throw new ConflictError(
          undefined,
          "Payment authorization is no longer pending.",
        );
      }

      if (authorization.isExpired()) {
        throw new ConflictError(
          undefined,
          "Payment authorization has expired.",
        );
      }

      authorization.authorize();

      return repos.paymentAuthorization.update(authorization);
    });

    await this.realtimeChannel.notifyAuthorizationResult({
      paymentRequestId: result.paymentRequestId,
      userId: result.userId,
      authorized: result.isAuthorized(),
    });

    return result;
  }
}
