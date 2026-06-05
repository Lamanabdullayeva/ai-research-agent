# AI Research Agent

A full-stack AI agentic application that autonomously researches any topic using web search and produces a structured report — streamed in real time.

## Tech Stack

**Frontend:** Angular 19 (Signals, standalone components, SSE streaming)
**Backend:** Python + FastAPI
**AI Model:** Llama 3.1 via Groq API
**Web Search:** Tavily API
**Font:** Inter

## Features

- Real-time agent activity timeline — watch the AI think and search live
- Structured research report with Summary, Key Findings, and Conclusion
- Download report as PDF
- Copy report to clipboard
- Research history saved in localStorage
- Stop button to cancel mid-search
- Auto-cancel after 60 seconds
- Apple-inspired dark UI

## How It Works

1. User enters a research topic
2. The Angular app sends a request to the FastAPI backend via SSE
3. The backend runs an **agentic loop**:
   - The AI model decides what to search
   - Tavily searches the web and returns results
   - Repeats up to 3 searches
4. The model writes a structured report
5. Every step streams to the UI in real time

## Project Structure

```
ai-research-agent/
├── backend/
│   ├── main.py            # FastAPI server + SSE endpoint
│   ├── agent.py           # Async agentic loop with tool use
│   ├── requirements.txt
│   └── .env               # API keys (not committed)
└── frontend/
    └── src/app/
        ├── app.ts          # Main component with Angular Signals
        ├── app.html        # Template
        ├── app.scss        # Apple-style dark UI
        └── research.service.ts  # SSE streaming service
```

## Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file:
```
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Run the server:
```bash
uvicorn main:app --reload
```

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200)

## API

**POST** `/research`

Request:
```json
{ "topic": "latest AI trends 2025" }
```

Streams SSE events:
```
data: {"type": "status", "message": "Starting research..."}
data: {"type": "tool_call", "tool": "web_search", "query": "..."}
data: {"type": "tool_result", "query": "...", "result_preview": "..."}
data: {"type": "final_report", "content": "..."}
data: [DONE]
```

## Key Concepts (for interviews)

- **Agentic loop** — the AI thinks, searches, reads, and repeats until it has enough information
- **Tool use / Function calling** — the model decides when and how to call external tools
- **SSE streaming** — results push to the frontend in real time as the agent works
- **Angular Signals** — reactive state management using Angular's modern primitives
- **Async FastAPI** — non-blocking backend that handles cancellation gracefully
