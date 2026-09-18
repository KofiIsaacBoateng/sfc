import type { TransactionRepository } from "../../domain/repositories/transaction.repository.js";

export class GetTransactionHistoryUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(userId: string) {
    return this.transactionRepository.findByUserId(userId);
  }
}
