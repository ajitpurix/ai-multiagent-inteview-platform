import os
from typing import Optional, Any
from langchain_core.language_models.chat_models import BaseChatModel

class LLMClientService:
    def __init__(self):
        self.provider = os.getenv("DEFAULT_LLM_PROVIDER", "openai").lower()
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")

    def get_model(self, temperature: float = 0.7, model_name: Optional[str] = None) -> Any:
        if self.provider == "anthropic" and self.anthropic_key:
            from langchain_anthropic import ChatAnthropic
            return ChatAnthropic(
                model_name=model_name or "claude-3-5-sonnet-20240620",
                anthropic_api_key=self.anthropic_key,
                temperature=temperature
            )
        elif self.provider == "gemini" and self.gemini_key:
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(
                model=model_name or "gemini-1.5-pro",
                google_api_key=self.gemini_key,
                temperature=temperature
            )
        elif self.openai_key and self.openai_key != "sk-proj-your-openai-api-key-here":
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model_name=model_name or "gpt-4o",
                openai_api_key=self.openai_key,
                temperature=temperature
            )
        else:
            # Fallback or mock provider for initial local testing without API credits
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(
                model_name="gpt-4o-mini",
                openai_api_key=self.openai_key or "sk-dummy-key",
                temperature=temperature
            )

_client_instance: Optional[LLMClientService] = None

def get_llm_client() -> LLMClientService:
    global _client_instance
    if _client_instance is None:
        _client_instance = LLMClientService()
    return _client_instance
