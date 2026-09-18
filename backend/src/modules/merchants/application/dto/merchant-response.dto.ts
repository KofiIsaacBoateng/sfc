import type {
  Merchant,
  MerchantStatus,
} from "../../domain/entities/merchant.entity.js";

export interface MerchantResponseDto {
  id: string;
  userId: string;
  businessName: string;
  status: MerchantStatus;
  createdAt: Date;
  updatedAt: Date;
}

export const toMerchantResponse = (
  merchant: Merchant,
): MerchantResponseDto => ({
  id: merchant.id,
  userId: merchant.userId,
  businessName: merchant.businessName,
  status: merchant.status,
  createdAt: merchant.createdAt,
  updatedAt: merchant.updatedAt,
});
