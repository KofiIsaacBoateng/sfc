import express from "express";
import type { Express, Request, Response } from "express";
import cors from "cors";
import { notFoundHandler } from "../shared/middleware/not-found.middleware.js";
import { globalErrorHandler } from "../shared/middleware/error.middleware.js";
import { httpLogger } from "../shared/logger/httpLogger.js";
import { setupSwagger } from "../docs/swagger.js";

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
      timestamp: new Date(),
      version: "1.0.0",
    },
  });
});

// Route not found Catchment Layer
app.use(notFoundHandler);

// Global Error Catchment Layer
app.use(globalErrorHandler);

export default app;
