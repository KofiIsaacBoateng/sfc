import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { FirebaseAuthProvider } from "@/modules/auth/application/ports/firebase-auth.provider.js";

import { createSocketAuthMiddleware } from "./socket-io.auth.js";
import { logger } from "@/shared/logger/logger.js";

export class SocketIoServer {
  readonly io: Server;

  constructor(
    httpServer: HttpServer,
    firebaseAuthProvider: FirebaseAuthProvider,
    unitOfWork: UnitOfWork,
  ) {
    this.io = new Server(httpServer, {
      cors: {
        // TODO: origin: process.env.CLIENT_URL,
        origin: "*",
      },
    });

    this.io.use(createSocketAuthMiddleware(firebaseAuthProvider, unitOfWork));

    this.io.on("connection", (socket) => {
      const userId = socket.data.userId as string;
      logger.info(`User: ${userId} just connected.`);
      socket.join(this.userRoom(userId));
      logger.info(`User:${userId} joined id room!`);

      socket.on("disconnect", () => {
        logger.warn(`User:${userId} is disconnected!`);
        // Socket.IO automatically removes the socket from its rooms.
        // No explicit cleanup is required here.
      });
    });
  }

  userRoom(userId: string): string {
    return `user:${userId}`;
  }
}
