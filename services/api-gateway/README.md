# API Gateway (`services/api-gateway`)

Node.js + TypeScript gateway acting as the reverse proxy for all client requests from the Next.js web application.

## Features
- Centralized rate limiting with IP bucket windows
- JWT verification & token decoding middleware
- HTTP proxy routing to downstream microservices:
  - `/api/auth` -> Auth Service (`:8001`)
  - `/api/users` -> User Service (`:8002`)
  - `/api/interviews` -> Interview Service (`:8003`)
  - `/api/reports` -> Report Service (`:8004`)
  - `/api/coding` -> Coding Service (`:8005`)
  - `/api/ai` -> AI Service (`:8006`)
