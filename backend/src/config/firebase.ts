import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import path from "path";

let authInstance;
try {
  initializeApp({
    credential: cert(
      path.resolve(process.cwd(), "firebase-service-account.json"),
    ),
  });

  authInstance = getAuth();
  console.log("🔒 Firebase Security Admin SDK initialized successfully");
} catch (error) {
  console.error("❌ Firebase Security Admin initialization failure:", error);
}

export const auth = authInstance;
