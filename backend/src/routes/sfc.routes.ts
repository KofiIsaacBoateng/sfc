import { Router } from "express";
import { authenticateFirebaseToken } from "../middleware/auth.middleware.js";
import { checkOwnership } from "../handlers/sfc.handler.js";

const router = Router();

// Route is locked down securely. The middleware intercepts the request first.
router.get("/ismine/:sfcToken", authenticateFirebaseToken, checkOwnership);

export default router;
