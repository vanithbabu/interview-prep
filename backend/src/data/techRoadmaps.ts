import type { BackendTopicSummary } from './categoriesFeed.js';

type TechId = 'react' | 'nextjs' | 'wordpress' | 'ai' | 'typescript';
type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'coding';

function topic(
  categoryId: TechId,
  id: string,
  title: string,
  level: Level,
  description: string,
  estimatedMinutes = 35
): BackendTopicSummary {
  return {
    id,
    categoryId,
    slug: id,
    title,
    level,
    estimatedMinutes,
    description,
    exampleCount: 50,
  };
}

export const REACT_TOPICS: BackendTopicSummary[] = [
  // Level 1 – Beginner (1–8)
  topic('react', 'react-fundamentals', '1. React Fundamentals', 'beginner', 'Component-driven UI, declarative rendering, and unidirectional data flow.', 25),
  topic('react', 'react-jsx', '2. JSX', 'beginner', 'JSX syntax, expressions in curly braces, fragments, and Babel compilation.', 25),
  topic('react', 'react-components', '3. Components', 'beginner', 'Functional components, composition, children prop, and pure rendering.', 30),
  topic('react', 'react-props-state', '4. Props & State', 'beginner', 'Read-only props vs mutable local state and lifting state up.', 30),
  topic('react', 'react-conditional', '5. Conditional Rendering', 'beginner', 'Ternaries, logical && pitfalls (0 rendering), and early returns.', 25),
  topic('react', 'react-lists-keys', '6. Lists & Keys', 'beginner', 'Rendering arrays with .map() and why stable unique keys matter.', 30),
  topic('react', 'react-events', '7. Event Handling', 'beginner', 'Synthetic events, passing arguments, and preventing default behavior.', 25),
  topic('react', 'react-lifecycle', '8. Component Lifecycle', 'beginner', 'Mount, update, unmount phases and how hooks model lifecycle.', 30),

  // Level 2 – Intermediate (9–19)
  topic('react', 'react-usestate', '9. useState', 'intermediate', 'Functional updates, lazy initialization, and batching.', 30),
  topic('react', 'react-useeffect', '10. useEffect', 'intermediate', 'Dependency arrays, cleanup functions, and avoiding infinite loops.', 40),
  topic('react', 'react-useref', '11. useRef', 'intermediate', 'DOM/native element refs and mutable values without re-renders.', 30),
  topic('react', 'react-hooks', '12. useMemo & useCallback', 'intermediate', 'Referential equality, derived value caching, and React.memo.', 40),
  topic('react', 'react-usecontext', '13. useContext', 'intermediate', 'Sharing theme/auth without prop drilling and avoiding over-rendering.', 30),
  topic('react', 'react-usereducer', '14. useReducer', 'intermediate', 'Predictable state transitions with actions and reducer functions.', 35),
  topic('react', 'react-custom-hooks', '15. Custom Hooks', 'intermediate', 'Extracting reusable stateful logic like useDebounce and useFetch.', 40),
  topic('react', 'react-router', '16. React Router', 'intermediate', 'Nested routes, URL params, navigation guards, and code splitting.', 35),
  topic('react', 'react-forms', '17. Forms & Validation', 'intermediate', 'Controlled vs uncontrolled inputs, React Hook Form, and Zod.', 40),
  topic('react', 'react-api-integration', '18. API Integration', 'intermediate', 'Loading/error states, AbortController, and TanStack Query caching.', 40),
  topic('react', 'react-state-routing', '19. State Management Overview', 'intermediate', 'Choosing between local state, Context, Zustand, and Redux.', 35),

  // Level 3 – Advanced (20–27)
  topic('react', 'react-redux', '20. Redux & Redux Toolkit', 'advanced', 'Slices, createAsyncThunk, RTK Query, and normalized state.', 45),
  topic('react', 'react-zustand', '21. Zustand', 'advanced', 'Minimalist stores, selector subscriptions, and persist middleware.', 35),
  topic('react', 'react-context-patterns', '22. Context API Patterns', 'advanced', 'Splitting state/dispatch contexts and provider composition.', 35),
  topic('react', 'react-reconciliation', '23. React Reconciliation', 'advanced', 'Diffing heuristics, element type changes, and key reconciliation.', 40),
  topic('react', 'react-virtual-dom', '24. Virtual DOM', 'advanced', 'How React batches updates and minimizes real DOM mutations.', 35),
  topic('react', 'react-fiber', '25. Fiber Architecture', 'advanced', 'Incremental rendering, priority lanes, and work-in-progress trees.', 45),
  topic('react', 'react-rendering-behavior', '26. Rendering Behavior', 'advanced', 'Parent-child re-renders, StrictMode double-invoke, and batching.', 40),
  topic('react', 'react-internals-perf', '27. Performance Optimization', 'advanced', 'Profiling, list virtualization, state colocation, and transitions.', 45),

  // Level 4 – Expert & Senior (28–33)
  topic('react', 'react-lazy-loading', '28. Lazy Loading', 'expert', 'React.lazy, dynamic import(), and route-based bundle splitting.', 35),
  topic('react', 'react-suspense', '29. Suspense', 'expert', 'Declarative loading boundaries and streaming data integration.', 35),
  topic('react', 'react-error-boundaries', '30. Error Boundaries', 'expert', 'Catching subtree errors gracefully with fallback UI and recovery.', 35),
  topic('react', 'react-rsc', '31. React Server Components', 'expert', 'Zero-bundle server rendering, serialization boundaries, and streaming.', 45),
  topic('react', 'react-testing', '32. Testing', 'expert', 'React Testing Library, user-centric queries, mocking, and async tests.', 40),
  topic('react', 'react-security-arch', '33. Security & Architecture', 'expert', 'XSS prevention, feature-based architecture, and compound components.', 45),

  // Level 5 – Coding & Scenarios (34–35)
  topic('react', 'react-coding-hooks', '34. Custom Hooks Coding', 'coding', 'Implementing useDebounce, usePrevious, and useInfiniteScroll.', 45),
  topic('react', 'react-senior-scenarios', '35. Senior Interview Scenarios', 'coding', 'Diagnosing stale closures, race conditions, and slow tables.', 50),
];

export const NEXTJS_TOPICS: BackendTopicSummary[] = [
  // Level 1 – Beginner (1–7)
  topic('nextjs', 'next-intro', '1. Next.js Introduction', 'beginner', 'Full-stack React framework, hybrid rendering, and zero-config DX.', 20),
  topic('nextjs', 'next-setup', '2. Project Setup', 'beginner', 'create-next-app, tsconfig, next.config, and folder conventions.', 25),
  topic('nextjs', 'next-pages-router', '3. Pages Router', 'beginner', 'Legacy pages/ directory, getServerSideProps, and getStaticProps.', 30),
  topic('nextjs', 'next-app-router', '4. App Router', 'beginner', 'app/ directory, Server-first defaults, and React 19 features.', 35),
  topic('nextjs', 'next-routing-layouts', '5. File-Based Routing', 'beginner', 'page.tsx, route groups, and nested URL segments.', 30),
  topic('nextjs', 'next-dynamic-routes', '6. Dynamic Routes', 'beginner', '[slug], [...catchAll], and generateStaticParams.', 30),
  topic('nextjs', 'next-layouts-templates', '7. Layouts & Templates', 'beginner', 'Persistent layout.tsx vs remounting template.tsx shells.', 30),

  // Level 2 – Intermediate (8–16)
  topic('nextjs', 'next-server-components', '8. Server Components', 'intermediate', 'Direct DB access, zero client JS, and async components.', 40),
  topic('nextjs', 'next-client-components', '9. Client Components', 'intermediate', '"use client" boundaries, hooks, and browser APIs.', 35),
  topic('nextjs', 'next-ssr', '10. SSR (Server-Side Rendering)', 'intermediate', 'Per-request dynamic rendering and personalized HTML.', 35),
  topic('nextjs', 'next-ssg', '11. SSG (Static Site Generation)', 'intermediate', 'Build-time HTML generation for blogs, docs, and marketing.', 30),
  topic('nextjs', 'next-isr', '12. ISR (Incremental Static Regeneration)', 'intermediate', 'Time-based & on-demand background revalidation.', 35),
  topic('nextjs', 'next-csr', '13. CSR (Client-Side Rendering)', 'intermediate', 'When to fetch on the client (dashboards, live feeds).', 25),
  topic('nextjs', 'next-rendering-rsc', '14. Data Fetching & Caching', 'intermediate', 'fetch caching, React cache(), and parallel data loading.', 40),
  topic('nextjs', 'next-loading-states', '15. Loading States', 'intermediate', 'loading.tsx instant skeletons and Suspense boundaries.', 25),
  topic('nextjs', 'next-error-handling', '16. Error Handling', 'intermediate', 'error.tsx, global-error.tsx, and notFound() recovery.', 30),

  // Level 3 – Advanced (17–23)
  topic('nextjs', 'next-server-actions', '17. Server Actions', 'advanced', '"use server" mutations, Zod validation, and useActionState.', 45),
  topic('nextjs', 'next-api-routes', '18. API Routes (Pages)', 'advanced', 'Legacy pages/api handlers and request/response helpers.', 25),
  topic('nextjs', 'next-route-handlers', '19. Route Handlers', 'advanced', 'route.ts GET/POST/webhooks, cookies, and streaming responses.', 40),
  topic('nextjs', 'next-middleware', '20. Middleware & Proxy', 'advanced', 'Edge request interception, redirects, and header rewrites.', 40),
  topic('nextjs', 'next-caching-revalidation', '21. Caching & Revalidation', 'advanced', 'revalidatePath, revalidateTag, and Router/Full Route Cache.', 45),
  topic('nextjs', 'next-seo-metadata', '22. Metadata & SEO', 'advanced', 'Static/dynamic generateMetadata, sitemap, and OpenGraph.', 30),
  topic('nextjs', 'next-image-font', '23. Image & Font Optimization', 'advanced', 'next/image LCP/CLS prevention and next/font zero-layout-shift.', 30),

  // Level 4 – Expert & Senior (24–28)
  topic('nextjs', 'next-auth', '24. Authentication', 'expert', 'Auth.js / JWT sessions, HttpOnly cookies, and OAuth flows.', 45),
  topic('nextjs', 'next-authorization', '25. Authorization & Security', 'expert', 'DAL checks, securing Server Actions, and CSRF protection.', 40),
  topic('nextjs', 'next-env-vars', '26. Environment Variables', 'expert', 'Server-only secrets vs NEXT_PUBLIC_* build-time inlining.', 25),
  topic('nextjs', 'next-streaming', '27. Streaming & Suspense', 'expert', 'Progressive HTML streaming and avoiding slow TTFB.', 40),
  topic('nextjs', 'next-actions-security', '28. Deployment & Performance', 'expert', 'Vercel, Docker standalone builds, Edge vs Node runtime.', 45),

  // Level 5 – Architecture & Scenarios (29–30)
  topic('nextjs', 'next-architecture', '29. Next.js Architecture', 'coding', 'Monorepos, feature modules, and BFF patterns.', 45),
  topic('nextjs', 'next-senior-questions', '30. Senior Interview Scenarios', 'coding', 'Debugging stale cache, hydration mismatches, and N+1 waterfalls.', 50),
];

export const WORDPRESS_TOPICS: BackendTopicSummary[] = [
  // Level 1 – Beginner (1–6)
  topic('wordpress', 'wp-fundamentals', '1. WordPress Fundamentals', 'beginner', 'CMS core, PHP + MySQL stack, and ecosystem overview.', 25),
  topic('wordpress', 'wp-installation', '2. Installation & Setup', 'beginner', 'wp-config.php, local dev (LocalWP/Docker), and environments.', 25),
  topic('wordpress', 'wp-architecture', '3. WordPress Architecture', 'beginner', 'wp-content, wp-includes, wp-admin, and request lifecycle.', 30),
  topic('wordpress', 'wp-themes', '4. Themes & Child Themes', 'beginner', 'style.css headers, functions.php, and safe child theme overrides.', 35),
  topic('wordpress', 'wp-template-hierarchy', '5. Template Hierarchy', 'beginner', 'How WordPress resolves single, archive, page, and 404 templates.', 35),
  topic('wordpress', 'wp-shortcodes', '6. Shortcodes', 'beginner', 'Registering [shortcodes] with attributes and output buffering.', 25),

  // Level 2 – Intermediate (7–13)
  topic('wordpress', 'wp-plugins', '7. Plugin Development', 'intermediate', 'Plugin headers, activation/deactivation hooks, and OOP structure.', 40),
  topic('wordpress', 'wp-architecture-hooks', '8. Hooks Overview', 'intermediate', 'Event-driven WordPress execution and hook priority/args.', 30),
  topic('wordpress', 'wp-actions-filters', '9. Actions & Filters', 'intermediate', 'do_action vs apply_filters and removing core hooks.', 35),
  topic('wordpress', 'wp-cpt', '10. Custom Post Types', 'intermediate', 'register_post_type, rewrite rules, and REST API exposure.', 35),
  topic('wordpress', 'wp-taxonomies', '11. Custom Taxonomies', 'intermediate', 'Hierarchical categories vs flat tags with register_taxonomy.', 30),
  topic('wordpress', 'wp-custom-fields', '12. Custom Fields & Meta', 'intermediate', 'get_post_meta, update_post_meta, and meta box saving.', 35),
  topic('wordpress', 'wp-acf', '13. Advanced Custom Fields (ACF)', 'intermediate', 'Field groups, repeaters, ACF JSON sync, and ACF Blocks.', 40),

  // Level 3 – Advanced (14–20)
  topic('wordpress', 'wp-gutenberg', '14. Gutenberg Blocks', 'advanced', 'block.json, @wordpress/scripts, and dynamic vs static blocks.', 45),
  topic('wordpress', 'wp-data-rest', '15. WP_Query', 'advanced', 'Custom loops, meta/tax queries, pagination, and wp_reset_postdata.', 40),
  topic('wordpress', 'wp-rest-api', '16. WP REST API', 'advanced', 'Custom endpoints, schema validation, and permission_callback.', 45),
  topic('wordpress', 'wp-database', '17. Database Structure', 'advanced', 'wp_posts, wp_postmeta, wp_options, and wp_users relationships.', 35),
  topic('wordpress', 'wp-wpdb', '18. $wpdb & Prepared SQL', 'advanced', '$wpdb->prepare(), get_results, and preventing SQL injection.', 35),
  topic('wordpress', 'wp-roles', '19. User Roles & Capabilities', 'advanced', 'current_user_can(), custom roles, and granular permissions.', 30),
  topic('wordpress', 'wp-auth', '20. Authentication', 'advanced', 'Cookie auth, Application Passwords, and JWT for headless apps.', 35),

  // Level 4 – Expert & Senior (21–29)
  topic('wordpress', 'wp-woocommerce', '21. WooCommerce Basics', 'expert', 'Products, orders (HPOS), cart/checkout hooks, and templates.', 40),
  topic('wordpress', 'wp-woocommerce-custom', '22. Custom WooCommerce Dev', 'expert', 'Custom payment gateways, shipping methods, and order meta.', 45),
  topic('wordpress', 'wp-cron', '23. Cron Jobs & Action Scheduler', 'expert', 'wp_schedule_event caveats vs real system cron and queues.', 35),
  topic('wordpress', 'wp-caching', '24. Caching', 'expert', 'Transients API, Redis Object Cache, and full-page CDN caching.', 40),
  topic('wordpress', 'wp-performance', '25. Performance Optimization', 'expert', 'Autoload bloat, Query Monitor, asset deferring, and Core Web Vitals.', 40),
  topic('wordpress', 'wp-security', '26. WordPress Security', 'expert', 'Nonces, sanitize_*, esc_*, file permissions, and hardening.', 45),
  topic('wordpress', 'wp-debugging', '27. Debugging', 'expert', 'WP_DEBUG, error_log, Query Monitor, and Xdebug.', 30),
  topic('wordpress', 'wp-deployment', '28. Deployment & CI/CD', 'expert', 'Composer/Bedrock, WP-CLI, database migrations, and staging.', 35),
  topic('wordpress', 'wp-woocommerce-headless', '29. Headless WordPress & React', 'expert', 'WPGraphQL / REST + Next.js ISR and webhook revalidation.', 45),

  // Level 5 – Scenarios (30)
  topic('wordpress', 'wp-senior-scenarios', '30. Advanced Interview Scenarios', 'coding', 'Fixing slow meta_query, securing AJAX, and scaling WooCommerce.', 50),
];

export const AI_TOPICS: BackendTopicSummary[] = [
  // Level 1 – Beginner (1–6)
  topic('ai', 'ai-fundamentals', '1. AI Fundamentals', 'beginner', 'Symbolic AI vs ML, narrow AI, and modern AI capabilities.', 20),
  topic('ai', 'ai-ml-basics', '2. Machine Learning Basics', 'beginner', 'Supervised, unsupervised, training vs inference, and overfitting.', 25),
  topic('ai', 'ai-dl-fundamentals', '3. Deep Learning Fundamentals', 'beginner', 'Neural networks, layers, weights, and transformer architecture.', 30),
  topic('ai', 'ai-genai', '4. Generative AI', 'beginner', 'How generative models predict next tokens and synthesize content.', 25),
  topic('ai', 'ai-llms', '5. Large Language Models', 'beginner', 'Pre-training, instruction fine-tuning, RLHF, and model trade-offs.', 30),
  topic('ai', 'ai-llm-prompting', '6. Tokens & Context Windows', 'beginner', 'Tokenization, context limits, latency, and cost estimation.', 30),

  // Level 2 – Intermediate (7–12)
  topic('ai', 'ai-prompt-engineering', '7. Prompt Engineering', 'intermediate', 'Zero-shot, few-shot, chain-of-thought, and delimiters.', 35),
  topic('ai', 'ai-system-prompts', '8. System Prompts', 'intermediate', 'Role framing, guardrails, tone control, and output rules.', 30),
  topic('ai', 'ai-apis', '9. AI APIs & Streaming', 'intermediate', 'REST vs SSE streaming responses, temperature, and max_tokens.', 35),
  topic('ai', 'ai-openai', '10. OpenAI / Local LLM Integration', 'intermediate', 'Chat completions, OpenAI-compatible Ollama APIs, and retries.', 35),
  topic('ai', 'ai-structured-outputs', '11. Structured Outputs', 'intermediate', 'JSON mode, JSON Schema enforcement, and Zod parsing.', 35),
  topic('ai', 'ai-function-calling', '12. Function Calling & Tools', 'intermediate', 'Defining tool schemas so LLMs trigger validated backend actions.', 40),

  // Level 3 – Advanced (13–19)
  topic('ai', 'ai-embeddings', '13. Embeddings', 'advanced', 'Dense vector representations, cosine similarity, and dimensions.', 35),
  topic('ai', 'ai-vector-dbs', '14. Vector Databases', 'advanced', 'pgvector, Pinecone, Qdrant, HNSW indexing, and metadata filters.', 40),
  topic('ai', 'ai-semantic-search', '15. Semantic Search', 'advanced', 'Vector similarity vs BM25 keyword search and hybrid re-ranking.', 40),
  topic('ai', 'ai-rag-embeddings', '16. Retrieval-Augmented Generation (RAG)', 'advanced', 'Document chunking, overlap, retrieval, and grounded prompting.', 45),
  topic('ai', 'ai-agents', '17. AI Agents', 'advanced', 'ReAct reasoning loops, planning, and tool selection.', 40),
  topic('ai', 'ai-agent-workflows', '18. Agent Workflows', 'advanced', 'Deterministic chains vs autonomous loops and bounded retries.', 40),
  topic('ai', 'ai-memory', '19. Memory in AI Applications', 'advanced', 'Sliding window history, summarization, and long-term vector memory.', 35),

  // Level 4 – Expert & Senior (20–23)
  topic('ai', 'ai-architecture', '20. AI Application Architecture', 'expert', 'Backend proxies, rate limiting, caching, and cost control.', 45),
  topic('ai', 'ai-security', '21. AI Security', 'expert', 'Prompt injection defense, PII redaction, and API key isolation.', 40),
  topic('ai', 'ai-evaluation', '22. Hallucinations & Evaluation', 'expert', 'Faithfulness, retrieval recall, LLM-as-a-judge, and CI evals.', 45),
  topic('ai', 'ai-agents-architecture', '23. Building AI Apps with React & Next.js', 'expert', 'Streaming UI, Server Actions, and optimistic chat state.', 45),

  // Level 5 – Practical & Interview (24–25)
  topic('ai', 'ai-projects', '24. Practical AI Projects', 'coding', 'RAG docs assistant, AI Interview Coach, and SQL copilot.', 45),
  topic('ai', 'ai-interview-qa', '25. AI Developer Interview Scenarios', 'coding', 'Debugging hallucinations, latency spikes, and context overflow.', 50),
];

export const TYPESCRIPT_TOPICS: BackendTopicSummary[] = [
  // Level 1 – Beginner (1–7)
  topic('typescript', 'ts-fundamentals', '1. TypeScript Fundamentals', 'beginner', 'Static type checking, type erasure, and tsconfig strict mode.', 25),
  topic('typescript', 'ts-primitives', '2. Primitive Types', 'beginner', 'string, number, boolean, null, undefined, unknown, any, never.', 25),
  topic('typescript', 'ts-arrays-tuples', '3. Arrays & Tuples', 'beginner', 'Typed arrays, readonly arrays, and fixed-length tuples.', 25),
  topic('typescript', 'ts-interfaces', '4. Interfaces', 'beginner', 'Object contracts, optional/readonly props, and extends.', 30),
  topic('typescript', 'ts-type-aliases', '5. Type Aliases', 'beginner', 'type vs interface, declaration merging, and readability.', 30),
  topic('typescript', 'ts-unions-intersections', '6. Union & Intersection Types', 'beginner', 'Combining types with | and & plus discriminated unions.', 30),
  topic('typescript', 'ts-enums', '7. Enums vs as const', 'beginner', 'Numeric/string enums vs zero-cost union objects with as const.', 25),

  // Level 2 – Intermediate (8–12)
  topic('typescript', 'ts-functions', '8. Functions & Overloads', 'intermediate', 'Parameter/return typing, optional params, and function overloads.', 35),
  topic('typescript', 'ts-generics-narrowing', '9. Generics', 'intermediate', 'Generic functions, interfaces, constraints (extends), and defaults.', 40),
  topic('typescript', 'ts-narrowing', '10. Type Narrowing', 'intermediate', 'typeof, instanceof, in, truthiness, and control-flow analysis.', 35),
  topic('typescript', 'ts-type-guards', '11. Type Guards', 'intermediate', 'Custom type predicates (val is User) and assertion functions.', 35),
  topic('typescript', 'ts-keyof-typeof', '12. keyof & typeof', 'intermediate', 'Deriving union keys from types and runtime constants.', 30),

  // Level 3 – Advanced (13–18)
  topic('typescript', 'ts-utility-types', '13. Utility Types', 'advanced', 'Partial, Required, Pick, Omit, Record, ReturnType, Awaited.', 40),
  topic('typescript', 'ts-mapped-types', '14. Mapped Types', 'advanced', 'Transforming object keys with [K in keyof T] and modifiers.', 40),
  topic('typescript', 'ts-conditional-types', '15. Conditional Types', 'advanced', 'T extends U ? X : Y and distributive conditional types.', 40),
  topic('typescript', 'ts-infer', '16. infer Keyword', 'advanced', 'Extracting nested return, promise, or array element types.', 40),
  topic('typescript', 'ts-advanced-generics', '17. Advanced Generics', 'advanced', 'Builder patterns, variadic tuple types, and template literals.', 45),
  topic('typescript', 'ts-declarations', '18. Declaration Files (.d.ts)', 'advanced', 'Ambient modules, declare global, and @types packages.', 35),

  // Level 4 – Expert & Senior (19–23)
  topic('typescript', 'ts-react', '19. TypeScript with React', 'expert', 'Typing props, children, events, refs, and generic components.', 40),
  topic('typescript', 'ts-nextjs', '20. TypeScript with Next.js', 'expert', 'Typing async Page params, Server Actions, and Route Handlers.', 40),
  topic('typescript', 'ts-api-typing', '21. API Response Typing', 'expert', 'Combining generics with Zod runtime validation (no `any`).', 40),
  topic('typescript', 'ts-advanced-architecture', '22. Advanced Architecture', 'expert', 'Shared monorepo contracts, branded types, and strict configs.', 45),
  topic('typescript', 'ts-satisfies', '23. satisfies & const Type Params', 'expert', 'Validating config objects without widening literal types.', 35),

  // Level 5 – Coding & Scenarios (24–25)
  topic('typescript', 'ts-challenges', '24. Type-Level Challenges', 'coding', 'Implementing DeepPartial<T>, DeepReadonly<T>, and MyPick.', 45),
  topic('typescript', 'ts-scenarios', '25. Real-World TS Scenarios', 'coding', 'Eliminating `any` in legacy codebases and strict form typing.', 50),
];
