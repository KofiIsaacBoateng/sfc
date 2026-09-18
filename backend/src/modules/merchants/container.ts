import { prisma } from "@/shared/infrastructure/prisma/prisma.js";

import { PrismaMerchantRepository } from "./infrastructure/prisma/prisma-merchant.repository.js";

import { GetMyMerchantUseCase } from "./application/use-cases/get-my-merchant.usecase.js";

import { UpdateMyMerchantUseCase } from "./application/use-cases/update-my-merchant.usecase.js";

import { MerchantController } from "./presentation/controllers/merchant.controller.js";

import env from "@/shared/config/env.js";

import { buildMerchantRoutes } from "./presentation/routes/merchant.route.js";

// merchant dependency instantiation

const merchantRepository = new PrismaMerchantRepository(prisma);

const getMyMerchantUseCase = new GetMyMerchantUseCase(merchantRepository);

const updateMyMerchantUseCase = new UpdateMyMerchantUseCase(merchantRepository);

const merchantController = new MerchantController(
  getMyMerchantUseCase,
  updateMyMerchantUseCase,
);

export const merchantRoutes = buildMerchantRoutes(
  merchantController,
  env.JWT_ACCESS_SECRET,
);
