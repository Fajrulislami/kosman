"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "primary";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  variant = "warning",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
      case "primary":
        return "bg-[#1F3D35] hover:bg-[#2A5247] text-white focus:ring-[#C69C6D]";
      case "warning":
      default:
        return "bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-100 text-red-600";
      case "primary":
        return "bg-[#F8F7F4] text-[#1F3D35]";
      case "warning":
      default:
        return "bg-amber-100 text-amber-600";
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F3D35]/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all animate-in fade-in zoom-in-95">
        <div className="bg-white px-6 pb-6 pt-6 sm:p-8 sm:pb-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${getIconStyles()}`}>
              <AlertTriangle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3 className="text-lg font-bold leading-6 text-[#1F3D35]" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-[#6B716D]">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#F8F7F4] px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getButtonStyles()}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#6B716D] shadow-sm ring-1 ring-inset ring-[#E5E3DE] hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
