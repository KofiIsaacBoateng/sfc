import type { PaymentAuthorizationRepository } from "../../domain/repositories/payment-authorization.repository.js";

import {
  PaymentAuthorization,
  PaymentAuthorizationStatus,
} from "../../domain/entities/payment-authorization.entity.js";

import { PaymentAuthorizationMapper } from "./payment-authorization.mapper.js";
import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";

export class PrismaPaymentAuthorizationRepository implements PaymentAuthorizationRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async create(
    authorization: PaymentAuthorization,
  ): Promise<PaymentAuthorization> {
    const created = await this.prisma.paymentAuthorization.create({
      data: PaymentAuthorizationMapper.toPersistence(authorization),
    });

    return PaymentAuthorizationMapper.toDomain(created);
  }

  async update(
    authorization: PaymentAuthorization,
  ): Promise<PaymentAuthorization> {
    const updated = await this.prisma.paymentAuthorization.update({
      where: {
        id: authorization.id,
      },
      data: PaymentAuthorizationMapper.toPersistence(authorization),
    });

    return PaymentAuthorizationMapper.toDomain(updated);
  }

  async findById(id: string): Promise<PaymentAuthorization | null> {
    const authorization = await this.prisma.paymentAuthorization.findUnique({
      where: { id },
    });

    return authorization
      ? PaymentAuthorizationMapper.toDomain(authorization)
      : null;
  }

  async findByPaymentRequestIdAndUserId(
    paymentRequestId: string,
    userId: string,
  ): Promise<PaymentAuthorization | null> {
    const authorization = await this.prisma.paymentAuthorization.findUnique({
      where: {
        paymentRequestId_userId: {
          paymentRequestId,
          userId,
        },
      },
    });

    return authorization
      ? PaymentAuthorizationMapper.toDomain(authorization)
      : null;
  }

  async claimAuthorized(
    id: string,
    userId: string,
  ): Promise<PaymentAuthorization | null> {
    const now = new Date();
    const updated = await this.prisma.paymentAuthorization.updateMany({
      where: {
        id,
        userId,
        status: PaymentAuthorizationStatus.AUTHORIZED,
        expiresAt: {
          gt: now,
        },
      },
      data: {
        status: PaymentAuthorizationStatus.CONSUMED,
        consumedAt: now,
        updatedAt: now,
      },
    });

    if (updated.count !== 1) {
      return null;
    }

    const authorization = await this.prisma.paymentAuthorization.findUnique({
      where: {
        id,
      },
    });

    return authorization
      ? PaymentAuthorizationMapper.toDomain(authorization)
      : null;
  }
}
