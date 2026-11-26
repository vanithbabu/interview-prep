import { Router } from 'express';
import { z } from 'zod';

import {
  getUserActivities,
  recordUserActivity,
  verifyToken,
} from '../services/auth.service.js';

export const activityRouter = Router();

const activitySchema = z.object({
  actionType: z.string().min(2).max(60),
  targetId: z.string().max(120).optional(),
  title: z.string().min(2).max(200),
  metadata: z.record(z.unknown()).optional(),
});

function extractUserId(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const claims = verifyToken(authHeader.slice(7));
  return claims?.sub ?? null;
}

activityRouter.post('/', async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const parsed = activitySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid activity payload' });
    return;
  }

  const entry = await recordUserActivity({
    userId,
    ...parsed.data,
  });
  res.status(201).json({ activity: entry });
});

activityRouter.get('/', async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  res.json({ activities: await getUserActivities(userId) });
});
