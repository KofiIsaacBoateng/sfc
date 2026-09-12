import type { Currency } from "@/shared/domain/value-objects/currency.vo.js";
import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../../domain/entities/transaction.entity.js";

export interface TransactionResponseDto {
  id: string;
  reference: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency: Currency;
  initiatedBy: string;
  createdAt: Date;
}

export const toTransactionResponse = (
  transaction: Transaction,
): TransactionResponseDto => ({
  id: transaction.id,
  reference: transaction.reference,
  type: transaction.type,
  status: transaction.status,
  amount: transaction.amount.toString(),
  currency: transaction.currency,
  initiatedBy: transaction.initiatedBy,
  createdAt: transaction.createdAt,
});
