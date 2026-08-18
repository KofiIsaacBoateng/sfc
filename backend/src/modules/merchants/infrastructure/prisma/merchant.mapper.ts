import type { Merchant as PrismaMerchant } from "@/generated/client/client.js";

import {
  Merchant,
  MerchantStatus,
} from "../../domain/entities/merchant.entity.js";

export class MerchantMapper {
  static toDomain(raw: PrismaMerchant): Merchant {
    return Merchant.restore({
      ...raw,
      status: raw.status as MerchantStatus,
    });
  }

  static toPersistence(merchant: Merchant) {
    return {
      id: merchant.id,
      userId: merchant.userId,
      businessName: merchant.businessName,
      status: merchant.status,
      createdAt: merchant.createdAt,
    };
  }
}
