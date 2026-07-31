import NotFoundError from "@/shared/errors/not-found.js";
import type { WalletRepository } from "../../domain/repositories/wallets.repository.js";
import type { WalletResponseDto } from "../dto/wallet-response.dto.js";

export class GetMyWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  execute = async (userId: string): Promise<WalletResponseDto> => {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundError(undefined, "Wallet not found!");
    }

    return {
      walletId: wallet.id,
      currency: wallet.currency,
      balanceMinor: wallet.balanceMinor,
      status: wallet.status,
    };
  };
}
