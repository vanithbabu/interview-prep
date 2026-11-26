import { Router } from 'express';
import { z } from 'zod';

import { verifyToken } from '../services/auth.service.js';
import { getUserSyncState, saveUserSyncState } from '../services/sync.service.js';

export const syncRouter = Router();

const syncPayloadSchema = z.object({
  completedTopicIds: z.array(z.string()),
  completedExampleIds: z.array(z.string()),
  answeredQuestionResults: z.record(z.enum(['correct', 'review'])),
  bookmarkedQuestionIds: z.array(z.string()),
  bookmarkedExampleIds: z.array(z.string()),
  notesById: z.record(z.string()),
  dailyGoalTarget: z.number().int().min(1).max(50),
  currentStreak: z.number().int().min(0),
  longestStreak: z.number().int().min(0),
  lastActiveDate: z.string().nullable(),
});

function extractUserId(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const claims = verifyToken(authHeader.slice(7));
  return claims?.sub ?? null;
}

syncRouter.get('/', async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const state = await getUserSyncState(userId);
  res.json({ state });
});

syncRouter.put('/', async (req, res) => {
  const userId = extractUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const parsed = syncPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid sync payload' });
    return;
  }
  const saved = await saveUserSyncState(userId, parsed.data);
  res.json({ state: saved });
});
