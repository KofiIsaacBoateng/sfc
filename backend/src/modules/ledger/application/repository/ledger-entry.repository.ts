import type { EntryType } from "@/generated/client/client.js";

export interface LedgerEntryRepository {
  create(params: {
    transactionId: string;
    ledgerAccountId: string;
    entryType: EntryType;
    amount: bigint;
  }): Promise<void>;
}
