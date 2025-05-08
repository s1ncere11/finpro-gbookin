// src/app/page.tsx
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="mx-80 mt-24">
      <HeroSection />
      <Footer />
    </main>
  );
}
