import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import { notFoundHandler } from "../shared/presentation/middleware/not-found.middleware.js";
import { globalErrorHandler } from "../shared/presentation/middleware/error.middleware.js";
import { httpLogger } from "../shared/logger/httpLogger.js";
import { setupSwagger } from "../docs/swagger.js";
import { deviceRoutes } from "@/modules/devices/container.js";
import { walletRoutes } from "@/modules/wallets/container.js";
import { authRoutes } from "@/modules/auth/container.js";
import { userRoutes } from "@/modules/users/container.js";
import { recipientRoutes } from "@/modules/transfers/container.js";

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
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/wallet", walletRoutes);
  app.use("/api/v1/devices", deviceRoutes);
  app.use("/api/v1/transfers", recipientRoutes);

  // Route not found Catchment Layer
  app.use(notFoundHandler);

  // Global Error Catchment Layer
  app.use(globalErrorHandler);

  return app;
};

export default buildApp;
