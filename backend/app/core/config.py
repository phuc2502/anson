"""
Application configuration loaded from environment variables.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Central configuration for the Anson Precision Backend."""

    # ── Server ──────────────────────────────────────────────
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    # ── AI Providers ─────────────────────────────────────────
    # Ollama (Local)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    DEFAULT_LOCAL_MODEL: str = "gemma2" # Đã sửa thành Gemma hoặc Llama tùy ý
    
    # Google (Cloud)
    GEMINI_API_KEY: str = ""
    DEFAULT_CLOUD_MODEL: str = "gemini-1.5-flash" # Default Gemini version

    # Embedding Model (RAG - Thường dùng Local cho tiết kiệm và bảo mật)
    EMBEDDING_MODEL: str = "nomic-embed-text"

    # ── Database ────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/anso.db"

    # ── ChromaDB ────────────────────────────────────────────
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"
    CHROMA_DOCS_COLLECTION: str = "project_docs"
    CHROMA_MEMORY_COLLECTION: str = "ai_memory"

    # ── CORS ────────────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Cached singleton for settings."""
    return Settings()
