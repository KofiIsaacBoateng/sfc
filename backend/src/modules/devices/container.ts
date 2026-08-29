import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { RegisterDeviceUseCase } from "./application/use-cases/register-device.usecase.js";
import { HamacActivationCodeHasher } from "./infrastructure/services/hmac-activation-code.hasher.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { DeviceController } from "./presentation/controllers/device.controller.js";
import { buildDeviceRoutes } from "./presentation/routes/device.route.js";
import env from "@/shared/config/env.js";

const repositoryFactory = new PrismaRepositoryFactory();
const prismaUnitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);
const activationCodeHasher = new HamacActivationCodeHasher(
  env.ACTIVATION_CODE_SECRET,
);

const registerDeviceUseCase = new RegisterDeviceUseCase(
  prismaUnitOfWork,
  activationCodeHasher,
);

const controller = new DeviceController(registerDeviceUseCase);

export const deviceRoutes = buildDeviceRoutes(
  controller,
  env.JWT_ACCESS_SECRET,
);
