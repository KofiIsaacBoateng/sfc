import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { RegisterDeviceUseCase } from "./application/use-cases/register-device.usecase.js";
import { HamacActivationCodeHasher } from "./infrastructure/services/hmac-activation-code.hasher.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { DeviceController } from "./presentation/controllers/sfc-device.controller.js";
import { buildDeviceRoutes } from "./presentation/routes/sfc-device.route.js";
import env from "@/shared/config/env.js";
import { GetMySfcDevicesUseCase } from "./application/use-cases/get-my-sfc-devices.usecase.js";
import { PrismaDeviceRepository } from "./infrastructure/prisma/prisma-device.repository.js";
import { BlockMySfcDeviceUseCase } from "./application/use-cases/block-my-sfc-device.usecase.js";
import { UnblockMySfcDeviceUseCase } from "./application/use-cases/unblock-my-sfc-device.usecase.js";

const repositoryFactory = new PrismaRepositoryFactory();
const sfcDeviceRepository = new PrismaDeviceRepository(prisma);

const prismaUnitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);
const activationCodeHasher = new HamacActivationCodeHasher(
  env.ACTIVATION_CODE_SECRET,
);

const registerDeviceUseCase = new RegisterDeviceUseCase(
  prismaUnitOfWork,
  activationCodeHasher,
);
const getMySfcDevicesUseCase = new GetMySfcDevicesUseCase(sfcDeviceRepository);
const blockMySfcDeviceUseCase = new BlockMySfcDeviceUseCase(
  sfcDeviceRepository,
);
const unblockMySfcDeviceUseCase = new UnblockMySfcDeviceUseCase(
  sfcDeviceRepository,
);

const controller = new DeviceController(
  registerDeviceUseCase,
  getMySfcDevicesUseCase,
  blockMySfcDeviceUseCase,
  unblockMySfcDeviceUseCase,
);

export const deviceRoutes = buildDeviceRoutes(
  controller,
  env.JWT_ACCESS_SECRET,
);
