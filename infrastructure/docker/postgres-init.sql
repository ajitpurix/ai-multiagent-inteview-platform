-- =========================================================
-- AI Interview Platform Database Initialization
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'CANDIDATE',
    password_hash VARCHAR(255),
    resume_url TEXT,
    skills TEXT[],
    experience_years INT DEFAULT 0,
    target_role VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
    id VARCHAR(64) PRIMARY KEY,
    candidate_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    role_title VARCHAR(255) NOT NULL,
    interview_type VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
    current_question_index INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    prompt TEXT NOT NULL,
    category VARCHAR(64) NOT NULL,
    difficulty VARCHAR(32) NOT NULL DEFAULT 'medium',
    starter_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Answers & Turn Transcripts Table
CREATE TABLE IF NOT EXISTS candidate_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(64) REFERENCES interview_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(64) REFERENCES interview_questions(id) ON DELETE CASCADE,
    answer_text TEXT,
    code_snippet TEXT,
    duration_seconds INT DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Evaluation Reports Table
CREATE TABLE IF NOT EXISTS evaluation_reports (
    id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64) UNIQUE REFERENCES interview_sessions(id) ON DELETE CASCADE,
    candidate_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    category_scores JSONB NOT NULL,
    key_strengths TEXT[] NOT NULL,
    areas_for_improvement TEXT[] NOT NULL,
    detailed_feedback TEXT NOT NULL,
    recommendation VARCHAR(32) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_candidate ON interview_sessions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_answers_session ON candidate_answers(session_id);
