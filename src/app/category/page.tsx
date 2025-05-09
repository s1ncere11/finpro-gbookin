"use client";

import { useState } from "react";
import CategoryPage from "@/components/CategoryPage";
import ActivityList from "@/components/ActivityList";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FaHome } from "react-icons/fa";

type CategoryId = string | null;

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(null);

  const handleCategorySelect = (categoryId: CategoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-0 max-w-7xl mx-auto mt-24">
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

      <h1 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 mb-4 transform transition duration-300 hover:scale-105">
        Kamu mau kemana nih?
      </h1>
      <p className="mb-6 text-gray-600 font-medium text-base sm:text-lg leading-relaxed hover:text-gray-700 transition-colors">
        Kamu udah ada destinasi? Atau masih yang vibe-nya{" "}
        <span className="text-fuchsia-700 font-semibold">drop pin random</span>{" "}
        gitu?
      </p>

      <CategoryPage onCategorySelect={handleCategorySelect} />
      <ActivityList selectedCategory={selectedCategory} />
    </main>
  );
}
