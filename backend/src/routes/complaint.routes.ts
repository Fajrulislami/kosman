import { Router } from "express";
import { requireAdmin, requireTenant } from "../middlewares/auth";
import {
  getPortalComplaints,
  submitComplaint,
  getAdminComplaints,
  updateComplaintStatus,
} from "../controllers/complaint.controller";

export const complaintRouter = Router();

// Portal Routes
complaintRouter.get("/portal/complaints", requireTenant, getPortalComplaints);
complaintRouter.post("/portal/complaints", requireTenant, submitComplaint);

// Admin Routes
complaintRouter.get("/admin/complaints", requireAdmin, getAdminComplaints);
complaintRouter.put("/admin/complaints/:id/status", requireAdmin, updateComplaintStatus);
