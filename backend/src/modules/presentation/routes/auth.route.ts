import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";

export const buildAuthRoutes = (authController: AuthController) => {
  const router = Router();

  router.post("/login", authController.login);

  return router;
};
