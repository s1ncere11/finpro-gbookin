// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    banners: 0,
    promos: 0,
    categories: 0,
    activities: 0,
    transactions: 0,
    pending: 0,
    users: 0,
    admins: 0,
  });

  const TOKEN = process.env.NEXT_PUBLIC_TOKEN;
  const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: TOKEN,
          "Content-Type": "application/json",
          apiKey: API_KEY,
        };

        const [
          bannersRes,
          promosRes,
          categoriesRes,
          activitiesRes,
          transactionsRes,
          usersRes,
        ] = await Promise.all([
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
            { headers }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
            { headers }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
            { headers }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
            { headers }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-transactions",
            { headers }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
            { headers }
          ),
        ]);

        const banners = await bannersRes.json();
        const promos = await promosRes.json();
        const categories = await categoriesRes.json();
        const activities = await activitiesRes.json();
        const transactions = await transactionsRes.json();
        const users = await usersRes.json();

        const transaksiData = transactions.data || [];
        const userData = users.data || [];

        setStats({
          banners: banners.data.length,
          promos: promos.data.length,
          categories: categories.data.length,
          activities: activities.data.length,
          transactions: transaksiData.length,
          pending: transaksiData.filter((tx) => tx.status === "pending").length,
          users: userData.filter((u) => u.role === "user").length,
          admins: userData.filter((u) => u.role === "admin").length,
        });
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <StatCard
        label="Total Banners"
        value={stats.banners}
        color="bg-fuchsia-100"
      />
      <StatCard
        label="Total Promos"
        value={stats.promos}
        color="bg-fuchsia-100"
      />
      <StatCard
        label="Total Categories"
        value={stats.categories}
        color="bg-fuchsia-100"
      />
      <StatCard
        label="Total Activities"
        value={stats.activities}
        color="bg-fuchsia-100"
      />
      <StatCard
        label="Total Transaksi"
        value={stats.transactions}
        color="bg-fuchsia-100"
      />
      <StatCard
        label="Perlu Konfirmasi"
        value={stats.pending}
        color="bg-fuchsia-100"
      />
      <StatCard label="Total User" value={stats.users} color="bg-fuchsia-100" />
      <StatCard
        label="Total Admin"
        value={stats.admins}
        color="bg-fuchsia-100"
      />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-lg p-4 ${color} shadow-sm`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
      <div className="h-2 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white w-2/3 rounded-full"></div>
      </div>
    </div>
  );
}
