import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { FirebaseAuthProvider } from "@/modules/auth/application/ports/firebase-auth.provider.js";

import { createSocketAuthMiddleware } from "./socket-io.auth.js";

export class SocketIoServer {
  readonly io: Server;

  constructor(
    httpServer: HttpServer,
    firebaseAuthProvider: FirebaseAuthProvider,
    unitOfWork: UnitOfWork,
  ) {
    this.io = new Server(httpServer, {
      cors: {
        // origin: process.env.CLIENT_URL,
        origin: "*",
      },
    });

    this.io.use(createSocketAuthMiddleware(firebaseAuthProvider, unitOfWork));

    this.io.on("connection", (socket) => {
      const userId = socket.data.userId as string;

      socket.join(`user:${userId}`);
    });
  }
}
