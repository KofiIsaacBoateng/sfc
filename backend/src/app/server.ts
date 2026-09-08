import dotenv from "dotenv";
import buildApp from "./app.js";
import http from "http";
import env from "../shared/config/env.js"; // configured with environment validation
import { logger } from "../shared/logger/logger.js";
import { SocketIoServer } from "@/shared/infrastructure/realtime/socket-io.server.js";
import { PrismaUnitOfWork } from "@/shared/infrastructure/prisma/prisma-unit-of-work.js";
import { prisma } from "@/shared/infrastructure/prisma/prisma.js";
import { PrismaRepositoryFactory } from "@/shared/infrastructure/prisma/prisma-repository-factory.js";
import { FirebaseAdminAuthProvider } from "@/modules/auth/infrastructure/firebase/firebase-admin-auth.provider.js";

// environment setup
dotenv.config();

// initiate server
const app = buildApp();
const server = http.createServer(app);

const repositoryFactory = new PrismaRepositoryFactory();
const unitOfWork = new PrismaUnitOfWork(prisma, repositoryFactory);
const firebaseAuthProvider = new FirebaseAdminAuthProvider();
const socketServer = new SocketIoServer(
  server,
  firebaseAuthProvider,
  unitOfWork,
);

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

export { socketServer };
export default startServer;
