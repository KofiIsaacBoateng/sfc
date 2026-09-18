import { Router } from "express";
import type { UsersController } from "../controllers/user.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildUserRoutes = (
  usersController: UsersController,
  jwtSecret: string,
) => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/users/me:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get current authenticated user
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */

  router.get(
    "/me",
    requireAuth(jwtSecret),
    usersController.me.bind(usersController),
  );

  /**
   * @openapi
   * /api/v1/users/profile:
   *   get:
   *     tags:
   *       - Users
   *     summary: Get current authenticated user's profile
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user profile
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */

  router.get(
    "/profile",
    requireAuth(jwtSecret),
    usersController.getMyProfile.bind(usersController),
  );

  return router;
};
