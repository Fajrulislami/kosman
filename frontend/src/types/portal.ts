// frontend/src/types/portal.ts

export interface TenantProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  nik: string;
  occupation: string;
  roomNumber: string;
  roomType: string;
  basePrice: number;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface PortalInvoiceItem {
  id: string;
  invoiceNumber: string;
  room: string;
  month: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
  rawStatus: "PENDING" | "WAITING_CONFIRMATION" | "PAID" | "OVERDUE" | "CANCELLED";
  payment: {
    id: string;
    status: string;
    proofUrl: string | null;
    rejectReason: string | null;
  } | null;
}

export interface PortalComplaintItem {
  id: string;
  ticketNumber: string;
  category: string;
  issue: string;
  description: string;
  images: string[];
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: string;
  rawStatus: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  date: string;
  resolvedDate: string | null;
  resolutionNote: string | null;
}
