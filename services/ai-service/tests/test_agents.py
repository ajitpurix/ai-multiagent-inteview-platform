import pytest
from app.agents.interviewer import InterviewerAgent
from app.agents.coder import CoderAgent
from app.agents.evaluator import EvaluatorAgent

@pytest.mark.asyncio
async def test_interviewer_turn():
    agent = InterviewerAgent()
    res = await agent.execute_turn(
        target_role="Software Engineer",
        experience_years=3,
        question_prompt="What is the difference between TCP and UDP?",
        chat_history=[],
        candidate_input="TCP is connection-oriented and reliable, while UDP is connectionless and faster."
    )
    assert "message" in res
    assert isinstance(res["is_question_completed"], bool)

@pytest.mark.asyncio
async def test_coder_evaluation():
    agent = CoderAgent()
    res = await agent.evaluate_code(
        problem_description="Reverse a linked list",
        candidate_code="def reverse(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev",
        language="python"
    )
    assert res["correctness_score"] > 0
    assert "complexity_time" in res

@pytest.mark.asyncio
async def test_evaluator_report():
    agent = EvaluatorAgent()
    report = await agent.generate_evaluation_report(
        session_id="test-session-123",
        transcript_history=[
            {"role": "agent", "content": "Welcome!"},
            {"role": "candidate", "content": "Glad to be here."}
        ]
    )
    assert report["session_id"] == "test-session-123"
    assert "overall_score" in report
    assert "hiring_recommendation" in report
