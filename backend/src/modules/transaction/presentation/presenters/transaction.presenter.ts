import type { Transaction } from "../../domain/entities/transaction.entity.js";
import type { TransferResponseDto } from "../../application/dto/transfer-money.dto.js";

export class TransactionPresenter {
  static toTransferResponse(transaction: Transaction): TransferResponseDto {
    return {
      transactionId: transaction.id,
      reference: transaction.reference,
      status: transaction.status,
      type: transaction.type,
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      initiatedBy: transaction.initiatedBy,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
