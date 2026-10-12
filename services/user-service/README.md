# User Service (`services/user-service`)

Manages candidate profiles, skills inventories, career levels, and resume document ingestion.

## Endpoints
- `GET /profile/:id`: Retrieve user profile
- `PUT /profile/:id`: Update personal details & skill tags
- `POST /profile/:id/resume`: Ingest resume file to S3
- `GET /health`: Service health check
