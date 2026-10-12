import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import dotenv from 'dotenv';
import { UserRole } from '@ai-interview/contracts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

app.use(cors());
app.use(express.json());

// In-memory user store for dev bootstrap
const users: any[] = [];

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.nativeEnum(UserRole).default(UserRole.CANDIDATE)
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'auth-service', status: 'healthy' });
});

app.post('/register', async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const existing = users.find(u => u.email === data.email);
    if (existing) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = {
      id: `usr_${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash: hashedPassword,
      createdAt: new Date().toISOString()
    };
    users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Validation failed' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = users.find(u => u.email === data.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Validation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`[Auth Service] Running on port ${PORT}`);
});
