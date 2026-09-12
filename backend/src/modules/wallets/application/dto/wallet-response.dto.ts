import type {
  Wallet,
  WalletStatus,
} from "../../domain/entities/wallet.entity.js";

export interface WalletResponseDto {
  walletId: string;
  currency: string;
  balanceMinor: string;
  status: WalletStatus;
}

export const toWalletResponse = (wallet: Wallet): WalletResponseDto => ({
  walletId: wallet.id,
  balanceMinor: wallet.balanceMinor.toString(),
  currency: wallet.currency,
  status: wallet.status,
});
