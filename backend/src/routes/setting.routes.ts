import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/setting.controller";
import { authMiddleware, optionalAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", optionalAuth, getSettings);
router.put("/", authMiddleware, requireAdmin, updateSettings);

export default router;
