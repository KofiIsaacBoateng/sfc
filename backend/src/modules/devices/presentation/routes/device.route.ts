import { Router } from "express";
import { DeviceController } from "../controllers/device.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildDeviceRoutes = (
  controller: DeviceController,
  jwtSecret: string,
): Router => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/devices/register:
   *  post:
   *     summary: Register an SFC device
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Devices
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - activationCode
   *               - tagUid
   *             properties:
   *               activationCode:
   *                 type: string
   *               tagUid:
   *                 type: string
   *     responses:
   *       "201":
   *         description: Device registered
   *       "404":
   *         description: Invalid activation code
   *       "409":
   *         description: Device already claimed
   */

  router.post(
    "/register",
    requireAuth(jwtSecret),
    controller.register.bind(controller),
  );

  return router;
};
