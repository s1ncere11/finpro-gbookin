// src/app/page.tsx
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-0 max-w-7xl mx-auto mt-24">
      <HeroSection />
      <Footer />
    </main>
  );
}
