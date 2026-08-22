import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";
import type { PaymentRequestRepository } from "../../domain/repositories/payment-request.repository.js";
import type { PaymentRequest } from "../../domain/entities/payment-request.entity.js";
import { PaymentRequestMapper } from "./payment-request.mapper.js";

export class PrismaPaymentRequestRepository implements PaymentRequestRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async create(request: PaymentRequest): Promise<PaymentRequest> {
    const raw = await this.prisma.paymentRequest.create({
      data: PaymentRequestMapper.toPersistence(request),
    });

    return PaymentRequestMapper.toDomain(raw);
  }

  async update(request: PaymentRequest): Promise<PaymentRequest> {
    const raw = await this.prisma.paymentRequest.update({
      where: {
        id: request.id,
      },
      data: PaymentRequestMapper.toPersistence(request),
    });

    return PaymentRequestMapper.toDomain(raw);
  }

  async claimPending(id: string): Promise<PaymentRequest | null> {
    const result = await this.prisma.paymentRequest.updateMany({
      where: {
        id,

        status: "PENDING",

        expiresAt: {
          gt: new Date(),
        },
      },

      data: {
        status: "PROCESSING",
        updatedAt: new Date(),
      },
    });

    if (result.count !== 1) {
      return null;
    }

    const request = await this.prisma.paymentRequest.findUnique({
      where: {
        id,
      },
    });

    return request ? PaymentRequestMapper.toDomain(request) : null;
  }

  async findById(id: string): Promise<PaymentRequest | null> {
    const raw = await this.prisma.paymentRequest.findUnique({ where: { id } });

    return raw ? PaymentRequestMapper.toDomain(raw) : null;
  }
}
