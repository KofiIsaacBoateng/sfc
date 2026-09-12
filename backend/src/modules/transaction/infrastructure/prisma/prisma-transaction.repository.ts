import type { PrismaExecuter } from "@/shared/infrastructure/prisma/prisma-executor.js";
import type { TransactionRepository } from "../../domain/repositories/transaction.repository.js";
import type { Transaction } from "../../domain/entities/transaction.entity.js";
import { TransactionMapper } from "./transaction.mapper.js";

export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaExecuter) {}

  async findById(id: string): Promise<Transaction | null> {
    const raw = await this.prisma.transaction.findUnique({
      where: { id },
    });

    return raw ? TransactionMapper.toDomain(raw) : null;
  }

  async findByUserId(
    userId: string,
    _?: {
      limit?: number;
      cursor?: string;
    },
  ): Promise<Transaction[]> {
    const raw = await this.prisma.transaction.findMany({
      where: { initiatedBy: userId },
    });

    return raw.map((item) => TransactionMapper.toDomain(item));
  }

  async findByReference(ref: string): Promise<Transaction | null> {
    const raw = await this.prisma.transaction.findUnique({
      where: { reference: ref },
    });

    return raw ? TransactionMapper.toDomain(raw) : null;
  }

  async create(transaction: Transaction): Promise<Transaction> {
    const result = await this.prisma.transaction.create({
      data: TransactionMapper.toPersistence(transaction),
    });

    return TransactionMapper.toDomain(result);
  }
}
