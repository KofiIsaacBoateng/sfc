import { prisma } from "@/shared/infrastructure/prisma/prisma.js";

import { PrismaPushDeviceRepository } from "./infrastructure/prisma/prisma-push-device.repository.js";

import { RegisterPushDeviceUseCase } from "./application/use-cases/register-push-device.usecase.js";

import { NotificationDeviceController } from "./presentation/controllers/notification-device.controller.js";

import env from "@/shared/config/env.js";

import { buildNotificationDeviceRoutes } from "./presentation/routes/notification-device.route.js";

// notification dependency instantiation
const pushDeviceRepository = new PrismaPushDeviceRepository(prisma);

const registerPushDeviceUseCase = new RegisterPushDeviceUseCase(
  /* this feature currently uses UnitOfWork */
  pushDeviceRepository,
);

const notificationDeviceController = new NotificationDeviceController(
  registerPushDeviceUseCase,
);

export const notificationDeviceRoutes = buildNotificationDeviceRoutes(
  notificationDeviceController,
  env.JWT_ACCESS_SECRET,
);
