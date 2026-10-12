# Terraform Infrastructure Configuration for AWS Deployment

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default = "us-east-1"
}

variable "environment" {
  default = "production"
}

# S3 Bucket for Candidate Resumes
resource "aws_s3_bucket" "resumes_bucket" {
  bucket = "ai-interview-platform-resumes-${var.environment}"
}

# S3 Bucket for Candidate Evaluation Reports
resource "aws_s3_bucket" "reports_bucket" {
  bucket = "ai-interview-platform-reports-${var.environment}"
}

# ECS Cluster for Microservices Orchestration
resource "aws_ecs_cluster" "platform_cluster" {
  name = "ai-interview-${var.environment}-cluster"
}

# Output Resources
output "resumes_bucket_name" {
  value = aws_s3_bucket.resumes_bucket.id
}

output "reports_bucket_name" {
  value = aws_s3_bucket.reports_bucket.id
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.platform_cluster.name
}
