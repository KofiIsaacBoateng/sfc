import env from "@/shared/config/env.js";
import { UsersController } from "./presentation/controllers/user.controller.js";
import { buildUserRoutes } from "./presentation/routes/user.route.js";
import { PrismaUserRepository } from "./infrastructure/prisma/prisma-user.repository.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { GetMyProfileUseCase } from "./application/use-cases/get-my-profile.usecase.js";

const userRepository = new PrismaUserRepository(prisma);

const getMyProfileUseCase = new GetMyProfileUseCase(userRepository);

const usersController = new UsersController(getMyProfileUseCase);
export const userRoutes = buildUserRoutes(
  usersController,
  env.JWT_ACCESS_SECRET,
);
