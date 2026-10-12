# Report Service (`services/report-service`)

Processes post-interview transcripts, compiles scorecard metrics across technical categories, and generates hiring recommendations.

## Endpoints
- `POST /generate/:sessionId`: Compile and synthesize scorecard from session transcript
- `GET /session/:sessionId`: Retrieve existing candidate evaluation report
- `GET /health`: Service health check
