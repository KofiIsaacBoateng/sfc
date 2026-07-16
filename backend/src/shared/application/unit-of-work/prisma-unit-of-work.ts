import type { Prisma, PrismaClient } from "@prisma/client";
import type { Repositories } from "./repositories.js";
import { PrismaUserRepository } from "@/src/modules/users/infrastructure/prisma/prisma-user.repository.js";
import type { UnitOfWork } from "./unit-of-work.js";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private readonly prisma: PrismaClient) {}

  execute<T>(work: (repos: Repositories) => Promise<T>) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const repos: Repositories = {
        users: new PrismaUserRepository(tx),
        wallets: new PrismaUserRepository(tx),
        ledger: new PrismaUserRepository(tx),
      };

      return work(repos);
    });
  }
}
