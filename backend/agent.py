import os
import json
from groq import Groq
from tavily import TavilyClient
from typing import AsyncGenerator
from dotenv import load_dotenv

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

# Tool definitions sent to the model
TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "Search the web for up-to-date information on a topic.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query"
                    }
                },
                "required": ["query"]
            }
        }
    }
]

def web_search(query: str) -> str:
    """Call Tavily search and return results as a string."""
    results = tavily_client.search(query=query, max_results=5)
    output = []
    for r in results.get("results", []):
        output.append(f"- {r['title']}: {r['content'][:300]}")
    return "\n".join(output)

async def run_research_agent(topic: str) -> AsyncGenerator[dict, None]:
    """
    Agentic loop:
    1. Ask the model what to do
    2. If it wants to use a tool, run the tool and feed results back
    3. Repeat until the model produces a final answer
    """
    messages = [
        {
            "role": "system",
            "content": (
                "You are a research agent. Given a topic, you search the web multiple times "
                "to gather information, then produce a well-structured research report. "
                "Always search at least 2-3 times with different queries before writing the final report. "
                "Format the final report with clear sections: Summary, Key Findings, and Conclusion."
            )
        },
        {
            "role": "user",
            "content": f"Research this topic thoroughly: {topic}"
        }
    ]

    yield {"type": "status", "message": f"Starting research on: {topic}"}

    # Agentic loop — max 10 iterations to avoid infinite loops
    for iteration in range(10):
        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
            max_tokens=4096
        )

        message = response.choices[0].message

        # If the model wants to call a tool
        if message.tool_calls:
            # Add the assistant message to history
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

            # Execute each tool call
            for tool_call in message.tool_calls:
                args = json.loads(tool_call.function.arguments)
                query = args.get("query", "")

                yield {"type": "tool_call", "tool": "web_search", "query": query}

                result = web_search(query)

                yield {"type": "tool_result", "query": query, "result_preview": result[:200]}

                # Feed tool result back to the model
                messages.append({
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "name": tool_call.function.name,
                    "content": result
                })

        else:
            # Model produced a final answer — we're done
            final_report = message.content
            yield {"type": "final_report", "content": final_report}
            return

    yield {"type": "error", "message": "Agent reached maximum iterations without a final answer."}
