"use client";

import { useEffect, useState } from "react";

export default function CategoryPage({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, activitiesRes] = await Promise.all([
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
            {
              headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
            }
          ),
          fetch(
            "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
            {
              headers: { apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c" },
            }
          ),
        ]);

        const categoriesJson = await categoriesRes.json();
        const activitiesJson = await activitiesRes.json();

        const activityCategoryIds = new Set(
          activitiesJson.data.map((activity) => activity.categoryId)
        );

        const filteredCategories = categoriesJson.data.filter((category) =>
          activityCategoryIds.has(category.id)
        );

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    setSelected(categoryId);
    onCategorySelect(categoryId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="min-h-[120px] flex flex-wrap justify-start gap-4 sm:gap-5 md:gap-6">
        {categories?.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center gap-3 sm:gap-4 px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto ${
              selected === category.id
                ? "bg-gradient-to-r from-purple-800 to-fuchsia-700 text-white border-fuchsia-800"
                : "bg-white text-black border-transparent hover:bg-gradient-to-r hover:from-purple-800 hover:to-fuchsia-700 hover:text-white"
            }`}
          >
            {category.imageUrl ? (
              <img
                src={
                  category.imageUrl && category.imageUrl.trim() !== ""
                    ? category.imageUrl
                    : "/catbg.jpg"
                }
                alt={category.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/catbg.jpg";
                }}
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">
                N/A
              </div>
            )}
            <div className="text-left">
              <p className="text-sm sm:text-base font-bold">{category.name}</p>
              <p className="text-xs opacity-80">Tours Available</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
