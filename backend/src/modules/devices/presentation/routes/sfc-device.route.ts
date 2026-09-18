import { Router } from "express";
import { DeviceController } from "../controllers/sfc-device.controller.js";
import { requireAuth } from "@/shared/presentation/middleware/require-auth.middleware.js";

export const buildDeviceRoutes = (
  controller: DeviceController,
  jwtSecret: string,
): Router => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/sfc-devices/register:
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

  /**
   * @openapi
   * /api/v1/sfc-devices:
   *   get:
   *     tags:
   *       - SFC Devices
   *     summary: Get my SFC devices
   *     description: Returns the SFC devices owned by the authenticated user.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: SFC devices retrieved successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SfcDeviceResponse'
   *       401:
   *         description: Authentication required.
   */
  router.get(
    "/",
    requireAuth(jwtSecret),
    controller.getMyDevices.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/sfc-devices/{deviceId}/block:
   *   patch:
   *     tags:
   *       - SFC Devices
   *     summary: Block an SFC device
   *     description: Blocks an SFC device belonging to the authenticated user.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: deviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the SFC device to block.
   *     responses:
   *       200:
   *         description: SFC device blocked successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SfcDeviceResponse'
   *       401:
   *         description: Authentication required.
   *       403:
   *         description: The authenticated user does not own the device.
   *       404:
   *         description: SFC device not found.
   *       409:
   *         description: Device is already blocked.
   */
  router.patch(
    "/:deviceId/block",
    requireAuth(jwtSecret),
    controller.block.bind(controller),
  );

  /**
   * @openapi
   * /api/v1/sfc-devices/{deviceId}/unblock:
   *   patch:
   *     tags:
   *       - SFC Devices
   *     summary: Unblock an SFC device
   *     description: Unblocks a blocked SFC device belonging to the authenticated user.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: deviceId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the SFC device to unblock.
   *     responses:
   *       200:
   *         description: SFC device unblocked successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SfcDeviceResponse'
   *       401:
   *         description: Authentication required.
   *       403:
   *         description: The authenticated user does not own the device.
   *       404:
   *         description: SFC device not found.
   *       409:
   *         description: Device is not blocked.
   */
  router.patch(
    "/:deviceId/unblock",
    requireAuth(jwtSecret),
    controller.unblock.bind(controller),
  );

  return router;
};
