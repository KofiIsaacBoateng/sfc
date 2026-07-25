import type {
  Wallet as PrismaWallet,
  Prisma,
  PrismaClient,
} from "@/generated/client/client.js";
import type { WalletRepository } from "../../domain/repositories/wallets.repository.js";
import type { Wallet } from "../../domain/entities/wallet.entity.js";
import { WalletMapper } from "./wallet.mapper.js";

type PrismaExecuter = Prisma.TransactionClient | PrismaClient;

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
}
