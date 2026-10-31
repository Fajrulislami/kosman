import { Router } from "express";
import { requireAdmin, requireTenant } from "../middlewares/auth";
import { 
  getAdminTenants, 
  registerTenant, 
  checkoutLease, 
  updateTenant, 
  extendLease, 
  moveRoom,
  requestLeaseExtension,
} from "../controllers/tenant.controller";

export const tenantRouter = Router();

// Admin Routes
tenantRouter.get("/admin/tenants", requireAdmin, getAdminTenants);
tenantRouter.post("/admin/tenants", requireAdmin, registerTenant);
tenantRouter.put("/admin/tenants/:id", requireAdmin, updateTenant);
tenantRouter.post("/admin/leases/:id/checkout", requireAdmin, checkoutLease);
tenantRouter.put("/admin/leases/:id/extend", requireAdmin, extendLease);
tenantRouter.put("/admin/leases/:id/move", requireAdmin, moveRoom);

// Portal Routes
tenantRouter.post("/portal/lease/extend-request", requireTenant, requestLeaseExtension);
