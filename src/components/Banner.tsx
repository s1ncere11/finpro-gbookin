"use client";

import { headers } from "next/headers";
import { useEffect, useState } from "react";

export default function Banner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c", // ganti dengan API key asli kamu
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
    <div className="flex gap-4 overflow-x-auto p-4">
      {Array.isArray(banners) &&
        banners.map((banner: any) => (
          <div
            key={banner.id}
            className="min-w-[300px] bg-white shadow-md rounded-md p-4"
          >
            <img
              src={banner.imageUrl}
              alt={banner.name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="mt-2 text-lg font-semibold">{banner.name}</h3>
            <p className="text-sm text-gray-600">{banner.description}</p>
          </div>
        ))}
    </div>
  );
}
