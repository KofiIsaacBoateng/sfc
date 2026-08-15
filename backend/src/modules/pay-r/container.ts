import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { CreatePaymentRequestUseCase } from "./application/use-cases/create-payment-request.usecase.js";
import { DefaultPaymentRequestReferenceGenerator } from "./infrastructure/payment-request-reference-generator.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import env from "@/shared/config/env.js";
import { PaymentRequestController } from "./presentation/controllers/payment-request.controller.js";
import { buildPaymentRequestRoutes } from "./presentation/routes/payment-request.routes.js";

const prismaRepositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, prismaRepositoryFactory);
const paymentRequestReferenceGenerator =
  new DefaultPaymentRequestReferenceGenerator();

const createPaymentRequestUseCase = new CreatePaymentRequestUseCase(
  unitOfWork,
  paymentRequestReferenceGenerator,
);

const paymentRequestController = new PaymentRequestController(
  createPaymentRequestUseCase,
);

export const paymentRequestRoutes = buildPaymentRequestRoutes(
  paymentRequestController,
  env.JWT_ACCESS_SECRET,
);
