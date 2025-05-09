"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import clsx from "clsx";
import Footer from "@/components/Footer";

type TransactionDetail = {
  id: string;
  invoiceId: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  expiredDate: string;
  proofPaymentUrl?: string;
  transaction_items: {
    title: string;
    imageUrls: string[];
    quantity: number;
    price: number;
  }[];
};
type PaymentMethod = {
  name: string;
  id: string;
  imageUrl: string;
};

export default function TransactionDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null
  );
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 1024 * 1024) {
      alert("Ukuran gambar maksimal 1MB");
      return;
    }
    setImageFile(file);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Failed to fetch transaction detail", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPayment = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const json = await res.json();
        setPaymentMethod(json.data?.[0]); // ambil yang pertama
      } catch (err) {
        console.error("Failed to fetch payment method", err);
      }
    };

    if (id && token) {
      fetchDetail();
      fetchPayment();
    }
  }, [id, token]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Failed to fetch transaction detail", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchDetail();
  }, [id, token]);

  const handleUploadAndUpdate = async () => {
    if (!imageFile || !id || !token) return alert("File tidak boleh kosong!");

    try {
      // 1. Upload Image
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("token", token || ""); // kirim token via formData

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error("Upload error:", errorText);
        return alert("Gagal upload gambar: " + errorText);
      }

      const uploadData = await uploadRes.json();

      const imageUrl = uploadData.url;

      // 2. Update Transaction Proof
      const updateRes = await fetch(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-proof-payment/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ proofPaymentUrl: imageUrl }),
        }
      );

      if (updateRes.ok) {
        alert("Transaksi berhasil diperbarui!");
      } else {
        alert("Gagal memperbarui transaksi.");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleCancel = async () => {
    if (!id || !token) return;
    const confirmed = confirm("Apakah kamu yakin ingin membatalkan transaksi?");
    if (!confirmed) return;

    try {
      const res = await fetch(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${id}`,
        {
          method: "POST",
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        alert("Transaksi berhasil dibatalkan.");
        location.reload();
      } else {
        alert("Gagal membatalkan transaksi.");
      }
    } catch (error) {
      console.error("Error canceling transaction:", error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!data)
    return <div className="p-10 text-center">Transaksi tidak ditemukan.</div>;

  const item = data.transaction_items?.[0];
  const proofUploaded = Boolean(data.proofPaymentUrl);

  const statusStyle = clsx(
    "inline-block px-3 py-1 rounded-full text-xs font-semibold",
    {
      "bg-yellow-100 text-yellow-700": data.status === "Pending",
      "bg-green-100 text-green-700": data.status === "Success",
      "bg-red-100 text-red-600":
        data.status === "Cancelled" || data.status === "Failed",
      "bg-gray-100 text-gray-700": data.status === "Unpaid",
    }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-1 py-10 mt-4">
      <Link
        href="/cartorders"
        className="text-sm text-fuchsia-600 hover:underline flex items-center gap-2 mb-6"
      >
        <FaArrowLeft /> Kembali ke Daftar Pesanan
      </Link>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="p-6 border-b flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Detail Transaksi
            </h1>
            <p className="text-sm text-gray-500">
              Invoice ID: {data.invoiceId}
            </p>
          </div>
          <div className={statusStyle}>{data.status}</div>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-6">
          <img
            src={item?.imageUrls?.[0] || "/catbg.jpg"}
            alt={item?.title}
            className="w-full md:w-60 h-60 object-cover rounded-lg border"
          />

          <div className="flex-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {item?.title}
            </h2>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Jumlah</span>
                <span>{item?.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Harga per Item</span>
                <span>Rp {item?.price.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>Rp {data.totalAmount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Order</span>
                <span>
                  {new Date(data.orderDate).toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Kadaluarsa</span>
                <span>
                  {new Date(data.expiredDate).toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
              {paymentMethod && (
                <div className="bg-fuchsia-50 p-4 rounded-xl space-y-2 border border-fuchsia-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <img
                      src={paymentMethod.imageUrl}
                      alt={paymentMethod.name}
                      className="w-5 h-5 object-contain"
                    />
                    <span>Bank {paymentMethod.name}</span>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={paymentMethod.id}
                      className="w-full px-4 py-2 rounded-lg bg-white border text-sm font-mono text-gray-800 pr-20"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(paymentMethod.id);
                        alert("Nomor VA berhasil disalin!");
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-sm bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800 rounded-lg flex items-center gap-1"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Bukti Pembayaran
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={proofUploaded}
                className={clsx(
                  "w-full border rounded-lg px-4 py-2 text-sm file:bg-fuchsia-100 file:border-none file:mr-4",
                  {
                    "bg-gray-100 text-gray-500 cursor-not-allowed":
                      proofUploaded,
                  }
                )}
              />

              {proofUploaded && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">
                    Bukti Pembayaran:
                  </p>
                  <img
                    src={data.proofPaymentUrl}
                    alt="Bukti Pembayaran"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button
                onClick={handleCancel}
                disabled={proofUploaded}
                className={clsx(
                  "w-full py-2 px-4 rounded-xl transition",
                  proofUploaded
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                )}
              >
                Batalkan Transaksi
              </button>

              <button
                onClick={handleUploadAndUpdate}
                disabled={proofUploaded}
                className={clsx(
                  "w-full py-2 px-4 rounded-xl transition",
                  proofUploaded
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-fuchsia-600 text-white hover:bg-fuchsia-700"
                )}
              >
                Perbarui Transaksi
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
