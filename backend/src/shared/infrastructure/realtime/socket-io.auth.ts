import type { Socket } from "socket.io";

import UnauthorizedError from "@/shared/errors/unauthorized.js";
import type { UnitOfWork } from "@/shared/application/unit-of-work/unit-of-work.js";
import type { FirebaseAuthProvider } from "@/modules/auth/application/ports/firebase-auth.provider.js";

export const createSocketAuthMiddleware = (
  firebaseAuthProvider: FirebaseAuthProvider,
  unitOfWork: UnitOfWork,
) => {
  return async (
    socket: Socket,
    next: (error?: Error) => void,
  ): Promise<void> => {
    try {
      const tokenId = socket.handshake.auth["token"];

      if (typeof tokenId !== "string" || tokenId.trim().length === 0) {
        throw new UnauthorizedError(
          undefined,
          "Firebase ID token is required.",
        );
      }

      const identity = await firebaseAuthProvider.verifyIdToken(tokenId);

      const user = await unitOfWork.execute(async (repos) => {
        return repos.users.findByFirebaseUid(identity.firebaseIdUid);
      });

      if (!user) {
        throw new UnauthorizedError(undefined, "Authenticated user not found.");
      }

      socket.data.userId = user.id;
      socket.data.firebaseIdUid = identity.firebaseIdUid;
      socket.data.phoneNumber = identity.phoneNumber;

      next();
    } catch (error) {
      next(
        error instanceof Error
          ? error
          : new UnauthorizedError(undefined, "Socket authentication failed."),
      );
    }
  };
};
