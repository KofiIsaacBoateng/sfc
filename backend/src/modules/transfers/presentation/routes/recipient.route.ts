import { Router } from "express";
import type { RecipientController } from "../controllers/recipient.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildRecipientRoutes = (
  controller: RecipientController,
  jwtSecret: string,
): Router => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/transfers/resolve:
   *  post:
   *     summary: Resolve a recipient of a transfer by device or phone
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Transfers
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - type
   *               - value
   *             properties:
   *               type:
   *                 type: string
   *                 enum: [DEVICE, PHONE]
   *                 example: DEVICE
   *
   *               value:
   *                 type: string
   *     responses:
   *       "200":
   *         description: Recipient resolved success
   *       "404":
   *         description: User or Wallet or Device or Profile is missing
   */

  router.post(
    "/resolve",
    requireAuth(jwtSecret),
    controller.resolve.bind(controller),
  );
  return router;
};
