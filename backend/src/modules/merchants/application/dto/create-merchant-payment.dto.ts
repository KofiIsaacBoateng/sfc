import { Currency } from "@/shared/domain/value-objects/currency.vo.js";

export interface CreateMerchantPaymentDto {
  amount: string;
  currency: Currency;
  expiresAt: Date;
}
