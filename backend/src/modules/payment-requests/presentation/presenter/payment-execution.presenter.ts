import type { Transaction } from "@/modules/transaction/domain/entities/transaction.entity.js";

export class PaymentExecutionPresenter {
  static toResponse(transaction: Transaction) {
    return {
      transactionId: transaction.id,
      reference: transaction.reference,
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      initiatedBy: transaction.initiatedBy,
      createdAt: transaction.createdAt.toISOString(),
    };
  }
}
