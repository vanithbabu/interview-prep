import { Router } from 'express';

import {
  generateTopicExamplesBatch,
  generateTopicLessonWithLocalAI,
  getBootstrapPayload,
  getDynamicCategories,
  getDynamicQuestionById,
  getDynamicQuestions,
  getDynamicTopicLesson,
} from '../services/content.service.js';

export const contentRouter = Router();

contentRouter.get('/bootstrap', async (_req, res) => {
  res.json(await getBootstrapPayload());
});

contentRouter.get('/categories', (_req, res) => {
  res.json({ categories: getDynamicCategories() });
});

contentRouter.get('/topics/:id', (req, res) => {
  const lesson = getDynamicTopicLesson(req.params.id);
  if (!lesson) {
    res.status(404).json({ error: 'Topic not found' });
    return;
  }
  res.json({ lesson });
});

contentRouter.post('/topics/:id/generate', async (req, res) => {
  const result = await generateTopicLessonWithLocalAI(req.params.id);
  if (!result) {
    res.status(404).json({ error: 'Topic not found' });
    return;
  }
  res.json(result);
});

contentRouter.post('/topics/:id/generate-examples', async (req, res) => {
  const rawStart = Number(req.body?.batchStart ?? 1);
  const batchStart = [1, 11, 21, 31, 41].includes(rawStart) ? rawStart : 1;
  const result = await generateTopicExamplesBatch(req.params.id, batchStart);
  if (!result) {
    res.status(404).json({ error: 'Topic not found' });
    return;
  }
  res.json(result);
});

contentRouter.get('/questions', (req, res) => {
  const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
  const difficulty = typeof req.query.difficulty === 'string' ? req.query.difficulty : undefined;
  const q = typeof req.query.q === 'string' ? req.query.q : undefined;
  res.json({ questions: getDynamicQuestions({ categoryId, difficulty, q }) });
});

contentRouter.get('/questions/:id', (req, res) => {
  const question = getDynamicQuestionById(req.params.id);
  if (!question) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json({ question });
});
