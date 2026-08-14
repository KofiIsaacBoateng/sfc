import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { RecipientResolutionUsecase } from "./application/use-cases/recipient-resolution.usecase.js";
import { RecipientController } from "./presentation/controllers/recipient.controller.js";
import { buildRecipientRoutes } from "./presentation/routes/recipient.route.js";
import env from "@/shared/config/env.js";
import { TransferMoneyUseCase } from "./application/use-cases/transfer-money.usecase.js";
import { DefaultTransactionReferenceGenerator } from "./infrastructure/transaction-reference.generator.js";
import { TransactionController } from "./presentation/controllers/transaction.controller.js";
import { buildTransactionRoutes } from "./presentation/routes/transaction.route.js";

const repositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);

/** recipient resolutino */
const resolveRecipientUsecase = new RecipientResolutionUsecase(unitOfWork);

const recipientController = new RecipientController(resolveRecipientUsecase);
export const recipientRoutes = buildRecipientRoutes(
  recipientController,
  env.JWT_ACCESS_SECRET,
);

/** transfer money */
const referenceGenerator = new DefaultTransactionReferenceGenerator();
const transferMoneyUseCase = new TransferMoneyUseCase(
  unitOfWork,
  referenceGenerator,
);

const transactionController = new TransactionController(transferMoneyUseCase);
export const transactionRoutes = buildTransactionRoutes(
  transactionController,
  env.JWT_ACCESS_SECRET,
);
