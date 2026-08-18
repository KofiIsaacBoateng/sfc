import type { MerchantRepository } from "../../domain/repositories/merchant.repository.js";

import type { Merchant } from "../../domain/entities/merchant.entity.js";

import { MerchantMapper } from "./merchant.mapper.js";
import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";

export class PrismaMerchantRepository implements MerchantRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async findById(id: string): Promise<Merchant | null> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
    });

    return merchant ? MerchantMapper.toDomain(merchant) : null;
  }

  async findByUserId(userId: string): Promise<Merchant | null> {
    const merchant = await this.prisma.merchant.findUnique({
      where: { userId },
    });

    return merchant ? MerchantMapper.toDomain(merchant) : null;
  }

  async create(merchant: Merchant): Promise<Merchant> {
    const created = await this.prisma.merchant.create({
      data: MerchantMapper.toPersistence(merchant),
    });

    return MerchantMapper.toDomain(created);
  }

  async update(merchant: Merchant): Promise<Merchant> {
    const updated = await this.prisma.merchant.update({
      where: {
        id: merchant.id,
      },
      data: MerchantMapper.toPersistence(merchant),
    });

    return MerchantMapper.toDomain(updated);
  }
}
