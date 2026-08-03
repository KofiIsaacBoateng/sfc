import type { Prisma, PrismaClient } from "@prisma/client";
import type { Repositories } from "../../application/unit-of-work/repositories.js";
import type { UnitOfWork } from "../../application/unit-of-work/unit-of-work.js";
import { PrismaRepositoryFactory } from "./prisma-repository-factory.js";

export class PrismaUnitOfWork implements UnitOfWork {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly repositoryFactory: PrismaRepositoryFactory,
  ) {}

  execute<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const repos = this.repositoryFactory.create(tx);

      return work(repos);
    });
  }
}
