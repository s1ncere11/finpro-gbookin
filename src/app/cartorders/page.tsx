"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSearch, FaTasks, FaTimes } from "react-icons/fa";
import {
  FaCartArrowDown,
  FaClock,
  FaFile,
  FaGift,
  FaHeart,
  FaPencil,
  FaPersonBooth,
  FaSalesforce,
  FaShop,
} from "react-icons/fa6";

type Transaction = {
  id: string;
  invoiceId: string;
  status: string;
  totalAmount: number;
  orderDate: string;
  expiredDate: string;
  transaction_items: {
    title: string;
    imageUrls: string[];
    quantity: number;
    price: number;
  }[];
};

type User = {
  name: string;
  role: string;
  email: string;
  profilePictureUrl: string;
  points: number;
};

const tabs = ["All", "Pending", "Success", "Cancelled", "Failed"];

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-400 text-yellow-700 ring-yellow-300",
  success: "bg-green-100 text-green-700 ring-green-300",
  cancelled: "bg-red-100 text-red-700 ring-red-300",
  failed: "bg-red-100 text-red-700 ring-red-300",
};

export default function CartOrders() {
  const [token, setToken] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setTransactions(data.data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setUser(data.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchTransactions();
    fetchUser();
  }, [token]);

  const filtered = transactions.filter((tx) => {
    const matchTab =
      selectedTab === "All" ||
      tx.status.toLowerCase() === selectedTab.toLowerCase();
    const matchSearch =
      tx.transaction_items?.[0]?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ?? false;
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-7xl px-1 mx-auto p-6 mt-20">
      <div className="flex flex-col-reverse md:flex-row md:items-start gap-6">
        {user && (
          <div className="md:w-1/3 mt-8 md:mt-0 h-fit sticky top-24">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 space-y-4 h-full flex flex-col">
              <div className="flex items-center gap-4">
                <img
                  src={user.profilePictureUrl || "/catbg.jpg"}
                  alt="profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-fuchsia-100"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    🗓️ Bergabung sejak: Jan 2024
                  </p>
                </div>
              </div>

              {/* POINTS & LEVEL */}
              <div className="grid grid-cols-2 gap-3 text-center text-sm mt-4">
                <div className="bg-fuchsia-50 p-3 rounded-xl">
                  <p className="text-fuchsia-800 font-bold">
                    {user.points?.toLocaleString("id-ID") ?? "0"}
                  </p>
                  <p className="text-gray-500 text-xs">Points</p>
                </div>
                <div className="bg-fuchsia-50 p-3 rounded-xl">
                  <p className="text-gray-700 font-semibold">
                    {user.points >= 5000
                      ? "Gold"
                      : user.points >= 2000
                      ? "Silver"
                      : "Bronze"}
                  </p>
                  <p className="text-gray-500 text-xs">Level</p>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span>Progress Bar</span>
                  <span>%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-fuchsia-00 h-2 rounded-full"></div>
                </div>
              </div>

              {/* DUMMY STATS */}
              <div className="grid grid-cols-2 gap-3 text-center text-sm mt-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <p className="text-indigo-800 font-bold">123</p>
                  <p className="text-gray-500 text-xs">Total Transaksi</p>
                </div>
                <div className="bg-fuchsia-50 p-3 rounded-xl">
                  <p className="text-fuchsia-800 font-bold">Liburan di Bali</p>
                  <p className="text-gray-500 text-xs">Produk Terakhir</p>
                </div>
              </div>

              {/* BADGES */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-blue-600 rounded-full">
                  <FaShop />
                  Aktif Belanja
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full">
                  <FaTasks />
                  Review Banyak
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-purple-600 rounded-full">
                  <FaPersonBooth />
                  {user.role}
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full">
                  <FaSalesforce /> Sering Promo
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full">
                  <FaHeart /> Kategori Favorit: Trip
                </span>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-2 mt-auto">
                <Link
                  href="/profile"
                  className="text-xs px-3 py-2 text-center flex items-center justify-center gap-2 bg-fuchsia-100 text-fuchsia-800 rounded-full hover:bg-fuchsia-200 transition"
                >
                  <FaPencil /> Edit Profil
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center justify-center gap-2 text-xs px-3 py-2 text-center bg-indigo-100 text-indigo-800 rounded-full hover:bg-indigo-200 transition"
                >
                  <FaCartArrowDown />
                  Wishlist
                </Link>
                <Link
                  href="/rewards"
                  className="text-xs px-3 py-2 flex justify-center items-center gap-2 text-center bg-fuchsia-100 text-fuchsia-800 rounded-full hover:bg-yellow-200 transition"
                >
                  <FaGift /> Lihat Rewards
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Left Side: Orders */}
        <div className="md:w-3/3">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-800 via-pink-700 to-red-600 mb-8 flex items-center gap-4">
            <span className="p-3 bg-fuchsia-100 text-fuchsia-800 rounded-full shadow-md animate-pulse">
              <FaFile className="text-2xl" />
            </span>
            <span className="border-b-4 border-fuchsia-800 pb-1">
              Your Orders
            </span>
          </h2>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-3 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition shadow-sm ${
                    selectedTab === tab
                      ? "bg-fuchsia-800 text-white"
                      : "bg-white text-fuchsia-800 border border-fuchsia-300 hover:bg-fuchsia-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <div className="relative w-full md:w-80 mb-3">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-400"
              />
            </div>
          </div>

          {/* Card List */}
          <div className="space-y-6">
            {filtered.map((tx) => {
              const item = tx.transaction_items?.[0];
              const badgeStyle =
                statusStyles[tx.status.toLowerCase()] ||
                "bg-gray-200 text-gray-800";

              return (
                <Link
                  key={tx.id}
                  href={`/cartorders/${tx.id}`}
                  className="block"
                >
                  <div
                    key={tx.id}
                    className="group flex flex-col md:flex-row bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <img
                      src={item?.imageUrls?.[0] || "/catbg.jpg"}
                      alt={item?.title || "No title"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/catbg.jpg";
                      }}
                      className="w-full md:w-44 h-44 object-cover md:rounded-l-2xl"
                    />

                    <div className="flex flex-col justify-between flex-1 p-5">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-gray-400 font-mono">
                              {tx.invoiceId}
                            </p>
                            <h3 className="text-lg font-semibold mt-1">
                              {item?.title || "No Title"}
                            </h3>
                          </div>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ring-1 ${badgeStyle}`}
                          >
                            {tx.status}
                          </span>
                        </div>

                        <div className="text-sm text-gray-500 mt-3 space-y-1">
                          <p className="flex items-center gap-2">
                            <FaClock /> Order:{" "}
                            {new Date(tx.orderDate).toLocaleDateString(
                              "id-ID",
                              {
                                dateStyle: "medium",
                              }
                            )}
                          </p>
                          <p className="flex items-center gap-2">
                            <FaTimes /> Kadaluarsa:{" "}
                            {new Date(tx.expiredDate).toLocaleDateString(
                              "id-ID",
                              {
                                dateStyle: "medium",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <p className="text-fuchsia-800 font-bold text-sm">
                          {item?.quantity} x Rp
                          {item?.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
