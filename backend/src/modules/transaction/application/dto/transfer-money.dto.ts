import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";

export interface TransferMoneyDto {
  recipientWalletId: string;

  amount: string;

  currency: Currency;
}

export interface TransferResponseDto {
  transactionId: string;
  reference: string;
  status: string;
  type: string;
  amount: string;
  currency: Currency;
  initiatedBy: string;
  createdAt: string;
}
