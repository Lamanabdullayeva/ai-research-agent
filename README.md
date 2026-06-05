# AI Research Agent

A full-stack AI agentic application that autonomously researches any topic using web search and produces a structured report — streamed in real time.

## Tech Stack

**Frontend:** Angular (with Signals, SSE streaming)  
**Backend:** Python + FastAPI  
**AI Model:** Llama 3.1 via Groq API  
**Web Search:** Tavily API  

## How It Works

1. User enters a research topic in the Angular UI
2. The Angular app sends a request to the FastAPI backend
3. The backend runs an **agentic loop**:
   - The AI model decides what to search
   - Tavily searches the web and returns results
   - The model reads results and decides if it needs more searches
   - Loop repeats until the model has enough information
4. The model writes a structured report (Summary, Key Findings, Conclusion)
5. Every step streams back to the UI in real time via **Server-Sent Events (SSE)**

## Project Structure

```
ai-research-agent/
├── backend/
│   ├── main.py        # FastAPI server + SSE endpoint
│   ├── agent.py       # Agentic loop with tool use
│   ├── .env           # API keys (not committed)
│   └── requirements.txt
└── frontend/          # Angular app (coming soon)
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

## API

**POST** `/research`

Request body:
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

- **Agentic loop**: The AI doesn't answer in one shot — it thinks, searches, reads, and repeats until confident
- **Tool use / Function calling**: The model decides when and how to call external tools (web search)
- **SSE streaming**: Results are pushed to the frontend in real time as the agent works
- **FastAPI**: Lightweight Python web framework, similar to Express in Node.js
