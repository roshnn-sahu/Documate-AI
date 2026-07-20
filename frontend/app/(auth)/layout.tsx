import { ReactNode } from "react";
import Image from "next/image";

// Split-screen layout for auth pages (login, signup).
// Left side: form content, Right side: decorative pattern.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-[45%]">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Decorative pattern */}
      <div className="hidden bg-neutral-100 lg:flex lg:w-[55%] lg:items-center lg:justify-center">
        <div className="relative h-[400px] w-[400px]">
          {/* Sunburst pattern */}
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full opacity-40"
          >
            {/* Radial lines */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30 * Math.PI) / 180;
              const x1 = 200 + Math.cos(angle) * 50;
              const y1 = 200 + Math.sin(angle) * 50;
              const x2 = 200 + Math.cos(angle) * 200;
              const y2 = 200 + Math.sin(angle) * 200;
              return (
                <line
                  key={`line-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#666666"
                  strokeWidth="2"
                />
              );
            })}
            {/* Inner circle */}
            <circle cx="200" cy="200" r="50" stroke="#666666" strokeWidth="2" fill="none" />
            {/* Center dot */}
            <circle cx="200" cy="200" r="4" fill="#666666" />
          </svg>
        </div>
      </div>
    </div>
  );
}
