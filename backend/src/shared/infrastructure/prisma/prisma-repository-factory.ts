import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma/prisma-user.repository.js";
import type { Repositories } from "../../application/unit-of-work/repositories.js";
import type { PrismaExecuter } from "./prisma-executor.js";
import { PrismaWalletRepository } from "@/modules/wallets/infrastructure/prisma/prisma-wallet.repository.js";
import { PrismaLedgerAccountRepository } from "@/modules/ledger/infrastructure/prisma/prisma-ledger-account.repository.js";
import { PrismaDeviceRepository } from "@/modules/devices/infrastructure/prisma/prisma-device.repository.js";
import { PrismaProvisionedDeviceRepository } from "@/modules/devices/infrastructure/prisma/prisma-provisioned-device.repository.js";
import { PrismaLedgerEntryRepository } from "@/modules/ledger/infrastructure/prisma/prisma-ledger-entry.repository.js";
import { PrismaTransactionRepository } from "@/modules/transaction/infrastructure/prisma/prisma-transaction.repository.js";

export class PrismaRepositoryFactory {
  create(tx: PrismaExecuter): Repositories {
    return {
      users: new PrismaUserRepository(tx),
      wallets: new PrismaWalletRepository(tx),
      ledger: new PrismaLedgerAccountRepository(tx),
      ledgerEntries: new PrismaLedgerEntryRepository(tx),
      transaction: new PrismaTransactionRepository(tx),
      device: new PrismaDeviceRepository(tx),
      provisionedDevice: new PrismaProvisionedDeviceRepository(tx),
    };
  }
}
