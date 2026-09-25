// frontend/src/types/admin.ts

export interface RoomItem {
  id: string;
  number: string;
  floor: number;
  type: string;
  roomTypeId: string;
  price: string;
  rawPrice: number;
  status: string;
  rawStatus: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | "RESERVED";
  tenant: string;
  tenantId: string | null;
  notes: string | null;
}

export interface RoomStatsData {
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
  occupancyRate: number;
}

export interface TenantItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  nik: string;
  occupation: string;
  room: string;
  roomNumber: string;
  roomId: string | null;
  leaseId: string | null;
  startDate: string;
  endDate: string;
  rentAmount: string;
  status: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface BillingItem {
  id: string;
  invoiceNumber: string;
  tenantName: string;
  tenantPhone: string;
  roomNumber: string;
  roomType: string;
  amount: string;
  rawAmount: number;
  dueDate: string;
  period: string;
  status: string;
  rawStatus: "PENDING" | "WAITING_CONFIRMATION" | "PAID" | "OVERDUE" | "CANCELLED";
  payment: {
    id: string;
    method: string;
    paidAt: string;
    proofUrl: string | null;
    status: string;
  } | null;
}

export interface ComplaintItem {
  id: string;
  ticketNumber: string;
  tenantName: string;
  tenantPhone: string;
  roomNumber: string;
  category: string;
  title: string;
  description: string;
  images: string[];
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
  resolvedAt: string | null;
  resolutionNote: string | null;
}

export interface DashboardOverview {
  metrics: {
    revenueThisMonth: number;
    revenueFormatted: string;
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    occupancyRate: number;
    unpaidInvoices: number;
    activeComplaints: number;
  };
  chartData: {
    month: string;
    pendapatan: number;
    fullAmount: number;
  }[];
  recentActivities: {
    payments: any[];
    complaints: any[];
  };
}
