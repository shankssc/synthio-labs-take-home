"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useSpeechSynthesis() {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  // Store current speech so we can replay it when toggling mute mid-narration
  const currentTextRef = useRef<string>("");
  const currentOnEndRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Cleanup on unmount, cancels any active speech on unmount
  useEffect(() => {
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  // Internal speak function that accepts an explicit muted override.
  // Used by toggleMute to replay at new volume without triggering
  const speakInternal = useCallback((text: string, onEnd?: () => void, muted?: boolean) => {
    if (!synthRef.current) return;

    // Always cancel before speaking as SpeechSynthesis queues utterances
    // by default which would cause double-narration on rapid calls
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = (muted ?? isMutedRef.current) ? 0 : 1;

    utterance.onend = () => {
      onEnd?.();
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted") {
        console.error("TTS error:", e.error);
      }
    };

    synthRef.current.speak(utterance);
  }, []);

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      // Store text and callback before speaking so toggleMute can replay them
      currentTextRef.current = text;
      currentOnEndRef.current = onEnd;
      speakInternal(text, onEnd);
    },
    [speakInternal]
  );

  const cancel = useCallback(() => {
    // Clear stored utterance on explicit cancel so toggleMute
    // doesn't replay something that was intentionally stopped
    currentTextRef.current = "";
    currentOnEndRef.current = undefined;
    synthRef.current?.cancel();
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev: boolean) => {
      const next = !prev;
      isMutedRef.current = next;

      // If something is currently playing, cancel and replay at new volume
      if (synthRef.current?.speaking && currentTextRef.current) {
        speakInternal(currentTextRef.current, currentOnEndRef.current, next);
      }

      return next;
    });
  }, [speakInternal]);

  const pause = useCallback(() => {
    synthRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    synthRef.current?.resume();
  }, []);

  const isSpeaking = () => synthRef.current?.speaking ?? false;

  return {
    speak,
    pause,
    resume,
    cancel,
    isSpeaking,
    isMuted,
    toggleMute,
    supported: typeof window !== "undefined" && "speechSynthesis" in window,
  };
}
