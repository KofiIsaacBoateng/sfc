import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { PaymentRequest } from "../../domain/entities/payment-request.entity.js";
import NotFoundError from "@/shared/errors/not-found.js";
import ConflictError from "@/shared/errors/conflict.js";
import ForbiddenError from "@/shared/errors/forbidden.js";

export class CancelPaymentRequestUseCase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(params: {
    paymentRequestId: string;
    merchantUserId: string;
  }): Promise<PaymentRequest> {
    return this.unitOfWork.execute(async (repos): Promise<PaymentRequest> => {
      const paymentRequest = await repos.paymentRequest.findById(
        params.paymentRequestId,
      );

      if (!paymentRequest) {
        throw new NotFoundError(undefined, "Payment request not found.");
      }

      if (paymentRequest.requesterId !== params.merchantUserId) {
        throw new ForbiddenError(
          undefined,
          "You are not allowed to cancel this payment request.",
        );
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

      paymentRequest.cancel();

      return repos.paymentRequest.update(paymentRequest);
    });
  }
}
