import { Router } from "express";

import type { PaymentAuthorizationController } from "../controllers/payment-authorization.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildPaymentAuthorizationRoutes = (
  controller: PaymentAuthorizationController,
  jwtSecret: string,
) => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/payment-requests/{paymentRequestId}/tap:
   *   post:
   *     tags:
   *       - Payment Authorization
   *     summary: Process an SFC payment tap
   *     security:
   *       - bearerAuth: []
   */
  router.post(
    "/:paymentRequestId/tap",
    requireAuth(jwtSecret),
    controller.handleTap.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/payment-requests/{paymentRequestId}/authorize:
   *   post:
   *     tags:
   *       - Payment Authorization
   *     summary: Authorize a payment request with PIN
   *     security:
   *       - bearerAuth: []
   */
  router.post(
    "/:paymentRequestId/authorize",
    requireAuth(jwtSecret),
    controller.authorize.bind(controller),
  );

  return router;
};
