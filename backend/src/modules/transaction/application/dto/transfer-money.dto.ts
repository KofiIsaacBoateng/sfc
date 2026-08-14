import type { Currency } from "@/modules/wallets/domain/entities/wallet.entity.js";

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
