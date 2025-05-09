"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

export default function PromoSlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
    breakpoints: {
      "(max-width: 640px)": {
        slides: { perView: 1.2, spacing: 10 },
      },
      "(min-width: 641px) and (max-width: 1024px)": {
        slides: { perView: 2.2, spacing: 10 },
      },
    },
    slides: {
      perView: 3,
      spacing: 15,
    },
    slideChanged(slider) {
      setIsFirst(slider.track.details.rel === 0);
      const lastVisible =
        slider.track.details.rel + slider.options.slides.perView >=
        slider.track.details.slides.length;
      setIsLast(lastVisible);
    },
  });

  useEffect(() => {
    async function fetchFilteredCategories() {
      try {
        const [categoriesRes, activitiesRes] = await Promise.all([
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
            {
              headers: {
                apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              },
            }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
            {
              headers: {
                apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              },
            }
          ),
        ]);

        if (!categoriesRes.ok || !activitiesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const categoriesData = await categoriesRes.json();
        const activitiesData = await activitiesRes.json();

        // Ambil semua categoryId dari aktivitas
        const validCategoryIds = new Set(
          activitiesData.data.map((act) => act.categoryId)
        );

        // Filter kategori yang ada activity-nya
        const filtered = categoriesData.data.filter((cat) =>
          validCategoryIds.has(cat.id)
        );

        setCategories(filtered);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredCategories();
  }, []);

  const handleNext = () => instanceRef.current?.next();
  const handlePrev = () => instanceRef.current?.prev();

  if (loading) {
    return (
      <div className="w-full py-10 mt-10 rounded-xl bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton width={100} height={18} />
            <Skeleton width={100} height={18} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-3 rounded-2xl shadow-md">
                <Skeleton height={200} />
                <div className="py-16 space-y-2">
                  <Skeleton height={100} width={`80%`} />
                  <Skeleton height={100} width={`90%`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div
      className="relative w-full py-10 px-4 mt-10 rounded-xl overflow-hidden bg-slate-100"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0px 3px 6px rgba(255, 0, 255, 0.4)",
      }}
    >
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-sky-900">
          Jelajahi Dunia Lewat Berbagai Kategori Perjalanan!
        </h2>
        <a
          href="/category"
          className="text-sky-900 font-semibold text-sm hover:underline"
        >
          Lihat semua Kategori →
        </a>
        {/* <div className="absolute inset-0 bg-black/10 z-50 rounded-xl"></div> */}
      </div>

      <div className="relative">
        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {categories.map((cat) => (
            <div key={cat.id} className="keen-slider__slide rounded-2xl">
              <div className="relative w-full h-[200px] sm:h-[240px] overflow-hidden rounded-xl group hover:cursor-pointer">
                <img
                  src={cat.imageUrl || undefined}
                  alt={cat.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white text-base sm:text-xl font-semibold text-center px-2">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*  Navigasi */}
        {!isFirst && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 p-2 rounded-full text-sky-700 border-2 border-sky-700 hover:bg-sky-700 hover:text-white bg-white shadow-md flex items-center justify-center z-10"
          >
            <FaArrowLeft />
          </button>
        )}

        {!isLast && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 p-2 rounded-full text-sky-700 border-2 border-sky-700 hover:bg-sky-700 hover:text-white bg-white shadow-md flex items-center justify-center z-10"
          >
            <FaArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}
