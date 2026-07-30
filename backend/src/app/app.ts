import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import { notFoundHandler } from "../shared/presentation/middleware/not-found.middleware.js";
import { globalErrorHandler } from "../shared/presentation/middleware/error.middleware.js";
import { httpLogger } from "../shared/logger/httpLogger.js";
import { setupSwagger } from "../docs/swagger.js";
import { buildAuthRoutes } from "../modules/auth/presentation/routes/auth.route.js";
import { buildUserRoutes } from "../modules/users/presentation/routes/user.route.js";
import {
  authController,
  getMyWalletController,
  usersController,
} from "./container.js";
import env from "../shared/config/env.js";
import { buildWalletRoutes } from "@/modules/wallets/presentation/routes/wallet.routes.js";
import { WalletController } from "@/modules/wallets/presentation/controllers/wallet.controller.js";

export const buildApp = () => {
  const app: Express = express();

  // Apply Global Middlewares
  app.use(cors());
  app.use(express.json());

  app.use(httpLogger); // logger middleware

  // api documentation
  setupSwagger(app);

  // Baseline Health Status Route
  app.get("/api/v1/health", (_: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        status: "UP",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    });
  });

  // app routes
  app.use("/api/v1/auth", buildAuthRoutes(authController));
  app.use(
    "/api/v1/users",
    buildUserRoutes(usersController, env.JWT_ACCESS_SECRET),
  );
  app.use(
    "/api/v1/wallet",
    buildWalletRoutes(getMyWalletController, env.JWT_ACCESS_SECRET),
  );

  // Route not found Catchment Layer
  app.use(notFoundHandler);

  // Global Error Catchment Layer
  app.use(globalErrorHandler);

  return app;
};

export default buildApp;
