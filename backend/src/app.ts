import express from "express";
import type { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"; // Import our new auth endpoints

// Load environment configurations
dotenv.config();

const app: Application = express();
const PORT = process.env["PORT"] || 5000;

// Apply Global Middlewares
app.use(cors());
app.use(express.json());

// Bind our specialized secure API route paths
app.use("/api/v1/auth", authRoutes);

// Baseline Health Status Route
app.get("/health", (_: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date() });
});

// Bootstrap Server Listener
app.listen(PORT, () => {
  console.log(`🚀 SFC backend running securely on port ${PORT}`);
});

export default app;
