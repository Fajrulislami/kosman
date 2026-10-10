import { Router } from "express";
import { requireAdmin, requireTenant } from "../middlewares/auth";
import {
  getAdminInvoices,
  getAdminInvoiceById,
  getPortalInvoices,
  payInvoice,
  verifyPayment,
  createInvoice,
  generateMonthlyInvoices,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller";

export const invoiceRouter = Router();

// Admin Routes
invoiceRouter.get("/admin/invoices", requireAdmin, getAdminInvoices);
invoiceRouter.get("/admin/invoices/:id", requireAdmin, getAdminInvoiceById);
invoiceRouter.post("/admin/invoices", requireAdmin, createInvoice);
invoiceRouter.put("/admin/invoices/:id", requireAdmin, updateInvoice);
invoiceRouter.delete("/admin/invoices/:id", requireAdmin, deleteInvoice);
invoiceRouter.post("/admin/invoices/generate-monthly", requireAdmin, generateMonthlyInvoices);
invoiceRouter.post("/admin/payments/:id/verify", requireAdmin, verifyPayment);

// Portal Routes
invoiceRouter.get("/portal/invoices", requireTenant, getPortalInvoices);
invoiceRouter.post("/portal/invoices/:id/pay", requireTenant, payInvoice);
