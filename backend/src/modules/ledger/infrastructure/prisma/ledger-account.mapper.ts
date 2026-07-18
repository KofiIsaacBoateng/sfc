import type {
  LedgerAccount as PrismaLedgerAccount,
  Prisma,
} from "@/src/generated/client/client.js";
import { LedgerAccount } from "../../domain/entities/ledger-account.entity.js";

export class LedgerAccountMapper {
  static toDomain(raw: PrismaLedgerAccount): LedgerAccount {
    return LedgerAccount.restore({
      id: raw.id,
      walletId: raw.walletId,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(
    ledgerAccount: LedgerAccount,
  ): Prisma.LedgerAccountUncheckedCreateInput {
    return {
      id: ledgerAccount.id,
      walletId: ledgerAccount.walletId,
    };
  }
}
