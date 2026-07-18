import { PrismaUserRepository } from "@/src/modules/users/infrastructure/prisma/prisma-user.repository.js";
import type { Repositories } from "../../application/unit-of-work/repositories.js";
import type { PrismaExecuter } from "./prisma-executor.js";
import { PrismaWalletRepository } from "@/src/modules/wallets/infrastructure/prisma/prisma-wallet.repository.js";
import { PrismaLedgerAccountRepository } from "@/src/modules/ledger/infrastructure/prisma/prisma-ledger-account.repository.js";

export class PrismaRepositoryFactory {
  create(prisma: PrismaExecuter): Repositories {
    return {
      users: new PrismaUserRepository(prisma),
      wallets: new PrismaWalletRepository(prisma),
      ledger: new PrismaLedgerAccountRepository(prisma),
    };
  }
}
