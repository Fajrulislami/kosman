import AdminShell from "@/components/admin/layout/AdminShell";

export const metadata = {
  title: "Admin Dashboard - Manajemen Properti Kos",
  description: "Property Management System for Kostara & Pondok Rahmat",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
