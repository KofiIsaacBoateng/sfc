import { Router } from "express";

import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

import { createPaymentRequestSchema } from "../validators/create-payment-request.validator.js";
import type { PaymentRequestController } from "../controllers/payment-request.controller.js";
import { validateSchema } from "@/shared/presentation/validation/validation.schema.js";

export function buildPaymentRequestRoutes(
  controller: PaymentRequestController,
  jwtSecret: string,
): Router {
  const router = Router();

  /**
   * @openapi
   * /payment-requests:
   *   post:
   *     tags:
   *       - Payment Requests
   *     summary: Create a payment request
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - amount
   *               - currency
   *               - expiresAt
   *             properties:
   *               amount:
   *                 type: string
   *                 example: "5000"
   *                 description: Amount in minor currency units
   *               currency:
   *                 type: string
   *                 enum:
   *                   - GHS
   *               expiresAt:
   *                 type: string
   *                 format: date-time
   *                 example: "2026-08-15T12:00:00.000Z"
   *     responses:
   *       201:
   *         description: Payment request created
   *       400:
   *         description: Invalid request
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Requester's wallet not found
   *       409:
   *         description: Request could not be created
   */
  router.post(
    "/",
    requireAuth(jwtSecret),
    validateSchema(createPaymentRequestSchema),
    controller.create.bind(controller),
  );

  return router;
}
