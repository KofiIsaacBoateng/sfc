import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"; // Import our new auth endpoints
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

// Load environment configurations
dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 5000;

// Apply Global Middlewares
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

// Baseline Health Status Route
app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Route not found Catchment Layer
app.use(notFoundHandler);

// Global Error Catchment Layer
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SFC backend running securely on port ${PORT}`);
});

export default app;
