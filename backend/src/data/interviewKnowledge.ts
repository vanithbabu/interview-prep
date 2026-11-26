export type KnowledgeCategoryId =
  | 'javascript'
  | 'react'
  | 'nextjs'
  | 'wordpress'
  | 'ai'
  | 'typescript';

export type KnowledgeLevel = 'beginner' | 'intermediate' | 'advanced' | 'senior';

export interface InterviewKnowledgeItem {
  id: string;
  categoryId: KnowledgeCategoryId;
  level: KnowledgeLevel;
  question: string;
  keyConcepts: string[];
  commonMistakes: string[];
  followUp: string;
  referenceAnswer: string;
}

export const INTERVIEW_KNOWLEDGE_BASE: InterviewKnowledgeItem[] = [
  {
    id: 'js-var-let-const',
    categoryId: 'javascript',
    level: 'beginner',
    question: 'Explain the difference between `let`, `const`, and `var` in JavaScript.',
    keyConcepts: ['block scope', 'function scope', 'hoisting', 'temporal dead zone', 'reassignment'],
    commonMistakes: ['Saying const makes objects immutable', 'Forgetting var leaks out of if/for blocks'],
    followUp: 'Can you mutate a property on an object declared with `const`?',
    referenceAnswer:
      'I default to `const` for everything, use `let` when a binding needs reassignment, and avoid `var`. `var` is function-scoped and hoisted as `undefined`, whereas `let` and `const` are block-scoped and stay in the Temporal Dead Zone until their declaration line.',
  },
  {
    id: 'js-closures',
    categoryId: 'javascript',
    level: 'intermediate',
    question: 'What is a closure in JavaScript, and how would you use one in a real app?',
    keyConcepts: ['lexical scope', 'outer function', 'private state', 'debounce', 'memory'],
    commonMistakes: ['Not mentioning memory retention trade-offs', 'Confusing closure with `this` binding'],
    followUp: 'How can a closure accidentally cause a memory leak?',
    referenceAnswer:
      'A closure happens when an inner function remembers variables from its outer lexical scope even after the outer function has returned. I use closures for private state, memoization caches, and `debounce`/`throttle` helpers.',
  },
  {
    id: 'js-event-loop',
    categoryId: 'javascript',
    level: 'advanced',
    question: 'Walk through the JavaScript Event Loop, microtasks, and macrotasks.',
    keyConcepts: ['call stack', 'microtask queue', 'macrotask queue', 'promise', 'setTimeout'],
    commonMistakes: ['Thinking setTimeout(..., 0) runs before Promise.then'],
    followUp: 'What happens if a microtask continuously schedules another microtask?',
    referenceAnswer:
      'Synchronous code runs first on the Call Stack. Once empty, the Event Loop drains the entire Microtask Queue (`Promise.then`, `await` continuations) before picking the next Macrotask (`setTimeout`, I/O).',
  },
  {
    id: 'react-hooks-memo',
    categoryId: 'react',
    level: 'intermediate',
    question: 'When should you use `useMemo` and `useCallback`, and when should you avoid them?',
    keyConcepts: ['referential equality', 're-render', 'expensive computation', 'React.memo', 'overhead'],
    commonMistakes: ['Wrapping every function in useCallback prematurely'],
    followUp: 'Why does `useCallback` do nothing if the child component is not wrapped in `React.memo`?',
    referenceAnswer:
      '`useMemo` caches an expensive computed value, and `useCallback` preserves function reference equality across renders. I only use them when passing callbacks to `React.memo` children, stabilizing `useEffect` dependencies, or avoiding genuinely heavy calculations.',
  },
  {
    id: 'react-reconciliation',
    categoryId: 'react',
    level: 'advanced',
    question: 'How do React reconciliation, keys, and Fiber work together during updates?',
    keyConcepts: ['virtual dom', 'diffing', 'keys', 'fiber', 'interruptible rendering'],
    commonMistakes: ['Using array index as key on reorderable lists'],
    followUp: 'How does Fiber enable concurrent features like `useTransition`?',
    referenceAnswer:
      'React compares the new element tree with the previous Fiber tree. Stable `key` props let React match list items accurately without resetting state. Fiber breaks rendering work into small units so high-priority updates like typing can interrupt background renders.',
  },
  {
    id: 'next-rsc-ssr',
    categoryId: 'nextjs',
    level: 'intermediate',
    question: 'How do React Server Components differ from Client Components and traditional SSR in Next.js App Router?',
    keyConcepts: ['zero bundle', 'server only', 'use client', 'hydration', 'streaming'],
    commonMistakes: ['Putting "use client" at the root layout unnecessarily'],
    followUp: 'Can a Client Component import and render a Server Component directly?',
    referenceAnswer:
      'Server Components run only on the server and ship zero component JavaScript to the browser, while SSR still hydrates Client Components on the client. I keep `"use client"` pushed down to interactive leaf components and pass Server Components as `children` when needed.',
  },
  {
    id: 'next-caching',
    categoryId: 'nextjs',
    level: 'advanced',
    question: 'Explain Next.js caching and revalidation strategies (SSR, SSG, ISR, `revalidateTag`).',
    keyConcepts: ['static', 'dynamic', 'revalidate', 'cache', 'on-demand'],
    commonMistakes: ['Assuming all fetch calls are cached or uncached without checking Next.js version defaults'],
    followUp: 'When would you choose `revalidateTag` over time-based ISR?',
    referenceAnswer:
      'I use static generation for marketing pages, time-based ISR (`revalidate: 60`) for semi-fresh catalogs, and on-demand `revalidateTag` in Server Actions or webhooks when CMS/database data changes immediately.',
  },
  {
    id: 'wp-hooks-security',
    categoryId: 'wordpress',
    level: 'intermediate',
    question: 'Explain WordPress Actions vs Filters and how you secure custom form/AJAX handlers.',
    keyConcepts: ['do_action', 'apply_filters', 'nonce', 'capability check', 'sanitize', 'escape'],
    commonMistakes: ['Forgetting `current_user_can` or `$wpdb->prepare`'],
    followUp: 'What is the difference between sanitization on input and escaping on output?',
    referenceAnswer:
      'Actions let you run code at specific lifecycle points without returning a value, while Filters receive data, modify it, and must return it. For security, I always verify a nonce (`check_ajax_referer`), check `current_user_can()`, sanitize inputs, use `$wpdb->prepare()`, and escape on output.',
  },
  {
    id: 'ai-rag-architecture',
    categoryId: 'ai',
    level: 'intermediate',
    question: 'How does Retrieval-Augmented Generation (RAG) work, and how do you reduce hallucinations?',
    keyConcepts: ['embeddings', 'vector database', 'chunking', 'semantic search', 'grounding', 'citations'],
    commonMistakes: ['Sending huge unchunked documents or skipping retrieval evaluation'],
    followUp: 'What chunking strategy would you pick for technical documentation?',
    referenceAnswer:
      'RAG embeds user queries into vectors, searches a vector database for the most relevant document chunks, and injects those chunks into the LLM prompt as grounded context. To cut hallucinations, I use overlapping semantic chunks, hybrid keyword+vector search, and instruct the model to cite sources or say "I do not know" when context is missing.',
  },
  {
    id: 'ts-generics-narrowing',
    categoryId: 'typescript',
    level: 'intermediate',
    question: 'How do TypeScript Generics and Type Narrowing work together for safe API responses?',
    keyConcepts: ['generics', 'type guard', 'unknown', 'narrowing', 'discriminated union'],
    commonMistakes: ['Using `any` instead of `unknown` + narrowing'],
    followUp: 'Why is a discriminated union (`status: "ok" | "error"`) better than optional fields?',
    referenceAnswer:
      'Generics let us write reusable wrappers like `ApiResponse<T>` without losing type info, while type narrowing (via `typeof`, `in`, custom type predicates, or Zod) safely refines `unknown` runtime data into exact TypeScript types.',
  },
];

export function findKnowledgeForTurn(params: {
  categoryId?: KnowledgeCategoryId | 'all';
  level: KnowledgeLevel;
  askedQuestions: string[];
}): InterviewKnowledgeItem[] {
  const { categoryId, level, askedQuestions } = params;
  const askedSet = new Set(askedQuestions.map((q) => q.toLowerCase()));

  const filtered = INTERVIEW_KNOWLEDGE_BASE.filter((item) => {
    if (categoryId && categoryId !== 'all' && item.categoryId !== categoryId) {
      return false;
    }
    return !askedSet.has(item.question.toLowerCase());
  });

  const levelMatched = filtered.filter((item) => item.level === level);
  return levelMatched.length > 0 ? levelMatched : filtered;
}
