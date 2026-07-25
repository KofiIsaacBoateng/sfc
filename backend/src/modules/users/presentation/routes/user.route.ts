import { Router } from "express";
import type { UsersController } from "../controllers/user.controller.js";
import { requireAuth } from "@/src/shared/presentation/middleware/require-auth.middleware.js";

export const buildUserRoutes = (
  usersController: UsersController,
  jwtSecret: string,
) => {
  const router = Router();

  router.post("/me", requireAuth(jwtSecret), usersController.me);

  return router;
};
