/**
 * Shared Type Definitions, API Contracts & Event Schemas
 */

export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  resumeUrl?: string;
  skills: string[];
  experienceYears?: number;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum InterviewType {
  BEHAVIORAL = 'BEHAVIORAL',
  TECHNICAL_CODING = 'TECHNICAL_CODING',
  SYSTEM_DESIGN = 'SYSTEM_DESIGN',
  FULL_MOCK = 'FULL_MOCK'
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  roleTitle: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  questionNumber: number;
  prompt: string;
  category: 'coding' | 'behavioral' | 'architecture' | 'algorithmic';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedKeyPoints?: string[];
  starterCode?: string;
  language?: string;
}

export interface CandidateAnswer {
  questionId: string;
  sessionId: string;
  answerText?: string;
  codeSnippet?: string;
  audioRecordingUrl?: string;
  durationSeconds: number;
  submittedAt: string;
}

export interface EvaluationReport {
  id: string;
  sessionId: string;
  candidateId: string;
  overallScore: number; // 0 - 100
  categories: {
    technicalAccuracy: number;
    problemSolving: number;
    communication: number;
    codeQuality: number;
    architecturalThinking: number;
  };
  keyStrengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'LEANING_HIRE' | 'LEANING_NO_HIRE' | 'NO_HIRE';
  generatedAt: string;
}

export interface CodeExecutionRequest {
  language: 'python' | 'javascript' | 'typescript' | 'cpp' | 'java' | 'go';
  code: string;
  inputs?: string[];
  expectedOutputs?: string[];
  timeoutMs?: number;
}

export interface CodeExecutionResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryUsedKb: number;
  passedAllTests?: boolean;
}

// Broker Event Topics & Payload Contracts
export enum EventTopics {
  INTERVIEW_CREATED = 'interview.created',
  INTERVIEW_STARTED = 'interview.started',
  INTERVIEW_ANSWER_SUBMITTED = 'interview.answer_submitted',
  INTERVIEW_COMPLETED = 'interview.completed',
  CODE_SUBMITTED = 'coding.submitted',
  REPORT_GENERATION_REQUESTED = 'report.generation_requested',
  REPORT_READY = 'report.ready'
}

export interface EventEnvelope<T> {
  eventId: string;
  topic: EventTopics;
  timestamp: string;
  payload: T;
}
