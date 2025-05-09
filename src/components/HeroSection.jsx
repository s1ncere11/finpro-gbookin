"use client";

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaSearch, FaUser } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PromoSlider from "./PromoSlider";
import CategorySlider from "@/components/CategorySlider";
import { useRouter } from "next/navigation";
import Banner from "./Banner";
import DownloadBanner from "@/components/DownloadBanner";

export default function HeroSection() {
  const router = useRouter(); // Hook untuk navigasi
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSelectedLocation(inputValue);

    const filtered = activities.filter((activity) =>
      activity.title.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredActivities(filtered);
    setIsDropdownOpen(true);
  };

  const handleSearchSubmit = () => {
    // Cek apakah ada input yang diisi
    if (selectedLocation.trim()) {
      // Mengarahkan ke halaman kategori dengan query parameter berdasarkan lokasi yang dipilih
      router.push(`/category?search=${encodeURIComponent(selectedLocation)}`);
    }
  };

  useEffect(() => {
    fetch(
      "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
      {
        headers: {
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => setActivities(data?.data || []));
  }, []);

  return (
    <>
      <div className="relative text-white rounded-3xl px-4 sm:px-6 md:px-10 py-6 overflow-hidden mt-5">
        <div
          style={{
            backgroundImage: "url('/bg-hero4.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0px 3px 6px rgba(255, 0, 255, 0.4)",
          }}
          className="absolute inset-0 z-0 rounded-3xl"
        />
        <div className="relative z-10">
          {/* Teks */}
          <div className="max-w-xl mb-6">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Kabur aja dulu.
            </h1>
            <p className="text-sm sm:text-base font-medium mt-2">
              Traveling asik, ga bikin dompet berisik!
            </p>
          </div>

          {/* Form */}
          <div className="bg-gray-50/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md w-full max-w-full sm:max-w-3xl mx-auto space-y-4">
            {/* Input Lokasi */}
            <div className="relative">
              <div className="flex items-center gap-3 border border-gray-300 rounded-md p-3 bg-white">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  value={selectedLocation}
                  placeholder="Mau kemana nih?"
                  className="w-full outline-none text-sm text-gray-700"
                  onChange={handleInputChange}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                />
              </div>

              {isDropdownOpen && filteredActivities.length > 0 && (
                <ul className="absolute z-10 bg-white mt-1 border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto w-full">
                  {filteredActivities.map((activity) => (
                    <li
                      key={activity.id}
                      onMouseDown={() => {
                        router.push(`/activity/${activity.id}`);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                    >
                      {activity.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tanggal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col border border-gray-300 rounded-md p-3 bg-white">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => setCheckInDate(date)}
                    dateFormat="dd MMM yyyy"
                    className="outline-none text-sm text-gray-800"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {checkInDate.toLocaleDateString("id-ID", { weekday: "long" })}
                </span>
              </div>

              <div className="flex flex-col border border-gray-300 rounded-md p-3 bg-white">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => setCheckOutDate(date)}
                    dateFormat="dd MMM yyyy"
                    className="outline-none text-sm text-gray-800"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {checkOutDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                  })}
                </span>
              </div>
            </div>

            {/* Tombol */}
            <button
              onClick={handleSearchSubmit}
              className="w-full bg-fuchsia-700 hover:bg-gradient-to-r from-purple-700 to-fuchsia-600 text-white font-semibold text-base md:text-lg py-3 rounded-md shadow"
            >
              CARI
            </button>
          </div>
        </div>
      </div>
      <PromoSlider />
      <Banner />
      <CategorySlider />
      <DownloadBanner />
    </>
  );
}
