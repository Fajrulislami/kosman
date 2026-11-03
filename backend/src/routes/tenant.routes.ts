import { Router } from "express";
import { requireAdmin, requireTenant } from "../middlewares/auth";
import { 
  getAdminTenants, 
  registerTenant, 
  checkoutLease, 
  updateTenant, 
  extendLease, 
  moveRoom,
} from "../controllers/tenant.controller";
import {
  requestLeaseExtension,
  getTenantExtensionStatus,
  getAdminLeaseExtensions,
  approveLeaseExtension,
  rejectLeaseExtension,
} from "../controllers/lease.controller";

export const tenantRouter = Router();

// Admin Tenant & Lease Routes
tenantRouter.get("/admin/tenants", requireAdmin, getAdminTenants);
tenantRouter.post("/admin/tenants", requireAdmin, registerTenant);
tenantRouter.put("/admin/tenants/:id", requireAdmin, updateTenant);
tenantRouter.post("/admin/leases/:id/checkout", requireAdmin, checkoutLease);
tenantRouter.put("/admin/leases/:id/extend", requireAdmin, extendLease);
tenantRouter.put("/admin/leases/:id/move", requireAdmin, moveRoom);

// Admin Lease Extension Approval Routes (Resmi, terpisah dari Komplain)
tenantRouter.get("/admin/leases/extensions", requireAdmin, getAdminLeaseExtensions);
tenantRouter.put("/admin/leases/extensions/:id/approve", requireAdmin, approveLeaseExtension);
tenantRouter.put("/admin/leases/extensions/:id/reject", requireAdmin, rejectLeaseExtension);

// Portal Tenant Routes
tenantRouter.post("/portal/lease/extend-request", requireTenant, requestLeaseExtension);
tenantRouter.get("/portal/lease/extension-status", requireTenant, getTenantExtensionStatus);
