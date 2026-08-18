import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

import { PaymentRequest } from "@/modules/pay-r/domain/entities/payment-request.entity.js";

import type { PaymentRequestReferenceGenerator } from "@/modules/pay-r/application/ports/payment-request-reference-generator.js";

import type { MerchantChargePolicy } from "../../domain/policies/merchant-charge.policy.js";

import type { CreateMerchantPaymentDto } from "../dto/create-merchant-payment.dto.js";

export class CreateMerchantPaymentUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly chargePolicy: MerchantChargePolicy,
    private readonly referenceGenerator: PaymentRequestReferenceGenerator,
  ) {}

  async execute(
    userId: string,
    dto: CreateMerchantPaymentDto,
  ): Promise<PaymentRequest> {
    const amount = BigInt(dto.amount);

    const expiresAt = new Date(dto.expiresAt);

    if (Number.isNaN(expiresAt.getTime())) {
      throw new Error("Invalid expiry date.");
    }

    return this.unitOfWork.execute(async (repos) => {
      const merchant = await repos.merchant.findByUserId(userId);

      if (!merchant) {
        throw new Error("Merchant account not found.");
      }

      if (!merchant.isActive()) {
        throw new Error("Merchant account is not active.");
      }

      const wallet = await repos.wallets.findByUserId(userId);

      if (!wallet) {
        throw new Error("Merchant wallet not found.");
      }

      if (!wallet.isActive()) {
        throw new Error("Merchant wallet is not active.");
      }

      if (wallet.currency !== dto.currency) {
        throw new Error("Currency mismatch.");
      }

      const feeAmount = this.chargePolicy.calculateCharge(amount);

      const paymentRequest = PaymentRequest.create({
        requesterId: merchant.userId,
        amount,
        feeAmount,
        currency: dto.currency,
        reference: this.referenceGenerator.generate(),
        expiresAt,
      });

      return repos.paymentRequest.create(paymentRequest);
    });
  }
}
