# Auth Service (`services/auth-service`)

Handles identity, authentication (JWT signing and verification), user credential security, and role-based access control (RBAC).

## Endpoints
- `POST /register`: Register new candidate or recruiter
- `POST /login`: Authenticate and obtain JWT bearer token
- `GET /health`: Service health check
