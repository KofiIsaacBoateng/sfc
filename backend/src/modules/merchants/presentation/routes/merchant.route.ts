import { Router } from "express";

import type { MerchantController } from "../controllers/merchant.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildMerchantRoutes = (
  controller: MerchantController,
  jwtSecret: string,
) => {
  const router = Router();

  /**
   * @openapi
   * /merchant/me:
   *   get:
   *     tags:
   *       - Merchant
   *     summary: Get the authenticated merchant profile
   *     description: Returns the merchant profile belonging to the authenticated user.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Merchant profile retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MerchantResponse'
   *       401:
   *         description: Authentication required.
   *       404:
   *         description: Merchant profile not found.
   */
  router.get(
    "/me",
    requireAuth(jwtSecret),
    controller.getMyMerchant.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/merchant/me:
   *   patch:
   *     tags:
   *       - Merchant
   *     summary: Update the authenticated merchant profile
   *     description: Updates the business name of the authenticated merchant.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - businessName
   *             properties:
   *               businessName:
   *                 type: string
   *                 example: Kofi's Electronics
   *     responses:
   *       200:
   *         description: Merchant profile updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MerchantResponse'
   *       400:
   *         description: Invalid merchant data.
   *       401:
   *         description: Authentication required.
   *       404:
   *         description: Merchant profile not found.
   */
  router.patch(
    "/me",
    requireAuth(jwtSecret),
    controller.updateMyMerchant.bind(controller),
  );

  return router;
};
