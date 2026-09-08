import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { PaymentRequestReferenceGenerator } from "../ports/payment-request-reference-generator.js";
import type { CreatePaymentRequestDto } from "../dto/create-payment-request.dto.js";
import { PaymentRequest } from "../../domain/entities/payment-request.entity.js";
import NotFoundError from "@/shared/errors/not-found.js";
import BadRequestError from "@/shared/errors/bad-request.js";

export class CreatePaymentRequestUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly referenceGenerator: PaymentRequestReferenceGenerator,
  ) {}

  async execute(
    requesterId: string,
    dto: CreatePaymentRequestDto,
  ): Promise<PaymentRequest> {
    const amount = BigInt(dto.amount);
    const expiresAt = new Date(dto.expiresAt);

    if (Number.isNaN(expiresAt.getTime())) {
      throw new BadRequestError(undefined, "Invalid expiry date.");
    }

    return this.unitOfWork.execute(async (repos) => {
      const existing = await repos.paymentRequest.findByIdempotencyKey(
        requesterId,
        dto.idempotencyKey,
      );

      if (existing) {
        if (existing.amount !== amount || existing.currency !== dto.currency) {
          throw new BadRequestError(
            undefined,
            "Idempotency key has already been used for a different payment request.",
          );
        }
        return existing;
      }

      const wallet = await repos.wallets.findByUserId(requesterId);

      if (!wallet) {
        throw new NotFoundError(
          "WALLET_NOT_FOUND",
          "Requester wallet not found.",
        );
      }

      if (!wallet.isActive()) {
        throw new BadRequestError(
          "WALLET_IS_INACTIVE",
          "Requester wallet is not active.",
        );
      }

      if (wallet.currency !== dto.currency) {
        throw new BadRequestError("CURRENCY_MISMATCH", "Currency mismatch.");
      }

      const paymentRequest = PaymentRequest.create({
        requesterId,
        amount,
        feeAmount: 0n /* TODO: make dynamic but no charge for now */,
        currency: dto.currency,
        idempotencyKey: dto.idempotencyKey,
        expiresAt,
        reference: this.referenceGenerator.generate(),
      });

      return repos.paymentRequest.create(paymentRequest);
    });
  }
}
