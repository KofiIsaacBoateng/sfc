import type { EntryType } from "@/generated/client/client.js";
import type { LedgerEntryRepository } from "../../application/repository/ledger-entry.repository.js";
import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";

export class PrismaLedgerEntryRepository implements LedgerEntryRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async create(params: {
    transactionId: string;
    ledgerAccountId: string;
    entryType: EntryType;
    amount: bigint;
  }): Promise<void> {
    await this.prisma.ledgerEntry.create({
      data: {
        transactionId: params.transactionId,

        ledgerAccountId: params.ledgerAccountId,

        entryType: params.entryType,

        amount: params.amount,
      },
    });
  }
}
