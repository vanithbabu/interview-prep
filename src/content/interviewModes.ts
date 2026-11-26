import type { MockInterviewModeConfig } from '@/types/interview';

export const INTERVIEW_MODES: MockInterviewModeConfig[] = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Core fundamentals and clear foundational explanations.',
    defaultCount: 5,
    secondsPerQuestion: 90,
    difficulties: ['beginner'],
    categories: ['javascript', 'react', 'nextjs', 'wordpress', 'ai', 'typescript'],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Practical patterns, closures, hooks, and async workflows.',
    defaultCount: 5,
    secondsPerQuestion: 120,
    difficulties: ['intermediate'],
    categories: ['javascript', 'react', 'nextjs', 'wordpress', 'ai', 'typescript'],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Internals, event loop, performance, and architecture.',
    defaultCount: 5,
    secondsPerQuestion: 150,
    difficulties: ['advanced'],
    categories: ['javascript', 'react', 'nextjs', 'wordpress', 'ai', 'typescript'],
  },
  {
    id: 'senior',
    title: 'Senior Developer',
    description: 'Trade-offs, scalability, debugging, and system thinking.',
    defaultCount: 6,
    secondsPerQuestion: 180,
    difficulties: ['intermediate', 'advanced'],
    categories: ['javascript', 'react', 'nextjs', 'wordpress', 'ai', 'typescript'],
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    description: 'JavaScript, TypeScript, React.js, and Next.js focus.',
    defaultCount: 6,
    secondsPerQuestion: 120,
    difficulties: ['beginner', 'intermediate', 'advanced'],
    categories: ['javascript', 'typescript', 'react', 'nextjs'],
  },
  {
    id: 'react',
    title: 'React Developer',
    description: 'React hooks, rendering, state management, and JS core.',
    defaultCount: 5,
    secondsPerQuestion: 120,
    difficulties: ['beginner', 'intermediate', 'advanced'],
    categories: ['react', 'javascript', 'typescript'],
  },
  {
    id: 'nextjs',
    title: 'Next.js Developer',
    description: 'App Router, RSC, SSR/ISR, caching, and TypeScript.',
    defaultCount: 5,
    secondsPerQuestion: 120,
    difficulties: ['beginner', 'intermediate', 'advanced'],
    categories: ['nextjs', 'react', 'typescript'],
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    description: 'End-to-end JS/TS, React/Next.js, WordPress, and AI.',
    defaultCount: 7,
    secondsPerQuestion: 120,
    difficulties: ['beginner', 'intermediate', 'advanced'],
    categories: ['javascript', 'typescript', 'react', 'nextjs', 'wordpress', 'ai'],
  },
  {
    id: 'custom',
    title: 'Custom Interview',
    description: 'Pick your own difficulty, technologies, and question count.',
    defaultCount: 5,
    secondsPerQuestion: 120,
    difficulties: ['beginner', 'intermediate', 'advanced'],
    categories: ['javascript', 'react', 'nextjs', 'wordpress', 'ai', 'typescript'],
  },
];

export function getInterviewModeById(id: string): MockInterviewModeConfig | undefined {
  return INTERVIEW_MODES.find((m) => m.id === id);
}
