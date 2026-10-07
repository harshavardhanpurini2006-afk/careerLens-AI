from app.core.config import settings
from app.ai.base import BaseLLMService
from app.ai.providers import MockLLMService, GroqLLMService, OpenAILLMService, GeminiLLMService

def get_llm_service() -> BaseLLMService:
    """
    Factory function returning the configured LLM provider instance.
    If no valid API key is present, gracefully defaults to MockLLMService.
    """
    provider = (settings.LLM_PROVIDER or "gemini").lower()
    api_key = settings.LLM_API_KEY

    if not api_key:
        return MockLLMService()

    if provider in ["gemini", "google"]:
        return GeminiLLMService(api_key=api_key, model=settings.LLM_MODEL or "gemini-3.5-flash-lite")
    elif provider == "groq":
        return GroqLLMService(api_key=api_key, model=settings.LLM_MODEL or "llama-3.3-70b-versatile")
    elif provider == "openai":
        return OpenAILLMService(api_key=api_key, model=settings.LLM_MODEL or "gpt-4o-mini")

    return GeminiLLMService(api_key=api_key, model=settings.LLM_MODEL or "gemini-3.5-flash-lite")

