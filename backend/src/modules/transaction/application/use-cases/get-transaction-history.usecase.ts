import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

export class GetTransactionHistoryUseCase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(userId: string) {
    return this.unitOfWork.execute(async (repos) => {
      return repos.transaction.findByUserId(userId);
    });
  }
}
