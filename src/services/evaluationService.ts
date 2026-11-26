import { ALL_QUESTIONS } from '@/content/questions';
import type { DifficultyLevel, InterviewQuestion, TechnologyId } from '@/types/content';
import type { MockAnswerEvaluation } from '@/types/interview';

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function selectQuestionsForMock(params: {
  questions: InterviewQuestion[];
  categories: TechnologyId[];
  difficulties: DifficultyLevel[];
  count: number;
}): InterviewQuestion[] {
  const { questions, categories, difficulties, count } = params;

  const matching = questions.filter(
    (q) => categories.includes(q.categoryId) && difficulties.includes(q.difficulty)
  );

  // Fallback to all available questions if a specific filter pool is currently smaller
  const pool = matching.length > 0 ? matching : questions;
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
}

export function evaluateMockAnswer(params: {
  question: InterviewQuestion;
  userAnswer: string;
  timedOut: boolean;
}): MockAnswerEvaluation {
  const { question, userAnswer, timedOut } = params;
  const normalized = userAnswer.trim().toLowerCase();

  if (!normalized) {
    return {
      questionId: question.id,
      questionTitle: question.title,
      userAnswer: '',
      score: 1,
      matchedConcepts: [],
      missingConcepts: question.keyConcepts,
      expectedAnswer: question.shortAnswer,
      improvedAnswer: question.humanInterviewAnswer,
      timedOut,
    };
  }

  const matchedConcepts: string[] = [];
  const missingConcepts: string[] = [];

  for (const concept of question.keyConcepts) {
    const tokens = concept.toLowerCase().split(/\s+/);
    const hasMatch = tokens.some((t) => t.length > 2 && normalized.includes(t));
    if (hasMatch || normalized.includes(concept.toLowerCase())) {
      matchedConcepts.push(concept);
    } else {
      missingConcepts.push(concept);
    }
  }

  const conceptRatio =
    question.keyConcepts.length > 0
      ? matchedConcepts.length / question.keyConcepts.length
      : 0.5;
  const conceptPoints = Math.round(conceptRatio * 7);
  const wordCount = normalized.split(/\s+/).length;
  const clarityPoints = wordCount >= 25 ? 3 : wordCount >= 12 ? 2 : 1;

  const score = Math.max(1, Math.min(10, conceptPoints + clarityPoints));

  return {
    questionId: question.id,
    questionTitle: question.title,
    userAnswer: userAnswer.trim(),
    score,
    matchedConcepts,
    missingConcepts,
    expectedAnswer: question.shortAnswer,
    improvedAnswer: question.humanInterviewAnswer,
    timedOut,
  };
}
