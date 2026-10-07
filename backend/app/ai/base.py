from abc import ABC, abstractmethod
from typing import Type, TypeVar, Optional, Dict, Any
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

class BaseLLMService(ABC):
    """
    Provider-agnostic interface for LLM services.
    Enforces structured JSON output and Pydantic validation across all providers.
    """

    @abstractmethod
    def generate_text(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generates plain text response with retry and error handling."""
        pass

    @abstractmethod
    def generate_structured(
        self,
        prompt: str,
        response_model: Type[T],
        system_prompt: Optional[str] = None
    ) -> T:
        """
        Generates structured JSON and validates it against a Pydantic response model.
        Retries up to max_retries if validation fails.
        """
        pass
