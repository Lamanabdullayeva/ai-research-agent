import os
import json
import asyncio
from groq import AsyncGroq
from tavily import TavilyClient
from typing import AsyncGenerator
from dotenv import load_dotenv

load_dotenv()

groq_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "Search the web for up-to-date information on a topic.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query"}
                },
                "required": ["query"]
            }
        }
    }
]

async def web_search(query: str) -> str:
    results = await asyncio.to_thread(
        tavily_client.search, query=query, max_results=5
    )
    output = []
    for r in results.get("results", []):
        output.append(f"- {r['title']}: {r['content'][:300]}")
    return "\n".join(output)

async def run_research_agent(topic: str) -> AsyncGenerator[dict, None]:
    messages = [
        {
            "role": "system",
            "content": (
                "You are a research agent. Given a topic, search the web to gather information, "
                "then produce a well-structured research report. "
                "Format the final report with clear sections: Summary, Key Findings, and Conclusion."
            )
        },
        {
            "role": "user",
            "content": f"Research this topic thoroughly: {topic}"
        }
    ]

    yield {"type": "status", "message": f"Starting research on: {topic}"}

    max_searches = 3
    search_count = 0

    for iteration in range(10):
        response = await groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            max_tokens=4096
        )

        message = response.choices[0].message

        if message.tool_calls:
            messages.append({
                "role": "assistant",
                "content": message.content or "",
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    }
                    for tc in message.tool_calls
                ]
            })

            for tool_call in message.tool_calls:
                args = json.loads(tool_call.function.arguments)
                query = args.get("query", "")

                search_count += 1
                yield {"type": "tool_call", "tool": "web_search", "query": query}

                result = await web_search(query)

                yield {"type": "tool_result", "query": query, "result_preview": result[:200]}

                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_call.function.name,
                    "content": result
                })

            if search_count >= max_searches:
                messages.append({
                    "role": "user",
                    "content": "You have completed enough searches. Now write the final research report."
                })
                final_response = await groq_client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages,
                    max_tokens=4096
                )
                yield {"type": "final_report", "content": final_response.choices[0].message.content}
                return

        else:
            yield {"type": "final_report", "content": message.content}
            return

    yield {"type": "error", "message": "Agent reached maximum iterations without a final answer."}
