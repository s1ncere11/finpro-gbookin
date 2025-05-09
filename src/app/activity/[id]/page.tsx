"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowDown, FaArrowUp, FaHome } from "react-icons/fa";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface Activity {
  id: string;
  title: string;
  description: string;
  facilities: string;
  address: string;
  city: string;
  province: string;
  imageUrls: string[];
  rating: number;
  total_reviews: number;
  price: number;
  location_maps: string;
}

export default function ActivityDetail() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showWhyLove, setShowWhyLove] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleBookNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            activityId: activity?.id,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal menambahkan ke keranjang");

      router.push("/cart");
    } catch (error) {
      alert("Terjadi kesalahan saat memproses pemesanan.");
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            activityId: activity?.id,
          }),
        }
      );

      if (!res.ok) throw new Error("Gagal menambahkan ke keranjang");

      alert("Berhasil ditambahkan ke keranjang!");
    } catch (error) {
      alert("Terjadi kesalahan saat menambahkan ke keranjang.");
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setActivity(json.data);
      } catch (e) {
        console.error(e);
        setError("Gagal memuat aktivitas. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchActivity();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!activity)
    return <div className="p-6 text-gray-500">Data tidak ditemukan</div>;

  return (
    <div className="pb-40 mt-24 px-4 md:px-10 lg:px-20 xl:px-72">
      {/* Breadcrumb */}
      <div className="mx-auto px-7 mt-10">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex items-center space-x-2">
            <li className="flex justify-center items-center gap-2">
              <FaHome />
              <Link href="/" className="hover:text-fuchsia-600 font-medium">
                Beranda
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <Link
              href="/category"
              className="hover:text-fuchsia-600 font-bold text-gray-800"
            >
              Kategori
            </Link>
          </ol>
        </nav>
      </div>

      {/* Hero Image */}
      <div className=" mx-auto px-7">
        <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={
              activity.imageUrls?.[0] && activity.imageUrls[0].trim() !== ""
                ? activity.imageUrls[0]
                : "/catbg.jpg"
            }
            alt={activity.title || "Activity Image"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/catbg.jpg";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
          <div className="absolute bottom-6 left-6 z-20 text-white">
            <h1 className="text-3xl lg:text-4xl font-bold drop-shadow-lg">
              {activity.title}
            </h1>
            <p className="text-md">
              {activity.city}, {activity.province}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-7 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-md p-6 shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowExperience(!showExperience)}
            >
              <h2 className="text-2xl font-semibold">Experience</h2>
              <span className="text-xl text-gray-500">
                {showExperience ? <FaArrowUp /> : <FaArrowDown />}
              </span>
            </div>

            <AnimatePresence>
              {showExperience && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3"
                >
                  <p className="text-gray-700 leading-relaxed">
                    {activity.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white rounded-md p-6 shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowFacilities(!showFacilities)}
            >
              <h2 className="text-2xl font-semibold">Facilities</h2>
              <span className="text-xl text-gray-500">
                {showFacilities ? <FaArrowUp /> : <FaArrowDown />}
              </span>
            </div>

            <AnimatePresence>
              {showFacilities && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3"
                >
                  <p className="text-gray-700">{activity.facilities}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-md p-6 shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowLocation(!showLocation)}
            >
              <h2 className="text-2xl font-semibold">Location</h2>
              <span className="text-xl text-gray-500">
                {showLocation ? <FaArrowUp /> : <FaArrowDown />}
              </span>
            </div>

            <AnimatePresence>
              {showLocation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3 object-cover md:w-fit"
                >
                  <p className="mb-4 text-gray-700">
                    {activity.address}, {activity.city}, {activity.province}
                  </p>
                  <div
                    className="rounded-xl overflow-hidden border"
                    dangerouslySetInnerHTML={{ __html: activity.location_maps }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Why You'll Love This */}

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="bg-white rounded-md p-6 shadow-sm "
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowWhyLove(!showWhyLove)}
            >
              <h2 className="text-2xl font-semibold">
                Why You'll Love This Activity
              </h2>
              <span className="text-xl text-gray-500">
                {showWhyLove ? <FaArrowUp /> : <FaArrowDown />}
              </span>
            </div>

            <AnimatePresence>
              {showWhyLove && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="list-disc pl-5 text-gray-700 space-y-2 mt-4 overflow-hidden"
                >
                  <li>✨ Experienced local guides with deep knowledge</li>
                  <li>🚐 Free hotel pick-up and drop-off</li>
                  <li>📸 Includes professional photo spot tours</li>
                  <li>🍽️ Complimentary traditional snacks</li>
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Dummy Reviews */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="bg-white rounded-md p-6 shadow-sm"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <h2 className="text-2xl font-semibold mb-0">Customer Reviews</h2>
              <span className="text-xl text-gray-500">
                {isOpen ? <FaArrowUp /> : <FaArrowDown />}
              </span>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-4 mt-4"
                >
                  <div className="border-b pb-4">
                    <p className="text-gray-800 font-semibold">Ayu Lestari</p>
                    <p className="text-sm text-yellow-500">⭐⭐⭐⭐⭐</p>
                    <p className="text-gray-600 mt-1">
                      Seru banget! Tour guide-nya ramah dan tempatnya bagus buat
                      foto-foto.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <p className="text-gray-800 font-semibold">Raka Prasetya</p>
                    <p className="text-sm text-yellow-500">⭐⭐⭐⭐</p>
                    <p className="text-gray-600 mt-1">
                      Worth the price. Waktunya pas, dan fasilitasnya lengkap.
                      Bakal balik lagi!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        </div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-[350px] lg:sticky lg:top-28 hidden lg:block"
        >
          <div className="bg-white rounded-md shadow-lg p-6 space-y-4">
            <div className="text-xl font-semibold">{activity.title}</div>
            <div>
              <span className="text-gray-800 font-medium flex items-center gap-3">
                <FaLocationCrosshairs /> {activity.city}, {activity.province}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-xl">⭐</span>
              <span className="text-gray-800 font-medium">
                {activity.rating}
              </span>

              <span className="text-sm text-gray-500">
                ({activity.total_reviews} reviews)
              </span>
            </div>
            <div className="text-3xl font-bold text-fuchsia-600">
              Rp{new Intl.NumberFormat("id-ID").format(activity.price)}{" "}
              <span className="text-sm font-normal text-gray-400">/ pax</span>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button
                onClick={handleBookNow}
                className="bg-gradient-to-r from-fuchsia-800 to-fuchsia-900 hover:from-fuchsia-700 hover:to-fuchsia-800 text-white py-3 rounded-xl font-semibold transition-all"
              >
                Book Now
              </button>
              <button
                onClick={handleAddToCart}
                className="border border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 py-3 rounded-xl font-semibold transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Sticky Booking */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex gap-2 lg:hidden z-50 shadow-xl">
        {/* Mobile Sticky Booking */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 lg:hidden z-50 shadow-xl">
          <div className="flex justify-between items-center mb-2 px-1">
            <div>
              <div className="text-sm text-gray-600">{activity.title}</div>
              <div className="flex items-center gap-1 text-yellow-500 text-sm">
                ⭐ {activity.rating}
                <span className="text-gray-400 text-xs">
                  ({activity.total_reviews} reviews)
                </span>
              </div>
            </div>
            <div className="text-lg font-bold text-fuchsia-600 text-right">
              Rp{new Intl.NumberFormat("id-ID").format(activity.price)}{" "}
              <span className="text-xs font-normal text-gray-400">/ pax</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleBookNow}
              className="flex-1 bg-fuchsia-600 text-white py-2 rounded-xl font-semibold"
            >
              Book Now
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-1 border border-fuchsia-600 text-fuchsia-600 py-2 rounded-xl font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
