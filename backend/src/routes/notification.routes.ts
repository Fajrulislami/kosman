import { Router } from "express";
import { requireAdmin } from "../middlewares/auth";
import { getAdminNotifications } from "../controllers/notification.controller";

export const notificationRouter = Router();

// Admin Routes
notificationRouter.get("/admin/notifications", requireAdmin, getAdminNotifications);
