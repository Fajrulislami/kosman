import { Router } from "express";
import { requireAdmin, requireTenant } from "../middlewares/auth";
import {
  getAdminInvoices,
  getPortalInvoices,
  payInvoice,
  verifyPayment,
  createInvoice,
} from "../controllers/invoice.controller";

export const invoiceRouter = Router();

// Admin Routes
invoiceRouter.get("/admin/invoices", requireAdmin, getAdminInvoices);
invoiceRouter.post("/admin/invoices", requireAdmin, createInvoice);
invoiceRouter.post("/admin/payments/:id/verify", requireAdmin, verifyPayment);

// Portal Routes
invoiceRouter.get("/portal/invoices", requireTenant, getPortalInvoices);
invoiceRouter.post("/portal/invoices/:id/pay", requireTenant, payInvoice);
