import type { LedgerAccount as PrismaLedgerAccount } from "@/generated/client/client.js";
import {
  LedgerAccount,
  LedgerAccountType,
} from "../../domain/entities/ledger-account.entity.js";

export class LedgerAccountMapper {
  static toDomain(raw: PrismaLedgerAccount): LedgerAccount {
    return LedgerAccount.restore({
      id: raw.id,
      walletId: raw.walletId,
      code: raw.code,
      accountType: raw.accountType as LedgerAccountType,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(ledgerAccount: LedgerAccount): PrismaLedgerAccount {
    return {
      id: ledgerAccount.id,
      walletId: ledgerAccount.walletId,
      accountType: ledgerAccount.accountType,
      code: ledgerAccount.code,
      createdAt: ledgerAccount.createdAt,
    };
  }
}
