"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { apiFetch } from "@/lib/api";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brandName, setBrandName] = useState("Kostara");

  useEffect(() => {
    // Ambil nama kos dari siteSettings jika ada
    apiFetch<{ data: { profile?: { name?: string } } }>("/api/admin/settings")
      .then((res) => {
        if (res?.data?.profile?.name) {
          setBrandName(res.data.profile.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F7F4] font-sans text-[#1F3D35]">
      {/* Desktop Sidebar */}
      <AdminSidebar brandName={brandName} />

      {/* Mobile Drawer (Slide-over) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1F3D35]/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 z-50 flex max-w-full animate-in slide-in-from-left duration-200">
            <AdminSidebar
              isMobile
              onClose={() => setIsMobileMenuOpen(false)}
              brandName={brandName}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* Top Header */}
        <AdminHeader
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          brandName={brandName}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
