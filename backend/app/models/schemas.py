from pydantic import BaseModel


class SlideSummary(BaseModel):
    index: int
    title: str


class AgentRequest(BaseModel):
    transcript: str
    current_slide: int
    slide_count: int
    slides_summary: list[SlideSummary]


class AgentResponse(BaseModel):
    action: str  # "navigate" | "answer" | "next" | "prev" | "none"
    slide_index: int | None = None
    response_text: str
