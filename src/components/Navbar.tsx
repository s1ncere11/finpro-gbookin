"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // lucide-react icon (opsional, bisa pakai lainnya)

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full z-50 fixed top-0">
      <div className="px-6 md:px-28 py-4 container mx-auto flex justify-between items-center font-sans">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-fuchsia-600">
          G-Bookin
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 text-black text-sm font-semibold">
          <Link className="hover:text-fuchsia-600" href="/">
            Home
          </Link>
          <Link className="hover:text-fuchsia-600" href="/category">
            Kategori
          </Link>
          <Link className="hover:text-fuchsia-600" href="/activity">
            Aktivitas
          </Link>
          <Link className="hover:text-fuchsia-600" href="/promo">
            Promo
          </Link>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex gap-2 items-center">
          <Link
            href="/cek-order"
            className="text-sm text-gray-700 font-semibold hover:text-fuchsia-600"
          >
            Cek Order
          </Link>
          <Link
            href="/login"
            className="bg-fuchsia-700 hover:bg-gradient-to-r  from-purple-700 to-fuchsia-600  text-white px-4 py-2 rounded-md"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="bg-fuchsia-700 hover:bg-gradient-to-r  from-purple-700 to-fuchsia-600  text-white px-4 py-2 rounded-md"
          >
            Daftar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 text-sm font-semibold shadow-md">
          <Link className="block hover:text-yellow-500" href="/">
            Home
          </Link>
          <Link className="block hover:text-yellow-500" href="/category">
            Category
          </Link>
          <Link className="block hover:text-yellow-500" href="/activity">
            Activity
          </Link>
          <Link className="block hover:text-yellow-500" href="/promo">
            Promo
          </Link>
          <hr />
          <Link className="block hover:text-yellow-500" href="/cek-order">
            Cek Order
          </Link>
          <Link
            className="block bg-yellow-500 text-white px-4 py-2 rounded-md"
            href="/login"
          >
            Masuk
          </Link>
          <Link
            className="block bg-gray-400 text-white px-4 py-2 rounded-md"
            href="/register"
          >
            Daftar
          </Link>
        </div>
      )}
    </nav>
  );
}
