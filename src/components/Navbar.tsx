"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { FaCartPlus, FaDatabase, FaPerson, FaRightLong } from "react-icons/fa6";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const handleClickCart = (e: React.MouseEvent) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault(); // Batalkan navigasi
      router.push("/login"); // Redirect ke login
    }
  };

  // Cek status login saat pertama kali render
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Supaya menu tertutup kalau resize ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login"); // redirect ke login atau beranda
  };

  return (
    <nav className="bg-white shadow-md w-full z-50 fixed top-0 left-0 min-h-[72px]">
      <div className="px-6 md:px-1 py-4 max-w-7xl mx-auto flex justify-between items-center font-sans">
        <Link href="/" className="text-2xl font-bold text-fuchsia-600">
          G-Bookin
        </Link>

        <div className="hidden md:flex gap-6 text-black text-sm font-semibold">
          <Link className="hover:text-fuchsia-600" href="/">
            Beranda
          </Link>
          <Link className="hover:text-fuchsia-600" href="/category">
            Kategori
          </Link>
          <Link className="hover:text-fuchsia-600" href="/promo">
            Promo
          </Link>
          <Link className="hover:text-fuchsia-600" href="/activity">
            Blog
          </Link>
        </div>

        <div className="hidden md:flex gap-2 items-center">
          <Link
            href="/cart"
            onClick={handleClickCart}
            className="text-gray-700 font-semibold hover:text-fuchsia-800 px-3 py-2"
          >
            <FaCartPlus className="text-2xl" />
          </Link>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none">
                <img
                  src="/catbg.jpg" // Ganti sesuai URL avatar jika tersedia
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-in-out translate-y-2 z-50">
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link
                      href="/profile"
                      className="flex justify-start gap-3 items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <FaPerson /> Profile
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/dashboard"
                      className="flex justify-start gap-3 items-center px-4 py-2 hover:bg-gray-100"
                    >
                      <FaDatabase /> Dashboard
                    </Link>
                  </li>
                </ul>
                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-start gap-3 items-center text-left px-4 py-2 text-sm text-fuchsia-600 hover:bg-gray-100"
                  >
                    <FaRightLong /> Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-fuchsia-700 border border-fuchsia-700 rounded-lg hover:bg-fuchsia-700 hover:text-white transition-colors duration-200 text-center"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-fuchsia-700 rounded-lg hover:bg-fuchsia-800 transition-colors duration-200 text-center"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-black"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white w-full px-6 pb-4 space-y-3 text-sm font-semibold shadow-md absolute top-full left-0">
          <Link
            className="block hover:text-fuchsia-500"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            Beranda
          </Link>
          <Link
            className="block hover:text-fuchsia-500"
            href="/category"
            onClick={() => setMenuOpen(false)}
          >
            Category
          </Link>
          <Link
            className="block hover:text-fuchsia-500"
            href="/promo"
            onClick={() => setMenuOpen(false)}
          >
            Promo
          </Link>
          <Link
            className="block hover:text-fuchsia-500"
            href="/activity"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <hr />
          <Link
            className="block hover:text-fuchsia-500"
            href="/cart"
            onClick={() => setMenuOpen(false)}
          >
            <FaCartPlus />
          </Link>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none">
                <img
                  src="/default-avatar.png" // Ganti sesuai URL avatar jika tersedia
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-in-out translate-y-2 z-50">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold text-gray-900">testes</p>
                  <p className="text-xs text-gray-600">testestes@gmail.com</p>
                </div>
                <ul className="py-2 text-sm text-gray-700">
                  <li>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      👤 Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/my-orders"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      📦 My Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      📊 Dashboard
                    </Link>
                  </li>
                </ul>
                <div className="border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    🔓 Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-fuchsia-700 border border-fuchsia-700 rounded-lg hover:bg-fuchsia-700 hover:text-white transition-colors duration-200 text-center"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-fuchsia-700 rounded-lg hover:bg-fuchsia-800 transition-colors duration-200 text-center"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
