"use client";

import Image from "next/image";
import { FaGift } from "react-icons/fa6";

export default function DownloadBanner() {
  return (
    <section className="relative w-full mt-12 bg-gradient-to-br from-fuchsia-100 via-white to-fuchsia-50 rounded-3xl shadow-xl overflow-hidden px-6 py-16 md:py-10">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
        {/* Left - Content */}
        <div className="text-center md:text-left">
          <span className="text-sm font-semibold bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full inline-flex items-center gap-2 mb-4">
            <FaGift /> Spesial Aplikasi
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-snug tracking-tight">
            Nikmati semua kemudahan <br /> di genggaman tanganmu.
          </h2>

          <p className="text-gray-600 mb-6 text-base md:text-lg max-w-md">
            Aplikasi Travelmu menawarkan promo eksklusif, perlindungan gratis,
            dan pengalaman terbaik yang tidak kamu temukan di website!
          </p>

          <ul className="space-y-3 text-gray-800 font-medium mb-8">
            <li>✅ Promo eksklusif setiap hari</li>
            <li>✅ Harga transparan & hemat</li>
            <li>✅ Asuransi perjalanan GRATIS</li>
          </ul>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
              alt="App Store"
              width={140}
              height={42}
              className="transition-transform hover:scale-105 rounded-md"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              width={140}
              height={42}
              className="transition-transform hover:scale-105 rounded-md"
            />
          </div>
        </div>

        {/* Right - Illustration with floating QR */}
        <div className="relative w-full flex justify-center">
          <img
            src="/dldl.png"
            alt="Ilustrasi"
            className="rounded-2xl w-full max-w-[320px] drop-shadow-2xl z-10"
          />
        </div>
      </div>
    </section>
  );
}
