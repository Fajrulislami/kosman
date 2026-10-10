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

export default function KwitansiPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        const res = await apiFetch<{ data: InvoiceDetail }>(`/api/admin/invoices/${id}`);
        setInvoice(res.data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat kwitansi");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchInvoiceDetail();
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
        <Link href="/admin/tagihan" className="text-[#1F3D35] underline">Kembali ke Tagihan</Link>
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
    <div className="min-h-screen bg-gray-200 py-10 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0 print:px-0">
      {/* Controls (Hidden on Print) */}
      <div className="mx-auto max-w-3xl mb-6 flex justify-between items-center print:hidden">
        <Link 
          href="/admin/tagihan"
          className="inline-flex items-center space-x-2 text-[#1F3D35] hover:text-[#C69C6D] transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Kembali</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center space-x-2 rounded-xl bg-[#1F3D35] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#152923]"
        >
          <Printer className="h-5 w-5" />
          <span>Cetak PDF</span>
        </button>
      </div>

      {/* Kwitansi A4 Sheet */}
      <div className="mx-auto max-w-3xl bg-white p-10 shadow-2xl print:shadow-none print:max-w-full">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1F3D35] tracking-tight">KOSTARA</h1>
            <p className="mt-2 text-sm text-gray-500">
              Jl. Kostara Premium No. 1, Jakarta Selatan<br />
              Telepon: +62 811-2222-3333
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
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kamar</h3>
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
                Sewa Kamar Kost - Bulan {invoice.periodMonth} Tahun {invoice.periodYear}
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
            <p className="text-sm font-bold text-[#1F3D35]">{payment?.method || "MANUAL_TRANSFER"}</p>
            <p className="text-xs text-gray-400 mt-4 italic">* Kwitansi ini sah sebagai bukti pembayaran penyewaan kost.</p>
          </div>
          <div className="text-center w-48">
            <p className="text-sm text-gray-500 mb-16">Penerima,</p>
            <p className="text-sm font-bold text-[#1F3D35] border-t border-gray-300 pt-2">Admin Kostara</p>
          </div>
        </div>
      </div>
    </div>
  );
}
