import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

// Split-screen layout for auth pages (login, signup).
// Left side: form content, Right side: decorative pattern.
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-[45%]">
        <div className="w-full max-w-[400px]">
          {/* Logo */}
          <Link href="/" className="mb-8 flex justify-center ">
            <Image
              src="/logo.png"
              alt="Logo"
              width={48}
              height={48}
              className="h-12 w-12 cursor-pointer rounded-full border border-neutral-300"
              priority
             
            />
          </Link>
          {children}
        </div>
      </div>

      {/* Right side - Decorative pattern */}
      <div className="hidden bg-neutral-50 lg:flex lg:w-[55%] lg:items-center lg:justify-center p-12">
        <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl border border-neutral-200/50 shadow-xl bg-white">

          <Image
            src="/auth_illustration.png"
            alt="AI Document Search illustration"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
