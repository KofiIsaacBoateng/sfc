import type { Wallet as PrismaWallet } from "@/generated/client/client.js";
import type { WalletRepository } from "../../domain/repositories/wallets.repository.js";
import {
  WalletStatus,
  type Wallet,
} from "../../domain/entities/wallet.entity.js";
import { WalletMapper } from "./wallet.mapper.js";
import BadRequestError from "@/shared/errors/bad-request.js";
import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";

export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  private toDomainOrNull(raw: PrismaWallet | null): Wallet | null {
    return raw ? WalletMapper.toDomain(raw) : null;
  }

  async findById(id: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({ where: { id } });

    return this.toDomainOrNull(wallet);
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });

    return this.toDomainOrNull(wallet);
  }

  async create(wallet: Wallet): Promise<Wallet> {
    const created = await this.prisma.wallet.create({
      data: WalletMapper.toPersistence(wallet),
    });

    return WalletMapper.toDomain(created);
  }

  async update(wallet: Wallet): Promise<Wallet> {
    const updated = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: WalletMapper.toPersistence(wallet),
    });

    return WalletMapper.toDomain(updated);
  }

  async debit(walletId: string, amountMinor: bigint): Promise<void> {
    if (amountMinor <= 0n) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Debit amount must be greater than zero.",
      );
    }

    const result = await this.prisma.wallet.updateMany({
      where: {
        id: walletId,
        status: WalletStatus.ACTIVE,
        balanceMinor: {
          gte: amountMinor,
        },
      },
      data: {
        balanceMinor: {
          decrement: amountMinor,
        },
      },
    });

    if (result.count !== 1) {
      throw new BadRequestError(
        "DEBIT_FAILED",
        "Insufficient funds or wallet unavailable.",
      );
    }
  }

  async credit(walletId: string, amountMinor: bigint): Promise<void> {
    if (amountMinor <= 0n) {
      throw new BadRequestError(
        "INVALID_AMOUNT",
        "Credit amount must be greater than zero.",
      );
    }

    const result = await this.prisma.wallet.updateMany({
      where: {
        id: walletId,
        status: WalletStatus.ACTIVE,
      },

      data: {
        balanceMinor: {
          increment: amountMinor,
        },
      },
    });

    if (result.count !== 1) {
      throw new BadRequestError(
        "CREDIT_FAILED",
        "Recipient wallet unavailable!",
      );
    }
  }
}
