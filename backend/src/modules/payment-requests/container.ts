import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { CreatePaymentRequestUseCase } from "./application/use-cases/create-payment-request.usecase.js";
import { DefaultPaymentRequestReferenceGenerator } from "./infrastructure/payment-request-reference-generator.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import env from "@/shared/config/env.js";
import { PaymentRequestController } from "./presentation/controllers/payment-request.controller.js";
import { buildPaymentRequestRoutes } from "./presentation/routes/payment-request.route.js";
import { DefaultTransactionReferenceGenerator } from "../transaction/infrastructure/transaction-reference.generator.js";
import { ApprovePaymentRequestUseCase } from "./application/use-cases/approve-payment-request.usecase.js";
import { PaymentExecutionController } from "./presentation/controllers/payment-execution.controller.js";
import { buildPaymentExecutionRoutes } from "./presentation/routes/payment-execution.route.js";
import { GetMyPaymentRequestsUseCase } from "./application/use-cases/get-my-payment-requests.usecase.js";
import { PrismaPaymentRequestRepository } from "./infrastructure/prisma/prisma-payment-request.repository.js";
import { CancelPaymentRequestUseCase } from "./application/use-cases/cancel-payment-request.usecase.js";
import { ExpirePendingPaymentRequestsUseCase } from "./application/use-cases/expire-payment-request.usecase.js";

const prismaRepositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, prismaRepositoryFactory);
const paymentRequestsRepository = new PrismaPaymentRequestRepository(prisma);

// create payment request
const paymentRequestReferenceGenerator =
  new DefaultPaymentRequestReferenceGenerator();

const createPaymentRequestUseCase = new CreatePaymentRequestUseCase(
  unitOfWork,
  paymentRequestReferenceGenerator,
);
const getMyPaymentRequestsUseCase = new GetMyPaymentRequestsUseCase(
  paymentRequestsRepository,
);
const cancelPaymentRequestUseCase = new CancelPaymentRequestUseCase(unitOfWork);
const expirePaymentRequestUseCase = new ExpirePendingPaymentRequestsUseCase(
  unitOfWork,
);

const paymentRequestController = new PaymentRequestController(
  createPaymentRequestUseCase,
  getMyPaymentRequestsUseCase,
  cancelPaymentRequestUseCase,
  expirePaymentRequestUseCase,
);

export const paymentRequestRoutes = buildPaymentRequestRoutes(
  paymentRequestController,
  env.JWT_ACCESS_SECRET,
);

// approve and execute payment
const transactionReferenceGenerator =
  new DefaultTransactionReferenceGenerator();

const approvePaymentRequestUseCase = new ApprovePaymentRequestUseCase(
  unitOfWork,
  transactionReferenceGenerator,
);

const paymentExecutionController = new PaymentExecutionController(
  approvePaymentRequestUseCase,
);

export const paymentExecutionRoutes = buildPaymentExecutionRoutes(
  paymentExecutionController,
  env.JWT_ACCESS_SECRET,
);
