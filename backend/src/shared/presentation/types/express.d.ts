import type {
  UserRole,
  UserStatus,
} from "@/src/modules/users/domain/entities/user.entity.ts";
import * as admin from "firebase-admin";

declare global {
  namespace Express {
    interface Request {
      authUser: {
        userId: string;
        firebaseUid: admin.auth.DecodedIdToken;
        phoneNumber: string;
        role: UserRole;
        status: UserStatus;
      };
    }
  }
}
