import type {
  Wallet,
  WalletStatus,
} from "../../domain/entities/wallet.entity.js";

export interface WalletResponseDto {
  walletId: string;
  userId: string;
  currency: string;
  balanceMinor: string;
  status: WalletStatus;
}

export const toWalletResponse = (wallet: Wallet): WalletResponseDto => ({
  walletId: wallet.id,
  userId: wallet.userId,
  balanceMinor: wallet.balanceMinor.toString(),
  currency: wallet.currency,
  status: wallet.status,
});
