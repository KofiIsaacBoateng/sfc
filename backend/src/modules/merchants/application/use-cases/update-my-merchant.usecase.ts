import BadRequestError from "@/shared/errors/bad-request.js";
import type { Merchant } from "../../domain/entities/merchant.entity.js";
import type { MerchantRepository } from "../../domain/repositories/merchant.repository.js";
import NotFoundError from "@/shared/errors/not-found.js";

export class UpdateMyMerchantUseCase {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async execute(
    userId: string,
    dto: {
      businessName: string;
    },
  ): Promise<Merchant> {
    const businessName = dto.businessName.trim();

    if (!businessName) {
      throw new BadRequestError(undefined, "Business name is required.");
    }

    const merchant = await this.merchantRepository.findByUserId(userId);
    if (!merchant) {
      throw new NotFoundError("USER_NOT_FOUND", "Merchant not found.");
    }

    merchant.updateBusinessName(businessName);

    return this.merchantRepository.update(merchant);
  }
}
