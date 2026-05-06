import React from "react";

export function HeroGradient() {
  return (
    <div className="absolute inset-0 pointer-events-none flex justify-center overflow-hidden z-0">
      {/* Base ambient linear */}
      <div className="absolute inset-0 bg-linear-to-b from-[#f0f4fb] via-[#f4f7fb] to-[#fae6e6] opacity-80"></div>

      {/* Sunburst Rays - Using CSS repeating-conic-linear */}
      <div
        className="absolute top-[0%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-40 mix-blend-soft-light blur-[80px]"
        style={{
          background:
            "repeating-conic-linear(from 0deg at 50% 50%, #ffffff 0deg 8deg, transparent 8deg 16deg)",
        }}
      ></div>

      {/* Origin glow at the top center to soften the ray origin */}
      <div className="absolute top-[-20%] w-[1000px] h-[600px] bg-white blur-[120px] rounded-full opacity-90"></div>

      {/* Pinkish/orange ambient reflection bottom left */}
      <div className="absolute bottom-[0%] left-[-10%] w-[800px] h-[600px] bg-linear-to-tr from-[#ffe8e4] to-transparent blur-[140px] rounded-full opacity-70"></div>

      {/* Bluish ambient reflection bottom right */}
      <div className="absolute bottom-[0%] right-[-10%] w-[800px] h-[600px] bg-linear-to-tl from-[#eadaff] to-transparent blur-[140px] rounded-full opacity-70"></div>
    </div>
  );
}
