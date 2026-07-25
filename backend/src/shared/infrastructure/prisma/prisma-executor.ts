import type { Prisma, PrismaClient } from "@/generated/client/client.js";

export type PrismaExecuter = Prisma.TransactionClient | PrismaClient;
