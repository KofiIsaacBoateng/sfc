import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";

export class ExpirePaymentRequestUseCase {
  constructor(private readonly unitOfWork: UnitOfWork) {}

  async execute(): Promise<number> {
    return this.unitOfWork.execute(async (repos) => {
      return await repos.paymentRequest.expirePending(new Date());
    });
  }
}
