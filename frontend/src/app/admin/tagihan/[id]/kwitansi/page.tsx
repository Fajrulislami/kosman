"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Printer, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  periodMonth: number;
  periodYear: number;
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
      }
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

export default function KwitansiPage() {
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
        const [invoiceRes, settingsRes] = await Promise.all([
          apiFetch<{ data: InvoiceDetail }>(`/api/admin/invoices/${id}`),
          apiFetch<{ data: { profile?: Partial<PropertyProfile> } }>("/api/admin/settings").catch(() => null),
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
        setError(err.message || "Gagal memuat kwitansi");
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
        <Loader2 className="h-10 w-10 animate-spin text-[#C69C6D]" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F7F4] flex-col gap-4">
        <h1 className="text-2xl font-bold text-red-600">{error || "Kwitansi tidak ditemukan"}</h1>
        <Link href="/admin/tagihan" className="text-[#1F3D35] underline font-semibold">Kembali ke Tagihan</Link>
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

  const payment = invoice.payments?.[0];

  return (
    <div className="min-h-screen bg-gray-200 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0 font-sans">
      {/* Controls (Hidden on Print) */}
      <div className="mx-auto max-w-3xl mb-6 flex justify-between items-center print:hidden">
        <Link 
          href="/admin/tagihan"
          className="inline-flex items-center space-x-2 text-[#1F3D35] hover:text-[#C69C6D] transition-colors font-semibold"
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

      {/* Kwitansi A4 Sheet */}
      <div className="mx-auto max-w-3xl bg-white p-10 shadow-2xl print:shadow-none print:max-w-full rounded-2xl print:rounded-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1F3D35] tracking-tight uppercase">
              {propertyProfile.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed whitespace-pre-line">
              {propertyProfile.address}<br />
              Telepon: {propertyProfile.phone}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-black text-[#C69C6D] uppercase tracking-wider mb-2">KWITANSI</h2>
            <p className="text-sm font-bold text-gray-800">No. {invoice.invoiceNumber}</p>
            <p className="text-sm text-gray-500 mt-1">Tanggal: {payment ? formatDate(payment.paidAt) : formatDate(invoice.createdAt)}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Diterima Dari</h3>
            <p className="text-lg font-bold text-[#1F3D35]">{invoice.lease.tenant.fullName}</p>
            <p className="text-sm text-gray-600">{invoice.lease.tenant.phone}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Unit Kamar</h3>
            <p className="text-lg font-bold text-[#1F3D35]">No. {invoice.lease.room.roomNumber}</p>
            <p className="text-sm text-gray-600">Periode: Bulan {invoice.periodMonth} / {invoice.periodYear}</p>
          </div>
        </div>

        {/* Table */}
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
                Sewa Kamar Kost ({invoice.lease.room.roomType?.name || "Unit"}) - Bulan {invoice.periodMonth} Tahun {invoice.periodYear}
              </td>
              <td className="py-6 text-sm font-bold text-[#1F3D35] text-right">
                {formatRupiah(invoice.amount)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="py-6 text-base font-black text-gray-800 text-right uppercase tracking-wider">Total Dibayar</td>
              <td className="py-6 text-2xl font-black text-[#C69C6D] text-right">
                {formatRupiah(payment?.amount || invoice.amount)}
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Footer Info */}
        <div className="flex justify-between items-end mt-16 pt-8 border-t-2 border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Metode Pembayaran:</p>
            <p className="text-sm font-bold text-[#1F3D35]">{payment?.method || "TUNAI / TRANSFER"}</p>
            <p className="text-xs text-gray-400 mt-4 italic">* Kwitansi ini sah sebagai bukti pembayaran penyewaan kost.</p>
          </div>
          <div className="text-center min-w-48">
            <p className="text-sm text-gray-500 mb-16">Penerima,</p>
            <p className="text-sm font-bold text-[#1F3D35] border-t border-gray-300 pt-2 truncate">
              Admin {propertyProfile.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
