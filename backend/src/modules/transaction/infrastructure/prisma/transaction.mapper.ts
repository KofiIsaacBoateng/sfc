import type { Transaction as PrismaTransaction } from "@/generated/client/client.js";
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../../domain/entities/transaction.entity.js";
import { Currency } from "@/modules/wallets/domain/entities/wallet.entity.js";

export class TransactionMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.restore({
      ...raw,
      status: raw.status as TransactionStatus,
      type: raw.type as TransactionType,
      currency: Currency.GHS,
    });
  }

  static toPersistence(transaction: Transaction): PrismaTransaction {
    return {
      id: transaction.id,
      reference: transaction.reference,
      initiatedBy: transaction.initiatedBy,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      currency: transaction.currency,
      createdAt: transaction.createdAt,
    };
  }
}
