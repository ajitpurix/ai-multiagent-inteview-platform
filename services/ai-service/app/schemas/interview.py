from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class CandidateProfileInput(BaseModel):
    candidate_id: str
    target_role: str = "Senior Full Stack Engineer"
    experience_years: int = 5
    skills: List[str] = Field(default_factory=list)
    resume_summary: Optional[str] = None

class InterviewStartRequest(BaseModel):
    session_id: str
    interview_type: str = "FULL_MOCK" # TECHNICAL_CODING | SYSTEM_DESIGN | BEHAVIORAL | FULL_MOCK
    candidate: CandidateProfileInput
    difficulty: str = "medium"

class InterviewQuestionResponse(BaseModel):
    question_id: str
    question_number: int
    category: str
    prompt: str
    context: Optional[str] = None
    starter_code: Optional[str] = None
    time_limit_minutes: int = 15

class InterviewTurnRequest(BaseModel):
    session_id: str
    question_id: str
    candidate_input: str
    code_submission: Optional[str] = None
    turn_type: str = "answer" # answer | follow_up_clarification

class InterviewTurnResponse(BaseModel):
    session_id: str
    agent_message: str
    is_question_completed: bool = False
    follow_up_count: int = 0
    next_action: str = "continue" # continue | next_question | wrap_up

class CodeEvaluationRequest(BaseModel):
    question_id: str
    problem_description: str
    candidate_code: str
    language: str = "python"
    test_results: Optional[Dict[str, Any]] = None

class CodeEvaluationResponse(BaseModel):
    correctness_score: int # 0-100
    complexity_time: str
    complexity_space: str
    code_smells: List[str]
    optimization_suggestions: List[str]
    feedback_summary: str

class FullReportGenerationRequest(BaseModel):
    session_id: str
    candidate_id: str
    transcript: List[Dict[str, Any]]

class EvaluationReportResponse(BaseModel):
    session_id: str
    overall_score: int
    category_scores: Dict[str, int]
    key_strengths: List[str]
    areas_for_improvement: List[str]
    hiring_recommendation: str
    executive_summary: str
