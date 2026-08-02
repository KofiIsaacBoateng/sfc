import { UserProvisioningService } from "@/modules/auth/application/services/user-provisioning.service.js";
import { LoginUseCase } from "@/modules/auth/application/use-cases/login.usecase.js";
import { FirebaseAdminAuthProvider } from "@/modules/auth/infrastructure/firebase/firebase-admin-auth.provider.js";
import { JwtTokenService } from "@/modules/auth/infrastructure/jwt/jwt-auth.service.js";
import { AuthController } from "@/modules/auth/presentation/controllers/auth.controller.js";
import { WalletProvisioningService } from "@/modules/wallets/application/services/wallet-provisioning.service.js";
import env from "@/shared/config/env.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { buildAuthRoutes } from "./presentation/routes/auth.route.js";

const repositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);

const firebaseAuthProvider = new FirebaseAdminAuthProvider();

const jwtService = new JwtTokenService(
  env.JWT_ACCESS_SECRET ?? "access-secret",
  env.JWT_REFRESH_SECRET ?? "refresh-secret",
);

const walletProvisioningService = new WalletProvisioningService();
const userProvisioningService = new UserProvisioningService(
  unitOfWork,
  walletProvisioningService,
);

const loginUseCase = new LoginUseCase(
  firebaseAuthProvider,
  userProvisioningService,
  jwtService,
);

const authController = new AuthController(loginUseCase);

export const authRoutes = buildAuthRoutes(authController);
