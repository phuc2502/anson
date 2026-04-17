from typing import Any
from app.core.config import get_settings

settings = get_settings()

class LLMFactory:
    """
    Factory xử lý việc lựa chọn model linh hoạt giữa Local và Cloud.
    Chưa import các thư viện nặng (langchain) ngay lúc này để đơn giản hóa setup ban đầu.
    """
    
    @staticmethod
    def get_llm(provider: str, model_name: str) -> Any:
        # Nếu Frontend yêu cầu dùng Gemini
        if provider.lower() == "gemini":
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY is missing in backend configuration.")
            print(f"[INFO] Khởi tạo kết nối Google Cloud Gemini ({model_name})...")
            # Return model instance qua thư viện langchain_google_genai
            # return ChatGoogleGenerativeAI(model=model_name, api_key=settings.GEMINI_API_KEY)
            return {"provider": "gemini", "model": model_name, "status": "Ready in Future"}

        # Nếu Frontend yêu cầu dùng Local Model qua Ollama
        elif provider.lower() == "ollama":
            print(f"[INFO] Khởi tạo kết nối Local Ollama ({model_name}) tại {settings.OLLAMA_BASE_URL}...")
            # Return model instance qua thư viện langchain_community
            # return ChatOllama(model=model_name, base_url=settings.OLLAMA_BASE_URL)
            return {"provider": "ollama", "model": model_name, "status": "Ready in Future"}
            
        else:
            raise ValueError(f"Provider không được hỗ trợ: {provider}")

