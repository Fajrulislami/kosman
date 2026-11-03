"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Printer, Loader2, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  periodMonth: number;
  periodYear: number;
  description?: string | null;
  status: string;
  createdAt: string;
  lease: {
    tenant: {
      fullName: string;
      phone: string;
    };
    room: {
      roomNumber: string;
      roomType: {
        name: string;
      };
    };
  };
  payments: Array<{
    amount: number;
    method: string;
    paidAt: string;
  }>;
}

interface PropertyProfile {
  name: string;
  address: string;
  phone: string;
}

export default function PortalKwitansiPage() {
  const params = useParams();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [propertyProfile, setPropertyProfile] = useState<PropertyProfile>({
    name: "Pondok Rahmat",
    address: "Romangpolong, Samata, Kec. Somba Opu, Kab. Gowa, Sulawesi Selatan",
    phone: "+62 812-3456-7890",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [invoiceRes, settingsRes] = await Promise.all([
          apiFetch<{ data: InvoiceDetail }>(`/api/portal/invoices/${id}`),
          apiFetch<{ data: { profile?: Partial<PropertyProfile> } }>("/api/settings").catch(() => null),
        ]);

        setInvoice(invoiceRes.data);

        if (settingsRes?.data?.profile) {
          setPropertyProfile({
            name: settingsRes.data.profile.name || "Pondok Rahmat",
            address: settingsRes.data.profile.address || "Romangpolong, Samata, Kec. Somba Opu, Kab. Gowa, Sulawesi Selatan",
            phone: settingsRes.data.profile.phone || "+62 812-3456-7890",
          });
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat kwitansi pembayaran");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F7F4]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#1F3D35] mx-auto" />
          <p className="mt-3 text-sm font-semibold text-[#6B716D]">Menyiapkan kwitansi resmi...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F7F4] p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5E3DE] shadow-xl text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#202321]">{error || "Kwitansi tidak ditemukan"}</h1>
          <p className="text-xs text-[#6B716D] mt-2 leading-relaxed">
            Pastikan tagihan ini telah diverifikasi lunas oleh pengelola atau periksa kembali riwayat tagihan Anda.
          </p>
          <div className="mt-6">
            <Link
              href="/portal/tagihan"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1F3D35] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#152923] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Tagihan</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatMethod = (method?: string) => {
    if (!method) return "TRANSFER BANK";
    if (method === "CASH") return "TUNAI / CASH";
    if (method === "MANUAL_TRANSFER") return "TRANSFER MANUAL";
    if (method === "MIDTRANS_VA") return "VIRTUAL ACCOUNT";
    if (method === "QRIS") return "QRIS";
    return method.replace(/_/g, " ");
  };

  const payment = invoice.payments?.[0];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0 font-sans">
      {/* Controls Bar (Disembunyikan saat mencetak) */}
      <div className="mx-auto max-w-3xl mb-6 flex justify-between items-center print:hidden">
        <Link 
          href="/portal/tagihan"
          className="inline-flex items-center space-x-2 text-[#1F3D35] hover:text-[#C69C6D] transition-colors font-semibold text-sm"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali ke Tagihan</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-2 rounded-xl bg-[#1F3D35] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#152923] active:scale-95 cursor-pointer"
        >
          <Printer className="h-5 w-5" />
          <span>Cetak Kwitansi (PDF)</span>
        </button>
      </div>

      {/* Lembar Kwitansi Formal A4 */}
      <div className="relative mx-auto max-w-3xl bg-white p-10 sm:p-12 shadow-2xl print:shadow-none print:max-w-full rounded-3xl print:rounded-none border border-[#E5E3DE] print:border-none overflow-hidden">
        
        {/* Cap LUNAS Digital Watermark */}
        <div className="absolute right-12 top-48 pointer-events-none select-none opacity-20 -rotate-12 border-4 border-green-600 rounded-2xl px-6 py-2.5">
          <span className="text-4xl font-black text-green-700 tracking-widest uppercase">LUNAS</span>
        </div>

        {/* Header Kwitansi */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-[#1F3D35] tracking-tight uppercase">
                {propertyProfile.name}
              </h1>
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed whitespace-pre-line max-w-sm">
              {propertyProfile.address}<br />
              Telepon: {propertyProfile.phone}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl sm:text-4xl font-black text-[#C69C6D] uppercase tracking-wider mb-2">
              KWITANSI
            </h2>
            <p className="text-sm font-bold text-gray-800">No. {invoice.invoiceNumber}</p>
            <p className="text-xs text-gray-500 mt-1">
              Tanggal: {payment ? formatDate(payment.paidAt) : formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>

        {/* Info Penyewa & Kamar */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#E5E3DE]/60">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Diterima Dari</h3>
            <p className="text-base font-bold text-[#1F3D35]">{invoice.lease.tenant.fullName}</p>
            <p className="text-xs text-gray-600 mt-0.5">{invoice.lease.tenant.phone}</p>
          </div>
          <div className="bg-[#F8F7F4] p-4 rounded-2xl border border-[#E5E3DE]/60 text-right">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Unit Kamar</h3>
            <p className="text-base font-bold text-[#1F3D35]">Kamar {invoice.lease.room.roomNumber}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {invoice.lease.room.roomType?.name || "Standar"} • {invoice.description || `Periode ${invoice.periodMonth}/${invoice.periodYear}`}
            </p>
          </div>
        </div>

        {/* Tabel Pembayaran */}
        <table className="w-full mb-10 text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Deskripsi Pembayaran</th>
              <th className="py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-50">
              <td className="py-6 text-sm font-semibold text-gray-800">
                {invoice.description
                  ? `${invoice.description} — Kamar ${invoice.lease.room.roomNumber} (${invoice.lease.room.roomType?.name || "Unit Kamar"})`
                  : `Sewa Kamar Kost (${invoice.lease.room.roomType?.name || "Unit Kamar"}) — Periode Bulan ${invoice.periodMonth} Tahun ${invoice.periodYear}`}
              </td>
              <td className="py-6 text-sm font-bold text-[#1F3D35] text-right whitespace-nowrap">
                {formatRupiah(invoice.amount)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="py-6 text-sm font-black text-gray-800 text-right uppercase tracking-wider">Total Pembayaran</td>
              <td className="py-6 text-2xl font-black text-[#C69C6D] text-right whitespace-nowrap">
                {formatRupiah(payment?.amount || invoice.amount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Status Verifikasi Badge */}
        <div className="flex items-center gap-2 mb-8 bg-green-50 p-3.5 rounded-2xl border border-green-200 text-green-800 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>Pembayaran tagihan ini telah diverifikasi lunas secara resmi oleh pengelola {propertyProfile.name}.</span>
        </div>

        {/* Footer & Tanda Tangan */}
        <div className="flex justify-between items-end pt-6 border-t-2 border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Metode Pembayaran:</p>
            <p className="text-sm font-bold text-[#1F3D35] mt-0.5">{formatMethod(payment?.method)}</p>
            <p className="text-[11px] text-gray-400 mt-4 italic max-w-xs">
              * Kwitansi ini diterbitkan secara elektronik dan sah sebagai bukti pembayaran resmi sewa kos.
            </p>
          </div>
          <div className="text-center min-w-44">
            <p className="text-xs text-gray-500 mb-14">Pengelola Kos,</p>
            <p className="text-sm font-bold text-[#1F3D35] border-t border-gray-300 pt-2 truncate">
              {propertyProfile.name} Management
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
