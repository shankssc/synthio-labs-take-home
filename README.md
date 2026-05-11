# Synthio Voice Demo

An AI voice presentation agent that presents 5 slides on how music streaming changed the industry. Built as a take-home assessment for SynthioLabs.

## What it does

- AI agent narrates 5 slides on the history of music streaming
- Interrupt mid-narration by pressing **Space** or clicking the orb
- Ask questions or give navigation commands by voice
- Agent uses Claude to interpret intent — navigate to a topic, answer a question, or move forward/back
- Slide view updates immediately when agent navigates

## Tech stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python 3.12, Anthropic Claude API
- **Voice:** Browser Web Speech API (STT + TTS) — no external voice API keys needed

## Prerequisites

- Python 3.12+
- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
- Google Chrome (Web Speech API works best in Chrome)

## Design decisions

**Why Web Speech API over a dedicated STT/TTS provider**
The brief asked for lightweight and fast prototyping. Web Speech API gave zero setup, no API keys, and good enough quality for a lightweight demo and kept the focus on the interaction design rather than infrastructure. The tradeoff is the obvious Chrome dependency as mentioned in the later section.

**Why interruption is trigger-based rather than always-on**
Always-on voice activation (wake word or VAD) adds significant complexity and false-positive noise. A deliberate trigger — spacebar or orb click — keeps the demo reliable and actually mirrors how real voice UX handles turn-taking in presentation contexts. The user controls when they want to speak.

**Why Claude handles slide navigation rather than keyword matching**
Keyword matching ("next", "Spotify", "go back") would cover 80% of cases but fail on natural/abstract phrasing like "take me to the economics part" or "what was before Spotify" for instance. Routing all interpretation through Claude means the agent handles natural language correctly without maintaining a brittle mapping layer with the tradeoff being latency (~1s API call) observed on interruptions and Claude API token usage on every interruption.

**Why the state machine lives in a single hook**
Keeping `usePresentationState` as the single source of truth for all voice states meant the components stay purely presentational, they receive state and fire callbacks, nothing else. This made debugging the TTS/STT sequencing significantly easier since all transitions happen in one place, the tradeoff was increased time in implementation as this hook did the most heavy-lifting.

**Why these five states for the voice interaction**
The state machine uses five discrete states — `idle`, `narrating`, `listening`, `processing`, `responding`, each representing a distinct phase with clear entry and exit conditions. `idle` and `narrating` are the only interruptible states, which prevents the user from accidentally triggering the mic while the agent is already handling a request. `processing` and `responding` are intentionally non-interruptible, interrupting a Claude API call mid-flight or cutting off the agent's response before it finishes would leave the state machine in an unrecoverable position. The separation between `processing` (waiting for Claude) and `responding` (TTS playing the answer) also made it straightforward to show distinct UI feedback for each phase without conflating them.

## Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd synthio-labs-take-home
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux
```

Open `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Verify it's running — open `http://localhost:8000/health` in your browser. You should see:

```json
{ "status": "ok" }
```

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in **Chrome**.

## Usage

1. The presentation loads on slide 1
2. Click the orb or press **Space** to start narration
3. While the agent is narrating, press **Space** or click the orb to interrupt
4. Speak your question or command — for example:
   - _"What happened to Napster?"_
   - _"Tell me about Spotify"_
   - _"Next"_ / _"Go back"_
   - _"Take me to the last slide"_
5. The agent responds and continues the presentation

## Project structure

```
synthio-labs-take-home/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory + CORS
│   │   ├── config.py                # Settings via pydantic-settings
│   │   ├── routers/
│   │   │   └── agent.py             # POST /api/v1/agent/respond
│   │   ├── services/
│   │   │   └── claude_service.py    # Claude API + prompt logic
│   │   └── models/
│   │       └── schemas.py           # Pydantic request/response models
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── app/
    │   ├── components/
    │   │   ├── SlideView.tsx            # Slide title, body, facts
    │   │   ├── VoiceOrb.tsx             # Animated mic/state indicator
    │   │   ├── SlideNav.tsx             # Slide dot progress
    │   │   ├── MuteButton.tsx           # Audio mute toggle
    │   │   └── TranscriptBar.tsx        # User + agent transcript
    │   ├── hooks/
    │   │   ├── usePresentationState.ts  # Core state machine
    │   │   ├── useSpeechSynthesis.ts    # TTS wrapper
    │   │   └── useSpeechRecognition.ts  # STT wrapper
    │   ├── lib/
    │   │   ├── slides.ts             # Slide content
    │   │   └── api.ts                # Backend API client
    │   ├── types/
    │   │   └── index.ts              # Shared TypeScript types
    │   └── page.tsx                  # Main presentation page
    ├── .prettierrc
    └── package.json
```

> Note: keep the backend terminal running and open a second terminal for the frontend.

## Known issues

- **Keyboard interrupt after dot navigation:** Pressing Space to interrupt doesn't always work after clicking a slide dot directly. Use the orb click as a workaround.

- **Slide navigation by number:** When asked to navigate to a slide by number (e.g. "take me to slide 3"), the agent may land on the wrong slide. This is a zero-indexing mismatch — the slides list is 0-based but Claude interprets and returns indices inconsistently. Navigate by topic instead (e.g. "take me to the Spotify slide") for reliable results.

## Browser compatibility

| Browser | Support                                         |
| ------- | ----------------------------------------------- |
| Chrome  | ✅ Full support                                 |
| Edge    | ✅ Full support                                 |
| Firefox | ⚠️ Partial — TTS works, STT unreliable          |
| Safari  | ⚠️ Partial — may require additional permissions |
