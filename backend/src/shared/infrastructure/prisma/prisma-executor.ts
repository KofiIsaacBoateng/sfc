import type { Prisma, PrismaClient } from "@/src/generated/client/client.js";

export type PrismaExecuter = Prisma.TransactionClient | PrismaClient;
