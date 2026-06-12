# Backend — AI Research Agent API

FastAPI service that runs an agentic research loop: it takes a topic, lets an LLM (Llama 3.1 via Groq) decide when to search the web (via Tavily), and streams progress and a final report back to the client over Server-Sent Events (SSE).

## Tech Stack

- **FastAPI** — HTTP API + SSE streaming
- **Groq API** (`llama-3.1-8b-instant`) — tool-calling LLM that drives the research loop
- **Tavily** — web search tool
- **python-dotenv** — environment variable loading

## Project Structure

```
backend/
├── main.py            # FastAPI app, CORS config, /research SSE endpoint
├── agent.py           # Agentic research loop (tool calls, search, final report)
├── requirements.txt   # Python dependencies
├── .env.example        # Template for required environment variables
└── .env                # Your local secrets (not committed)
```

## Setup

### 1. Create a virtual environment

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| --- | --- | --- |
| `GROQ_API_KEY` | Yes | API key from [console.groq.com](https://console.groq.com) |
| `TAVILY_API_KEY` | Yes | API key from [tavily.com](https://tavily.com) |
| `CORS_ORIGINS` | No | Comma-separated list of allowed frontend origins. Defaults to `http://localhost:4200` |

### 4. Run the server

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API Reference

### `POST /research`

Streams the agent's research progress and final report as Server-Sent Events.

**Request body:**

```json
{ "topic": "Latest advancements in AI" }
```

**Response:** `text/event-stream`, where each event is a JSON object on a `data:` line:

| Event type | Payload | Meaning |
| --- | --- | --- |
| `status` | `{ "type": "status", "message": "..." }` | Agent has started |
| `tool_call` | `{ "type": "tool_call", "tool": "web_search", "query": "..." }` | Agent is searching the web |
| `tool_result` | `{ "type": "tool_result", "query": "...", "result_preview": "..." }` | Search results returned |
| `final_report` | `{ "type": "final_report", "content": "..." }` | Final markdown research report |
| `error` | `{ "type": "error", "message": "..." }` | Something went wrong |

The stream ends with a literal `data: [DONE]` event.

## How the Agent Works

1. The LLM is given the topic and a `web_search` tool.
2. It is forced to search at least once, then decides (up to 3 total searches) whether more searches are needed.
3. Once 3 searches are complete (or the model decides it has enough information), it's prompted to write a final report with **Summary**, **Key Findings**, and **Conclusion** sections.
4. The report is streamed back as a single `final_report` event.

## Deployment (Render)

1. Push this repo to GitHub.
2. Create a new **Web Service** on [Render](https://render.com), pointing at the `backend/` directory.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables in the Render dashboard: `GROQ_API_KEY`, `TAVILY_API_KEY`, and `CORS_ORIGINS` (set this to your deployed frontend URL once it exists).
