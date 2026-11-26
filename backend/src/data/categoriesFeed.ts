import { JS_50_TOPICS } from './jsRoadmap50.js';
import {
  AI_TOPICS,
  NEXTJS_TOPICS,
  REACT_TOPICS,
  TYPESCRIPT_TOPICS,
  WORDPRESS_TOPICS,
} from './techRoadmaps.js';

export interface BackendTopicSummary {
  id: string;
  categoryId: 'javascript' | 'react' | 'nextjs' | 'wordpress' | 'ai' | 'typescript';
  slug: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'coding';
  estimatedMinutes: number;
  description: string;
  exampleCount: number;
}

export interface BackendCategoryMeta {
  id: 'javascript' | 'react' | 'nextjs' | 'wordpress' | 'ai' | 'typescript';
  name: string;
  shortDescription: string;
  icon: string;
  accentColor: string;
  topics: BackendTopicSummary[];
}

export const CATEGORIES_FEED: BackendCategoryMeta[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    shortDescription: '50-module roadmap from fundamentals to senior internals & coding interviews.',
    icon: 'language-javascript',
    accentColor: '#F59E0B',
    topics: JS_50_TOPICS,
  },
  {
    id: 'react',
    name: 'React.js',
    shortDescription: '35-module roadmap covering JSX, hooks, state management, Fiber, RSC & testing.',
    icon: 'react',
    accentColor: '#06B6D4',
    topics: REACT_TOPICS,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    shortDescription: '30-module roadmap covering App Router, RSC, SSR/SSG/ISR, Server Actions & caching.',
    icon: 'triangle-outline',
    accentColor: '#6366F1',
    topics: NEXTJS_TOPICS,
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    shortDescription: '30-module roadmap covering themes, plugins, hooks, CPTs, ACF, WooCommerce & headless.',
    icon: 'wordpress',
    accentColor: '#2563EB',
    topics: WORDPRESS_TOPICS,
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    shortDescription: '25-module roadmap covering LLMs, prompting, RAG, embeddings, agents & AI security.',
    icon: 'brain',
    accentColor: '#10B981',
    topics: AI_TOPICS,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    shortDescription: '25-module roadmap covering types, generics, narrowing, mapped types & React/Next.js.',
    icon: 'language-typescript',
    accentColor: '#3B82F6',
    topics: TYPESCRIPT_TOPICS,
  },
];
