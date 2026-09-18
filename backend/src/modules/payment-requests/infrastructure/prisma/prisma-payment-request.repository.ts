import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";
import type { PaymentRequestRepository } from "../../domain/repositories/payment-request.repository.js";
import {
  PaymentRequestStatus,
  type PaymentRequest,
} from "../../domain/entities/payment-request.entity.js";
import { PaymentRequestMapper } from "./payment-request.mapper.js";
import { Prisma } from "@/generated/client/client.js";
import ConflictError from "@/shared/errors/conflict.js";

export class PrismaPaymentRequestRepository implements PaymentRequestRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async findById(id: string): Promise<PaymentRequest | null> {
    const raw = await this.prisma.paymentRequest.findUnique({ where: { id } });

    return raw ? PaymentRequestMapper.toDomain(raw) : null;
  }

  async findByRequesterId(requesterId: string): Promise<PaymentRequest[]> {
    const raw = await this.prisma.paymentRequest.findMany({
      where: {
        requesterId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return raw.map(PaymentRequestMapper.toDomain);
  }

  async findByIdempotencyKey(
    requesterId: string,
    idempotencyKey: string,
  ): Promise<PaymentRequest | null> {
    const raw = await this.prisma.paymentRequest.findUnique({
      where: {
        requesterId_idempotencyKey: {
          requesterId,
          idempotencyKey,
        },
      },
    });

    return raw ? PaymentRequestMapper.toDomain(raw) : null;
  }

  async create(paymentRequest: PaymentRequest): Promise<PaymentRequest> {
    try {
      const raw = await this.prisma.paymentRequest.create({
        data: PaymentRequestMapper.toPersistence(paymentRequest),
      });

      return PaymentRequestMapper.toDomain(raw);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError(
          undefined,
          "Idempotency key has already been used.",
        );
      }

      throw error;
    }
  }

  async update(paymentRequest: PaymentRequest): Promise<PaymentRequest> {
    const raw = await this.prisma.paymentRequest.update({
      where: {
        id: paymentRequest.id,
      },
      data: PaymentRequestMapper.toPersistence(paymentRequest),
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

  async expirePending(now: Date): Promise<number> {
    const results = await this.prisma.paymentRequest.updateMany({
      where: {
        status: PaymentRequestStatus.PENDING,
        expiresAt: {
          lte: now,
        },
      },

      data: {
        status: PaymentRequestStatus.EXPIRED,
        updatedAt: now,
      },
    });

    return results.count;
  }
}
