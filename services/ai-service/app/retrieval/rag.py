from typing import List, Dict, Any, Optional

class QuestionBankRetriever:
    """
    RAG retriever for curated interview questions categorized by difficulty and role.
    """
    def __init__(self):
        # Seeded default question taxonomy
        self._curated_questions = [
            {
                "id": "q-101",
                "category": "algorithmic",
                "role": "Senior Full Stack Engineer",
                "difficulty": "medium",
                "prompt": "Design an LRU Cache with O(1) get and put operations. Explain your data structure choices.",
                "starter_code": "class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n\n    def get(self, key: int) -> int:\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        pass"
            },
            {
                "id": "q-102",
                "category": "architecture",
                "role": "Senior Full Stack Engineer",
                "difficulty": "hard",
                "prompt": "Design a real-time collaborative document editing service like Google Docs or Figma. How do you handle concurrent updates and offline sync?",
                "starter_code": None
            },
            {
                "id": "q-103",
                "category": "behavioral",
                "role": "Senior Full Stack Engineer",
                "difficulty": "medium",
                "prompt": "Tell me about a time when you had a strong technical disagreement with a principal architect or product manager. How did you resolve it?",
                "starter_code": None
            }
        ]

    async def get_questions_for_role(self, role: str, difficulty: str = "medium", limit: int = 3) -> List[Dict[str, Any]]:
        # In production, query vector embeddings from Chroma/Pinecone/pgvector
        return self._curated_questions[:limit]

class ResumeContextRetriever:
    """
    Retrieves candidate's specific background, projects, and technologies for contextual probing.
    """
    async def extract_key_topics(self, resume_summary: Optional[str]) -> List[str]:
        if not resume_summary:
            return ["distributed systems", "REST APIs", "Microservices"]
        return [word.strip() for word in resume_summary.split(",") if word.strip()]
