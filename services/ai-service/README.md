# AI Service (`services/ai-service`)

Python 3.11 + FastAPI microservice powering the multi-agent conversational interview engine and automated evaluations using LangGraph.

## Folder Structure
```
app/
├── api/             # FastAPI routers & REST endpoints (/v1/interview/...)
├── agents/          # InterviewerAgent, CoderAgent, EvaluatorAgent
├── graphs/          # LangGraph state machine interview_graph.py
├── prompts/         # Calibrated persona system prompts & scoring rubrics
├── retrieval/       # RAG question bank & candidate profile retrieval
├── schemas/         # Pydantic validation schemas
└── services/        # Multi-provider LLM factory (OpenAI, Gemini, Anthropic)
tests/               # Pytest async test suite
```

## Running Locally
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8006 --reload
```

## Healthcheck
`GET http://localhost:8006/health`
