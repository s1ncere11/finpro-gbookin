"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function PromoSlider() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleNext = () => instanceRef.current?.next();
  const handlePrev = () => instanceRef.current?.prev();

  if (loading) return <div className="text-center my-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">
          Keliling dunia penuh diskon dan promo menarik!
        </h2>
        <a
          href="#"
          className="text-blue-600 font-semibold text-sm hover:underline"
        >
          Lihat semua →
        </a>
      </div>

      <div className="relative">
        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="keen-slider__slide rounded-2xl">
                {cat.imageUrl ? (
                  <div className="relative w-full h-[200px] sm:h-[240px] overflow-hidden rounded-xl group hover:cursor-pointer">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white text-base sm:text-xl font-semibold text-center px-2">
                        {cat.name}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] sm:h-[240px] flex items-center justify-center bg-gray-200 rounded-xl">
                    <span className="text-gray-500 text-sm">
                      Tidak ada gambar
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center">Tidak ada data tersedia</div>
          )}
        </div>

        {/* Tombol Navigasi */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-0 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base p-2 rounded-full text-fuchsia-700 border-2 border-fuchsia-700 hover:bg-fuchsia-700 hover:text-white bg-white shadow-md flex items-center justify-center z-10"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-0 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base p-2 rounded-full text-fuchsia-700 border-2 border-fuchsia-700 hover:bg-fuchsia-700 hover:text-white bg-white shadow-md flex items-center justify-center z-10"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
