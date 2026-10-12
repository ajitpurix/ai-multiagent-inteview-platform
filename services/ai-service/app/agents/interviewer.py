from typing import Dict, Any, List
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.prompts.interview_prompts import INTERVIEWER_SYSTEM_PROMPT
from app.services.llm_client import get_llm_client

class InterviewerAgent:
    """
    Autonomous Interviewer Agent responsible for natural back-and-forth dialogue,
    asking follow-up clarification questions, and maintaining interview tempo.
    """
    def __init__(self):
        self.llm_service = get_llm_client()

    async def execute_turn(
        self,
        target_role: str,
        experience_years: int,
        question_prompt: str,
        chat_history: List[Dict[str, str]],
        candidate_input: str
    ) -> Dict[str, Any]:
        prompt_text = INTERVIEWER_SYSTEM_PROMPT.format(
            target_role=target_role,
            experience_years=experience_years,
            question_prompt=question_prompt
        )

        messages = [SystemMessage(content=prompt_text)]
        for turn in chat_history:
            if turn.get("role") == "agent":
                messages.append(AIMessage(content=turn.get("content", "")))
            elif turn.get("role") == "candidate":
                messages.append(HumanMessage(content=turn.get("content", "")))

        messages.append(HumanMessage(content=candidate_input))

        try:
            model = self.llm_service.get_model(temperature=0.6)
            response = await model.ainvoke(messages)
            content = response.content
        except Exception:
            # Resilient fallback if LLM offline / credentials pending
            content = f"Thank you for sharing that approach. Could you elaborate on how your solution scales when handling high concurrent throughput?"

        # Determine if this concludes question (simple heuristic + agent discretion)
        turn_count = len([t for t in chat_history if t.get("role") == "candidate"])
        is_completed = turn_count >= 3

        return {
            "message": content,
            "is_question_completed": is_completed,
            "follow_up_count": turn_count
        }
