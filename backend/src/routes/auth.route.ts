import { Router } from "express";
import { linkSFCDevice, syncUserSession } from "../handlers/auth.handler.js";
import { authenticateFirebaseToken } from "../middleware/auth.middleware.js";

const router = Router();

// Route is locked down securely. The middleware intercepts the request first.
router.post("/sync", authenticateFirebaseToken, syncUserSession);

router.post("/link-device", authenticateFirebaseToken, linkSFCDevice);

export default router;
