"""
Ollama client wrapper for LLM generation and embedding requests.
"""
import httpx
from typing import AsyncGenerator
from app.core.config import get_settings

settings = get_settings()


async def generate_stream(prompt: str, system_prompt: str = "") -> AsyncGenerator[str, None]:
    """Stream text generation from Ollama LLM."""
    payload = {
        "model": settings.LLM_MODEL,
        "prompt": prompt,
        "stream": True,
    }
    if system_prompt:
        payload["system"] = system_prompt

    async with httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL, timeout=120.0) as client:
        async with client.stream("POST", "/api/generate", json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if line:
                    import json
                    data = json.loads(line)
                    token = data.get("response", "")
                    if token:
                        yield token
                    if data.get("done", False):
                        break


async def generate(prompt: str, system_prompt: str = "") -> str:
    """Non-streaming text generation from Ollama LLM."""
    payload = {
        "model": settings.LLM_MODEL,
        "prompt": prompt,
        "stream": False,
    }
    if system_prompt:
        payload["system"] = system_prompt

    async with httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL, timeout=120.0) as client:
        response = await client.post("/api/generate", json=payload)
        response.raise_for_status()
        return response.json().get("response", "")


async def embed(texts: list[str]) -> list[list[float]]:
    """Generate embeddings via Ollama embedding model."""
    async with httpx.AsyncClient(base_url=settings.OLLAMA_BASE_URL, timeout=60.0) as client:
        response = await client.post("/api/embed", json={
            "model": settings.EMBEDDING_MODEL,
            "input": texts,
        })
        response.raise_for_status()
        return response.json().get("embeddings", [])
