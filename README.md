# AI Multi-Agent Interview Platform

An enterprise-ready, distributed AI-powered technical and behavioral interview platform featuring multi-agent evaluation workflows, real-time code sandboxing, speech/chat interaction, and automated candidate assessment reports.

---

## 🏛 Architecture Overview

```
ai-interview-platform/
├── apps/
│   └── web/                    # Next.js 14 frontend (App Router, Tailwind/CSS, Lucide)
├── services/
│   ├── api-gateway/            # Node.js + TypeScript (Reverse proxy, JWT verification, rate limiting)
│   ├── auth-service/           # Authentication & Session Management (OAuth, JWT, RBAC)
│   ├── user-service/           # Profiles, resumes, candidate history, skill taxonomies
│   ├── interview-service/      # Session orchestration, question state-machine, real-time sync
│   ├── report-service/         # Evaluation report generator, radar chart metrics, PDF generation
│   ├── coding-service/         # Isolated code execution runner & unit test validator
│   └── ai-service/             # Python + FastAPI (LangGraph Multi-Agent Orchestration)
│       ├── app/
│       │   ├── api/            # FastAPI REST & WebSocket endpoints
│       │   ├── agents/         # Autonomous agents: Interviewer, Evaluator, Grader, Persona
│       │   ├── graphs/         # LangGraph stateful interview graph workflows
│       │   ├── prompts/        # System prompts, role constraints, assessment rubrics
│       │   ├── retrieval/      # RAG vector pipelines (Chroma / Qdrant) for resume & question banks
│       │   ├── schemas/        # Pydantic data contracts and validation models
│       │   └── services/       # LLM provider abstractions (OpenAI, Gemini, Anthropic)
│       ├── tests/              # Pytest agent and graph workflow test suites
│       ├── requirements.txt    # Python dependencies
│       └── Dockerfile          # Containerization for AI microservice
├── packages/
│   └── contracts/              # Shared TypeScript types, API contracts, and event schemas
├── infrastructure/
│   ├── docker/                 # Base Docker images, Nginx configs, DB init scripts
│   └── aws/                    # AWS ECS / EKS / Terraform deployment templates
├── docker-compose.yml          # Local multi-service orchestration
├── .env.example                # Sample environment variables
└── README.md                   # Platform documentation
```

---

## 🤖 Multi-Agent Architecture (`services/ai-service`)

The AI service operates an asynchronous **LangGraph** multi-agent state machine coordinating specialized agents:

1. **Interviewer Agent**: Drives dynamic dialogue, follows up on candidate answers, and probes technical depths based on resume context.
2. **Coding Grader Agent**: Assesses candidate code submissions for correctness, algorithmic time/space complexity, edge cases, and style.
3. **System Design Evaluator**: Analyzes architectural decisions, scalability, trade-offs, and reliability discussions.
4. **Behavioral & Rubric Evaluator**: Measures soft skills, STAR method adherence, culture fit, and clarity against calibrated scoring rubrics.
5. **Report Synthesizer**: Compiles raw observations into comprehensive candidate scorecards with actionable feedback.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: >= 18.x
- **Python**: >= 3.10
- **Docker & Docker Compose**: Installed and running

### 2. Environment Setup
Copy the example environment file and supply your API keys:
```bash
cp .env.example .env
```

Ensure you configure your AI API keys (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GEMINI_API_KEY`).

### 3. Running with Docker Compose (Recommended)
Boot all microservices and infrastructure databases (PostgreSQL, Redis, RabbitMQ):
```bash
docker-compose up --build
```

### 4. Running Locally in Development Mode
Install dependencies across all workspaces:
```bash
npm install
```

Start the Python AI service:
```bash
cd services/ai-service
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8006 --reload
```

Start Node.js services and frontend:
```bash
npm run dev
```

---

## 🔌 Service Port Allocation

| Service | Port | Description |
|---|---|---|
| **Web Frontend** | `3000` | Next.js User Interface |
| **API Gateway** | `8000` | Entry point reverse proxy & authentication |
| **Auth Service** | `8001` | JWT & user credential management |
| **User Service** | `8002` | Candidate profile & resume storage |
| **Interview Service** | `8003` | Session life-cycle & live answer streaming |
| **Report Service** | `8004` | Evaluation synthesis & PDF scoring |
| **Coding Service** | `8005` | Sandboxed multi-language code runner |
| **AI Service** | `8006` | FastAPI + LangGraph Multi-Agent Engine |
| **PostgreSQL** | `5432` | Relational storage for sessions & users |
| **Redis** | `6379` | Ephemeral caching & real-time pub/sub |
| **RabbitMQ** | `5672` / `15672` | Message queue & management dashboard |

---

## 📜 License
MIT License. Built for modern AI-driven recruitment and technical interviewing.
