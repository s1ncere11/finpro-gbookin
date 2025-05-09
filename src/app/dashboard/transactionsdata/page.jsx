"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleDollarSign, CreditCard, FileText } from "lucide-react";

const API_URL =
  "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(API_URL, {
          headers: {
            apiKey: API_KEY,
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (result && result.data) {
          setTransactions(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    const searchLower = search.toLowerCase();
    const statusMatch = t.status?.toLowerCase() === filter.toLowerCase();
    const invoiceIdMatch = t.invoiceId?.toLowerCase().includes(searchLower);
    const titleMatch = t.transaction_items[0]?.title
      ?.toLowerCase()
      .includes(searchLower);
    const dateStr = formatDate(t.orderDate).toLowerCase();
    const dateMatch = dateStr.includes(searchLower);
    const amountMatch = t.totalAmount
      ?.toString()
      .toLowerCase()
      .includes(searchLower);

    return (
      statusMatch && (invoiceIdMatch || titleMatch || dateMatch || amountMatch)
    );
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-6 py-10 bg-fuchsia-50 ">
      <h1 className="text-4xl font-bold text-fuchsia-700 mb-2">
        Transactions Data
      </h1>
      <p className="mb-6 text-gray-500">Lorem ipsum dolor sit amet.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["Pending", "Success", "Cancelled", "Failed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full font-medium border transition-all duration-200 shadow-sm text-sm ${
              filter === status
                ? "bg-fuchsia-700 text-white"
                : "bg-white text-fuchsia-700 border-fuchsia-700 hover:bg-fuchsia-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 border border-fuchsia-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-fuchsia-700">
              {filter} Transactions
            </h2>
            <p className="text-sm text-gray-500">
              Total: {filteredTransactions.length} transactions
            </p>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by Invoice ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full p-3 border border-fuchsia-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
        />

        <div className="grid grid-cols-1 gap-4">
          {paginatedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-fuchsia-100/40 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-fuchsia-200 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="text-fuchsia-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-fuchsia-800">
                    {tx.invoiceId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tx.transaction_items[0]?.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(tx.orderDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <CreditCard className="w-4 h-4 text-fuchsia-600" />
                  {tx.payment_method?.name}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <CircleDollarSign className="w-4 h-4 text-fuchsia-600" />
                  Rp {tx.totalAmount.toLocaleString("id-ID")}
                </div>
                <span className="bg-fuchsia-200 text-fuchsia-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {tx.status}
                </span>

                <button
                  onClick={() =>
                    router.push(`/dashboard/transactionsdata/${tx.id}`)
                  }
                  className="ml-2 text-sm text-fuchsia-600 hover:text-fuchsia-800"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              Tidak ada transaksi ditemukan.
            </div>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-md text-sm border ${
                currentPage === page
                  ? "bg-fuchsia-700 text-white"
                  : "bg-white text-fuchsia-700 border-fuchsia-300 hover:bg-fuchsia-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
