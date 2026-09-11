import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getMessaging } from "firebase-admin/messaging";
import path from "path";

let authInstance, firebaseMessaging;
try {
  initializeApp({
    credential: cert(
      path.resolve(process.cwd(), "firebase-service-account.json"),
    ),
  });

  authInstance = getAuth();
  firebaseMessaging = getMessaging();
  console.log("🔒 Firebase Security Admin SDK initialized successfully");
} catch (error) {
  console.error("❌ Firebase Security Admin initialization failure:", error);
}

export const auth = authInstance;
export { firebaseMessaging };
