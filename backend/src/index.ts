import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { allowedOrigins, env } from './config/env.js';
import { activityRouter } from './routes/activity.routes.js';
import { aiCoachRouter } from './routes/aiCoach.routes.js';
import { authRouter } from './routes/auth.routes.js';
import { contentRouter } from './routes/content.routes.js';
import { syncRouter } from './routes/sync.routes.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin not allowed by CORS'));
      }
    },
  })
);
app.use(express.json({ limit: '64kb' }));

const interviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'interview-prep-backend',
    aiProvider: env.AI_PROVIDER,
    model: env.AI_PROVIDER === 'local' ? env.LOCAL_AI_MODEL : env.AI_MODEL,
  });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/activity', activityRouter);
app.use('/api/v1/sync', syncRouter);
app.use('/api/v1/content', contentRouter);
app.use('/api/v1/interview', interviewLimiter, aiCoachRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Internal server error';
  console.error('[Backend Error]', message);
  res.status(500).json({ error: 'Unable to process request right now.' });
});

app.listen(env.PORT, () => {
  console.log(`Backend API listening on http://localhost:${env.PORT}`);
});
