import { Router } from "express";

import type { NotificationDeviceController } from "../controllers/notification-device.controller.js";

import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildNotificationDeviceRoutes = (
  controller: NotificationDeviceController,
  jwtSecret: string,
) => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/notifications/devices:
   *   post:
   *     tags:
   *       - Notifications
   *     summary: Register a push notification device
   *     description: Registers or refreshes the push notification token for the authenticated user's device.
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - platform
   *             properties:
   *               token:
   *                 type: string
   *                 example: "fcm-device-token"
   *               platform:
   *                 type: string
   *                 example: "android"
   *     responses:
   *       201:
   *         description: Push notification device registered successfully.
   *       400:
   *         description: Invalid push-device data.
   *       401:
   *         description: Authentication required.
   */
  router.post(
    "/devices",
    requireAuth(jwtSecret),
    controller.register.bind(controller),
  );

  return router;
};
