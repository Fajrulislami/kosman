"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
}

export default function AlertModal({
  isOpen,
  title,
  message,
  variant = "info",
  onClose,
}: AlertModalProps) {
  if (!isOpen) return null;

  const getStyles = () => {
    switch (variant) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
          bg: "bg-green-100",
          button: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-600" />,
          bg: "bg-red-100",
          button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "info":
      default:
        return {
          icon: <Info className="h-6 w-6 text-[#1F3D35]" />,
          bg: "bg-[#F8F7F4]",
          button: "bg-[#1F3D35] hover:bg-[#2A5247] focus:ring-[#1F3D35]",
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-3xl bg-white text-center shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="px-6 py-8">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${styles.bg} mb-4`}>
            {styles.icon}
          </div>
          <h3 className="text-xl font-bold text-[#1F3D35] mb-2">{title}</h3>
          <p className="text-sm text-[#6B716D]">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="bg-[#F8F7F4] px-6 py-4">
          <button
            type="button"
            className={`w-full justify-center rounded-xl px-4 py-3 text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.button}`}
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
