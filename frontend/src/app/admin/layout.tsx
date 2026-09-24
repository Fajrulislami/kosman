import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export const metadata = {
  title: "Admin Dashboard - Pondok Rahmat",
  description: "Property Management System for Pondok Rahmat",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F7F4] font-sans text-[#1F3D35]">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Top Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
