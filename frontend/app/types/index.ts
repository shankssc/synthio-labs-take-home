export type PresentationState = "idle" | "narrating" | "listening" | "processing" | "responding";

export interface Slide {
  index: number;
  title: string;
  body: string;
  facts: string[];
}

export interface SlideSummary {
  index: number;
  title: string;
}

export interface AgentRequest {
  transcript: string;
  current_slide: number;
  slide_count: number;
  slides_summary: SlideSummary[];
}

export interface AgentResponse {
  action: "navigate" | "answer" | "next" | "prev" | "none";
  slide_index?: number;
  response_text: string;
}
