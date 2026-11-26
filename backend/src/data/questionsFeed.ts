export interface BackendQuestionFeed {
  id: string;
  categoryId: 'javascript' | 'react' | 'nextjs' | 'wordpress' | 'php' | 'laravel' | 'mysql' | 'ai' | 'typescript';
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
    id: 'js-q-introduction',
    categoryId: 'javascript',
    topicId: 'js-introduction',
    title: 'What is JavaScript and how is it executed?',
    difficulty: 'beginner',
    shortAnswer:
      'JavaScript is a high-level, single-threaded, dynamically typed, garbage-collected language with first-class functions, an event-driven non-blocking runtime, and engines like V8 (Chrome/Node) that JIT-compile it to machine code.',
    humanInterviewAnswer:
      'JavaScript started as a small scripting language for Netscape browsers in 1995, but today it runs everywhere—browsers, servers via Node.js, mobile apps with React Native, even IoT devices. It is single-threaded, meaning one call stack, but it handles concurrency through an event loop that queues callbacks. The V8 engine compiles JS to optimised machine code at runtime using JIT compilation, which is why modern JS is surprisingly fast despite being dynamically typed.',
    detailedExplanation:
      'JavaScript engines parse source into an AST, generate bytecode, and then JIT-compile hot paths. The event loop picks tasks from the macrotask queue (setTimeout, I/O) and microtask queue (Promises, queueMicrotask). First-class functions mean functions can be assigned to variables, passed as arguments, and returned from other functions—enabling closures and higher-order patterns that are foundational to the language.',
    practicalExample:
      'When you type in a search bar, JavaScript captures each keystroke via an event listener, debounces the input using `setTimeout`, sends a `fetch` request to the server asynchronously, and updates the DOM with results—all without reloading the page.',
    codeExample: {
      language: 'javascript',
      code: `let status = 'Loading';\nconsole.log(typeof status);\nstatus = 200;\nconsole.log(typeof status);`,
      expectedOutput: 'string\nnumber',
    },
    followUpQuestions: [
      'What does single-threaded mean?',
      'How does JS run outside the browser?',
      'What is JIT compilation?',
    ],
    interviewerExpectations: [
      'Mention single-threaded + event loop for concurrency.',
      'Explain dynamic typing with an example.',
      'Know that Node.js brought JS to the server.',
    ],
    keyConcepts: ['single-threaded', 'event loop', 'dynamic typing', 'JIT compilation', 'first-class functions', 'V8'],
    tags: ['fundamentals', 'introduction', 'runtime'],
  },
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
    id: 'wp-q-child-theme-hierarchy',
    categoryId: 'wordpress',
    topicId: 'wp-template-hierarchy',
    title: 'How do Child Themes and the WordPress Template Hierarchy work together?',
    difficulty: 'beginner',
    shortAnswer:
      'A Child Theme inherits parent templates and lets you override specific files safely, while the Template Hierarchy resolves the most specific template down to `index.php`.',
    humanInterviewAnswer:
      'Whenever I customize a third-party theme, I create a Child Theme so parent theme updates never wipe out my changes. WordPress checks the Child Theme folder first using the Template Hierarchy—for example `single-course.php` before `single.php` before `index.php`—and falls back to the Parent Theme if a file is not overridden.',
    detailedExplanation:
      'WordPress matches the main `WP_Query` conditional tags against an ordered list of template filenames via `locate_template()`, checking `STYLESHEETPATH` (child) before `TEMPLATEPATH` (parent). Stylesheets are loaded via `wp_enqueue_scripts` rather than `@import`.',
    practicalExample: 'Overriding only `single-product.php` in a WooCommerce child theme while keeping all other parent templates.',
    followUpQuestions: ['Why is wp_enqueue_style preferred over @import in style.css?'],
    interviewerExpectations: ['Explain safe updates with child themes.', 'Show template fallback order to index.php.'],
    keyConcepts: ['child theme', 'template hierarchy', 'wp_enqueue_scripts', 'get_stylesheet_directory'],
    tags: ['wordpress', 'themes', 'templates'],
  },
  {
    id: 'wp-q-wp-query-perf',
    categoryId: 'wordpress',
    topicId: 'wp-data-rest',
    title: 'How do you optimize slow `WP_Query` and `meta_query` calls on large WordPress sites?',
    difficulty: 'advanced',
    shortAnswer:
      'Use `pre_get_posts` for main loops, set `no_found_rows => true` for unpaginated queries, replace heavy `meta_query` filters with Taxonomies, and add Redis Object Caching.',
    humanInterviewAnswer:
      'Multiple `meta_query` joins are slow because `wp_postmeta.meta_value` is an unindexed `LONGTEXT` column. On large sites I convert filterable attributes into Custom Taxonomies so queries hit indexed term tables, set `no_found_rows => true` when I do not need pagination, and put Redis in front of MySQL.',
    detailedExplanation:
      '`WP_Query` runs `SQL_CALC_FOUND_ROWS` by default unless `no_found_rows => true` is passed. It also primes post and term caches unless disabled. Avoiding `posts_per_page => -1` prevents memory spikes.',
    practicalExample: 'Replacing 3 `meta_query` product filters with `tax_query` + Redis cut query latency from 3.8s to 18ms.',
    followUpQuestions: ['Why should you never use query_posts()?'],
    interviewerExpectations: ['Explain unindexed wp_postmeta bottleneck.', 'Mention no_found_rows, tax_query, and Redis.'],
    keyConcepts: ['WP_Query', 'meta_query', 'tax_query', 'no_found_rows', 'pre_get_posts'],
    tags: ['wordpress', 'performance', 'database'],
  },
  {
    id: 'wp-q-rest-api-custom',
    categoryId: 'wordpress',
    topicId: 'wp-rest-api',
    title: 'How do you build a secure custom WordPress REST API endpoint?',
    difficulty: 'intermediate',
    shortAnswer:
      'Register it on `rest_api_init` with `register_rest_route()`, enforce auth in `permission_callback`, validate/sanitize `args`, and return `WP_Error` or `rest_ensure_response()`.',
    humanInterviewAnswer:
      'I hook into `rest_api_init`, call `register_rest_route()` with a versioned namespace like `acme/v1`, and always define a `permission_callback`—checking `current_user_can()` for writes or `__return_true` only for public reads. Then I validate every parameter in `args` before running `$wpdb->prepare()` or `WP_Query`.',
    detailedExplanation:
      'WordPress requires `permission_callback` on every route to prevent accidental unauthenticated access. Authenticated browser requests use cookie auth + `X-WP-Nonce`, while external headless clients use Application Passwords or JWT.',
    practicalExample: 'Exposing `POST /wp-json/acme/v1/enroll` gated by `is_user_logged_in()` and integer course ID validation.',
    followUpQuestions: ['Why is permission_callback required on every REST route?'],
    interviewerExpectations: ['Mention rest_api_init & register_rest_route.', 'Enforce permission_callback and args validation.'],
    keyConcepts: ['rest_api_init', 'permission_callback', 'validate_callback', 'X-WP-Nonce'],
    tags: ['wordpress', 'rest-api', 'security'],
  },
  {
    id: 'wp-q-woocommerce-hpos-cron',
    categoryId: 'wordpress',
    topicId: 'wp-woocommerce',
    title: 'How do WooCommerce HPOS and real system Cron improve production WordPress scalability?',
    difficulty: 'advanced',
    shortAnswer:
      'HPOS moves WooCommerce orders out of `wp_posts`/`wp_postmeta` into dedicated indexed tables, and disabling `WP-Cron` in favor of system cron + Action Scheduler prevents missed jobs and slow page loads.',
    humanInterviewAnswer:
      'Classic WooCommerce stuffed every order and its metadata into `wp_posts` and `wp_postmeta`, slowing down large stores. HPOS fixes that with dedicated order tables—so I always use `wc_get_order()` CRUD methods instead of `get_post_meta()`. I also set `DISABLE_WP_CRON` to `true` and run `wp cron event run` via Linux cron.',
    detailedExplanation:
      'HPOS (`wp_wc_orders`) reduces table contention and speeds up order searches. Default WP-Cron fires on visitor HTTP requests, causing latency spikes or missed schedules; Action Scheduler processes WooCommerce webhooks/emails in resilient batches.',
    practicalExample: 'Migrating an order-sync plugin from `get_post_meta($id, "_erp_id")` to `$order->get_meta("_erp_id")` for HPOS compatibility.',
    followUpQuestions: ['Why did WooCommerce introduce HPOS?'],
    interviewerExpectations: ['Contrast HPOS vs wp_posts/wp_postmeta.', 'Explain DISABLE_WP_CRON + system cron.'],
    keyConcepts: ['HPOS', 'wc_get_order', 'DISABLE_WP_CRON', 'Action Scheduler'],
    tags: ['wordpress', 'woocommerce', 'scaling'],
  },
  // PHP Questions
  {
    id: 'php-q-strict-types-oop',
    categoryId: 'php',
    topicId: 'php-oop-classes',
    title: 'When do you use an Interface vs an Abstract Class vs a Trait in modern PHP 8+?',
    difficulty: 'intermediate',
    shortAnswer:
      'Use Interfaces for contracts ("can do") and DI, Abstract Classes for shared base state/behavior ("is-a"), and Traits sparingly for horizontal code reuse across unrelated classes.',
    humanInterviewAnswer:
      'I use Interfaces whenever I want swappable dependencies—like `PaymentGateway` implemented by `StripeGateway` and `FakeGateway` in tests. Abstract Classes make sense when subclasses genuinely share base properties and template methods, while Traits are for small reusable helpers like `HasUuid` without forcing inheritance.',
    detailedExplanation:
      'PHP supports single class inheritance but multiple interface implementation. Combined with `declare(strict_types=1)`, constructor property promotion, and `readonly` properties in PHP 8+, interfaces enable clean SOLID dependency inversion.',
    practicalExample: 'Injecting `NotifierInterface` into `OrderService` so unit tests pass an in-memory stub without sending real emails.',
    followUpQuestions: ['What is the difference between `self::` and `static::` (late static binding) in PHP?'],
    interviewerExpectations: ['Distinguish Interface, Abstract Class, and Trait.', 'Mention Dependency Injection / testability.'],
    keyConcepts: ['interface', 'abstract class', 'trait', 'strict_types', 'dependency injection'],
    tags: ['php', 'oop', 'solid'],
  },
  {
    id: 'php-q-pdo-security',
    categoryId: 'php',
    topicId: 'php-pdo-prepared',
    title: 'How do PDO prepared statements stop SQL injection, and how do you secure passwords and file uploads in PHP?',
    difficulty: 'beginner',
    shortAnswer:
      'PDO native prepared statements separate SQL syntax from user values. Hash passwords with `password_hash()`, and validate uploads using `finfo` MIME inspection + random filenames stored outside webroot.',
    humanInterviewAnswer:
      'With PDO, I set `ATTR_EMULATE_PREPARES => false` so MySQL compiles the query template separately from the parameters—meaning user input can never alter SQL structure. For passwords I always use `password_hash()` and `password_verify()`, and for uploads I check real file bytes with `finfo` instead of trusting the file extension.',
    detailedExplanation:
      'Defense-in-depth in PHP covers SQLi (native PDO prepared statements), XSS (`htmlspecialchars(..., ENT_QUOTES, "UTF-8")`), CSRF (`hash_equals` tokens + `SameSite` cookies), and `session_regenerate_id(true)` on login.',
    practicalExample: 'Renaming uploaded avatars to `bin2hex(random_bytes(16)) . ".jpg"` after verifying `image/jpeg` via `finfo`.',
    followUpQuestions: ['Why is password_hash() much safer than sha256($password . $salt)?'],
    interviewerExpectations: ['Explain native prepared statements.', 'Cover password_hash and upload MIME validation.'],
    keyConcepts: ['PDO', 'prepared statements', 'password_hash', 'finfo', 'XSS', 'CSRF'],
    tags: ['php', 'security', 'pdo'],
  },
  {
    id: 'php-q-fpm-opcache-generators',
    categoryId: 'php',
    topicId: 'php-lifecycle-fpm',
    title: 'How do PHP-FPM, OPcache, and Generators work together for performance and memory efficiency?',
    difficulty: 'advanced',
    shortAnswer:
      'PHP-FPM runs isolated share-nothing worker processes, OPcache keeps compiled bytecode in shared RAM to skip re-parsing, and Generators (`yield`) stream large datasets in O(1) memory.',
    humanInterviewAnswer:
      'On every HTTP request, Nginx hands PHP execution to a PHP-FPM worker, which tears down all request memory when done so bugs don’t leak across requests. OPcache keeps the compiled PHP bytecode in shared memory so files aren’t recompiled every hit. And when exporting 500k CSV rows, I use `yield` in a Generator so memory stays flat.',
    detailedExplanation:
      'Sizing `pm.max_children` to available RAM prevents OOM thrashing under traffic spikes, while `opcache.validate_timestamps=0` in immutable deployments avoids filesystem `stat()` calls.',
    practicalExample: 'Streaming a 1-million-row database export with a Generator using 4 MB RAM instead of hitting PHP’s `memory_limit`.',
    followUpQuestions: ['How do you calculate the right pm.max_children for a server?'],
    interviewerExpectations: ['Explain share-nothing FPM + OPcache bytecode.', 'Show how yield prevents OOM.'],
    keyConcepts: ['PHP-FPM', 'OPcache', 'share-nothing', 'Generator', 'yield'],
    tags: ['php', 'performance', 'internals'],
  },
  {
    id: 'php-q-modern-php8',
    categoryId: 'php',
    topicId: 'php-modern-php8',
    title: 'What key features in PHP 8.x improve code safety and readability?',
    difficulty: 'beginner',
    shortAnswer:
      'PHP 8.x adds strict `match` expressions, backed `enum`s, `readonly` properties/classes, constructor property promotion, union/intersection types, and the nullsafe `?->` operator.',
    humanInterviewAnswer:
      'Modern PHP 8+ lets me write very clean, strongly typed code: I use constructor property promotion + `readonly` for DTOs, backed `enum`s instead of magic string constants, `match` for strict `===` branching that won’t silently fall through, and `?->` to safely read nested nullable objects.',
    detailedExplanation:
      'Unlike `switch`, `match` returns a value, uses strict comparison (`===`), does not fall through, and throws `UnhandledMatchError` if a case is missing. PHP 8+ also fixed `"0" == ""` type juggling surprises.',
    practicalExample: 'Modeling `enum OrderStatus: string` and mapping UI labels exhaustively with `match ($order->status)`.',
    followUpQuestions: ['How does `match` differ from `switch` in PHP 8?'],
    interviewerExpectations: ['Name 4+ PHP 8 features accurately.', 'Contrast match vs switch.'],
    keyConcepts: ['match', 'enum', 'readonly', 'nullsafe', 'constructor promotion'],
    tags: ['php', 'php8', 'types'],
  },
  // Laravel Questions
  {
    id: 'laravel-q-n-plus-one',
    categoryId: 'laravel',
    topicId: 'laravel-eager-loading',
    title: 'What is the N+1 query problem in Laravel Eloquent, and how do you prevent it?',
    difficulty: 'intermediate',
    shortAnswer:
      'Accessing a lazy-loaded relation inside a loop triggers 1 query per item (`N+1`). Fix it with `with()` eager loading, `withCount()`, and `Model::preventLazyLoading()` in local dev.',
    humanInterviewAnswer:
      'If I fetch 50 posts and read `$post->author->name` in Blade or a Resource, Eloquent runs 51 SQL queries. Using `Post::with("author:id,name")->get()` loads all authors in one `IN (...)` query—just 2 queries total. I also turn on `Model::preventLazyLoading(!app()->isProduction())` so any N+1 throws immediately during development.',
    detailedExplanation:
      'Eager loading batches foreign keys across the parent collection. In API Resources, `$this->whenLoaded("author")` ensures serialization never accidentally triggers lazy loading.',
    practicalExample: 'Cutting a dashboard endpoint from 120 SQL queries down to 4 queries using `with(["author:id,name"])->withCount("comments")`.',
    followUpQuestions: ['What is the difference between `with()` and `load()`?'],
    interviewerExpectations: ['Explain 1+N query pattern.', 'Mention with(), whenLoaded(), and preventLazyLoading().'],
    keyConcepts: ['N+1', 'eager loading', 'with()', 'preventLazyLoading', 'whenLoaded'],
    tags: ['laravel', 'eloquent', 'performance'],
  },
  {
    id: 'laravel-q-container-lifecycle',
    categoryId: 'laravel',
    topicId: 'laravel-service-container',
    title: 'How do Laravel’s Service Container, Service Providers, and Middleware pipeline work?',
    difficulty: 'intermediate',
    shortAnswer:
      'The HTTP Kernel runs middleware around the router; Service Providers register bindings (`register()`) and boot hooks (`boot()`); the Container uses Reflection to auto-inject constructor dependencies.',
    humanInterviewAnswer:
      'When a request enters `public/index.php`, Laravel boots Service Providers—first `register()` to bind interfaces in the Container, then `boot()` for event listeners or routes. Middleware wraps the controller like onion layers around `$next($request)`, and the Container automatically resolves any class or interface type-hinted in the controller.',
    detailedExplanation:
      '`bind()` creates a new instance per resolution, while `singleton()` shares one instance for the request (or worker lifetime in Octane, so never store user/request state on singletons!).',
    practicalExample: 'Binding `PaymentGateway::class` to `StripeGateway::class` in `AppServiceProvider::register()` so controllers stay decoupled.',
    followUpQuestions: ['What is the difference between register() and boot() in a Service Provider?'],
    interviewerExpectations: ['Explain register vs boot.', 'Explain Reflection auto-wiring and bind vs singleton.'],
    keyConcepts: ['Service Container', 'Service Provider', 'Middleware', 'Reflection', 'singleton'],
    tags: ['laravel', 'architecture', 'di'],
  },
  {
    id: 'laravel-q-queues-transactions',
    categoryId: 'laravel',
    topicId: 'laravel-queues-jobs',
    title: 'How do you handle race conditions in `DB::transaction()` and reliable `ShouldQueue` jobs in Laravel?',
    difficulty: 'advanced',
    shortAnswer:
      'Use `DB::transaction()` with `lockForUpdate()` (or atomic conditional `UPDATE`) to stop race conditions, and dispatch queued jobs with `->afterCommit()` plus `$tries`/`$backoff`.',
    humanInterviewAnswer:
      'To stop two users from buying the last item simultaneously, I wrap the check and decrement in `DB::transaction()` using `->lockForUpdate()` on the product row. And whenever I dispatch a queued job from inside a transaction, I chain `->afterCommit()` so the Redis worker never runs before MySQL commits the row.',
    detailedExplanation:
      'Pessimistic row locking (`SELECT ... FOR UPDATE`) serializes concurrent writers on the same row. Setting `$tries` and exponential `$backoff` on `ShouldQueue` jobs handles transient third-party failures gracefully.',
    practicalExample: 'Preventing double webhook processing with a `UNIQUE` `event_id` table inside `DB::transaction()` + `afterCommit()` job dispatch.',
    followUpQuestions: ['What is the difference between `lockForUpdate()` and `sharedLock()`?'],
    interviewerExpectations: ['Show lockForUpdate() inside DB::transaction.', 'Mention afterCommit() for queued jobs.'],
    keyConcepts: ['DB::transaction', 'lockForUpdate', 'ShouldQueue', 'afterCommit', 'idempotency'],
    tags: ['laravel', 'queues', 'concurrency'],
  },
  {
    id: 'laravel-q-sanctum-validation',
    categoryId: 'laravel',
    topicId: 'laravel-auth-sanctum',
    title: 'How do `FormRequest`, `JsonResource`, Sanctum, and Policies keep Laravel APIs secure and clean?',
    difficulty: 'beginner',
    shortAnswer:
      '`FormRequest` validates and authorizes input (`$request->validated()`), Policies enforce model ownership, Sanctum handles SPA cookies or mobile Bearer tokens, and `JsonResource` shapes safe JSON output.',
    humanInterviewAnswer:
      'I keep controllers thin by letting a `FormRequest` validate input—never passing `$request->all()` into `create()` so mass-assignment stays locked down with `$fillable`. Sanctum handles Bearer tokens for our React Native app, Policies check ownership like `$user->id === $order->user_id`, and `JsonResource` ensures internal DB columns never leak.',
    detailedExplanation:
      'Sanctum hashes personal access tokens with SHA-256 in `personal_access_tokens` and supports token abilities (`["orders:write"]`) alongside standard Laravel Policies.',
    practicalExample: 'Using `OrderPolicy::view()` + `OrderResource` so users only see their own orders with exact fields.',
    followUpQuestions: ['What HTTP status code does Laravel return when FormRequest validation fails on an API request?'],
    interviewerExpectations: ['Connect FormRequest, $fillable, Policy, Sanctum, and JsonResource.'],
    keyConcepts: ['FormRequest', 'validated()', 'Sanctum', 'Policy', 'JsonResource'],
    tags: ['laravel', 'api', 'security'],
  },
  // MySQL Questions
  {
    id: 'mysql-q-indexes-explain',
    categoryId: 'mysql',
    topicId: 'mysql-indexes-btree',
    title: 'How do MySQL composite B-Tree indexes work, and what do you look for in `EXPLAIN`?',
    difficulty: 'intermediate',
    shortAnswer:
      'Composite indexes follow the Leftmost Prefix rule (equality columns first, range columns last). In `EXPLAIN`, watch out for `type: ALL` (full scan), high `rows`, `Using filesort`, and `Using temporary`.',
    humanInterviewAnswer:
      'A composite index on `(user_id, status, created_at)` works for `(user_id)` and `(user_id, status, created_at)`, but not `(status)` alone—that is the Leftmost Prefix rule. When a query is slow, I run `EXPLAIN ANALYZE` to check if `type` is `ALL` (full table scan) or if a function like `YEAR(created_at)` is blocking the index.',
    detailedExplanation:
      'In InnoDB, secondary indexes store `(indexed_cols, primary_key)`. Covering indexes (`Extra: Using index`) satisfy the query from the B-Tree alone without touching the clustered table.',
    practicalExample: 'Rewriting `WHERE DATE(created_at) = "2026-11-27"` into a `>=` and `<` range predicate so MySQL uses the index.',
    followUpQuestions: ['Why does applying a function like `WHERE YEAR(created_at) = 2026` break index usage?'],
    interviewerExpectations: ['Explain Leftmost Prefix + Equality-before-Range.', 'Identify EXPLAIN type=ALL and non-SARGable queries.'],
    keyConcepts: ['B-Tree', 'leftmost prefix', 'EXPLAIN', 'covering index', 'SARGable'],
    tags: ['mysql', 'indexes', 'performance'],
  },
  {
    id: 'mysql-q-joins-pagination',
    categoryId: 'mysql',
    topicId: 'mysql-pagination-perf',
    title: 'Why does deep `OFFSET` pagination get slow in MySQL, and how does Keyset (Cursor) pagination solve it?',
    difficulty: 'intermediate',
    shortAnswer:
      '`LIMIT 20 OFFSET 100000` forces MySQL to scan and discard 100,000 rows first. Keyset pagination (`WHERE id < :cursor ORDER BY id DESC LIMIT 20`) jumps straight to the page via the index in O(log N) time.',
    humanInterviewAnswer:
      'With `OFFSET 100000`, MySQL still has to read and throw away the first 100,000 rows on every request. Switching to cursor/keyset pagination—filtering `WHERE id < last_id LIMIT 20`—lets the B-Tree index seek straight to the next 20 rows, so page 5,000 is just as fast as page 1.',
    detailedExplanation:
      'When sorting by a non-unique column like `created_at`, use a composite row-value cursor `WHERE (created_at, id) < (?, ?)` so ties never skip or duplicate rows.',
    practicalExample: 'Powering a mobile infinite-scroll feed with `?cursor=98420` instead of `?page=5000`.',
    followUpQuestions: ['What UI trade-off does cursor pagination have vs numbered pages?'],
    interviewerExpectations: ['Explain why OFFSET scans discarded rows.', 'Show WHERE id < cursor pattern.'],
    keyConcepts: ['keyset pagination', 'cursor', 'OFFSET', 'B-Tree seek'],
    tags: ['mysql', 'pagination', 'performance'],
  },
  {
    id: 'mysql-q-transactions-deadlocks',
    categoryId: 'mysql',
    topicId: 'mysql-locking-deadlocks',
    title: 'How do MySQL MVCC (`REPEATABLE READ`) and Deadlocks work in InnoDB?',
    difficulty: 'advanced',
    shortAnswer:
      'MVCC lets `SELECT` read a consistent snapshot without blocking writers. Deadlocks occur when two transactions lock rows in opposite orders—prevent them with indexed `WHERE` clauses and consistent lock ordering.',
    humanInterviewAnswer:
      'InnoDB uses MVCC so normal `SELECT` queries read a snapshot via undo logs without blocking `UPDATE`s. Deadlocks happen when Transaction A locks row 1 then wants row 2, while Transaction B locks row 2 then wants row 1. I prevent them by always locking IDs in ascending order, keeping transactions short, and indexing `WHERE` columns.',
    detailedExplanation:
      'In `REPEATABLE READ`, plain `SELECT` uses snapshot read while `SELECT ... FOR UPDATE` performs a current locking read (and may acquire gap/next-key locks to stop phantom reads). `SHOW ENGINE INNODB STATUS` reveals the latest deadlock.',
    practicalExample: 'Sorting `[fromId, toId]` ascending before `SELECT ... FOR UPDATE` in a wallet transfer.',
    followUpQuestions: ['What is the difference between a dirty read, non-repeatable read, and phantom read?'],
    interviewerExpectations: ['Explain MVCC non-blocking reads.', 'Explain deadlock cycle and deterministic lock order.'],
    keyConcepts: ['MVCC', 'REPEATABLE READ', 'FOR UPDATE', 'deadlock', 'InnoDB'],
    tags: ['mysql', 'transactions', 'concurrency'],
  },
  {
    id: 'mysql-q-cte-window-joins',
    categoryId: 'mysql',
    topicId: 'mysql-subqueries-cte',
    title: 'How do `LEFT JOIN`, `HAVING`, CTEs (`WITH`), and Window Functions (`DENSE_RANK`) solve complex SQL queries?',
    difficulty: 'beginner',
    shortAnswer:
      'Use `WHERE` before `GROUP BY` and `HAVING` after; put right-table `LEFT JOIN` filters in `ON` (not `WHERE`); and use CTEs + `DENSE_RANK()`/`ROW_NUMBER()` for Top-N-per-group queries.',
    humanInterviewAnswer:
      'A super common SQL bug is filtering a `LEFT JOIN`ed table in the `WHERE` clause, which turns it into an `INNER JOIN`—unless you’re intentionally looking for `WHERE right.id IS NULL`. For ranking questions like "2nd highest salary per department", I use a `WITH` CTE and `DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC)`.',
    detailedExplanation:
      'Window functions preserve individual rows while computing rankings or running totals across `PARTITION BY` windows. `DENSE_RANK()` handles tied values without skipping ranks.',
    practicalExample: 'Fetching each customer’s most recent order with `ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) = 1`.',
    followUpQuestions: ['Why is `DENSE_RANK()` better than `ROW_NUMBER()` for "2nd highest salary"?'],
    interviewerExpectations: ['Explain LEFT JOIN ON vs WHERE.', 'Show CTE + Window Function pattern.'],
    keyConcepts: ['LEFT JOIN', 'HAVING', 'CTE', 'ROW_NUMBER', 'DENSE_RANK'],
    tags: ['mysql', 'sql', 'queries'],
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
