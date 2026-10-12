from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any

from app.schemas.interview import (
    InterviewStartRequest,
    InterviewQuestionResponse,
    InterviewTurnRequest,
    InterviewTurnResponse,
    CodeEvaluationRequest,
    CodeEvaluationResponse,
    FullReportGenerationRequest,
    EvaluationReportResponse
)
from app.retrieval.rag import QuestionBankRetriever
from app.agents.interviewer import InterviewerAgent
from app.agents.coder import CoderAgent
from app.agents.evaluator import EvaluatorAgent
from app.graphs.interview_graph import build_interview_graph

router = APIRouter(prefix="/v1", tags=["interview-ai"])

question_retriever = QuestionBankRetriever()
interviewer_agent = InterviewerAgent()
coder_agent = CoderAgent()
evaluator_agent = EvaluatorAgent()
interview_graph = build_interview_graph()

# In-memory session tracking for demonstration / state store
sessions_db: Dict[str, Dict[str, Any]] = {}

@router.post("/interview/start", response_model=List[InterviewQuestionResponse])
async def start_interview(request: InterviewStartRequest):
    """
    Initializes a new interview session and retrieves tailored questions
    based on the candidate's target role and difficulty.
    """
    questions = await question_retriever.get_questions_for_role(
        role=request.candidate.target_role,
        difficulty=request.difficulty
    )

    sessions_db[request.session_id] = {
        "candidate": request.candidate.model_dump(),
        "questions": questions,
        "chat_history": [],
        "current_question_index": 0
    }

    return [
        InterviewQuestionResponse(
            question_id=q["id"],
            question_number=idx + 1,
            category=q["category"],
            prompt=q["prompt"],
            starter_code=q.get("starter_code")
        )
        for idx, q in enumerate(questions)
    ]

@router.post("/interview/turn", response_model=InterviewTurnResponse)
async def process_turn(request: InterviewTurnRequest):
    """
    Executes a multi-agent interview turn via the compiled LangGraph workflow.
    """
    session = sessions_db.get(request.session_id, {
        "candidate": {"target_role": "Software Engineer", "experience_years": 4},
        "chat_history": []
    })

    initial_state = {
        "session_id": request.session_id,
        "target_role": session["candidate"].get("target_role", "Software Engineer"),
        "experience_years": session["candidate"].get("experience_years", 4),
        "current_question_prompt": "Explain your approach to system scalability.",
        "chat_history": session.get("chat_history", []),
        "candidate_latest_input": request.candidate_input,
        "code_submission": request.code_submission,
        "agent_response": "",
        "is_question_finished": False,
        "should_evaluate_code": bool(request.code_submission),
        "code_feedback": None,
        "final_report": None
    }

    # Run through LangGraph
    final_state = await interview_graph.ainvoke(initial_state)

    # Record turn
    session.setdefault("chat_history", []).extend([
        {"role": "candidate", "content": request.candidate_input},
        {"role": "agent", "content": final_state["agent_response"]}
    ])
    sessions_db[request.session_id] = session

    return InterviewTurnResponse(
        session_id=request.session_id,
        agent_message=final_state["agent_response"],
        is_question_completed=final_state["is_question_finished"],
        follow_up_count=len(session["chat_history"]) // 2,
        next_action="next_question" if final_state["is_question_finished"] else "continue"
    )

@router.post("/interview/grade-code", response_model=CodeEvaluationResponse)
async def grade_code(request: CodeEvaluationRequest):
    """
    Autonomous code review & algorithmic grading for submissions.
    """
    res = await coder_agent.evaluate_code(
        problem_description=request.problem_description,
        candidate_code=request.candidate_code,
        language=request.language
    )
    return CodeEvaluationResponse(**res)

@router.post("/interview/report", response_model=EvaluationReportResponse)
async def generate_report(request: FullReportGenerationRequest):
    """
    Synthesizes the complete evaluation report and scoring rubric metrics.
    """
    report = await evaluator_agent.generate_evaluation_report(
        session_id=request.session_id,
        transcript_history=request.transcript
    )
    return EvaluationReportResponse(**report)
