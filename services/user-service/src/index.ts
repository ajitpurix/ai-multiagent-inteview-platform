import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UserProfile, UserRole } from '@ai-interview/contracts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors());
app.use(express.json());

// In-memory profile store
const profiles: Map<string, UserProfile> = new Map();

// Seed mock profile for quick-testing
profiles.set('usr_default', {
  id: 'usr_default',
  email: 'alex.developer@example.com',
  name: 'Alex Rivera',
  role: UserRole.CANDIDATE,
  skills: ['TypeScript', 'Node.js', 'React', 'Python', 'PostgreSQL', 'Docker'],
  experienceYears: 6,
  targetRole: 'Senior Full Stack Engineer',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'user-service', status: 'healthy' });
});

app.get('/profile/:id', (req: Request, res: Response) => {
  const profile = profiles.get(req.params.id) || profiles.get('usr_default');
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  return res.json(profile);
});

app.put('/profile/:id', (req: Request, res: Response) => {
  const existing = profiles.get(req.params.id) || {
    id: req.params.id,
    email: 'user@example.com',
    name: 'Candidate',
    role: UserRole.CANDIDATE,
    skills: [],
    createdAt: new Date().toISOString()
  };

  const updated: UserProfile = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  profiles.set(req.params.id, updated);
  return res.json(updated);
});

app.post('/profile/:id/resume', (req: Request, res: Response) => {
  // In production, handles S3 upload and triggers resume parsing pipeline
  const profile = profiles.get(req.params.id) || profiles.get('usr_default');
  if (profile) {
    profile.resumeUrl = `https://s3.amazonaws.com/ai-interview-resumes/${req.params.id}.pdf`;
    profile.updatedAt = new Date().toISOString();
  }
  return res.json({
    message: 'Resume uploaded successfully',
    resumeUrl: profile?.resumeUrl
  });
});

app.listen(PORT, () => {
  console.log(`[User Service] Running on port ${PORT}`);
});
