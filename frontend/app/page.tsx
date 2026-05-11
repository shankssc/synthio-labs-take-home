"use client";

import { SLIDES } from "@/app/lib/slides";
import { usePresentationState } from "@/app/hooks/usePresentationState";
import { SlideView } from "@/app/components/SlideView";
import { VoiceOrb } from "@/app/components/VoiceOrb";
import { SlideNav } from "@/app/components/SlideNav";
import { TranscriptBar } from "@/app/components/TranscriptBar";
import { MuteButton } from "@/app/components/MuteButton";

export default function Home() {
  const {
    currentSlide,
    state,
    transcript,
    agentResponse,
    interrupt,
    startNarration,
    navigateTo,
    isMuted,
    toggleMute,
  } = usePresentationState();

  const slide = SLIDES[currentSlide];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0a0a0a]">
      <div className="flex w-full max-w-3xl items-center justify-between px-8 pt-8">
        <span className="font-mono text-xs uppercase tracking-widest text-[#333]">
          Synthio Demo
        </span>
        <div className="flex items-center gap-3">
          <MuteButton isMuted={isMuted} onToggle={toggleMute} />
          <span className="font-mono text-xs text-[#333]">
            How Music Streaming Changed the Industry
          </span>
        </div>
      </div>

      <SlideView slide={slide} />

      {state === "idle" && (
        <div className="mb-6 flex flex-col items-center gap-1">
          <p className="font-mono text-sm tracking-wide text-[#555]">
            Press{" "}
            <kbd className="rounded border border-[#333] px-1.5 py-0.5 text-xs text-[#666]">
              Space
            </kbd>{" "}
            or click the orb to begin
          </p>
        </div>
      )}

      <div className="flex w-full flex-col items-center">
        <SlideNav total={SLIDES.length} current={currentSlide} onNavigate={navigateTo} />
        <VoiceOrb state={state} onClick={state === "idle" ? startNarration : interrupt} />
        <TranscriptBar state={state} transcript={transcript} agentResponse={agentResponse} />
      </div>
    </main>
  );
}
