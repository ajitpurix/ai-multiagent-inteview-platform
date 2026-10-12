import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

// Service target URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8002';
const INTERVIEW_SERVICE_URL = process.env.INTERVIEW_SERVICE_URL || 'http://localhost:8003';
const REPORT_SERVICE_URL = process.env.REPORT_SERVICE_URL || 'http://localhost:8004';
const CODING_SERVICE_URL = process.env.CODING_SERVICE_URL || 'http://localhost:8005';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8006';

app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Optional JWT Authenticator middleware for protected routes
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    (req as any).user = user;
    next();
  });
};

// Microservice Route Proxies
app.use('/api/auth', proxy(AUTH_SERVICE_URL));
app.use('/api/users', proxy(USER_SERVICE_URL));
app.use('/api/interviews', proxy(INTERVIEW_SERVICE_URL));
app.use('/api/reports', proxy(REPORT_SERVICE_URL));
app.use('/api/coding', proxy(CODING_SERVICE_URL));
app.use('/api/ai', proxy(AI_SERVICE_URL));

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on http://localhost:${PORT}`);
});
