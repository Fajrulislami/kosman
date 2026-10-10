import { Router } from "express";
import { requireAdmin } from "../middlewares/auth";
import { getAnalyticsOverview } from "../controllers/analytics.controller";

export const analyticsRouter = Router();

analyticsRouter.get("/admin/analytics/overview", requireAdmin, getAnalyticsOverview);
