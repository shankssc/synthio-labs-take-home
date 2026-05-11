import json
import anthropic
from anthropic.types import TextBlock
from app.config import settings
from app.models.schemas import AgentRequest, AgentResponse

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = """You are a voice presentation agent presenting slides about the history of music streaming.
The user has interrupted the presentation to ask a question or give a command.
You must respond with a JSON object only — no other text, no markdown, no code fences.

Rules:
- If the user asks to go to a specific topic, set action to "navigate" and pick the most relevant slide_index
- If the user asks "next", "go forward", "continue" — set action to "next"
- If the user asks "go back", "previous", "back" — set action to "prev"
- If the user asks a factual question, set action to "answer" and answer it concisely
- If unclear, set action to "none"
- response_text must always be present and speakable — no markdown, no bullet points, no lists
- Keep response_text under 40 words — it will be read aloud
- slide_index is only required when action is "navigate"

Response format:
{"action": "navigate" | "answer" | "next" | "prev" | "none", "slide_index": <integer or null>, "response_text": "<spoken response>"}"""


async def get_agent_response(request: AgentRequest) -> AgentResponse:
    slides_list = "\n".join(
        f"Slide {s.index}: {s.title}" for s in request.slides_summary
    )

    user_message = f"""Current slide: {request.current_slide} of {request.slide_count - 1}

Available slides:
{slides_list}

User said: "{request.transcript}"

Respond with JSON only."""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=256,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    text_block = next(
        (block for block in message.content if isinstance(block, TextBlock)),
        None,
    )

    if text_block is None:
        return AgentResponse(
            action="none",
            response_text="I didn't catch that. Please try again.",
        )

    raw = text_block.text.strip()

    # Claude returns response coded in markdown despite the prompt instructions so strip markdown code fences if present
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1]  # remove opening ```json line
        raw = raw.rsplit("```", 1)[0]  # remove closing ```
        raw = raw.strip()

    try:
        data = json.loads(raw)
        return AgentResponse(
            action=data.get("action", "none"),
            slide_index=data.get("slide_index"),
            response_text=data.get(
                "response_text", "I didn't catch that. Please try again."
            ),
        )
    except (json.JSONDecodeError, KeyError):
        return AgentResponse(
            action="none",
            response_text="I didn't catch that. Please try again.",
        )
