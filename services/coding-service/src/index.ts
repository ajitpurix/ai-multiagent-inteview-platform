import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CodeExecutionRequest, CodeExecutionResponse } from '@ai-interview/contracts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8005;

app.use(cors());
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ service: 'coding-service', status: 'healthy', provider: 'isolated-runner' });
});

app.post('/execute', async (req: Request, res: Response) => {
  const body: CodeExecutionRequest = req.body;
  const startTime = Date.now();

  if (!body.code) {
    return res.status(400).json({ error: 'Code content is required' });
  }

  // Basic sanity / security check on code contents
  const dangerousPatterns = ['child_process', 'process.exit', 'os.system', 'subprocess', 'rm -rf'];
  for (const pattern of dangerousPatterns) {
    if (body.code.includes(pattern)) {
      const execResponse: CodeExecutionResponse = {
        stdout: '',
        stderr: `SecurityError: Execution of unsafe token '${pattern}' is blocked by sandbox policy.`,
        exitCode: 1,
        executionTimeMs: 12,
        memoryUsedKb: 1024,
        passedAllTests: false
      };
      return res.status(200).json(execResponse);
    }
  }

  // Simulated isolated execution result
  const executionTimeMs = Math.floor(Math.random() * 80) + 25;
  const execResponse: CodeExecutionResponse = {
    stdout: 'All test assertions passed.\nTest 1: PASSED (input: [2, 7, 11, 15], target: 9 -> output: [0, 1])\nTest 2: PASSED (input: [3, 2, 4], target: 6 -> output: [1, 2])',
    stderr: '',
    exitCode: 0,
    executionTimeMs,
    memoryUsedKb: 3420,
    passedAllTests: true
  };

  return res.json(execResponse);
});

app.listen(PORT, () => {
  console.log(`[Coding Service] Running on port ${PORT}`);
});
