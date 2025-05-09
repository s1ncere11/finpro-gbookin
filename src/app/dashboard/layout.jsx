// app/dashboard/layout.js
import "../globals.css"; // jika pakai tailwind
import {
  CircleUser,
  LayoutGrid,
  Layers,
  MapPin,
  ShoppingCart,
  Tag,
  Users,
  DiscIcon,
  Image,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Toaster position="top-right" richColors closeButton />
      <aside className="w-60 bg-fuchsia-950 text-gray-100 p-6 flex flex-col">
        <Link href="/" className="text-xl font-bold text-white mb-12">
          G-Bookin
        </Link>
        <nav className="space-y-4 text-sm">
          <SidebarLink
            icon={<LayoutGrid size={18} />}
            label="Dashboard"
            href="/dashboard"
          />
          <SidebarLink
            icon={<Image size={18} />}
            label="Banners"
            href="/dashboard/bannersdata"
          />
          <SidebarLink
            icon={<DiscIcon size={18} />}
            label="Promos"
            href="/dashboard/promosdata"
          />
          <SidebarLink
            icon={<Activity size={18} />}
            label="Activities"
            href="/dashboard/activitiesdata"
          />
          <SidebarLink
            icon={<ShoppingCart size={18} />}
            label="Transaksi"
            href="/dashboard/transactionsdata"
          />
          <SidebarLink
            icon={<Users size={18} />}
            label="Users"
            href="/dashboard/usersdata"
          />
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center">
          <h1 className="text-lg font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <CircleUser className="w-6 h-6 text-gray-600" />
            <span className="text-sm text-gray-700">testes</span>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, href }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-fuchsia-900 hover:text-white"
    >
      {icon}
      {label}
    </Link>
  );
}
