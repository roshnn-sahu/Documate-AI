import AiInput from "@/components/chat/ai-input";
import { HeroGradient } from "@/components/hero-gradient";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-1 flex-col items-center gap-4 p-4">
      <HeroGradient />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="relative z-10 mb-6 flex flex-col items-center justify-center">
          <h2 className="font-bricolage mb-3 bg-linear-to-b from-neutral-900 to-neutral-500 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl">
            How can i assist you?
          </h2>
          <p className="text-md text-center text-neutral-600">
            Quickly find answers, get assistance, and explore AI-powered
            insights-all in one place
          </p>
        </div>
        <AiInput className="mx-auto" />
      </div>
    </div>
  );
};

export default page;
