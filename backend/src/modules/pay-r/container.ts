import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { CreatePaymentRequestUseCase } from "./application/use-cases/create-payment-request.usecase.js";
import { DefaultPaymentRequestReferenceGenerator } from "./infrastructure/payment-request-reference-generator.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";

const prismaRepositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, prismaRepositoryFactory);
const paymentRequestReferenceGenerator =
  new DefaultPaymentRequestReferenceGenerator();

const createPaymentRequestUseCase = new CreatePaymentRequestUseCase(
  unitOfWork,
  paymentRequestReferenceGenerator,
);
