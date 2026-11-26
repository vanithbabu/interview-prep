import type {
  DifficultyLevel,
  InterviewQuestion,
  TechnologyId,
  TopicSummary,
} from '@/types/content';

export type SearchStatusFilter = 'all' | 'bookmarked' | 'unanswered' | 'review';

export interface SearchFilters {
  query: string;
  difficulty: 'all' | DifficultyLevel;
  category: 'all' | TechnologyId;
  status: SearchStatusFilter;
  bookmarkedQuestionIds: string[];
  answeredQuestionResults: Record<string, 'correct' | 'review'>;
  notesById: Record<string, string>;
}

export function filterTopics(
  topics: TopicSummary[],
  filters: Pick<SearchFilters, 'query' | 'difficulty' | 'category'>
): TopicSummary[] {
  const q = filters.query.trim().toLowerCase();

  return topics.filter((topic) => {
    if (filters.difficulty !== 'all' && topic.level !== filters.difficulty) {
      return false;
    }
    if (filters.category !== 'all' && topic.categoryId !== filters.category) {
      return false;
    }
    if (!q) return true;

    return (
      topic.title.toLowerCase().includes(q) ||
      topic.description.toLowerCase().includes(q) ||
      topic.categoryId.toLowerCase().includes(q)
    );
  });
}

export function filterQuestions(
  questions: InterviewQuestion[],
  filters: SearchFilters
): InterviewQuestion[] {
  const q = filters.query.trim().toLowerCase();

  return questions.filter((question) => {
    if (filters.difficulty !== 'all' && question.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.category !== 'all' && question.categoryId !== filters.category) {
      return false;
    }

    const isBookmarked = filters.bookmarkedQuestionIds.includes(question.id);
    const result = filters.answeredQuestionResults[question.id];

    if (filters.status === 'bookmarked' && !isBookmarked) return false;
    if (filters.status === 'unanswered' && result !== undefined) return false;
    if (filters.status === 'review' && result !== 'review') return false;

    if (!q) return true;

    const note = (filters.notesById[question.id] ?? '').toLowerCase();
    return (
      question.title.toLowerCase().includes(q) ||
      question.shortAnswer.toLowerCase().includes(q) ||
      question.tags.some((t) => t.toLowerCase().includes(q)) ||
      note.includes(q)
    );
  });
}
