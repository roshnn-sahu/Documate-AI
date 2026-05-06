import Header from "@/components/header";
import Footer from "@/components/footer";
import React from "react";

import { HeroGradient } from "@/components/hero-gradient";
import HeroSection from "@/components/hero-section"

export default function Page() {
  return (
    <>
      <div className="w-full min-h-screen relative overflow-hidden bg-white  mx-auto  rounded-xl py-3 px-5 ">
      <Header />
     
     <HeroSection/>
      </div>

      <Footer />
    </>
  );
}
