import type { Currency } from "@/modules/wallets/domain/entities/wallet.entity.js";

export interface TransferMoneyDto {
  recipientWalletId: string;

  amount: string;

  currency: Currency;
}
