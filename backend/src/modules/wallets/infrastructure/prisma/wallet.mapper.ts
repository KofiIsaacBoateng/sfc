import {
  type Wallet as PrismaWallet,
  Prisma,
} from "@/src/generated/client/client.js";
import {
  Currency,
  Wallet,
  WalletStatus,
} from "@/src/modules/wallets/domain/entities/wallet.entity.js";

export class WalletMapper {
  static toDomain(raw: PrismaWallet): Wallet {
    return Wallet.restore({
      id: raw.id,
      userId: raw.userId,
      status: raw.status as WalletStatus,
      currency: raw.currency as Currency,
      updatedAt: raw.updatedAt,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(wallet: Wallet): Prisma.WalletUncheckedCreateInput {
    return {
      id: wallet.id,
      userId: wallet.userId,
      status: wallet.status,
      currency: wallet.currency,
    };
  }
}
