"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function PromoSlider() {
  const [promos, setPromos] = useState([]);
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
    async function fetchPromos() {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/promos",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch promos");
        }

        const data = await res.json();
        setPromos(data.data || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPromos();
  }, []);

  const handleNext = () => {
    instanceRef.current?.next();
  };

  const handlePrev = () => {
    instanceRef.current?.prev();
  };

  if (loading) {
    return <div className="text-center my-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 my-10">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl sm:text-2xl font-bold">
          Jangan sampai kelewatan promo akomodasi ini!
        </h2>
        <a
          href="#"
          className="text-sm sm:text-sm text-blue-600 font-semibold hover:underline"
        >
          Lihat semua →
        </a>
      </div>

      <div className="relative">
        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {promos.length > 0 ? (
            promos.map((promo) => (
              <div
                key={promo.id}
                className="keen-slider__slide rounded-2xl mx-1"
              >
                <img
                  src={promo.imageUrl}
                  alt={promo.name}
                  className="w-full h-[200px] sm:h-[240px] object-cover rounded-2xl"
                />
                <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-800 truncate">
                  {promo.name}
                </h3>
              </div>
            ))
          ) : (
            <div className="text-center">Tidak ada promo tersedia</div>
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
