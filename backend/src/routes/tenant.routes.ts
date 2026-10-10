import { Router } from "express";
import { requireAdmin } from "../middlewares/auth";
import { getAdminTenants, registerTenant, checkoutLease } from "../controllers/tenant.controller";

export const tenantRouter = Router();

// Admin Routes
tenantRouter.get("/admin/tenants", requireAdmin, getAdminTenants);
tenantRouter.post("/admin/tenants", requireAdmin, registerTenant);
tenantRouter.post("/admin/leases/:id/checkout", requireAdmin, checkoutLease);
