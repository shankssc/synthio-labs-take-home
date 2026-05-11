"use client";

import { Slide } from "@/app/types";

interface SlideViewProps {
  slide: Slide;
}

export function SlideView({ slide }: SlideViewProps) {
  return (
    <div className="flex w-full max-w-3xl flex-1 flex-col justify-center px-8 py-12">
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-[#e8ff47]">
        Slide {slide.index + 1} of 5
      </div>
      <h1 className="mb-6 font-serif text-4xl font-bold leading-tight text-[#f0f0f0]">
        {slide.title}
      </h1>
      <p className="mb-10 font-mono text-lg leading-relaxed text-[#aaaaaa]">{slide.body}</p>
      <div className="flex flex-wrap gap-2">
        {slide.facts.map((fact) => (
          <span
            key={fact}
            className="rounded-full border border-[#e8ff47]/30 bg-[#e8ff47]/5 px-3 py-1 font-mono text-xs text-[#e8ff47]"
          >
            {fact}
          </span>
        ))}
      </div>
    </div>
  );
}
