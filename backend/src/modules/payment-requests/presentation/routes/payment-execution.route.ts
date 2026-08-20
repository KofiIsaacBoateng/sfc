import { Router } from "express";

import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

import { PaymentExecutionController } from "../controllers/payment-execution.controller.js";

export function buildPaymentExecutionRoutes(
  controller: PaymentExecutionController,
  jwtSecret: string,
): Router {
  const router = Router();

  /**
   * @openapi
   * /api/v1/payment-requests/{paymentRequestId}/approve:
   *   post:
   *     tags:
   *       - Payment Requests
   *     summary: Approve and pay a pending payment request
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: paymentRequestId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       201:
   *         description: Payment completed
   *       400:
   *         description: Payment request cannot be approved
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Payment request not found
   *       409:
   *         description: Payment request already processed or unavailable
   */

  router.post(
    "/:paymentRequestId/approve",
    requireAuth(jwtSecret),
    controller.approve.bind(controller),
  );

  return router;
}
