import type {
  FirebaseAuthProvider,
  FirebaseIdentity,
} from "../../application/ports/firebase-auth.provider.js";
import UnauthorizedError from "@/shared/errors/unauthorized.js";
import { auth } from "@/shared/config/firebase.js";

export class FirebaseAdminAuthProvider implements FirebaseAuthProvider {
  async verifyIdToken(tokenId: string): Promise<FirebaseIdentity> {
    const decoded = await auth?.verifyIdToken(tokenId);

    if (!decoded) {
      throw new UnauthorizedError(
        "FIREBASE_ERROR",
        "Invalid firebase token or auth instance failed to initialize.",
      );
    }

    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      throw new UnauthorizedError(
        "FIREBASE_ERROR",
        "Firebase token is missing phone number.",
      );
    }

    return {
      firebaseIdUid: decoded.uid,
      phoneNumber,
    };
  }
}
