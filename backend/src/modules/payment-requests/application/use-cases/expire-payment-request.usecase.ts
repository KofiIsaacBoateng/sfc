import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

export class ExpirePendingPaymentRequestsUseCase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(): Promise<number> {
    return this.unitOfWork.execute(async (repos): Promise<number> => {
      return await repos.paymentRequest.expirePending(new Date());
    });
  }
}
