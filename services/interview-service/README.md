# Interview Service (`services/interview-service`)

Manages the interview session lifecycle, question queues, candidate answer submissions, and dialogue turns with `ai-service`.

## Endpoints
- `POST /sessions`: Create and initialize an interview session
- `PATCH /sessions/:id/start`: Mark session as in-progress
- `POST /sessions/:id/turn`: Coordinate agent conversation turn
- `POST /sessions/:id/answers`: Record final answer for a question
- `GET /sessions/:id`: Retrieve session metadata, questions, and transcript
