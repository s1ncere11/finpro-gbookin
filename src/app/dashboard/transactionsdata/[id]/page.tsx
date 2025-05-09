"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              apiKey: API_KEY,
            },
          }
        );
        const data = await res.json();
        setTransaction(data.data);
        setSelectedStatus(data.data.status);
      } catch (error) {
        console.error("Gagal mengambil detail transaksi:", error);
      }
    };

    fetchTransactionDetail();
  }, [id]);

  const getStatusIcon = (status: string) => {
    if (status === "success")
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === "pending")
      return <Clock className="w-5 h-5 text-yellow-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  if (!transaction) {
    return <p className="p-6">Memuat detail transaksi...</p>;
  }

  return (
    <div className="px-6 py-10 bg-fuchsia-50 min-h-screen">
      <div className=" mx-auto">
        <h1 className="text-4xl font-bold text-fuchsia-700 mb-1 tracking-tight">
          Transaction Details
        </h1>
        <p className="text-gray-500 mb-8 text-base">
          Informasi lengkap transaksi kamu.
        </p>

        {/* Grid dua kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KIRI */}
          <div className="lg:col-span-2 space-y-8">
            {/* Info Transaksi */}
            <div className="bg-white border border-fuchsia-200 rounded-3xl shadow-lg p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">Invoice</p>
                  <p className="text-lg font-semibold">
                    {transaction.invoiceId}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {getStatusIcon(transaction.status)}
                    <span
                      className={`capitalize text-sm font-medium ${
                        transaction.status === "success"
                          ? "text-green-600"
                          : transaction.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <img
                    src={transaction.payment_method?.imageUrl}
                    alt={transaction.payment_method?.name}
                    className="w-14 h-14 object-contain rounded-md border p-1 bg-white"
                  />
                  <div>
                    <p className="text-gray-700 font-semibold">
                      {transaction.payment_method?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      VA:{" "}
                      {transaction.payment_method?.virtual_account_number ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 border-t pt-4">
                <p>
                  <strong className="text-gray-800">Tanggal Order:</strong>{" "}
                  {new Date(transaction.orderDate).toLocaleString()}
                </p>
                <p>
                  <strong className="text-gray-800">Total Bayar:</strong>{" "}
                  <span className="text-fuchsia-700 font-bold">
                    Rp {transaction.totalAmount.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
            </div>

            {/* Produk */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-fuchsia-700">
                Rincian Produk
              </h2>
              {transaction.transaction_items?.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-fuchsia-100 shadow-sm flex flex-col md:flex-row gap-4 hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrls?.[0] || "/catbg.jpg"}
                    alt={item.title}
                    className="w-full md:w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/catbg.jpg";
                    }}
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <p>
                        Jumlah:{" "}
                        <span className="font-medium text-gray-700">
                          {item.quantity}
                        </span>
                      </p>
                      <p className="font-semibold text-fuchsia-600">
                        Harga: Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KANAN */}
          <div className="space-y-6">
            {/* Ringkasan & Aksi */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-md space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Rincian Pembayaran
              </h3>
              <div className="flex justify-between items-center mb-2 border-b pb-2">
                <span className="text-sm text-gray-600">Total Pembayaran</span>
                <span className="font-bold text-fuchsia-700">
                  Rp {transaction.totalAmount.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Select Status */}
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Status Pembayaran
                </label>
                <select
                  className="w-full border rounded-md px-3 py-2"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  disabled={transaction.status === "success"}
                >
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Tombol Update */}
              <button
                disabled={transaction.status === "success"}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(
                      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transaction.id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          apiKey: API_KEY,
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: selectedStatus }),
                      }
                    );

                    const result = await res.json();
                    if (res.ok) {
                      toast.success("Status transaksi diperbarui!");
                      setTransaction((prev: any) => ({
                        ...prev,
                        status: selectedStatus,
                      }));
                    } else {
                      toast.error(
                        result.message || "Gagal memperbarui status."
                      );
                    }
                  } catch (err) {
                    toast.error("Terjadi kesalahan saat update status.");
                    console.error(err);
                  }
                }}
                className={`w-full font-semibold py-2 px-4 rounded-md mb-2 ${
                  transaction.status === "success"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-fuchsia-700 hover:bg-fuchsia-600 text-white"
                }`}
              >
                Update Status
              </button>

              {/* Tombol Batalkan */}
              <button
                disabled={transaction.status === "success"}
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  try {
                    const res = await fetch(
                      `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${transaction.id}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          apiKey: API_KEY,
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: "cancelled" }),
                      }
                    );

                    const result = await res.json();
                    if (res.ok) {
                      setTransaction((prev: any) => ({
                        ...prev,
                        status: "cancelled",
                      }));
                      toast.success("Transaksi berhasil dibatalkan.");
                    } else {
                      toast.error(
                        result.message || "Gagal membatalkan transaksi."
                      );
                    }
                  } catch (err) {
                    toast.error("Terjadi kesalahan saat batalkan transaksi.");
                    console.error(err);
                  }
                }}
                className={`w-full font-semibold py-2 px-4 rounded-md ${
                  transaction.status === "success"
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "text-red-600 border border-red-500 hover:bg-red-50"
                }`}
              >
                Batalkan Transaksi
              </button>
            </div>

            {/* Bukti Pembayaran */}
            {transaction.proofPaymentUrl ? (
              <>
                <img
                  src={transaction.proofPaymentUrl}
                  alt="Bukti Pembayaran"
                  className="w-full rounded-lg border shadow cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />

                {/* Modal */}
                {isModalOpen && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <div
                      className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                      <img
                        src={transaction.proofPaymentUrl}
                        alt="Bukti Pembayaran Modal"
                        className="w-full h-auto rounded"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Belum ada bukti pembayaran.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
