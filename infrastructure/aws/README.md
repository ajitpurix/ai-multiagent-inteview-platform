# Cloud Infrastructure (`infrastructure/aws`)

Contains AWS Terraform scripts and cloud deployment architectures.

## Cloud Resources
- **ECS Cluster**: Hosts containerized tasks for services (`api-gateway`, `auth-service`, `user-service`, `interview-service`, `report-service`, `coding-service`, `ai-service`).
- **S3 Buckets**:
  - `ai-interview-platform-resumes-*`: Encrypted candidate resume storage.
  - `ai-interview-platform-reports-*`: Generated evaluation PDF/JSON scorecard exports.
- **RDS PostgreSQL**: High availability relational persistence.
- **ElastiCache Redis**: Session cache and real-time pub/sub.
