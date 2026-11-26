import type { TopicLesson } from './topicLessonsFeed.js';

export const EXTRA_TOPIC_LESSONS: Record<string, TopicLesson> = {
  'js-arrays-objects': {
    id: 'js-arrays-objects',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'Arrays, Objects & Destructuring',
    level: 'beginner',
    estimatedMinutes: 35,
    coreQuestion: 'How do map, filter, reduce, and destructuring help write cleaner JavaScript?',
    simpleHumanAnswer:
      '`map` transforms every item, `filter` keeps items matching a condition, `reduce` combines items into a single value, and destructuring unpacks properties or elements cleanly in one line.',
    realWorldExample:
      'In an e-commerce cart, you `filter` in-stock items, `map` their display prices, and `reduce` them into a grand total.',
    codeExamples: [
      {
        title: 'Example 1: Filter & Map Pipeline',
        language: 'JavaScript',
        code: `const users = [\n  { name: 'Ali', active: true },\n  { name: 'Mia', active: false },\n  { name: 'Zed', active: true },\n];\nconst activeNames = users.filter((u) => u.active).map((u) => u.name);\nconsole.log(activeNames.join(', '));`,
        expectedOutput: 'Ali, Zed',
      },
      {
        title: 'Example 2: Reduce Cart Total',
        language: 'JavaScript',
        code: `const cart = [{ price: 20, qty: 2 }, { price: 15, qty: 1 }];\nconst total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);\nconsole.log(total);`,
        expectedOutput: '55',
      },
      {
        title: 'Example 3: Object & Array Destructuring with Defaults',
        language: 'JavaScript',
        code: `const config = { host: 'localhost' };\nconst { host, port = 4000 } = config;\nconst [first, second = 'fallback'] = ['JS'];\nconsole.log(host, port, first, second);`,
        expectedOutput: 'localhost 4000 JS fallback',
      },
    ],
    interviewSpeakingAnswer:
      'I prefer `map`, `filter`, and `reduce` over manual `for` loops because they are declarative and return new values without mutating the original array, which is essential in React state updates.',
    followUpQuestions: [
      'What is the difference between `forEach` and `map`?',
      'Why does `{ ...obj }` only create a shallow copy?',
      'How does `structuredClone` differ from `JSON.parse(JSON.stringify(obj))`?',
    ],
  },
  'js-this-prototypes': {
    id: 'js-this-prototypes',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'this, call/apply/bind & Prototypes',
    level: 'intermediate',
    estimatedMinutes: 40,
    coreQuestion: 'How is `this` determined, and how do call, apply, and bind work?',
    simpleHumanAnswer:
      'For regular functions, `this` depends on *how* the function is called. `call` and `apply` invoke the function immediately with a chosen `this`, while `bind` returns a new permanently bound function.',
    realWorldExample:
      'Borrowing `Array.prototype.slice` or locking `this` on a class method passed as a callback.',
    codeExamples: [
      {
        title: 'Example 1: call vs apply',
        language: 'JavaScript',
        code: `function intro(role, city) {\n  return \`\${this.name} - \${role} (\${city})\`;\n}\nconst dev = { name: 'Kiran' };\nconsole.log(intro.call(dev, 'Frontend', 'Pune'));\nconsole.log(intro.apply(dev, ['Fullstack', 'Delhi']));`,
        expectedOutput: 'Kiran - Frontend (Pune)\nKiran - Fullstack (Delhi)',
      },
      {
        title: 'Example 2: bind for Detached Callbacks',
        language: 'JavaScript',
        code: `const service = {\n  prefix: '[API]',\n  log(msg) { return \`\${this.prefix} \${msg}\`; },\n};\nconst boundLog = service.log.bind(service);\nconsole.log(boundLog('Ready'));`,
        expectedOutput: '[API] Ready',
      },
      {
        title: 'Example 3: Prototype Inheritance',
        language: 'JavaScript',
        code: `function Animal(name) { this.name = name; }\nAnimal.prototype.speak = function () { return this.name + ' makes a sound'; };\nconst dog = new Animal('Rex');\nconsole.log(dog.speak());`,
        expectedOutput: 'Rex makes a sound',
      },
    ],
    interviewSpeakingAnswer:
      '`this` in a normal function is determined at call time—either by the object before the dot, `new`, or `call`/`apply`/`bind`. `call` takes comma-separated args, `apply` takes an array, and `bind` returns a new function.',
    followUpQuestions: [
      'How does prototype chain lookup work when accessing a property?',
      'What does the `new` keyword do step by step?',
      'Can you override an arrow function’s `this` with `.call()`?',
    ],
  },
  'js-async-event-loop': {
    id: 'js-async-event-loop',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'Event Loop, Promises & Async/Await',
    level: 'intermediate',
    estimatedMinutes: 45,
    coreQuestion: 'How does the JavaScript Event Loop prioritize Promises vs setTimeout?',
    simpleHumanAnswer:
      'Synchronous code runs first, then all Promise microtasks run completely, and only then does the Event Loop pick up the next `setTimeout` macrotask.',
    realWorldExample:
      'Fetching user profile and notifications in parallel with `Promise.allSettled` so one failed widget never crashes the dashboard.',
    codeExamples: [
      {
        title: 'Example 1: Microtask vs Macrotask Order',
        language: 'JavaScript',
        code: `console.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');`,
        expectedOutput: 'A\nD\nC\nB',
      },
      {
        title: 'Example 2: async/await with try/catch',
        language: 'JavaScript',
        code: `async function loadUser() {\n  try {\n    const user = await Promise.resolve({ name: 'Neha' });\n    console.log('Loaded:', user.name);\n  } catch (err) {\n    console.log('Error:', err);\n  }\n}\nloadUser();`,
        expectedOutput: 'Loaded: Neha',
      },
      {
        title: 'Example 3: Promise.allSettled Resilience',
        language: 'JavaScript',
        code: `Promise.allSettled([\n  Promise.resolve('Profile OK'),\n  Promise.reject('Ads failed'),\n]).then((res) => console.log(res.map((r) => r.status).join(', ')));`,
        expectedOutput: 'fulfilled, rejected',
      },
    ],
    interviewSpeakingAnswer:
      'JavaScript executes synchronous code on the Call Stack, drains the entire Microtask Queue (`Promise.then` and `await` continuations) before taking one Macrotask (`setTimeout`), and repeats.',
    followUpQuestions: [
      'Compare `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`.',
      'What happens if a Promise rejects without a `.catch()` or `try/catch`?',
      'How do you cancel an in-flight `fetch` request?',
    ],
  },
  'js-performance-memory': {
    id: 'js-performance-memory',
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title: 'Memory, Debouncing, Throttling & FP',
    level: 'advanced',
    estimatedMinutes: 45,
    coreQuestion: 'How do debouncing, throttling, and WeakMap help JavaScript performance?',
    simpleHumanAnswer:
      'Debouncing waits until a user stops typing before running, throttling limits execution to once every N ms, and `WeakMap` lets unused object keys be garbage-collected automatically.',
    realWorldExample:
      'Debouncing a search bar API call by 300ms and throttling scroll progress tracking.',
    codeExamples: [
      {
        title: 'Example 1: Debounce Utility',
        language: 'JavaScript',
        code: `function debounce(fn, delay) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), delay);\n  };\n}\nconsole.log(typeof debounce(() => {}, 300));`,
        expectedOutput: 'function',
      },
      {
        title: 'Example 2: Throttle Utility',
        language: 'JavaScript',
        code: `function throttle(fn, limit) {\n  let last = 0;\n  return (...args) => {\n    const now = Date.now();\n    if (now - last >= limit) { last = now; return fn(...args); }\n  };\n}\nconst ping = throttle((x) => x, 1000);\nconsole.log(ping('ok'), ping('skip'));`,
        expectedOutput: 'ok undefined',
      },
      {
        title: 'Example 3: WeakMap Metadata Cache',
        language: 'JavaScript',
        code: `const meta = new WeakMap();\nlet obj = { id: 1 };\nmeta.set(obj, { visits: 3 });\nconsole.log(meta.get(obj).visits);`,
        expectedOutput: '3',
      },
    ],
    interviewSpeakingAnswer:
      'Debounce delays execution until activity pauses—great for search inputs—while throttle caps execution frequency during continuous events like scrolling. For memory safety, I clean up timers/listeners and use `WeakMap` when attaching metadata to objects.',
    followUpQuestions: [
      'What are common causes of memory leaks in JavaScript?',
      'Why are `WeakMap` keys required to be objects?',
      'How does mark-and-sweep garbage collection work?',
    ],
  },
  'react-fundamentals': {
    id: 'react-fundamentals',
    categoryId: 'react',
    categoryName: 'React.js',
    title: 'JSX, Components, Props & State',
    level: 'beginner',
    estimatedMinutes: 30,
    coreQuestion: 'What is the difference between Props and State in React?',
    simpleHumanAnswer:
      'Props are read-only inputs passed down from a parent component, while State is private data owned and updated inside the component itself.',
    realWorldExample:
      'A `ProductCard` receives `title` and `price` as props, and keeps `quantity` in its own `useState`.',
    codeExamples: [
      {
        title: 'Example 1: Props & Typed Component',
        language: 'TSX',
        code: `function Greeting({ name }: { name: string }) {\n  return <Text>Hello, {name}</Text>;\n}`,
        expectedOutput: 'Renders "Hello, <name>"',
      },
      {
        title: 'Example 2: Functional State Update',
        language: 'TSX',
        code: `const [count, setCount] = useState(0);\nconst increment = () => setCount((prev) => prev + 1);`,
        expectedOutput: 'Safely increments based on latest queued state.',
      },
      {
        title: 'Example 3: Lists with Stable Keys',
        language: 'TSX',
        code: `{items.map((item) => (\n  <ItemRow key={item.id} title={item.title} />\n))}`,
        expectedOutput: 'Uses unique `item.id` so React tracks rows accurately.',
      },
    ],
    interviewSpeakingAnswer:
      'Props flow one way from parent to child and are immutable inside the child. State is local, mutable via setter functions, and triggers a re-render whenever it changes.',
    followUpQuestions: [
      'Why should you use the functional updater `setCount(prev => prev + 1)`?',
      'What happens if you mutate state directly instead of calling `setState`?',
      'Why should you avoid array index as a `key`?',
    ],
  },
  'react-state-routing': {
    id: 'react-state-routing',
    categoryId: 'react',
    categoryName: 'React.js',
    title: 'State Management, Forms & Routing',
    level: 'intermediate',
    estimatedMinutes: 40,
    coreQuestion: 'How do you choose between Context API, Zustand, and Redux Toolkit?',
    simpleHumanAnswer:
      'Context is great for low-frequency globals like theme or auth; Zustand is lightweight for shared client state; Redux Toolkit shines in large teams needing strict actions and devtools.',
    realWorldExample:
      'Using Zustand with `persist` for learning progress and React Context for Light/Dark theme.',
    codeExamples: [
      {
        title: 'Example 1: Zustand Store Slice',
        language: 'TypeScript',
        code: `const useCounter = create<{ count: number; inc: () => void }>((set) => ({\n  count: 0,\n  inc: () => set((s) => ({ count: s.count + 1 })),\n}));`,
        expectedOutput: 'Only components selecting `count` re-render on `inc()`.',
      },
      {
        title: 'Example 2: Controlled Form Input',
        language: 'TSX',
        code: `const [email, setEmail] = useState('');\n<TextInput value={email} onChangeText={setEmail} />`,
        expectedOutput: 'React state is the single source of truth for input value.',
      },
      {
        title: 'Example 3: Context Consumer Hook',
        language: 'TSX',
        code: `const ThemeCtx = createContext<'light' | 'dark'>('light');\nconst mode = useContext(ThemeCtx);`,
        expectedOutput: 'Reads nearest Provider value cleanly.',
      },
    ],
    interviewSpeakingAnswer:
      'I keep server state in a data-fetching layer, local UI state in `useState`, low-frequency app config in Context, and shared client state in Zustand because selector subscriptions avoid Context’s full-tree re-renders.',
    followUpQuestions: [
      'Why can Context API cause unnecessary re-renders?',
      'What is the difference between controlled and uncontrolled forms?',
      'How does `useReducer` help with complex state transitions?',
    ],
  },
  'react-internals-perf': {
    id: 'react-internals-perf',
    categoryId: 'react',
    categoryName: 'React.js',
    title: 'Fiber, Reconciliation, RSC & Optimization',
    level: 'advanced',
    estimatedMinutes: 50,
    coreQuestion: 'How do you diagnose and fix slow React rendering performance?',
    simpleHumanAnswer:
      'Measure first with React DevTools Profiler, then prevent wasted re-renders by moving state down, memoizing heavy subtrees, virtualizing long lists, and code-splitting with `React.lazy`.',
    realWorldExample:
      'Moving a search input state into its own child component so typing does not re-render a 500-row chart.',
    codeExamples: [
      {
        title: 'Example 1: Lazy Loading with Suspense',
        language: 'TSX',
        code: `const HeavyChart = React.lazy(() => import('./HeavyChart'));\n<Suspense fallback={<LoadingState />}><HeavyChart /></Suspense>`,
        expectedOutput: 'Splits HeavyChart into its own async chunk.',
      },
      {
        title: 'Example 2: Error Boundary Fallback',
        language: 'TSX',
        code: `class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {\n  state = { hasError: false };\n  static getDerivedStateFromError() { return { hasError: true }; }\n  render() { return this.state.hasError ? <Text>Something broke</Text> : this.props.children; }\n}`,
        expectedOutput: 'Catches render errors in child tree without crashing app.',
      },
      {
        title: 'Example 3: useTransition for Non-Urgent Updates',
        language: 'TSX',
        code: `const [isPending, startTransition] = useTransition();\nstartTransition(() => setFilterQuery(text));`,
        expectedOutput: 'Keeps typing responsive while heavy list filters.',
      },
    ],
    interviewSpeakingAnswer:
      'Before adding `useMemo` everywhere, I profile with React DevTools, colocate state closer to where it is used, virtualize long lists, and use `Suspense` + lazy loading for heavy routes.',
    followUpQuestions: [
      'How does React Fiber schedule urgent vs transition updates?',
      'Why do Error Boundaries still require class components?',
      'What is hydration mismatch?',
    ],
  },
  'next-routing-layouts': {
    id: 'next-routing-layouts',
    categoryId: 'nextjs',
    categoryName: 'Next.js',
    title: 'App Router, Routing & Layouts',
    level: 'beginner',
    estimatedMinutes: 30,
    coreQuestion: 'How do `layout.tsx`, `template.tsx`, `loading.tsx`, and `error.tsx` work in Next.js App Router?',
    simpleHumanAnswer:
      '`layout.tsx` wraps child pages and keeps its state across navigation, `template.tsx` remounts on every route change, `loading.tsx` shows a Suspense fallback, and `error.tsx` catches route errors.',
    realWorldExample:
      'A persistent dashboard sidebar in `app/dashboard/layout.tsx` paired with a skeleton loader in `loading.tsx`.',
    codeExamples: [
      {
        title: 'Example 1: Dynamic Route Page',
        language: 'TSX',
        code: `export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  return <h1>Topic: {id}</h1>;\n}`,
        expectedOutput: 'Renders `/topic/<id>` dynamically.',
      },
      {
        title: 'Example 2: Shared Layout Shell',
        language: 'TSX',
        code: `export default function DashboardLayout({ children }: { children: React.ReactNode }) {\n  return <div className="shell"><Sidebar />{children}</div>;\n}`,
        expectedOutput: 'Preserves Sidebar state across nested page transitions.',
      },
      {
        title: 'Example 3: Route-Level Error Boundary',
        language: 'TSX',
        code: `'use client';\nexport default function Error({ reset }: { reset: () => void }) {\n  return <button onClick={reset}>Try again</button>;\n}`,
        expectedOutput: 'Recovers failed route segment without full reload.',
      },
    ],
    interviewSpeakingAnswer:
      'In Next.js App Router, folders define URL segments and special files like `layout.tsx`, `loading.tsx`, and `error.tsx` automatically wire shared shells, Suspense boundaries, and Error Boundaries.',
    followUpQuestions: [
      'When would you use `template.tsx` instead of `layout.tsx`?',
      'What are Route Groups `(marketing)` used for?',
      'How do Parallel Routes `@modal` work?',
    ],
  },
  'next-actions-security': {
    id: 'next-actions-security',
    categoryId: 'nextjs',
    categoryName: 'Next.js',
    title: 'Server Actions, Middleware, Auth & Performance',
    level: 'advanced',
    estimatedMinutes: 50,
    coreQuestion: 'How do you secure Next.js Server Actions and Middleware?',
    simpleHumanAnswer:
      'Treat every Server Action like a public API endpoint: authenticate the session inside the action, validate inputs with Zod, and never rely solely on Middleware for authorization.',
    realWorldExample:
      'Validating a form submission in a Server Action with Zod, checking `session.userId`, updating Postgres, and calling `revalidatePath()`.',
    codeExamples: [
      {
        title: 'Example 1: Validated Server Action',
        language: 'TypeScript',
        code: `'use server';\nexport async function createNote(formData: FormData) {\n  const title = String(formData.get('title') ?? '').trim();\n  if (!title) throw new Error('Title required');\n  // verify session + save to DB\n}`,
        expectedOutput: 'Executes securely on server with input validation.',
      },
      {
        title: 'Example 2: Route Handler (GET/POST)',
        language: 'TypeScript',
        code: `import { NextResponse } from 'next/server';\nexport async function GET() {\n  return NextResponse.json({ ok: true });\n}`,
        expectedOutput: 'Returns `{ "ok": true }` from `/api/...`.',
      },
      {
        title: 'Example 3: Middleware Redirect Guard',
        language: 'TypeScript',
        code: `export function middleware(req: NextRequest) {\n  if (!req.cookies.get('session')) {\n    return NextResponse.redirect(new URL('/login', req.url));\n  }\n}`,
        expectedOutput: 'Redirects unauthenticated requests before route renders.',
      },
    ],
    interviewSpeakingAnswer:
      'Server Actions are exposed as POST endpoints under the hood, so I always verify authentication, check permissions, and validate inputs with Zod inside the action itself, then call `revalidateTag` or `revalidatePath`.',
    followUpQuestions: [
      'Why is Middleware alone not enough for authorization?',
      'How does `next/image` optimize Core Web Vitals (LCP/CLS)?',
      'When do you use a Route Handler instead of a Server Action?',
    ],
  },
  'wp-data-rest': {
    id: 'wp-data-rest',
    categoryId: 'wordpress',
    categoryName: 'WordPress',
    title: 'CPTs, ACF, WP_Query, $wpdb & REST API',
    level: 'intermediate',
    estimatedMinutes: 45,
    coreQuestion: 'How do you register a Custom Post Type and query it efficiently with WP_Query?',
    simpleHumanAnswer:
      'Use `register_post_type()` on `init` to create a CPT, and use `WP_Query` with `no_found_rows => true` when you do not need pagination so MySQL skips extra row counting.',
    realWorldExample:
      'Creating a `course` CPT with ACF fields and exposing a custom WP REST API endpoint for a mobile or React frontend.',
    codeExamples: [
      {
        title: 'Example 1: Register Custom Post Type',
        language: 'PHP',
        code: `add_action('init', function () {\n  register_post_type('course', [\n    'label' => 'Courses',\n    'public' => true,\n    'show_in_rest' => true,\n    'supports' => ['title', 'editor', 'thumbnail'],\n  ]);\n});`,
        expectedOutput: 'Registers `course` CPT with Gutenberg & REST API support.',
      },
      {
        title: 'Example 2: Optimized WP_Query',
        language: 'PHP',
        code: `$q = new WP_Query([\n  'post_type' => 'course',\n  'posts_per_page' => 6,\n  'no_found_rows' => true,\n]);`,
        expectedOutput: 'Fetches 6 courses without `SQL_CALC_FOUND_ROWS` overhead.',
      },
      {
        title: 'Example 3: Custom WP REST API Route',
        language: 'PHP',
        code: `add_action('rest_api_init', function () {\n  register_rest_route('app/v1', '/courses', [\n    'methods' => 'GET',\n    'callback' => fn() => rest_ensure_response(['ok' => true]),\n    'permission_callback' => '__return_true',\n  ]);\n});`,
        expectedOutput: 'Exposes `/wp-json/app/v1/courses`.',
      },
    ],
    interviewSpeakingAnswer:
      'I register CPTs with `show_in_rest => true` for block editor and REST support, optimize `WP_Query` with `no_found_rows` when pagination is not needed, and always define a `permission_callback` on custom REST routes.',
    followUpQuestions: [
      'Why is `meta_query` slow on large `wp_postmeta` tables?',
      'When should you use a Custom Taxonomy instead of Post Meta?',
      'How do you register an ACF-powered Gutenberg block?',
    ],
  },
  'wp-woocommerce-headless': {
    id: 'wp-woocommerce-headless',
    categoryId: 'wordpress',
    categoryName: 'WordPress',
    title: 'WooCommerce, Security, Caching & Headless WP',
    level: 'advanced',
    estimatedMinutes: 50,
    coreQuestion: 'How do you optimize WooCommerce and build Headless WordPress with React/Next.js?',
    simpleHumanAnswer:
      'Cache expensive queries with Transients or Redis Object Cache, avoid running heavy queries on every page load, and in Headless WP fetch from WP REST API or WPGraphQL with Next.js ISR.',
    realWorldExample:
      'Using WooCommerce hooks (`woocommerce_checkout_process`) for custom validation and webhooks to trigger Next.js `revalidateTag`.',
    codeExamples: [
      {
        title: 'Example 1: Transient Caching',
        language: 'PHP',
        code: `$data = get_transient('featured_courses');\nif ($data === false) {\n  $data = fetch_expensive_courses();\n  set_transient('featured_courses', $data, HOUR_IN_SECONDS);\n}`,
        expectedOutput: 'Caches result for 1 hour in object cache / options.',
      },
      {
        title: 'Example 2: WooCommerce Order Hook',
        language: 'PHP',
        code: `add_action('woocommerce_thankyou', function ($order_id) {\n  $order = wc_get_order($order_id);\n  // Trigger CRM sync or webhook\n});`,
        expectedOutput: 'Runs custom integration after order completion.',
      },
      {
        title: 'Example 3: Secure AJAX Nonce + Capability',
        language: 'PHP',
        code: `check_ajax_referer('save_prefs_nonce', 'security');\nif (!current_user_can('manage_options')) {\n  wp_send_json_error('Forbidden', 403);\n}`,
        expectedOutput: 'Blocks CSRF and unauthorized users.',
      },
    ],
    interviewSpeakingAnswer:
      'For high-traffic WordPress and WooCommerce sites, I combine Redis persistent object caching, Transients, indexed queries, and non-blocking cron/Action Scheduler jobs. In Headless WP, Next.js ISR + WordPress webhooks give both fast pages and instant content updates.',
    followUpQuestions: [
      'Why does WooCommerce use Action Scheduler instead of standard WP-Cron for heavy tasks?',
      'How do you prevent `wp_options` autoload bloat?',
      'How do you handle authentication in Headless WordPress?',
    ],
  },
  'ai-llm-prompting': {
    id: 'ai-llm-prompting',
    categoryId: 'ai',
    categoryName: 'Artificial Intelligence',
    title: 'LLMs, Tokens & Prompt Engineering',
    level: 'beginner',
    estimatedMinutes: 30,
    coreQuestion: 'What are tokens, context windows, temperature, and structured outputs in LLMs?',
    simpleHumanAnswer:
      'Tokens are sub-word chunks LLMs read and bill by, the context window is the max tokens per request, temperature controls randomness, and structured outputs force valid JSON.',
    realWorldExample:
      'Setting `temperature: 0.1` and a JSON Schema for an interview answer grader so the UI always receives predictable fields.',
    codeExamples: [
      {
        title: 'Example 1: Structured JSON Prompting',
        language: 'TypeScript',
        code: `const body = {\n  model: 'gpt-4o-mini',\n  temperature: 0.2,\n  response_format: { type: 'json_object' },\n  messages: [\n    { role: 'system', content: 'Return JSON with { score, feedback }.' },\n    { role: 'user', content: 'Explain closures.' },\n  ],\n};`,
        expectedOutput: 'Forces machine-parseable JSON output.',
      },
      {
        title: 'Example 2: Few-Shot Prompting',
        language: 'TypeScript',
        code: `const prompt = \`Classify difficulty:\nQ: What is let? -> beginner\nQ: Explain Fiber -> advanced\nQ: What is a closure? ->\`;`,
        expectedOutput: 'intermediate',
      },
      {
        title: 'Example 3: Zod Runtime Output Guard',
        language: 'TypeScript',
        code: `const GradeSchema = z.object({ score: z.number().min(1).max(10), feedback: z.string() });\nconst parsed = GradeSchema.parse(JSON.parse(rawModelOutput));`,
        expectedOutput: 'Guarantees type-safe LLM responses before UI rendering.',
      },
    ],
    interviewSpeakingAnswer:
      'LLMs process text as tokens inside a fixed context window. For production apps, I use clear system prompts, low temperature for deterministic tasks, JSON/Schema outputs, and runtime Zod validation.',
    followUpQuestions: [
      'Why do LLM costs and latency grow with larger prompts?',
      'When would you use few-shot examples vs zero-shot prompting?',
      'Why should you never trust raw LLM JSON without schema validation?',
    ],
  },
  'ai-agents-architecture': {
    id: 'ai-agents-architecture',
    categoryId: 'ai',
    categoryName: 'Artificial Intelligence',
    title: 'AI Agents, Memory, Security & Evaluation',
    level: 'advanced',
    estimatedMinutes: 50,
    coreQuestion: 'How do AI Agents, function calling, memory, and prompt-injection defenses work?',
    simpleHumanAnswer:
      'An AI Agent uses an LLM in a loop with tools (function calling) and memory to plan and act. To keep it safe, validate every tool call on the server and treat user/retrieved text as untrusted.',
    realWorldExample:
      'An AI Interview Coach backend that evaluates answers, calls a curriculum lookup tool, stores session memory in Postgres, and blocks prompt injection.',
    codeExamples: [
      {
        title: 'Example 1: Tool / Function Definition',
        language: 'TypeScript',
        code: `const tools = [{\n  type: 'function',\n  function: {\n    name: 'lookupTopicRubric',\n    parameters: { type: 'object', properties: { topicId: { type: 'string' } }, required: ['topicId'] },\n  },\n}];`,
        expectedOutput: 'Allows LLM to request structured tool execution.',
      },
      {
        title: 'Example 2: Bounded Agent Loop Guard',
        language: 'TypeScript',
        code: `const MAX_STEPS = 5;\nfor (let step = 0; step < MAX_STEPS; step++) {\n  // call model -> execute validated tool -> break when final answer\n}`,
        expectedOutput: 'Prevents infinite tool-calling loops and runaway costs.',
      },
      {
        title: 'Example 3: Server-Side Proxy Security',
        language: 'TypeScript',
        code: `// Mobile calls Express proxy; Express attaches process.env.AI_API_KEY\n// Never put AI keys in EXPO_PUBLIC_*`,
        expectedOutput: 'Protects API keys from client bundle extraction.',
      },
    ],
    interviewSpeakingAnswer:
      'AI Agents combine an LLM with tool calling, short/long-term memory, and bounded execution loops. On the security side, I keep API keys on the backend, validate tool arguments with Zod, enforce step/rate limits, and isolate untrusted user text from system instructions.',
    followUpQuestions: [
      'How do you prevent prompt injection in a RAG or Agent app?',
      'What is the difference between a fixed workflow and an autonomous agent?',
      'How do you evaluate agent reliability in CI?',
    ],
  },
  'ts-fundamentals': {
    id: 'ts-fundamentals',
    categoryId: 'typescript',
    categoryName: 'TypeScript',
    title: 'Primitives, Interfaces, Types & Unions',
    level: 'beginner',
    estimatedMinutes: 30,
    coreQuestion: 'What is the difference between `interface` and `type` in TypeScript?',
    simpleHumanAnswer:
      'Both describe object shapes, but `interface` supports declaration merging and `extends`, while `type` can also define unions, intersections, primitives, and tuples.',
    realWorldExample:
      'Using `interface` for component props and `type` for union states like `type Status = "idle" | "loading" | "error"`.',
    codeExamples: [
      {
        title: 'Example 1: Interface vs Union Type',
        language: 'TypeScript',
        code: `interface User { id: string; name: string }\ntype Role = 'admin' | 'member';\nconst u: User & { role: Role } = { id: '1', name: 'Sam', role: 'admin' };`,
        expectedOutput: 'Combines object interface with literal union role.',
      },
      {
        title: 'Example 2: Tuples & Readonly Arrays',
        language: 'TypeScript',
        code: `type Pair = readonly [string, number];\nconst score: Pair = ['JS', 95];`,
        expectedOutput: 'Enforces exact 2-element `[string, number]` tuple.',
      },
      {
        title: 'Example 3: Exhaustive Union Check',
        language: 'TypeScript',
        code: `type Level = 'beginner' | 'intermediate' | 'advanced';\nfunction label(l: Level): string {\n  switch (l) {\n    case 'beginner': return 'B';\n    case 'intermediate': return 'I';\n    case 'advanced': return 'A';\n  }\n}`,
        expectedOutput: 'Compiler errors if any `Level` case is missed.',
      },
    ],
    interviewSpeakingAnswer:
      'I use `interface` for object contracts and React props, and `type` for unions, tuples, and utility compositions. Both are erased at compile time and have zero runtime cost.',
    followUpQuestions: [
      'Why are union types often preferred over TypeScript `enum`?',
      'What does `as const` do?',
      'What is `never` used for in exhaustive switches?',
    ],
  },
  'ts-advanced-architecture': {
    id: 'ts-advanced-architecture',
    categoryId: 'typescript',
    categoryName: 'TypeScript',
    title: 'Mapped/Conditional Types, infer & React/Next.js',
    level: 'advanced',
    estimatedMinutes: 50,
    coreQuestion: 'How do Mapped Types, Conditional Types, and `infer` work in TypeScript?',
    simpleHumanAnswer:
      'Mapped types loop over keys of an object type to transform them, conditional types act like `if/else` at the type level, and `infer` extracts a nested type automatically.',
    realWorldExample:
      'Extracting the resolved return type of an async API function with `Awaited<ReturnType<typeof fetchUser>>`.',
    codeExamples: [
      {
        title: 'Example 1: Built-in Utility Types',
        language: 'TypeScript',
        code: `interface Topic { id: string; title: string; level: string }\ntype TopicPreview = Pick<Topic, 'id' | 'title'>;\ntype TopicPatch = Partial<Omit<Topic, 'id'>>;`,
        expectedOutput: 'Derives preview & patch types without duplication.',
      },
      {
        title: 'Example 2: Custom Mapped Type',
        language: 'TypeScript',
        code: `type Nullable<T> = { [K in keyof T]: T[K] | null };\ntype NullableUser = Nullable<{ name: string; age: number }>;`,
        expectedOutput: '{ name: string | null; age: number | null }',
      },
      {
        title: 'Example 3: Conditional Type with infer',
        language: 'TypeScript',
        code: `type UnwrapArray<T> = T extends Array<infer U> ? U : T;\ntype Item = UnwrapArray<string[]>; // string`,
        expectedOutput: 'Extracts `string` from `string[]`.',
      },
    ],
    interviewSpeakingAnswer:
      'Utility, mapped, and conditional types let us derive DTOs, form patches, and API response types from one source of truth instead of duplicating interfaces across frontend and backend.',
    followUpQuestions: [
      'How do `keyof` and `typeof` work together on a `const` object?',
      'What is distributive conditional typing?',
      'How do `.d.ts` declaration files work?',
    ],
  },
};
