"use client";

import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

export default function PromoSlider() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
      setIsBeginning(slider.track.details.rel === 0);
      setIsEnd(
        slider.track.details.rel ===
          slider.track.details.slides.length - slider.options.slides.perView
      );
    },
    created(slider) {
      setIsBeginning(slider.track.details.rel === 0);
      setIsEnd(
        slider.track.details.rel ===
          slider.track.details.slides.length - slider.options.slides.perView
      );
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
        if (!res.ok) throw new Error("Failed to fetch promos");

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
      className="w-full py-10 mt-10 rounded-xl bg-slate-100"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0px 3px 6px rgba(255, 0, 255, 0.4)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-sky-900">Promo Deals!</h2>
          <a
            href="/promo"
            className="text-sky-900 font-semibold text-sm hover:underline"
          >
            Cek Semua Promo →
          </a>
        </div>

        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {promos.map((promo) => (
              <div
                key={promo.id}
                className="keen-slider__slide bg-white rounded-2xl shadow-md overflow-hidden "
              >
                <div className="relative h-[200px] sm:h-[240px] w-full">
                  <img
                    src={
                      promo.imageUrl && promo.imageUrl.trim() !== ""
                        ? promo.imageUrl
                        : "/catbg.jpg"
                    }
                    alt={promo.title || "Promo Image"}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/catbg.jpg";
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-fuchsia-600 text-white text-xs font-bold px-4 py-2 rounded">
                    15% OFF
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="text-base font-semibold mb-1 line-clamp-2">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {promo.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigasi */}
          {/* Tombol Prev */}
          <button
            onClick={handlePrev}
            className={`absolute top-1/2 left-0 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base p-2 rounded-full border-2 shadow-md flex items-center justify-center z-10 ${
              isBeginning
                ? "hidden"
                : "text-fuchsia-600 border-fuchsia-600 bg-white hover:bg-fuchsia-600 hover:text-white"
            }`}
          >
            <FaArrowLeft />
          </button>

          {/* Tombol Next */}
          <button
            onClick={handleNext}
            className={`absolute top-1/2 right-0 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base p-2 rounded-full border-2 shadow-md flex items-center justify-center z-10 ${
              isEnd
                ? "hidden"
                : "text-fuchsia-600 border-fuchsia-600 bg-white hover:bg-fuchsia-600 hover:text-white"
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
