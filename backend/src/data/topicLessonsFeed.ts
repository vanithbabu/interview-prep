import { JS_LESSONS_PART_1 } from './jsLessonsPart1.js';
import { JS_LESSONS_PART_2 } from './jsLessonsPart2.js';
import { EXTRA_TOPIC_LESSONS } from './topicLessonsExtra.js';

export interface TopicLessonCodeExample {
  title: string;
  language: string;
  code: string;
  expectedOutput: string;
}

export interface TopicLesson {
  id: string;
  categoryId: 'javascript' | 'react' | 'nextjs' | 'wordpress' | 'ai' | 'typescript';
  categoryName: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'coding';
  estimatedMinutes: number;
  coreQuestion: string;
  simpleHumanAnswer: string;
  realWorldExample: string;
  codeExamples: TopicLessonCodeExample[];
  interviewSpeakingAnswer: string;
  followUpQuestions: string[];
  followUpAnswers?: Array<{ question: string; answer: string }>;
}

export const TOPIC_LESSONS: Record<string, TopicLesson> = {
  'js-fundamentals': {
    id: 'js-fundamentals',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'JavaScript Fundamentals & Variables',
    level: 'beginner',
    estimatedMinutes: 25,
    coreQuestion: 'What is the difference between var, let, and const in JavaScript?',
    simpleHumanAnswer:
      '`const` is for values you do not reassign, `let` is for values that change inside a block, and `var` is the older function-scoped keyword that can leak out of `if` or `for` blocks.',
    realWorldExample:
      'Think of `const` like your passport number (stays bound to you), and `let` like your current score in a game (updates as you play).',
    codeExamples: [
      {
        title: 'Example 1: Block Scope (let vs var)',
        language: 'JavaScript',
        code: `if (true) {\n  var leaked = 'visible outside';\n  let scoped = 'inside only';\n}\nconsole.log(leaked);\nconsole.log(typeof scoped);`,
        expectedOutput: 'visible outside\nundefined',
      },
      {
        title: 'Example 2: Mutating a const Object',
        language: 'JavaScript',
        code: `const user = { name: 'Asha', role: 'Dev' };\nuser.role = 'Senior Dev';\nconsole.log(user.name, '-', user.role);`,
        expectedOutput: 'Asha - Senior Dev',
      },
      {
        title: 'Example 3: Loop Binding with let',
        language: 'JavaScript',
        code: `const fns = [];\nfor (let i = 0; i < 3; i++) {\n  fns.push(() => i);\n}\nconsole.log(fns.map((fn) => fn()).join(', '));`,
        expectedOutput: '0, 1, 2',
      },
    ],
    interviewSpeakingAnswer:
      'In modern JavaScript, I default to `const`, use `let` when I need to reassign a variable, and avoid `var`. `let` and `const` are block-scoped and stay in the Temporal Dead Zone until declared, whereas `var` is function-scoped and hoisted as `undefined`.',
    followUpQuestions: [
      'Can you mutate properties of an object declared with `const`?',
      'What is the Temporal Dead Zone (TDZ)?',
      'Why does `var` cause bugs inside `for` loops with callbacks?',
    ],
  },
  'js-functions': {
    id: 'js-functions',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'Functions, Arrow Functions & Parameters',
    level: 'beginner',
    estimatedMinutes: 35,
    coreQuestion: 'How do regular functions and arrow functions differ in JavaScript?',
    simpleHumanAnswer:
      'Regular functions get their own `this` based on how they are called, while arrow functions have a shorter syntax and inherit `this` from the surrounding scope.',
    realWorldExample:
      'Using an arrow function inside a class method or `setTimeout` lets you read `this.name` without needing `.bind(this)`.',
    codeExamples: [
      {
        title: 'Example 1: Implicit Return & Object Literal',
        language: 'JavaScript',
        code: `const double = (n) => n * 2;\nconst makeUser = (id, name) => ({ id, name });\nconsole.log(double(7), makeUser(1, 'Riya').name);`,
        expectedOutput: '14 Riya',
      },
      {
        title: 'Example 2: Default & Rest Parameters',
        language: 'JavaScript',
        code: `const sum = (label = 'Total', ...nums) => {\n  const total = nums.reduce((a, b) => a + b, 0);\n  return \`\${label}: \${total}\`;\n};\nconsole.log(sum('Score', 10, 20, 30));`,
        expectedOutput: 'Score: 60',
      },
      {
        title: 'Example 3: Lexical this in Arrow Functions',
        language: 'JavaScript',
        code: `const team = {\n  name: 'Core',\n  describe() {\n    const read = () => this.name;\n    return read();\n  },\n};\nconsole.log(team.describe());`,
        expectedOutput: 'Core',
      },
    ],
    interviewSpeakingAnswer:
      'Arrow functions differ from regular functions in three main ways: they inherit `this` lexically instead of binding it dynamically, they have no `arguments` object, and they cannot be called with `new` as constructors.',
    followUpQuestions: [
      'Why should you avoid arrow functions for object methods?',
      'What happens if you try to `.bind()` an arrow function?',
      'How do rest parameters differ from the `arguments` object?',
    ],
  },
  'js-scope-closures': {
    id: 'js-scope-closures',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'Scope, Hoisting & Closures',
    level: 'intermediate',
    estimatedMinutes: 40,
    coreQuestion: 'What is a closure in JavaScript?',
    simpleHumanAnswer:
      'A closure is when an inner function remembers variables from its outer function, even after the outer function has finished executing.',
    realWorldExample:
      'Imagine a function that creates a counter. Every time you call it, the counter remembers its previous value.',
    codeExamples: [
      {
        title: 'Example 1: Counter Closure',
        language: 'JavaScript',
        code: `function counter() {\n  let count = 0;\n\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst myCounter = counter();\nconsole.log(myCounter()); // 1\nconsole.log(myCounter()); // 2\nconsole.log(myCounter()); // 3`,
        expectedOutput: '1\n2\n3',
      },
      {
        title: 'Example 2: Private Bank Balance',
        language: 'JavaScript',
        code: `function createWallet(initial) {\n  let balance = initial;\n  return {\n    deposit: (amt) => (balance += amt),\n    read: () => balance,\n  };\n}\nconst w = createWallet(100);\nw.deposit(45);\nconsole.log(w.read());`,
        expectedOutput: '145',
      },
      {
        title: 'Example 3: Memoized Function Cache',
        language: 'JavaScript',
        code: `function memoize(fn) {\n  const cache = new Map();\n  return (x) => (cache.has(x) ? cache.get(x) : cache.set(x, fn(x)).get(x));\n}\nconst fastSquare = memoize((n) => n * n);\nconsole.log(fastSquare(8), fastSquare(8));`,
        expectedOutput: '64 64',
      },
    ],
    interviewSpeakingAnswer:
      'A closure is a feature in JavaScript where an inner function can access variables from its outer function, even after the outer function has completed execution. We commonly use closures for data privacy, debouncing, memoization, and maintaining state.',
    followUpQuestions: [
      'Why do we use closures?',
      'What are practical use cases?',
      'What is the difference between scope and closure?',
    ],
  },
  'react-hooks': {
    id: 'react-hooks',
    categoryId: 'react',
    categoryName: 'React.js',
    title: 'Core & Custom Hooks',
    level: 'intermediate',
    estimatedMinutes: 45,
    coreQuestion: 'When should you use useMemo and useCallback in React?',
    simpleHumanAnswer:
      '`useMemo` remembers the result of an expensive calculation, and `useCallback` remembers the function itself so React does not create a brand-new function on every render.',
    realWorldExample:
      'If you pass an `onSelect` handler to 100 memoized list rows, `useCallback` keeps the handler reference identical so unchanged rows do not re-render.',
    codeExamples: [
      {
        title: 'Example 1: useMemo for Derived Filtering',
        language: 'TSX',
        code: `const visibleItems = useMemo(\n  () => items.filter((item) => item.active),\n  [items]\n);`,
        expectedOutput: 'Recomputes only when `items` changes.',
      },
      {
        title: 'Example 2: useCallback with React.memo Child',
        language: 'TSX',
        code: `const handleSave = useCallback((id: string) => {\n  saveItem(id);\n}, []);`,
        expectedOutput: 'Preserves function reference across renders.',
      },
      {
        title: 'Example 3: Custom useDebouncedValue Hook',
        language: 'TSX',
        code: `function useDebouncedValue<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const t = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(t);\n  }, [value, delay]);\n  return debounced;\n}`,
        expectedOutput: 'Updates `debounced` only after `delay` ms of inactivity.',
      },
    ],
    interviewSpeakingAnswer:
      'I use `useMemo` to cache expensive derived values and `useCallback` to preserve function reference equality for `React.memo` children or `useEffect` dependencies. I avoid wrapping every trivial function prematurely because memoization adds comparison overhead.',
    followUpQuestions: [
      'Why does `useCallback` do nothing if the child is not wrapped in `React.memo`?',
      'What are the Rules of Hooks and why do they exist?',
      'How do you clean up subscriptions in `useEffect`?',
    ],
  },
  'next-rendering-rsc': {
    id: 'next-rendering-rsc',
    categoryId: 'nextjs',
    categoryName: 'Next.js',
    title: 'SSR, SSG, ISR, CSR & Server Components',
    level: 'intermediate',
    estimatedMinutes: 45,
    coreQuestion: 'How do Server Components differ from Client Components in Next.js?',
    simpleHumanAnswer:
      'Server Components run only on the server and send zero component JavaScript to the browser, while Client Components (`"use client"`) hydrate in the browser so you can use hooks and click handlers.',
    realWorldExample:
      'A product page fetches database records in a Server Component and only marks the interactive "Add to Cart" button as `"use client"`.',
    codeExamples: [
      {
        title: 'Example 1: Server Component Data Fetch',
        language: 'TSX',
        code: `export default async function ProductPage({ params }: { params: { id: string } }) {\n  const product = await db.product.findUnique({ where: { id: params.id } });\n  return <ProductView product={product} />;\n}`,
        expectedOutput: 'Runs on server; database client never ships to browser.',
      },
      {
        title: 'Example 2: Client Component Leaf',
        language: 'TSX',
        code: `'use client';\nimport { useState } from 'react';\nexport function LikeButton() {\n  const [likes, setLikes] = useState(0);\n  return <button onClick={() => setLikes((n) => n + 1)}>Likes: {likes}</button>;\n}`,
        expectedOutput: 'Interactive button hydrated on the client.',
      },
      {
        title: 'Example 3: ISR Time-Based Revalidation',
        language: 'TSX',
        code: `const res = await fetch('https://api.example.com/posts', {\n  next: { revalidate: 60 },\n});`,
        expectedOutput: 'Caches response and revalidates in background every 60s.',
      },
    ],
    interviewSpeakingAnswer:
      'In Next.js App Router, components are Server Components by default—they run on the server and ship zero component JS to the client. I push `"use client"` down to small interactive leaves when I need React hooks or browser APIs.',
    followUpQuestions: [
      'Can a Client Component import a Server Component directly?',
      'When would you use `revalidateTag` instead of time-based ISR?',
      'What is the difference between SSR and Streaming with Suspense?',
    ],
  },
  'wp-architecture-hooks': {
    id: 'wp-architecture-hooks',
    categoryId: 'wordpress',
    categoryName: 'WordPress',
    title: 'Architecture, Template Hierarchy & Hooks',
    level: 'beginner',
    estimatedMinutes: 35,
    coreQuestion: 'What is the difference between Actions and Filters in WordPress?',
    simpleHumanAnswer:
      'Actions let you run your own code at a specific moment (without returning anything), while Filters give you a value to modify and return.',
    realWorldExample:
      'You use an Action (`save_post`) to send a Slack notification when an article is published, and a Filter (`the_title`) to append a badge to post titles.',
    codeExamples: [
      {
        title: 'Example 1: Action Hook (wp_enqueue_scripts)',
        language: 'PHP',
        code: `add_action('wp_enqueue_scripts', function () {\n  wp_enqueue_style('theme-main', get_stylesheet_uri(), [], '1.0.0');\n});`,
        expectedOutput: 'Enqueues the theme stylesheet on front-end page loads.',
      },
      {
        title: 'Example 2: Filter Hook (the_content)',
        language: 'PHP',
        code: `add_filter('the_content', function ($content) {\n  if (is_single()) {\n    return $content . '<p>Thanks for reading!</p>';\n  }\n  return $content;\n});`,
        expectedOutput: 'Appends footer note to single post content.',
      },
      {
        title: 'Example 3: Safe Prepared Query with $wpdb',
        language: 'PHP',
        code: `global $wpdb;\n$results = $wpdb->get_results(\n  $wpdb->prepare("SELECT ID, post_title FROM {$wpdb->posts} WHERE post_status = %s", 'publish')\n);`,
        expectedOutput: 'Safely queries published posts without SQL injection risk.',
      },
    ],
    interviewSpeakingAnswer:
      'Actions let you execute custom side effects at WordPress lifecycle points using `do_action`, while Filters intercept, transform, and must return data via `apply_filters`. And for any user input, I always verify nonces, check `current_user_can()`, and use `$wpdb->prepare()`.',
    followUpQuestions: [
      'What happens if you forget to `return` a value inside a Filter callback?',
      'How does WordPress Template Hierarchy resolve `single-product.php`?',
      'Why do we sanitize on input and escape on output?',
    ],
  },
  'ai-rag-embeddings': {
    id: 'ai-rag-embeddings',
    categoryId: 'ai',
    categoryName: 'Artificial Intelligence',
    title: 'Embeddings, Vector DBs & RAG Pipelines',
    level: 'intermediate',
    estimatedMinutes: 45,
    coreQuestion: 'How does Retrieval-Augmented Generation (RAG) work?',
    simpleHumanAnswer:
      'RAG looks up the most relevant paragraphs from your own documents first, then hands those paragraphs to the AI model so it answers using real facts instead of guessing.',
    realWorldExample:
      'A company support bot embeds all help-center articles into a vector database, retrieves the top 3 matching sections for a user question, and asks the LLM to answer only from those sections.',
    codeExamples: [
      {
        title: 'Example 1: Cosine Similarity Helper',
        language: 'TypeScript',
        code: `function cosineSimilarity(a: number[], b: number[]): number {\n  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);\n  const magA = Math.hypot(...a);\n  const magB = Math.hypot(...b);\n  return dot / (magA * magB);\n}`,
        expectedOutput: 'Returns similarity score between -1 and 1.',
      },
      {
        title: 'Example 2: Overlapping Text Chunker',
        language: 'TypeScript',
        code: `function chunkText(text: string, size = 500, overlap = 100): string[] {\n  const chunks: string[] = [];\n  for (let i = 0; i < text.length; i += size - overlap) {\n    chunks.push(text.slice(i, i + size));\n  }\n  return chunks;\n}`,
        expectedOutput: 'Splits document into overlapping chunks preserving context.',
      },
      {
        title: 'Example 3: Grounded RAG System Prompt',
        language: 'TypeScript',
        code: `const prompt = \`Answer ONLY using the provided context.\nIf the answer is not in the context, say "I don't know".\nContext:\n\${retrievedChunks.join('\\n---\\n')}\`;`,
        expectedOutput: 'Reduces hallucinations by forcing source grounding.',
      },
    ],
    interviewSpeakingAnswer:
      'RAG converts documents into vector embeddings stored in a vector DB. At query time, we embed the user’s question, retrieve the top-K relevant chunks, and pass them as grounded context to the LLM. To reduce hallucinations, I use overlapping chunks, hybrid search, and explicit citations.',
    followUpQuestions: [
      'Why do we use chunk overlap when splitting documents?',
      'What is hybrid search (vector + BM25 keyword)?',
      'How do you evaluate a RAG pipeline?',
    ],
  },
  'ts-generics-narrowing': {
    id: 'ts-generics-narrowing',
    categoryId: 'typescript',
    categoryName: 'TypeScript',
    title: 'Generics, Type Narrowing & Guards',
    level: 'intermediate',
    estimatedMinutes: 40,
    coreQuestion: 'How do Generics and Type Narrowing work together in TypeScript?',
    simpleHumanAnswer:
      'Generics act like type placeholders so one function can work safely with any data type, while Type Narrowing checks what type a value actually is at runtime before you use it.',
    realWorldExample:
      'An `ApiResponse<T>` generic wraps any endpoint payload, and a discriminated union (`status: "ok" | "error"`) lets TypeScript narrow the exact shape.',
    codeExamples: [
      {
        title: 'Example 1: Generic API Wrapper',
        language: 'TypeScript',
        code: `interface ApiResult<T> {\n  ok: boolean;\n  data: T;\n}\nfunction wrap<T>(data: T): ApiResult<T> {\n  return { ok: true, data };\n}`,
        expectedOutput: 'Preserves exact type of `data` without `any`.',
      },
      {
        title: 'Example 2: Discriminated Union Narrowing',
        language: 'TypeScript',
        code: `type LoadState<T> =\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; message: string };\n\nfunction render(state: LoadState<string>) {\n  if (state.status === 'success') return state.data;\n  return state.status;\n}`,
        expectedOutput: 'TypeScript narrows `state.data` safely inside `if`.',
      },
      {
        title: 'Example 3: Custom Type Guard Predicate',
        language: 'TypeScript',
        code: `interface User { id: string; name: string }\nfunction isUser(val: unknown): val is User {\n  return typeof val === 'object' && val !== null && 'id' in val && 'name' in val;\n}`,
        expectedOutput: 'Safely narrows `unknown` to `User`.',
      },
    ],
    interviewSpeakingAnswer:
      'Generics let us write reusable functions and types like `ApiResponse<T>` without losing type safety, while type narrowing—using `typeof`, `in`, discriminated unions, or custom type guards—safely refines `unknown` runtime values into exact types.',
    followUpQuestions: [
      'Why is `unknown` safer than `any`?',
      'What is a discriminated union?',
      'How do `keyof` and `extends` constrain a generic parameter?',
    ],
  },
};

export function getTopicLessonById(id: string): TopicLesson | undefined {
  return (
    TOPIC_LESSONS[id] ??
    EXTRA_TOPIC_LESSONS[id] ??
    JS_LESSONS_PART_1[id] ??
    JS_LESSONS_PART_2[id]
  );
}
