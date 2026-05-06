import React from "react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 ">
        <div className="glass-pane border rounded-xl px-6 py-3 flex items-center justify-between shadow-lg bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-linear-to-br from-rose-400 to-orange-400 rounded-lg flex items-center justify-center text-white shadow-sm shadow-rose-200/50">
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="text-[#1e293b] font-bold text-xl tracking-tight">
             Documate AI
            </span>
          </div>
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
            <Button variant="outline">Get Started</Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
