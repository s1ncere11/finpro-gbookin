"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function Banner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const json = await res.json();
        setBanners(json.data);
      } catch (error) {
        console.error("Gagal fetch banner:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="w-full  py-6 mt-10">
      <h2 className="text-xl md:text-2xl font-bold text-fuchsia-700 mb-4">
        Temukan kejutan dan destinasi baru yang siap kamu jelajahi!
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="rounded-2xl"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0px 3px 6px rgba(255, 0, 255, 0.4)",
        }}
      >
        {banners.map((banner: any) => (
          <SwiperSlide key={banner.id}>
            <div className="w-full shadow-lg rounded-xl ">
              <img
                src={banner.imageUrl}
                alt={banner.name}
                className="w-full h-[250px] sm:h-[350px] object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
