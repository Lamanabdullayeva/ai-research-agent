from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import os

from agent import run_research_agent

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    topic: str

@app.post("/research")
async def research(request: ResearchRequest):
    async def event_stream():
        async for event in run_research_agent(request.topic):
            yield f"data: {json.dumps(event)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")
