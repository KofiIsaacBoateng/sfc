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
   * /api/v1/payment-requests:
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

  /**
   * @openapi
   * /api/v1/payment-requests:
   *   get:
   *     tags:
   *       - Payment Requests
   *     summary: Get merchant payment request history
   *     description: Returns payment requests created by the authenticated merchant, ordered from newest to oldest.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Payment request history retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/PaymentRequestResponse'
   *       401:
   *         description: Authentication required.
   */
  router.get(
    "/",
    requireAuth(jwtSecret),
    controller.getMyPaymentRequests.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/payment-requests/expire-pending:
   *   post:
   *     tags:
   *       - Payment Requests
   *     summary: Expire pending payment requests
   *     description: Marks all pending payment requests whose expiration time has passed as expired.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Pending payment requests expired successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Pending payment requests expired successfully.
   *       401:
   *         description: Authentication required.
   */
  router.post(
    "/expire-pending",
    requireAuth(jwtSecret),
    controller.expirePendingPaymentRequests.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/payment-requests/{paymentRequestId}/cancel:
   *   post:
   *     tags:
   *       - Payment Requests
   *     summary: Cancel a payment request
   *     description: Cancels a pending payment request belonging to the authenticated user.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: paymentRequestId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the payment request to cancel.
   *     responses:
   *       200:
   *         description: Payment request cancelled successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaymentRequestResponse'
   *       401:
   *         description: Authentication required.
   *       403:
   *         description: The authenticated user does not own the payment request.
   *       404:
   *         description: Payment request not found.
   *       409:
   *         description: Payment request is no longer pending or has expired.
   */
  router.post(
    "/:paymentRequestId/cancel",
    requireAuth(jwtSecret),
    controller.cancelPaymentRequest.bind(controller),
  );

  return router;
}
