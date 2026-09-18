import NotFoundError from "@/shared/errors/not-found.js";
import type { WalletRepository } from "../../domain/repositories/wallets.repository.js";
import type { Wallet } from "../../domain/entities/wallet.entity.js";

export class GetMyWalletUseCase {
  constructor(private readonly walletRepository: WalletRepository) {}

  async execute(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundError("WALLET_NOT_FOUND", "Wallet not found!");
    }

    return wallet;
  }
}
