import { Router } from 'express';
import { z } from 'zod';

import {
  getUserById,
  loginUser,
  registerUser,
  verifyToken,
} from '../services/auth.service.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(80).optional(),
});

const loginSchema = z.object({
  email: z.string().email().max(120),
  password: z.string().min(1).max(128),
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please provide a valid email and 6+ char password.' });
    return;
  }

  try {
    const result = await registerUser(parsed.data);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
      res.status(409).json({ error: 'An account with this email already exists.' });
      return;
    }
    res.status(500).json({ error: 'Registration failed.' });
  }
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Please enter a valid email and password.' });
    return;
  }

  try {
    const result = await loginUser(parsed.data);
    res.json(result);
  } catch {
    res.status(401).json({ error: 'Invalid email or password.' });
  }
});

authRouter.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const claims = token ? verifyToken(token) : null;
  if (!claims) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const user = await getUserById(claims.sub);
  if (!user) {
    res.status(401).json({ error: 'User session expired' });
    return;
  }
  res.json({ user });
});
