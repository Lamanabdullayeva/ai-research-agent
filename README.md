# AI Research Agent

A full-stack agentic AI application that autonomously researches any topic: it searches the web, decides what to search next, and produces a structured markdown report — all streamed to the UI in real time.

**Live demo:** [ai-research-agent-three-phi.vercel.app](https://ai-research-agent-three-phi.vercel.app/)

**Backend API:** [ai-research-agent-api-x0sz.onrender.com](https://ai-research-agent-api-x0sz.onrender.com)

**Demo video / screenshots:** _coming soon_

> Note: the backend is on Render's free tier and may take ~30-60 seconds to wake up on the first request after inactivity.

## What It Does

You type a topic (e.g. "Latest advancements in AI"). The backend runs an agent loop where an LLM (Llama 3.1 via Groq) decides when to search the web using Tavily, runs up to 3 searches, then writes a structured report with **Summary**, **Key Findings**, and **Conclusion** sections. Every step — each search query, each result, and the final report — streams to the Angular frontend live over Server-Sent Events.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Angular 19 (standalone components, Signals) |
| Backend | Python, FastAPI |
| AI Model | Llama 3.1 (via Groq API) |
| Web Search | Tavily API |
| Streaming | Server-Sent Events (SSE) |
| Styling | SCSS, Inter font, Apple-inspired dark UI |

## Features

- Real-time agent activity feed — watch the agent search and "think" live
- Structured research report (Summary, Key Findings, Conclusion) rendered from markdown
- Typewriter effect as the report streams in
- Copy report to clipboard / download as PDF
- Suggested topic chips for quick exploration
- Recent search history (persisted in `localStorage`)
- Stop button to cancel an in-progress search, with a 60-second auto-cancel
- Loading states and empty states throughout (no dead-end UI)

## How It Works (Agentic Loop)

1. The Angular app sends the topic to the FastAPI backend, which opens an SSE stream.
2. The LLM is given the topic and a `web_search` tool, and is forced to search at least once.
3. After each search, the model decides whether it needs another search (up to 3 total).
4. Once searching is done, the model is prompted to write the final report.
5. The frontend streams and renders each step as it happens: search queries, result previews, a "Writing report..." indicator, and finally the rendered report.

## Project Structure

```
ai-research-agent/
├── backend/
│   ├── main.py              # FastAPI app, CORS config, /research SSE endpoint
│   ├── agent.py             # Agentic research loop (tool calls, search, final report)
│   ├── requirements.txt
│   ├── .env.example         # Template for required environment variables
│   └── README.md            # Backend setup & deployment guide
└── frontend/
    ├── src/app/
    │   ├── app.ts / app.html / app.scss   # Root component
    │   ├── components/
    │   │   ├── search-box/                # Topic input, actions, suggested topics
    │   │   ├── agent-activity/            # Live agent activity feed
    │   │   ├── report-panel/              # Final report display
    │   │   └── search-history/            # Recent searches
    │   ├── pipes/                         # Markdown rendering, event labels/styling
    │   ├── services/research.service.ts  # SSE client
    │   ├── constants/app.constants.ts     # UI labels & config
    │   └── environments/                  # Dev / prod backend URLs
    └── README.md             # Frontend setup & deployment guide
```

## Running Locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then fill in GROQ_API_KEY and TAVILY_API_KEY
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`. See [`backend/README.md`](./backend/README.md) for full details, the SSE event reference, and deployment instructions.

### Frontend

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200`. See [`frontend/README.md`](./frontend/README.md) for project structure, build, and deployment instructions.

## API Overview

**POST** `/research`

```json
{ "topic": "Latest advancements in AI" }
```

Streams SSE events:

```
data: {"type": "status", "message": "Starting research on: ..."}
data: {"type": "tool_call", "tool": "web_search", "query": "..."}
data: {"type": "tool_result", "query": "...", "result_preview": "..."}
data: {"type": "final_report", "content": "..."}
data: [DONE]
```

Full reference in [`backend/README.md`](./backend/README.md).

## Key Concepts (for interviews)

- **Agentic loop** — the model autonomously decides when and how many times to call a tool before producing a final answer
- **Tool use / function calling** — structured tool definitions passed to the LLM, with results fed back into the conversation
- **SSE streaming** — incremental results pushed from a Python async generator to the browser in real time
- **Angular Signals** — reactive state management (`signal`, `computed`, `input`, `output`) without RxJS boilerplate
- **Environment-based config** — `fileReplacements` swap API URLs between dev and production builds
- **Async FastAPI** — non-blocking request handling with graceful client-disconnect cancellation

## Screenshots

_Screenshots and a short demo video will be added here._
