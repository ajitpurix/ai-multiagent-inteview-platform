import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {
  InterviewSession,
  InterviewStatus,
  InterviewType,
  InterviewQuestion,
  CandidateAnswer
} from '@ai-interview/contracts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8006';

app.use(cors());
app.use(express.json());

const sessions = new Map<string, InterviewSession>();
const sessionQuestions = new Map<string, InterviewQuestion[]>();
const sessionAnswers = new Map<string, CandidateAnswer[]>();

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'interview-service', status: 'healthy' });
});

// Create and initialize interview session
app.post('/sessions', async (req: Request, res: Response) => {
  const { candidateId, roleTitle, interviewType } = req.body;
  const sessionId = `ses_${uuidv4().substring(0, 8)}`;

  try {
    // Request curated questions from AI Service
    const aiRes = await axios.post(`${AI_SERVICE_URL}/v1/interview/start`, {
      session_id: sessionId,
      interview_type: interviewType || InterviewType.FULL_MOCK,
      candidate: {
        candidate_id: candidateId || 'usr_default',
        target_role: roleTitle || 'Senior Full Stack Engineer',
        experience_years: 5
      }
    });

    const questions: InterviewQuestion[] = aiRes.data.map((q: any) => ({
      id: q.question_id,
      sessionId,
      questionNumber: q.question_number,
      prompt: q.prompt,
      category: q.category,
      difficulty: 'medium',
      starterCode: q.starter_code
    }));

    const session: InterviewSession = {
      id: sessionId,
      candidateId: candidateId || 'usr_default',
      roleTitle: roleTitle || 'Senior Full Stack Engineer',
      interviewType: interviewType || InterviewType.FULL_MOCK,
      status: InterviewStatus.SCHEDULED,
      currentQuestionIndex: 0,
      totalQuestions: questions.length,
      createdAt: new Date().toISOString()
    };

    sessions.set(sessionId, session);
    sessionQuestions.set(sessionId, questions);
    sessionAnswers.set(sessionId, []);

    return res.status(201).json({ session, questions });
  } catch (error: any) {
    // Graceful offline mock response
    const mockQuestions: InterviewQuestion[] = [
      {
        id: 'q-1',
        sessionId,
        questionNumber: 1,
        prompt: 'Explain the internal architecture of Node.js event loop and libuv thread pool.',
        category: 'architecture',
        difficulty: 'medium'
      },
      {
        id: 'q-2',
        sessionId,
        questionNumber: 2,
        prompt: 'Implement an LRU Cache with O(1) operations.',
        category: 'coding',
        difficulty: 'medium',
        starterCode: 'class LRUCache {\n  constructor(capacity) {}\n  get(key) {}\n  put(key, val) {}\n}'
      }
    ];

    const session: InterviewSession = {
      id: sessionId,
      candidateId: candidateId || 'usr_default',
      roleTitle: roleTitle || 'Senior Full Stack Engineer',
      interviewType: interviewType || InterviewType.FULL_MOCK,
      status: InterviewStatus.SCHEDULED,
      currentQuestionIndex: 0,
      totalQuestions: mockQuestions.length,
      createdAt: new Date().toISOString()
    };

    sessions.set(sessionId, session);
    sessionQuestions.set(sessionId, mockQuestions);
    sessionAnswers.set(sessionId, []);

    return res.status(201).json({ session, questions: mockQuestions });
  }
});

// Start session
app.patch('/sessions/:id/start', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.status = InterviewStatus.IN_PROGRESS;
  session.startedAt = new Date().toISOString();
  sessions.set(session.id, session);

  return res.json(session);
});

// Process conversational turn with AI Agent
app.post('/sessions/:id/turn', async (req: Request, res: Response) => {
  const { questionId, candidateInput, codeSubmission } = req.body;
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  try {
    const aiTurnRes = await axios.post(`${AI_SERVICE_URL}/v1/interview/turn`, {
      session_id: session.id,
      question_id: questionId,
      candidate_input: candidateInput,
      code_submission: codeSubmission
    });

    return res.json(aiTurnRes.data);
  } catch {
    return res.json({
      session_id: session.id,
      agent_message: "Great explanation. How would you handle network partitioning or split-brain scenarios in this design?",
      is_question_completed: false,
      follow_up_count: 1,
      next_action: "continue"
    });
  }
});

// Submit answer for current question
app.post('/sessions/:id/answers', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const answer: CandidateAnswer = {
    ...req.body,
    sessionId: session.id,
    submittedAt: new Date().toISOString()
  };

  const currentAnswers = sessionAnswers.get(session.id) || [];
  currentAnswers.push(answer);
  sessionAnswers.set(session.id, currentAnswers);

  // Advance question index
  session.currentQuestionIndex += 1;
  if (session.currentQuestionIndex >= session.totalQuestions) {
    session.status = InterviewStatus.COMPLETED;
    session.completedAt = new Date().toISOString();
  }

  sessions.set(session.id, session);
  return res.json({ session, answer });
});

// Get session details
app.get('/sessions/:id', (req: Request, res: Response) => {
  const session = sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  return res.json({
    session,
    questions: sessionQuestions.get(session.id) || [],
    answers: sessionAnswers.get(session.id) || []
  });
});

app.listen(PORT, () => {
  console.log(`[Interview Service] Running on port ${PORT}`);
});
