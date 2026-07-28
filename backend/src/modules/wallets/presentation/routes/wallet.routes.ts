import { Router } from "express";
import type { WalletController } from "../controllers/wallet.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildWalletRoutes = (
  controller: WalletController,
  jwtSecret: string,
): Router => {
  const router = Router();

  /**
   * @openapi
   * /wallet:
   *   get:
   *     summary: Get authenticated user's wallet
   *     tags:
   *       - Wallet
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Wallet retrieved successfully
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Wallet not found
   */

  router.get("/", requireAuth(jwtSecret), controller.getMyWallet);
  return router;
};
