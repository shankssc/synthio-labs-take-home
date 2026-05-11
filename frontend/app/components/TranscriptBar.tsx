"use client";

import { PresentationState } from "@/app/types";

interface TranscriptBarProps {
  state: PresentationState;
  transcript: string;
  agentResponse: string;
}

export function TranscriptBar({ state, transcript, agentResponse }: TranscriptBarProps) {
  const isListening = state === "listening";
  const hasContent = transcript || agentResponse;

  if (!hasContent && !isListening) return null;

  return (
    <div className="flex w-full max-w-3xl flex-col gap-2 px-8 pb-8">
      {transcript && (
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 font-mono text-xs text-[#555]">YOU</span>
          <span className="font-mono text-sm text-[#888]">{transcript}</span>
        </div>
      )}
      {agentResponse && (
        <div className="flex items-start gap-2">
          <span className="mt-0.5 shrink-0 font-mono text-xs text-[#e8ff47]">AI</span>
          <span className="font-mono text-sm text-[#aaaaaa]">{agentResponse}</span>
        </div>
      )}
      {isListening && !transcript && (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#555]">YOU</span>
          <span className="animate-pulse font-mono text-sm text-[#555]">listening...</span>
        </div>
      )}
    </div>
  );
}
