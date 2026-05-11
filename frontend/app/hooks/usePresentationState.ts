"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PresentationState } from "@/app/types";
import { SLIDES, SLIDES_SUMMARY } from "@/app/lib/slides";
import { getAgentResponse } from "@/app/lib/api";
import { useSpeechSynthesis } from "@/app/hooks/useSpeechSynthesis";
import { useSpeechRecognition } from "@/app/hooks/useSpeechRecognition";

export function usePresentationState() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [state, setState] = useState<PresentationState>("idle");
  const [transcript, setTranscript] = useState("");
  const [agentResponse, setAgentResponse] = useState("");
  const stateRef = useRef<PresentationState>("idle");
  const currentSlideRef = useRef(0);

  const { speak, cancel, isMuted, toggleMute } = useSpeechSynthesis();
  const { start: startSTT, stop: stopSTT } = useSpeechRecognition();

  // Keeping stateRef in sync so callbacks always see current state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Also keeping currentSlideRef in sync
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const narrateSlide = useCallback(
    (slideIndex: number) => {
      const slide = SLIDES[slideIndex];
      if (!slide) return;

      setState("narrating");

      const text = `${slide.title}. ${slide.body}`;

      speak(text, () => {
        // Only go idle if we haven't been interrupted
        if (stateRef.current === "narrating") {
          setState("idle");
        }
      });
    },
    [speak]
  );

  const handleTranscript = useCallback(
    async (userTranscript: string) => {
      if (!userTranscript.trim()) {
        // Empty transcript — resume narration
        setState("narrating");
        narrateSlide(currentSlideRef.current);
        return;
      }

      setTranscript(userTranscript);
      setState("processing");

      try {
        const response = await getAgentResponse({
          transcript: userTranscript,
          current_slide: currentSlideRef.current, // Reading from ref to avoid stale values
          slide_count: SLIDES.length,
          slides_summary: SLIDES_SUMMARY,
        });

        setAgentResponse(response.response_text);
        setState("responding");

        if (
          response.action === "navigate" &&
          response.slide_index !== undefined &&
          response.slide_index !== null
        ) {
          // Update slide immediately so the UI reflects the destination
          // while the agent is still speaking the transition response
          setCurrentSlide(response.slide_index);
          speak(response.response_text, () => {
            setTimeout(() => narrateSlide(response.slide_index!), 800);
          });
        } else if (response.action === "next") {
          const next = Math.min(currentSlideRef.current + 1, SLIDES.length - 1);
          setCurrentSlide(next);
          speak(response.response_text, () => {
            setTimeout(() => narrateSlide(next), 800);
          });
        } else if (response.action === "prev") {
          const prev = Math.max(currentSlideRef.current - 1, 0);
          setCurrentSlide(prev);
          speak(response.response_text, () => {
            setTimeout(() => narrateSlide(prev), 800);
          });
        } else {
          // "answer" or "none" — speak response then resume current slide
          speak(response.response_text, () => {
            setTimeout(() => narrateSlide(currentSlideRef.current), 800);
          });
        }
      } catch (err) {
        console.error("Agent error:", err);
        setState("narrating");
        narrateSlide(currentSlideRef.current);
      }
    },
    [narrateSlide, speak]
  );

  const interrupt = useCallback(() => {
    // Only allow interrupt when narrating or idle
    if (stateRef.current !== "narrating" && stateRef.current !== "idle") return;

    cancel();
    setState("listening");
    setTranscript("");
    setAgentResponse("");

    startSTT((result) => {
      handleTranscript(result);
    });
  }, [cancel, startSTT, handleTranscript]);

  const navigateTo = useCallback(
    (index: number) => {
      cancel();
      stopSTT();
      // Explicitly set idle before narrating so the keyboard listener
      // can fire correctly on the new slide
      setState("idle");
      setCurrentSlide(index);
      setTimeout(() => narrateSlide(index), 300);
    },
    [cancel, stopSTT, narrateSlide]
  );

  const startNarration = useCallback(() => {
    narrateSlide(currentSlide);
  }, [currentSlide, narrateSlide]);

  // Spacebar shortcut — uses refs throughout so the handler never
  // needs to be re-registered when state or slide changes.
  // Empty deps would cause stale interrupt/narrateSlide refs so we
  // include them — the listener is cheap to re-register.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      if (e.target !== document.body) return;
      e.preventDefault();

      const current = stateRef.current;
      if (current === "narrating") {
        interrupt();
      } else if (current === "idle") {
        // Space on idle starts narration rather than opening the mic —
        // opening the mic before narration has started is unexpected behavior
        narrateSlide(currentSlideRef.current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [interrupt, narrateSlide]);

  return {
    currentSlide,
    state,
    transcript,
    agentResponse,
    startNarration,
    interrupt,
    navigateTo,
    isMuted,
    toggleMute,
  };
}
