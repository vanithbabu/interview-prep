import { Router } from 'express';

import { coachTurnRequestSchema } from '../schemas/aiCoach.schema.js';
import { evaluateCoachTurn } from '../services/aiCoach.service.js';

export const aiCoachRouter = Router();

aiCoachRouter.post('/evaluate', async (req, res, next) => {
  try {
    const parsed = coachTurnRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid interview payload',
        details: parsed.error.flatten(),
      });
      return;
    }

    const result = await evaluateCoachTurn(parsed.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
