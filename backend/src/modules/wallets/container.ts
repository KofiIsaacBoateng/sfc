import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaWalletRepository } from "./infrastructure/prisma/prisma-wallet.repository.js";
import { GetMyWalletUseCase } from "./application/use-case/get-my-wallet.usecase.js";
import { WalletController } from "./presentation/controllers/wallet.controller.js";
import env from "@/shared/config/env.js";
import { buildWalletRoutes } from "./presentation/routes/wallet.routes.js";

// wallet dependency instantiation
const walletRepository = new PrismaWalletRepository(prisma);

const getMyWalletUseCase = new GetMyWalletUseCase(walletRepository);

const getMyWalletController = new WalletController(getMyWalletUseCase);

export const walletRoutes = buildWalletRoutes(
  getMyWalletController,
  env.JWT_ACCESS_SECRET,
);
