"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

export default function PortalLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Pengecualian: Halaman Login tidak boleh ada Sidebar & Header
  if (pathname === "/portal/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <PortalSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col min-w-0">
        <PortalHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
