import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";

import { HeroGradient } from "@/components/hero-gradient";
import HeroSection from "@/components/hero-section";

export default function Page() {
  return (
    <>
      <div className="relative mx-auto min-h-screen w-full overflow-hidden rounded-xl bg-white px-5 py-3">
        <Header />

        <HeroSection />
      </div>

      <Footer />
    </>
  );
}
