"use client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Header = () => {
  const router = useRouter();
  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 ">
        <div className="glass-pane border rounded-xl px-6 py-3 flex items-center justify-between shadow-lg bg-white/50 backdrop-blur-sm">
          <Link href="/" className="flex items-center gap-2">
            <div className="size-8 bg-linear-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center text-white shadow-sm shadow-rose-200/50">
              <Image
                src="/logo.png"
                alt="Hero Graphic"
                width={50}
                height={50}
                className="rounded-full  p-1"
              />
             
            </div>
            <span className="text-[#1e293b] font-bold text-xl tracking-tight">
              Documate AI
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
              href="#"
            >
              Product
            </a>
            <a
              className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
              href="#"
            >
              Integrations
            </a>
            <a
              className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
              href="#"
            >
              Security
            </a>
            <a
              className="text-sm font-semibold text-on-surface hover:text-primary transition-colors"
              href="#"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                router.push("/chat/new");
              }}
              variant="outline"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
