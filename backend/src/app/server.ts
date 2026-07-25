import dotenv from "dotenv";
import buildApp from "./app.js";
import http from "http";
import env from "../shared/config/env.js"; // configured with environment validation
import { logger } from "../shared/logger/logger.js";

// environment setup
dotenv.config();

// initiate server
const app = buildApp();
const server = http.createServer(app);

const startServer = () => {
  server.listen(env.PORT, () => {
    logger.info(`SFC backend running securely on port ${env.PORT}`);
  });

  // Handle system crashes gracefully
  process.on("unhandledRejection", (err) => {
    logger.error({
      message: "Unhandled Rejection! Shutting down...",
      error: err,
    });
    server.close(() => process.exit(1));
  });
};

export default startServer;
