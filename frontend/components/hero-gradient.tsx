import React from "react";

export function HeroGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden rounded-xl">
      {/* Base ambient linear */}
      <div className="absolute inset-0 bg-linear-to-b from-[#dae9ff] via-[#f2f6fa] to-[#ffc7b6] opacity-60"></div>

      {/* Sunburst Rays - Using CSS repeating-conic-linear */}
      <div
        className="absolute top-[0%] left-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-soft-light blur-[80px]"
        style={{
          background:
            "repeating-conic-linear(from 0deg at 50% 50%, #ffffff 0deg 8deg, transparent 8deg 16deg)",
        }}
      ></div>

      {/* Origin glow at the top center to soften the ray origin */}
      <div className="absolute top-[-20%] h-[600px] w-[1000px] rounded-full bg-white opacity-90 blur-[120px]"></div>

      {/* Pinkish/orange ambient reflection bottom left */}
      <div className="absolute bottom-[0%] left-[-10%] h-[600px] w-[800px] rounded-full bg-linear-to-tr from-[#ffe8e4] to-transparent opacity-70 blur-[140px]"></div>

      {/* Bluish ambient reflection bottom right */}
      <div className="absolute right-[-10%] bottom-[0%] h-[600px] w-[800px] rounded-full bg-linear-to-tl from-[#eadaff] to-transparent opacity-70 blur-[140px]"></div>
    </div>
  );
}
