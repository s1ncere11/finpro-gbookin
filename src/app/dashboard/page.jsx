"use client";

import {
  LayoutDashboard,
  Image,
  Tag,
  MapPin,
  ShoppingCart,
  Users,
  Settings,
  Info,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 hidden md:block">
        <div className="flex items-center gap-2 text-2xl font-bold text-orange-600 mb-10">
          <span>🧡</span> M.
        </div>

        <nav className="space-y-2 text-sm font-medium text-gray-700">
          <SidebarItem
            icon={<LayoutDashboard size={16} />}
            label="Dashboard"
            active
          />
          <SidebarItem icon={<Image size={16} />} label="Data Banner" />
          <SidebarItem icon={<Tag size={16} />} label="Data Promo" />
          <SidebarItem
            icon={<LayoutDashboard size={16} />}
            label="Data Category"
          />
          <SidebarItem icon={<MapPin size={16} />} label="Data Activity" />
          <SidebarItem
            icon={<ShoppingCart size={16} />}
            label="Data Transaksi"
          />
          <SidebarItem icon={<Users size={16} />} label="Data User" />
        </nav>

        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-gray-600">
          <img
            src="https://ui-avatars.com/api/?name=testes"
            alt="avatar"
            className="w-6 h-6 rounded-full"
          />
          <div>
            <div className="font-semibold">testes</div>
            <div className="text-[10px]">testestes@gmail.com</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 flex items-center mb-4 gap-1">
          <Link href="/" className="text-gray-700">
            🏠 Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-700">Dashboard</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <StatCard
            icon={<Image className="w-5 h-5 text-gray-500" />}
            label="Total Banner"
            value="11"
          />
          <StatCard
            icon={<Tag className="w-5 h-5 text-gray-500" />}
            label="Total Promo"
            value="10"
          />
          <StatCard
            icon={<LayoutDashboard className="w-5 h-5 text-gray-500" />}
            label="Total Category"
            value="25"
          />
          <StatCard
            icon={<MapPin className="w-5 h-5 text-gray-500" />}
            label="Total Activity"
            value="30"
          />
          <StatCard
            icon={<ShoppingCart className="w-5 h-5 text-gray-500" />}
            label="Total Transaksi"
            value="567"
          />
          <StatCard
            icon={<Info className="w-5 h-5 text-gray-500" />}
            label="Perlu Konfirmasi"
            value="245"
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-gray-500" />}
            label="Total User"
            value="378"
          />
          <StatCard
            icon={<Settings className="w-5 h-5 text-gray-500" />}
            label="Total Admin"
            value="312"
          />
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 ${
        active ? "bg-orange-50 text-orange-600 font-semibold" : ""
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-md p-4 shadow-sm border flex justify-between items-center">
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-semibold text-gray-800">{value}</div>
      </div>
      <div className="bg-gray-100 rounded-full p-2">{icon}</div>
    </div>
  );
}
