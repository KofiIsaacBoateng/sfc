import NotFoundError from "@/shared/errors/not-found.js";
import type { Merchant } from "../../domain/entities/merchant.entity.js";
import type { MerchantRepository } from "../../domain/repositories/merchant.repository.js";

export class GetMyMerchantUseCase {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async execute(userId: string): Promise<Merchant> {
    const merchant = await this.merchantRepository.findByUserId(userId);

    if (!merchant) {
      throw new NotFoundError("USER_NOT_FOUND", "Merchant not found.");
    }

    return merchant;
  }
}
