"use client";

import { PresentationState } from "@/app/types";

interface VoiceOrbProps {
  state: PresentationState;
  onClick: () => void;
}

const STATE_LABELS: Record<PresentationState, string> = {
  idle: "Click or press Space to start",
  narrating: "Click or press Space to interrupt",
  listening: "Listening...",
  processing: "Thinking...",
  responding: "Responding...",
};

export function VoiceOrb({ state, onClick }: VoiceOrbProps) {
  const isListening = state === "listening";
  const isNarrating = state === "narrating";
  const isProcessing = state === "processing";
  const isResponding = state === "responding";

  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        disabled={isProcessing || isResponding}
        aria-label={STATE_LABELS[state]}
        className="relative flex items-center justify-center focus:outline-none disabled:cursor-not-allowed"
      >
        {/* Outer pulse ring — only when listening or narrating */}
        {(isListening || isNarrating) && (
          <span
            className={`absolute animate-ping rounded-full opacity-20 ${
              isListening ? "h-20 w-20 bg-[#ff4747]" : "h-20 w-20 bg-[#e8ff47]"
            }`}
          />
        )}

        {/* Main orb */}
        <span
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
            isListening
              ? "bg-[#ff4747] shadow-[0_0_24px_rgba(255,71,71,0.6)]"
              : isNarrating
                ? "bg-[#e8ff47] shadow-[0_0_24px_rgba(232,255,71,0.4)]"
                : isProcessing || isResponding
                  ? "bg-[#333] shadow-none"
                  : "bg-[#222] shadow-none hover:bg-[#2a2a2a]"
          }`}
        >
          {/* Icon */}
          {isListening ? (
            // Mic icon
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1.5 14.9A7.002 7.002 0 0 1 5 9H3a9.002 9.002 0 0 0 8 8.94V20H9v2h6v-2h-2v-2.06A9.002 9.002 0 0 0 21 9h-2a7 7 0 0 1-5.5 6.9z" />
            </svg>
          ) : isProcessing ? (
            // Spinner
            <svg className="h-6 w-6 animate-spin text-[#666]" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : isNarrating ? (
            // Sound wave icon
            <svg className="h-6 w-6 text-[#0a0a0a]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            // Play icon
            <svg className="h-6 w-6 text-[#666]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </button>

      <span className="font-mono text-xs tracking-wide text-[#555]">{STATE_LABELS[state]}</span>
    </div>
  );
}
