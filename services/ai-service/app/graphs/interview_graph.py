from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from app.agents.interviewer import InterviewerAgent
from app.agents.coder import CoderAgent
from app.agents.evaluator import EvaluatorAgent

class InterviewState(TypedDict):
    session_id: str
    target_role: str
    experience_years: int
    current_question_prompt: str
    chat_history: List[Dict[str, str]]
    candidate_latest_input: str
    code_submission: Optional[str]
    agent_response: str
    is_question_finished: bool
    should_evaluate_code: bool
    code_feedback: Optional[Dict[str, Any]]
    final_report: Optional[Dict[str, Any]]

interviewer_agent = InterviewerAgent()
coder_agent = CoderAgent()
evaluator_agent = EvaluatorAgent()

async def interviewer_node(state: InterviewState) -> Dict[str, Any]:
    """Interviewer agent processes candidate answer and asks follow-ups."""
    result = await interviewer_agent.execute_turn(
        target_role=state["target_role"],
        experience_years=state["experience_years"],
        question_prompt=state["current_question_prompt"],
        chat_history=state["chat_history"],
        candidate_input=state["candidate_latest_input"]
    )
    return {
        "agent_response": result["message"],
        "is_question_finished": result["is_question_completed"]
    }

async def code_grader_node(state: InterviewState) -> Dict[str, Any]:
    """If code was submitted, grader evaluates complexity and correctness."""
    if state.get("code_submission"):
        feedback = await coder_agent.evaluate_code(
            problem_description=state["current_question_prompt"],
            candidate_code=state["code_submission"]
        )
        return {"code_feedback": feedback}
    return {"code_feedback": None}

def route_after_interviewer(state: InterviewState) -> str:
    """Decide whether to route to code grader or end turn."""
    if state.get("code_submission"):
        return "code_grader"
    return END

def build_interview_graph():
    """Builds and compiles the multi-agent LangGraph interview orchestration workflow."""
    workflow = StateGraph(InterviewState)

    workflow.add_node("interviewer", interviewer_node)
    workflow.add_node("code_grader", code_grader_node)

    workflow.set_entry_point("interviewer")
    workflow.add_conditional_edges(
        "interviewer",
        route_after_interviewer,
        {
            "code_grader": "code_grader",
            END: END
        }
    )
    workflow.add_edge("code_grader", END)

    return workflow.compile()
