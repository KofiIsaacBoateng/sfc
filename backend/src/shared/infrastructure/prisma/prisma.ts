import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../../generated/client/client.js";

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error(
    "❌ Critical: DATABASE_URL is missing from your environment variables",
  );
}

// Establish a standard node-postgres connection pool configuration
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Instantiate the client with the driver adapter injected directly
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ["query", "error", "warn"],
  });

if (process.env["NODE_ENV"] !== "production") globalForPrisma.prisma = prisma;
