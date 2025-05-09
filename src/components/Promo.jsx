"use client";

import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { TbFlagCancel } from "react-icons/tb";

export default function PromosPage() {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState(null); // Untuk modal

  useEffect(() => {
    fetch("https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos", {
      headers: {
        apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.data)) {
          setPromos(data.data);
        } else {
          console.error("Data dari API bukan array:", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPromos = Array.isArray(promos)
    ? promos.filter((promo) =>
        promo.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl overflow-hidden shadow-lg"
        >
          <div className="bg-gray-300 h-60 w-full" />
          <div className="p-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 mt-20">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-orange-600 drop-shadow">
        Promo Liburan yang Literally Worth It!
      </h1>

      <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
        Mau chill di Bali atau healing ke luar negeri? Cek promo-promo{" "}
        <span className="font-semibold text-fuchsia-600">epic</span> dari{" "}
        <span className="font-semibold text-orange-500">Xplore Vacations</span>.
        Lebih dari <strong>100+ destinasi</strong> ready buat kamu explore. 🌍✈️
      </p>

      <div className="relative w-full max-w-md mb-6">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cari promo Bali, Jepang, dll..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPromos.map((promo) => (
            <div
              key={promo.id}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-[1.03]"
            >
              {/* Gambar + Hover Effect */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={
                    promo.imageUrl && promo.imageUrl.trim() !== ""
                      ? promo.imageUrl
                      : "/catbg.jpg"
                  }
                  alt={promo.title || "Promo Image"}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/catbg.jpg";
                  }}
                />

                {/* Badge Diskon */}
                <span className="absolute top-3 left-3 bg-fuchsia-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  -15%
                </span>

                {/* Badge New */}
                <span className="absolute top-3 right-3 bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow">
                  Baru
                </span>

                {/* Overlay Klaim */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <button
                    onClick={() => setSelectedPromo(promo)}
                    className="text-white bg-fuchsia-600 hover:bg-fuchsia-700 hover:cursor-pointer px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
                  >
                    🎉 Klaim Sekarang
                  </button>
                </div>
              </div>

              {/* Info Promo */}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1">
                  {promo.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {promo.termsCondition}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPromo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl animate-fadeIn grid grid-cols-1 md:grid-cols-2">
            {/* Gambar di kiri */}
            <div className="relative">
              <img
                src={
                  selectedPromo.imageUrl && selectedPromo.imageUrl.trim() !== ""
                    ? selectedPromo.imageUrl
                    : "/catbg.jpg"
                }
                alt={selectedPromo.title || "Promo Image"}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/catbg.jpg";
                }}
              />

              <button
                onClick={() => setSelectedPromo(null)}
                className="absolute top-3 right-3 bg-white hover:bg-fuchsia-700 hover:cursor-pointer bg-opacity-80 hover:bg-opacity-100 text-gray-700 hover:text-red-500 p-2 rounded-full shadow transition"
              >
                ✖️
              </button>
              <span className="absolute bottom-3 left-3 bg-fuchsia-600 text-white text-xs px-3 py-1 rounded-full shadow">
                Promo Spesial
              </span>
            </div>

            {/* Konten di kanan */}
            <div className="p-6 flex flex-col justify-between relative">
              <div>
                <h2 className="text-2xl font-bold text-fuchsia-700 mb-2">
                  🎉 {selectedPromo.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {selectedPromo.description}
                </p>

                {/* Kode Promo - Glassmorphism */}
                <div className="backdrop-blur-md bg-fuchsia-50/70 border border-fuchsia-200 p-4 rounded-xl mb-5 shadow-inner">
                  <p className="text-xs text-gray-500 mb-1">Kode Promo</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-wider text-fuchsia-700">
                      {selectedPromo.promoCode || "BELI2"}
                    </span>
                  </div>
                </div>

                {/* Info Diskon */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-5">
                  <div>
                    <p className="text-gray-500 mb-1">💸 Diskon</p>
                    <p className="font-bold text-fuchsia-700 text-lg">
                      Rp
                      {selectedPromo.promo_discount_price?.toLocaleString(
                        "id-ID"
                      ) || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">📌 Minimum Claim</p>
                    <p className="font-bold text-gray-800 text-lg">
                      Rp
                      {selectedPromo.minimum_claim_price?.toLocaleString(
                        "id-ID"
                      ) || "-"}
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-xs text-gray-500">
                  <p className="font-semibold text-gray-600 mb-1">
                    📄 Syarat & Ketentuan
                  </p>
                  <p>
                    {selectedPromo.terms_condition
                      ? selectedPromo.terms_condition.replace(/<[^>]*>/g, "")
                      : "Syarat & ketentuan berlaku."}
                  </p>
                </div>
              </div>

              {/* Floating Klaim Button */}
              <div className="mt-6 flex justify-end">
                <button
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold text-sm px-6 py-2 rounded-xl transition hover:cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      selectedPromo.promoCode || "BELI2"
                    );
                    alert("✅ Kode disalin ke clipboard!");
                  }}
                >
                  🚀 Klaim Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
