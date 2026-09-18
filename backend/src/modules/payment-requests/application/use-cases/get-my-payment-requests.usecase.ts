import type { PaymentRequestRepository } from "../../domain/repositories/payment-request.repository.js";

export class GetMyPaymentRequestsUseCase {
  constructor(
    private readonly paymentRequestRepository: PaymentRequestRepository,
  ) {}

  async execute(requesterId: string) {
    return this.paymentRequestRepository.findByRequesterId(requesterId);
  }
}
