"use client";

interface SlideNavProps {
  total: number;
  current: number;
  onNavigate: (index: number) => void;
}

export function SlideNav({ total, current, onNavigate }: SlideNavProps) {
  return (
    <div className="mb-6 flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onNavigate(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={`rounded-full transition-all duration-300 ${
            i === current ? "h-2 w-6 bg-[#e8ff47]" : "h-2 w-2 bg-[#444] hover:bg-[#666]"
          }`}
        />
      ))}
    </div>
  );
}
