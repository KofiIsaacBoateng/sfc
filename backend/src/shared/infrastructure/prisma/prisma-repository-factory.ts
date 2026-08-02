import { PrismaUserRepository } from "@/modules/users/infrastructure/prisma/prisma-user.repository.js";
import type { Repositories } from "../../application/unit-of-work/repositories.js";
import type { PrismaExecuter } from "./prisma-executor.js";
import { PrismaWalletRepository } from "@/modules/wallets/infrastructure/prisma/prisma-wallet.repository.js";
import { PrismaLedgerAccountRepository } from "@/modules/ledger/infrastructure/prisma/prisma-ledger-account.repository.js";
import { PrismaDeviceRepository } from "@/modules/devices/infrastructure/prisma/prisma-device.repository.js";
import { PrismaProvisionedDeviceRepository } from "@/modules/devices/infrastructure/prisma/prisma-provisioned-device.repository.js";

export class PrismaRepositoryFactory {
  create(prisma: PrismaExecuter): Repositories {
    return {
      users: new PrismaUserRepository(prisma),
      wallets: new PrismaWalletRepository(prisma),
      ledger: new PrismaLedgerAccountRepository(prisma),
      device: new PrismaDeviceRepository(prisma),
      provisionedDevice: new PrismaProvisionedDeviceRepository(prisma),
    };
  }
}
