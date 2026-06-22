import { Router } from "express";
import { syncUserSession } from "../handlers/auth.handler.js";
import { authenticateFirebaseToken } from "../middleware/auth.middleware.js";

const router = Router();

// Route is locked down securely. The middleware intercepts the request first.
router.post("/sync", authenticateFirebaseToken, syncUserSession);

export default router;
