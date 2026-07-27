import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export const buildAuthRoutes = (authController: AuthController) => {
  const router = Router();

  /**
   * @openapi
   * /api/v1/auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login with Firebase token
   *     description: Verifies a Firebase ID token, provisions the user if needed, and returns SFC tokens.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firebaseToken
   *               - role
   *             properties:
   *               firebaseToken:
   *                 type: string
   *                 example: eyJhbGciOi...
   *               role:
   *                 type: string
   *                 enum: [INDIVIDUAL, BUSINESS]
   *                 example: INDIVIDUAL
   *     responses:
   *       200:
   *         description: Login successful
   *       400:
   *         description: Invalid request
   *       500:
   *         description: Server error
   */

  router.post("/login", authController.login);

  return router;
};
