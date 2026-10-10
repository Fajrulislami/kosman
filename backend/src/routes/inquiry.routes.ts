import { Router } from "express";
import { requireAdmin } from "../middlewares/auth";
import { createInquiry, getAdminInquiries, updateInquiryStatus, deleteInquiry } from "../controllers/inquiry.controller";

export const inquiryRouter = Router();

// Public
inquiryRouter.post("/public/inquiries", createInquiry);

// Admin
inquiryRouter.get("/admin/inquiries", requireAdmin, getAdminInquiries);
inquiryRouter.put("/admin/inquiries/:id", requireAdmin, updateInquiryStatus);
inquiryRouter.delete("/admin/inquiries/:id", requireAdmin, deleteInquiry);
