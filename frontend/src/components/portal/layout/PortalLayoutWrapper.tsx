"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { PortalProvider } from "@/context/PortalContext";
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
    <PortalProvider>
      <div className="flex min-h-screen bg-[#F8F7F4] print:min-h-0 print:bg-white print:block">
        <PortalSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        <div className="flex-1 flex flex-col min-w-0 print:block">
          <PortalHeader onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto print:p-0 print:m-0 print:overflow-visible">
            {children}
          </main>
        </div>
      </div>
    </PortalProvider>
  );
}
