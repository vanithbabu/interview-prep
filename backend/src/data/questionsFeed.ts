export interface BackendQuestionFeed {
  id: string;
  categoryId: 'javascript' | 'react' | 'nextjs' | 'wordpress' | 'ai' | 'typescript';
  topicId?: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  shortAnswer: string;
  detailedExplanation: string;
  humanInterviewAnswer: string;
  practicalExample: string;
  codeExample?: {
    language: string;
    code: string;
    expectedOutput: string;
  };
  followUpQuestions: string[];
  interviewerExpectations: string[];
  keyConcepts: string[];
  tags: string[];
}

export const ALL_QUESTIONS_FEED: BackendQuestionFeed[] = [
  {
    id: 'js-q-var-let-const',
    categoryId: 'javascript',
    topicId: 'js-fundamentals',
    title: 'What is the difference between `var`, `let`, and `const` in JavaScript?',
    difficulty: 'beginner',
    shortAnswer:
      '`var` is function-scoped and hoisted as `undefined`, whereas `let` and `const` are block-scoped and stay in the Temporal Dead Zone until initialized. `const` also prevents reassignment.',
    humanInterviewAnswer:
      'In modern JavaScript, I default to `const` for everything, use `let` when I actually need to reassign a variable—like a loop counter—and avoid `var`. The big difference is scope and hoisting: `var` leaks out of `if` or `for` blocks because it is function-scoped, while `let` and `const` stay inside `{}` blocks and throw a `ReferenceError` if you touch them before their declaration line.',
    detailedExplanation:
      '`var` declarations are hoisted to the top of their enclosing function and initialized to `undefined`. `let` and `const` are block-scoped and remain in the Temporal Dead Zone (TDZ) until execution reaches their declaration. `const` locks the binding, not the contents of an object or array.',
    practicalExample:
      'Using `let` in a `for` loop with async callbacks ensures each iteration gets its own block-scoped value.',
    codeExample: {
      language: 'javascript',
      code: `if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a);\nconsole.log(typeof b);`,
      expectedOutput: '1\nundefined',
    },
    followUpQuestions: [
      'Can you mutate properties of an object declared with `const`?',
      'What happens if you access a `let` variable before its declaration line?',
    ],
    interviewerExpectations: [
      'Mention block scope vs. function scope.',
      'Explain Temporal Dead Zone (TDZ).',
      'Clarify that `const` prevents reassignment, not object mutation.',
    ],
    keyConcepts: ['block scope', 'function scope', 'hoisting', 'temporal dead zone', 'reassignment'],
    tags: ['fundamentals', 'variables', 'scope'],
  },
  {
    id: 'js-q-closures',
    categoryId: 'javascript',
    topicId: 'js-scope-closures',
    title: 'What is a closure in JavaScript, and where do you use it in real projects?',
    difficulty: 'intermediate',
    shortAnswer:
      'A closure is a function that retains access to variables from its outer lexical scope even after the outer function has returned.',
    humanInterviewAnswer:
      'A closure happens when an inner function remembers variables from its outer function even after that outer function finishes running. I use closures all the time for private state, custom React hooks, memoization caches, and `debounce`/`throttle` helpers.',
    detailedExplanation:
      'Because JavaScript uses lexical scoping, a function keeps a live reference to its outer Lexical Environment when returned or passed as a callback.',
    practicalExample: 'Building a `debounce(fn, delay)` search handler where `timerId` lives in a closure.',
    codeExample: {
      language: 'javascript',
      code: `function createCounter(start = 0) {\n  let count = start;\n  return () => ++count;\n}\nconst next = createCounter(5);\nconsole.log(next(), next());`,
      expectedOutput: '6 7',
    },
    followUpQuestions: ['Can closures cause memory leaks? How do you avoid them?'],
    interviewerExpectations: ['Explain lexical scope and persistence.', 'Give 2+ real-world examples.'],
    keyConcepts: ['lexical scope', 'outer function', 'private state', 'memory'],
    tags: ['closures', 'scope'],
  },
  {
    id: 'js-q-event-loop',
    categoryId: 'javascript',
    topicId: 'js-async-event-loop',
    title: 'Explain the JavaScript Event Loop, Microtasks, and Macrotasks.',
    difficulty: 'advanced',
    shortAnswer:
      'JavaScript runs synchronous code on the Call Stack, then drains the entire Microtask Queue (`Promise.then`) before taking the next Macrotask (`setTimeout`).',
    humanInterviewAnswer:
      'JavaScript is single-threaded, so it uses the Event Loop to handle async work. Synchronous code runs first on the Call Stack. Once empty, the Event Loop drains *all* Microtasks—like `Promise.then` or `await` continuations—before picking one Macrotask like `setTimeout`.',
    detailedExplanation:
      'Timers and I/O callbacks enter the Macrotask Queue, while Promise reactions and `queueMicrotask` enter the Microtask Queue, which always drains completely before the next Macrotask.',
    practicalExample: 'Predicting execution order when mixing `console.log`, `setTimeout`, and `Promise.resolve`.',
    codeExample: {
      language: 'javascript',
      code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
      expectedOutput: '1\n4\n3\n2',
    },
    followUpQuestions: ['What happens if a microtask continuously schedules another microtask?'],
    interviewerExpectations: ['Distinguish Call Stack, Microtask Queue, and Macrotask Queue.'],
    keyConcepts: ['call stack', 'microtask queue', 'macrotask queue', 'promise', 'setTimeout'],
    tags: ['event loop', 'async'],
  },
  {
    id: 'react-q-hooks-memo',
    categoryId: 'react',
    topicId: 'react-hooks',
    title: 'When should you use `useMemo` and `useCallback`, and when should you avoid them?',
    difficulty: 'intermediate',
    shortAnswer:
      '`useMemo` caches computed values and `useCallback` caches function references across renders. Use them only for expensive work or stabilizing props/dependencies.',
    humanInterviewAnswer:
      'I do not wrap every function in `useCallback` by default because memoization itself has a small memory and comparison cost. I reach for `useCallback` when passing a handler to a `React.memo` child or when a function is a `useEffect` dependency, and `useMemo` when filtering or sorting a large list.',
    detailedExplanation:
      'On every render, React creates new function and object references. `useCallback(fn, deps)` preserves referential equality so memoized children skip re-rendering, while `useMemo` avoids recomputing derived data unless dependencies change.',
    practicalExample: 'Stabilizing a search filter callback passed to a large virtualized `FlatList` item.',
    followUpQuestions: ['Why does `useCallback` have no effect if the child is not wrapped in `React.memo`?'],
    interviewerExpectations: ['Explain referential equality.', 'Warn against premature optimization.'],
    keyConcepts: ['referential equality', 're-render', 'React.memo', 'expensive computation'],
    tags: ['react', 'hooks', 'performance'],
  },
  {
    id: 'react-q-fiber-keys',
    categoryId: 'react',
    topicId: 'react-internals-perf',
    title: 'How do React reconciliation, keys, and Fiber work together?',
    difficulty: 'advanced',
    shortAnswer:
      'Reconciliation diffs old and new element trees using `key` props to match list items, while Fiber breaks rendering into interruptible units of work.',
    humanInterviewAnswer:
      'When state updates, React compares the new element tree against the current Fiber tree. Giving list items stable IDs as `key` props lets React move or update the right DOM nodes without losing child state. Fiber makes this traversal incremental so high-priority interactions like typing can pause background renders.',
    detailedExplanation:
      'Fiber represents each component as a linked-list node with work-in-progress and current trees, enabling concurrent scheduling (`useTransition`, `Suspense`).',
    practicalExample: 'Using database IDs instead of array indices in dynamic sortable tables.',
    followUpQuestions: ['What bug happens when you use array index as `key` on a list with inputs?'],
    interviewerExpectations: ['Explain diffing, stable keys, and interruptible Fiber rendering.'],
    keyConcepts: ['virtual dom', 'diffing', 'keys', 'fiber', 'interruptible rendering'],
    tags: ['react', 'fiber', 'reconciliation'],
  },
  {
    id: 'next-q-rsc-ssr',
    categoryId: 'nextjs',
    topicId: 'next-rendering-rsc',
    title: 'How do React Server Components differ from Client Components and traditional SSR?',
    difficulty: 'intermediate',
    shortAnswer:
      'Server Components execute only on the server and ship zero component JS to the browser, while SSR pre-renders Client Components that still hydrate on the client.',
    humanInterviewAnswer:
      'In Next.js App Router, components are Server Components by default—they can query a database directly and send zero JavaScript for that component to the browser. You only add `"use client"` at interactive leaf boundaries where you need `useState`, `useEffect`, or click handlers.',
    detailedExplanation:
      'Traditional SSR renders HTML on the server, then sends the full JS bundle to hydrate on the client. RSC keeps server-only dependencies (SDKs, DB clients) off the client bundle completely.',
    practicalExample: 'Fetching product details in a Server Component and passing them to a small `"use client"` AddToCart button.',
    followUpQuestions: ['How can you render a Server Component inside a Client Component?'],
    interviewerExpectations: ['Distinguish RSC zero-bundle from SSR hydration.', 'Explain `"use client"` boundaries.'],
    keyConcepts: ['zero bundle', 'server only', 'use client', 'hydration'],
    tags: ['nextjs', 'rsc', 'ssr'],
  },
  {
    id: 'wp-q-hooks-security',
    categoryId: 'wordpress',
    topicId: 'wp-architecture-hooks',
    title: 'Explain WordPress Actions vs Filters and how to secure custom handlers.',
    difficulty: 'intermediate',
    shortAnswer:
      'Actions run side effects at lifecycle hooks (`do_action`), while Filters transform and return data (`apply_filters`). Secure handlers with nonces, capability checks, and `$wpdb->prepare()`.',
    humanInterviewAnswer:
      'Actions let you plug in extra behavior at a specific moment—like sending an email after a post saves—without returning anything. Filters receive a value, modify it, and must return it. For security, I always verify a nonce, check `current_user_can()`, sanitize input, use `$wpdb->prepare()` for SQL, and escape on output.',
    detailedExplanation:
      'WordPress hooks decouple core/theme/plugin execution. Security relies on defense-in-depth: CSRF protection (nonces), authorization (`current_user_can`), SQL injection prevention (`prepare`), and XSS prevention (`esc_html`, `esc_attr`).',
    practicalExample: 'Securing an AJAX endpoint with `check_ajax_referer()` and `current_user_can("edit_posts")`.',
    followUpQuestions: ['Why should you sanitize on input and escape on output?'],
    interviewerExpectations: ['Contrast Actions vs Filters.', 'Name nonce + capability + prepare + escaping.'],
    keyConcepts: ['do_action', 'apply_filters', 'nonce', 'capability check', 'sanitize', 'escape'],
    tags: ['wordpress', 'hooks', 'security'],
  },
  {
    id: 'ai-q-rag',
    categoryId: 'ai',
    topicId: 'ai-rag-embeddings',
    title: 'How does Retrieval-Augmented Generation (RAG) work, and how do you reduce hallucinations?',
    difficulty: 'intermediate',
    shortAnswer:
      'RAG embeds a query, retrieves matching document chunks from a vector database, and injects them into the LLM prompt as grounded context.',
    humanInterviewAnswer:
      'RAG lets an LLM answer questions about your private or up-to-date docs without retraining the model. You split documents into chunks, store their embeddings in a vector DB, and at query time retrieve the top matching chunks to put in the prompt. To cut hallucinations, I use hybrid search, strict system prompts to cite sources, and instruct the model to say it does not know if the context lacks the answer.',
    detailedExplanation:
      'RAG combines dense vector similarity (semantic search) with optional BM25 keyword search and re-ranking before generation, plus evaluation metrics for retrieval recall and faithfulness.',
    practicalExample: 'Building a Next.js docs assistant backed by pgvector and OpenAI embeddings.',
    followUpQuestions: ['What chunking strategy would you use for technical documentation?'],
    interviewerExpectations: ['Explain embeddings + vector search + prompt grounding.', 'Give hallucination mitigations.'],
    keyConcepts: ['embeddings', 'vector database', 'chunking', 'semantic search', 'grounding'],
    tags: ['ai', 'rag', 'llm'],
  },
  {
    id: 'ts-q-generics-narrowing',
    categoryId: 'typescript',
    topicId: 'ts-generics-narrowing',
    title: 'How do TypeScript Generics and Type Narrowing work together for safe API responses?',
    difficulty: 'intermediate',
    shortAnswer:
      'Generics parameterize reusable containers like `ApiResponse<T>`, while type narrowing (`typeof`, `in`, type guards, Zod) safely refines `unknown` runtime data.',
    humanInterviewAnswer:
      'Generics let you write flexible functions and types—like `ApiResponse<T>`—that preserve exact types instead of falling back to `any`. When data comes from an external API at runtime, I type it as `unknown` and narrow it with a discriminated union or Zod schema so TypeScript guarantees safety.',
    detailedExplanation:
      'TypeScript types are erased at runtime, so combining compile-time generics with runtime narrowing (type predicates `x is T` or schema validation) prevents runtime crashes.',
    practicalExample: 'Typing a generic `fetchJson<T>(url, schema)` helper with Zod.',
    followUpQuestions: ['Why is `unknown` safer than `any` for API responses?'],
    interviewerExpectations: ['Explain generics + runtime narrowing.', 'Prefer `unknown` over `any`.'],
    keyConcepts: ['generics', 'type guard', 'unknown', 'narrowing', 'discriminated union'],
    tags: ['typescript', 'generics'],
  },
];
