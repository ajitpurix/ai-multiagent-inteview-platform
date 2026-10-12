# Coding Service (`services/coding-service`)

Sandboxed isolated runner executing candidate code submissions against hidden test cases with timeout and resource constraint enforcement.

## Endpoints
- `POST /execute`: Execute code with memory/time benchmarks and safety filters
- `GET /health`: Service health check
