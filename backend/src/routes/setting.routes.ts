import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/setting.controller";
import { authMiddleware, requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", authMiddleware, requireAdmin, getSettings);
router.put("/", authMiddleware, requireAdmin, updateSettings);

export default router;
