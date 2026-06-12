from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import os

from agent import run_research_agent

load_dotenv()

app = FastAPI()

# Comma-separated list of allowed origins, e.g.
# CORS_ORIGINS=http://localhost:4200,https://your-frontend.vercel.app
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:4200")
allow_origins = [origin.strip() for origin in cors_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.post("/research")
async def research(request: Request, body: ResearchRequest):
    async def event_stream():
        async for event in run_research_agent(body.topic):
            # Stop if the client disconnected
            if await request.is_disconnected():
                break
            yield f"data: {json.dumps(event)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
