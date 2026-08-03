import env from "@/shared/config/env.js";
import { UsersController } from "./presentation/controllers/user.controller.js";
import { buildUserRoutes } from "./presentation/routes/user.route.js";

const usersController = new UsersController();
export const userRoutes = buildUserRoutes(
  usersController,
  env.JWT_ACCESS_SECRET,
);
