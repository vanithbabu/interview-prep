export const FOLLOW_UP_ANSWERS: Record<string, string> = {
  'What is JIT compilation?':
    'JIT (Just-In-Time) compilation means the JavaScript engine (e.g., V8) first interprets bytecode, then detects "hot" functions that run frequently and compiles them into optimised machine code at runtime. This gives near-native speed without requiring an ahead-of-time compile step.',
  'Can you mutate properties of an object declared with `const`?':
    'Yes. `const` prevents reassigning the variable binding itself, not mutating the object properties in memory. To prevent property mutations, use `Object.freeze()` (shallow) or deep-freeze recursively.',
  'What is the Temporal Dead Zone (TDZ)?':
    'The TDZ is the period between entering a block scope and the actual `let`, `const`, or `class` declaration line. Accessing the variable during the TDZ throws a `ReferenceError` instead of returning `undefined`.',
  'Why does `var` cause bugs inside `for` loops with callbacks?':
    '`var` is function-scoped, so every iteration shares the same variable binding. By the time async callbacks like `setTimeout` run, the loop has finished and every callback sees the final value. `let` creates a fresh binding per iteration.',
  'Why should you avoid arrow functions for object methods?':
    'Arrow functions do not have their own `this`—they inherit `this` lexically from the enclosing scope. On an object literal, `this` usually points to the outer module/global object instead of the object itself.',
  'What happens if you try to `.bind()` an arrow function?':
    'Calling `.bind()`, `.call()`, or `.apply()` on an arrow function does not throw, but the `this` argument is silently ignored because an arrow function’s `this` is lexically locked at creation time.',
  'How do rest parameters differ from the `arguments` object?':
    'Rest parameters (`...args`) create a real Array with methods like `.map()` and `.filter()`, work in arrow functions, and only collect remaining arguments. `arguments` is an array-like object unavailable in arrow functions.',
  'Why do we use closures?':
    'Closures let a function remember and access variables from its outer lexical scope even after the outer function has returned. They enable data privacy, factory functions, memoization, and event/callback state.',
  'What are practical use cases?':
    'Common real-world uses include debouncing/throttling utilities, React hooks/event handlers, private counters/caches, curried configuration helpers, and module-level state encapsulation.',
  'What is the difference between scope and closure?':
    'Scope defines where variables are accessible in code (lexical rules). A closure is a runtime function bundled with references to its surrounding lexical environment so those variables survive after the outer function finishes.',
  'Why does `useCallback` do nothing if the child is not wrapped in `React.memo`?':
    'When a parent re-renders, React re-renders all child components by default regardless of whether props changed. `useCallback` only keeps the function reference stable, which only prevents child re-renders when the child checks prop equality via `React.memo`.',
  'What are the Rules of Hooks and why do they exist?':
    'Only call Hooks at the top level (never inside loops, conditions, or nested functions) and only from React functions. React tracks hook state by call order across renders, so conditional calls shift indices and corrupt state.',
  'How do you clean up subscriptions in `useEffect`?':
    'Return a cleanup function from `useEffect` (e.g., `return () => unsubscribe()` or `clearInterval(id)`). React runs it before re-running the effect and when the component unmounts, preventing memory leaks.',
  'Can a Client Component import a Server Component directly?':
    'No—importing a Server Component inside a `"use client"` file pulls it into the client bundle. Instead, pass a Server Component as `children` or a prop from a parent Server Component.',
  'When would you use `revalidateTag` instead of time-based ISR?':
    'Use `revalidateTag` when data changes unpredictably (like a CMS publish, price update, or user edit) and you want instant on-demand cache invalidation rather than waiting for a fixed timer to expire.',
  'What is the difference between SSR and Streaming with Suspense?':
    'Traditional SSR waits for all data on the server before sending any HTML. Streaming with `<Suspense>` sends the page shell immediately and streams slower sections as their promises resolve, improving TTFB and perceived speed.',
  'What happens if you forget to `return` a value inside a Filter callback?':
    'In WordPress, a filter hook passes the value through callbacks; returning nothing (`null`) replaces the filtered content with empty/null output, often breaking titles, content, or queries.',
  'How does WordPress Template Hierarchy resolve `single-product.php`?':
    'For a custom post type `product`, WordPress checks `single-{post-type}-{slug}.php`, then `single-product.php`, then `single.php`, `singular.php`, and finally `index.php`.',
  'Why do we sanitize on input and escape on output?':
    'Sanitizing cleans untrusted data before saving to the database, while escaping (`esc_html`, `esc_attr`, `esc_url`) encodes data right before rendering in HTML/attributes to prevent XSS even if legacy or external data is unsafe.',
  'Why do we use chunk overlap when splitting documents?':
    'Overlap preserves context across chunk boundaries so sentences or ideas split between two chunks are not lost, improving embedding similarity and retrieval recall.',
  'What is hybrid search (vector + BM25 keyword)?':
    'Hybrid search combines dense vector similarity (semantic meaning) with sparse keyword matching like BM25 (exact IDs, names, error codes), then merges rankings (e.g., RRF) for higher accuracy.',
  'How do you evaluate a RAG pipeline?':
    'Measure retrieval quality (context recall/precision, MRR) and generation quality (faithfulness/groundedness, answer relevance) against a golden dataset of question-answer pairs.',
  'Why is `unknown` safer than `any`?':
    '`any` disables type checking completely, letting bugs slip through. `unknown` accepts any value but forces you to narrow or validate its type before using it.',
  'What is a discriminated union?':
    'A union of object types sharing a literal tag property (e.g., `status: "loading" | "success" | "error"`). Checking that tag lets TypeScript automatically narrow the remaining fields.',
  'How do `keyof` and `extends` constrain a generic parameter?':
    '`<T, K extends keyof T>` restricts `K` to valid property names of `T`, ensuring `obj[key]` is always type-safe and enabling autocomplete.',
  'What is the difference between `forEach` and `map`?':
    '`forEach` iterates for side effects and always returns `undefined`. `map` transforms each element and returns a brand-new array of the same length.',
  'Why does `{ ...obj }` only create a shallow copy?':
    'Spread copies top-level properties by value, but nested objects/arrays still share the same memory references as the original object.',
  'How does `structuredClone` differ from `JSON.parse(JSON.stringify(obj))`?':
    '`structuredClone` natively handles `Date`, `Map`, `Set`, `RegExp`, `ArrayBuffer`, and circular references, whereas JSON serialization drops functions/`undefined`, converts `Date` to strings, and throws on circular references.',
  'How does prototype chain lookup work when accessing a property?':
    'JavaScript checks the object’s own properties first; if missing, it walks up `[[Prototype]]` link by link until it finds the property or reaches `null` (returning `undefined`).',
  'What does the `new` keyword do step by step?':
    'It creates a new empty object, links its `[[Prototype]]` to `Constructor.prototype`, binds `this` to that new object while executing the constructor, and returns the object (unless the constructor returns another non-null object).',
  'Can you override an arrow function’s `this` with `.call()`?':
    'No. Arrow functions capture `this` lexically from their creation scope, so `.call()`, `.apply()`, and `.bind()` cannot change it.',
  'Compare `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`.':
    '`Promise.all` resolves when all succeed (fails fast on first rejection). `allSettled` waits for all and returns each status. `race` settles with the first settled promise. `any` resolves with the first fulfilled promise (rejects only if all reject).',
  'What happens if a Promise rejects without a `.catch()` or `try/catch`?':
    'It triggers an `unhandledRejection` event. In browsers it logs an uncaught error; in modern Node.js it can terminate the process.',
  'How do you cancel an in-flight `fetch` request?':
    'Create an `AbortController`, pass `controller.signal` to `fetch(url, { signal })`, and call `controller.abort()` when cancelling (e.g., on component unmount or new search input).',
  'What are common causes of memory leaks in JavaScript?':
    'Forgotten timers/intervals, unremoved event listeners or subscriptions, detached DOM nodes referenced in closures, and unbounded global caches.',
  'Why are `WeakMap` keys required to be objects?':
    'WeakMaps hold weak references so garbage collection can reclaim keys when nothing else references them. Primitive values cannot be garbage-collected individually.',
  'How does mark-and-sweep garbage collection work?':
    'The collector starts from GC roots (global scope, active call stack), marks all reachable objects, and sweeps away any unreachable objects to free memory.',
  'Why should you use the functional updater `setCount(prev => prev + 1)`?':
    'State updates are asynchronous and batched. Passing a function guarantees you read the latest queued state rather than a stale closure value.',
  'What happens if you mutate state directly instead of calling `setState`?':
    'React compares object references (`Object.is`). Mutating in place keeps the same reference, so React skips re-rendering and causes hard-to-trace UI bugs.',
  'Why should you avoid array index as a `key`?':
    'If items are reordered, inserted, or deleted, array indices shift, causing React to reuse the wrong component state, inputs, or animations.',
  'Why can Context API cause unnecessary re-renders?':
    'Every consumer of a Context re-renders whenever the Provider’s `value` reference changes, even if the consumer only uses one untouched field. Splitting contexts or memoizing `value` helps.',
  'What is the difference between controlled and uncontrolled forms?':
    'Controlled inputs store their value in React state via `value` + `onChange`. Uncontrolled inputs let the DOM hold the value and read it via `ref` on submit.',
  'How does `useReducer` help with complex state transitions?':
    'It centralizes related state updates into a pure `(state, action) => nextState` reducer, making multi-field transitions predictable, testable, and easier to debug.',
  'How does React Fiber schedule urgent vs transition updates?':
    'Fiber breaks rendering into interruptible work units with priorities. Typing/clicks run at high priority, while `startTransition` updates can be paused or yielded so the UI stays responsive.',
  'Why do Error Boundaries still require class components?':
    'React’s `getDerivedStateFromError` and `componentDidCatch` lifecycle methods currently only exist on class components; there is no built-in Hook equivalent yet.',
  'What is hydration mismatch?':
    'It occurs when the HTML rendered on the server differs from what React renders on the client during initial hydration (often caused by `Date.now()`, `Math.random()`, or browser-only APIs).',
  'When would you use `template.tsx` instead of `layout.tsx`?':
    '`layout.tsx` persists across route navigations and keeps state, whereas `template.tsx` remounts a fresh instance on every navigation—useful for entry animations or per-page state resets.',
  'What are Route Groups `(marketing)` used for?':
    'Parenthesized folders organize routes and share dedicated layouts without adding the folder name to the URL path.',
  'How do Parallel Routes `@modal` work?':
    'Named `@slot` folders render multiple independent pages/modals in the same layout simultaneously and can be combined with intercepting routes for shareable modal URLs.',
  'Why is Middleware alone not enough for authorization?':
    'Middleware runs at the edge before route handlers and is great for quick redirects, but defense-in-depth requires verifying sessions and permissions inside Server Actions, Route Handlers, and data queries too.',
  'How does `next/image` optimize Core Web Vitals (LCP/CLS)?':
    'It prevents CLS by reserving aspect-ratio space, and improves LCP via automatic WebP/AVIF resizing, responsive `srcset`, and `priority` preloading for hero images.',
  'When do you use a Route Handler instead of a Server Action?':
    'Use Server Actions for form submissions and UI mutations from React components; use Route Handlers (`route.ts`) for webhooks, third-party APIs, custom HTTP methods, or streaming responses.',
  'Why is `meta_query` slow on large `wp_postmeta` tables?':
    '`wp_postmeta` stores `meta_value` as `LONGTEXT` without an index on values, so `meta_query` filters often force full table scans and expensive `JOIN`s.',
  'When should you use a Custom Taxonomy instead of Post Meta?':
    'Use Custom Taxonomies when you need to filter, group, or archive posts (like categories/tags), because taxonomy tables are indexed for fast queries. Use Post Meta for unique per-post attributes.',
  'How do you register an ACF-powered Gutenberg block?':
    'Define a `block.json` with `acf.renderTemplate` and register it via `register_block_type()` on `init` (or `acf_register_block_type()`), then read fields with `get_field()` in the template.',
  'Why does WooCommerce use Action Scheduler instead of standard WP-Cron for heavy tasks?':
    'WP-Cron is traffic-dependent and runs sequentially in a single request, risking timeouts. Action Scheduler stores jobs in custom tables, processes batches asynchronously, and supports retries.',
  'How do you prevent `wp_options` autoload bloat?':
    'Pass `autoload: false` (or `"no"`) in `add_option()` / `update_option()` for large or rarely needed data so WordPress doesn’t load it on every single page request.',
  'How do you handle authentication in Headless WordPress?':
    'Use JWT or OAuth tokens for stateless REST/GraphQL clients, or secure HTTP-only cookie sessions when the frontend shares the same root domain.',
  'Why do LLM costs and latency grow with larger prompts?':
    'LLMs process and bill per token. Longer prompts increase input token cost and prefill compute time, and attention scales with context length, slowing down time-to-first-token.',
  'When would you use few-shot examples vs zero-shot prompting?':
    'Use zero-shot for simple, well-defined tasks. Add few-shot examples when you need a strict output format, edge-case handling, or consistent tone/classification.',
  'Why should you never trust raw LLM JSON without schema validation?':
    'LLMs are probabilistic and can omit fields, change types, or wrap JSON in markdown fences. Always validate with Zod/Pydantic and handle retries or fallbacks.',
  'How do you prevent prompt injection in a RAG or Agent app?':
    'Separate system instructions from untrusted retrieved text, apply strict tool/permission boundaries, validate outputs, and never execute unverified instructions from user/document content.',
  'What is the difference between a fixed workflow and an autonomous agent?':
    'A fixed workflow follows predetermined code paths and steps, while an autonomous agent dynamically chooses which tools to call and how many steps to take based on intermediate results.',
  'How do you evaluate agent reliability in CI?':
    'Run deterministic test suites over mocked tools and golden scenarios, asserting tool-call sequences, schema validity, latency budgets, and final task success rates.',
  'Why are union types often preferred over TypeScript `enum`?':
    'String literal unions (`"idle" | "loading"`) emit zero runtime JavaScript, tree-shake completely, and work naturally with structural typing, unlike `enum` which generates extra runtime objects.',
  'What does `as const` do?':
    'It makes an object or array deeply `readonly` and narrows its values to their exact literal types instead of general `string` or `number` types.',
  'What is `never` used for in exhaustive switches?':
    'Assigning the default-case value to `never` forces a compile-time error if a new union variant is added and not yet handled in the `switch`.',
  'How do `keyof` and `typeof` work together on a `const` object?':
    '`typeof obj` extracts the object’s TypeScript type, and `keyof typeof obj` produces a union of its exact property keys.',
  'What is distributive conditional typing?':
    'When a conditional type `T extends U ? X : Y` is applied to a naked generic union `T`, TypeScript distributes the check across each union member individually.',
  'How do `.d.ts` declaration files work?':
    'They describe the shape and types of JavaScript modules without emitting runtime code, giving TypeScript autocomplete and type checking for JS libraries.',
  'What does single-threaded mean?':
    'JavaScript has one main call stack and executes one piece of synchronous code at a time. Async work is offloaded to browser/Node APIs and queued via the Event Loop.',
  'How does JS run outside the browser?':
    'Runtimes like Node.js, Deno, and Bun embed a JS engine (V8 or JavaScriptCore) alongside C++/Rust system bindings (like libuv) for filesystem, networking, and OS APIs.',
  'Why does `typeof null` return `"object"`?':
    'It is a famous legacy bug from the first version of JavaScript, where values had a 3-bit type tag and `0` represented objects—`null` was the null pointer (`0x00`). Kept for backwards compatibility.',
  'When do you need `BigInt`?':
    'When working with integers larger than `Number.MAX_SAFE_INTEGER` (`2^53 - 1`), such as 64-bit database IDs, cryptography, or high-precision timestamps.',
  'What values are falsy in JS?':
    'There are exactly 8 falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, and `NaN`. Everything else (including `[]` and `{}`) is truthy.',
  'How does short-circuiting work with `&&` and `||`?':
    '`&&` stops and returns the first falsy operand (or the last if all are truthy). `||` stops and returns the first truthy operand (or the last if all are falsy).',
  'Why is `Boolean([])` true?':
    'In JavaScript, all objects—including empty arrays `[]` and empty objects `{}`—are truthy. Only the 8 primitive falsy values evaluate to `false`.',
  'How do you check for `NaN` reliably?':
    'Use `Number.isNaN(val)`. Unlike global `isNaN()`, `Number.isNaN()` does not coerce strings to numbers, so `Number.isNaN("hello")` accurately returns `false`.',
  'Why cannot `if` be placed inside `{}` in JSX?':
    'JSX `{}` only accepts expressions that evaluate to a value, whereas `if` is a statement. Use ternary `? :`, `&&`, or compute the value before `return`.',
  'What is Automatic Semicolon Insertion (ASI)?':
    'The JS parser automatically inserts semicolons at certain line breaks. However, putting a newline right after `return` causes `return;` (`undefined`) before the next line.',
  'What happens if you forget `break` in a `switch` statement?':
    'Execution falls through into the next `case` block and runs its code even if its condition doesn’t match, until a `break` or `return` is hit.',
  'How do guard clauses reduce nesting?':
    'Guard clauses check invalid/edge conditions early and `return` immediately, keeping the main happy-path logic flat and readable instead of deeply nested in `if/else` blocks.',
  'Why should you avoid `for...in` on arrays?':
    '`for...in` iterates over all enumerable string keys—including inherited prototype properties and custom properties—in no guaranteed order. Use `for...of` or `.forEach()` for arrays.',
  'Can you `break` out of `.forEach()`?':
    'No. `break` is invalid inside a callback and `return` only skips the current iteration. Use a `for...of` loop, `.some()`, or `.find()` if you need early exit.',
  'What is the difference between `slice` and `substring`?':
    '`slice(start, end)` supports negative indices (counting from the end) and returns `""` if `start > end`. `substring` treats negative indices as `0` and swaps `start` and `end` if `start > end`.',
  'How do you reverse a string safely with Unicode?':
    'Use `[...str].reverse().join("")` (or `Intl.Segmenter` for grapheme clusters like emojis with skin tones) instead of `str.split("")`, which splits surrogate pairs.',
  'What is the difference between `slice` and `splice`?':
    '`slice()` is non-mutating and returns a shallow copy of a subarray. `splice()` mutates the original array in place to add/remove elements.',
  'How does `Array.isArray()` work?':
    'It reliably checks whether a value is a true Array (even across iframes/realms), unlike `typeof arr` which returns `"object"`.',
  'Does `some()` stop iterating once it finds `true`?':
    'Yes. `Array.prototype.some()` short-circuits and immediately returns `true` on the first element that satisfies the callback.',
  'How do you flatten a deeply nested array?':
    'Use `arr.flat(Infinity)` in modern JS, or recursively/iteratively unpack elements with a stack when `Array.isArray(item)` is true.',
  'How do you check if a property exists on an object itself (`Object.hasOwn`)?':
    '`Object.hasOwn(obj, "key")` checks only own properties (ignoring the prototype chain) and safely works even on `Object.create(null)` objects.',
  'What happens when you spread an object with nested objects?':
    'Only the top-level properties are copied. Nested objects still point to the same references, so mutating a nested field affects both copies.',
  'Is `Object.freeze` deep or shallow?':
    '`Object.freeze` is shallow—it only freezes direct properties of the object. Nested objects remain mutable unless frozen recursively.',
  'What is the difference between `Object.freeze` and `Object.seal`?':
    '`Object.seal` prevents adding or deleting properties but still allows modifying existing values. `Object.freeze` prevents adding, deleting, AND modifying values.',
  'What is the scope chain?':
    'When resolving a variable, JS looks in the current lexical scope first, then walks outward through parent scopes up to the global scope until found.',
  'What is variable shadowing?':
    'Declaring a variable in an inner scope with the same name as one in an outer scope. Inside the inner scope, the inner variable hides the outer one.',
  'What is the Temporal Dead Zone?':
    'The region of a block before a `let` or `const` declaration is reached, where accessing the identifier throws a `ReferenceError`.',
  'Are class declarations hoisted?':
    'Yes, they are hoisted like `let`/`const`, but they stay in the Temporal Dead Zone until the `class` line executes, so you cannot instantiate them before their declaration.',
  'How does rest differ from spread?':
    'Rest (`...args` in parameters/destructuring) collects multiple items into one array/object. Spread (`...arr` in calls/literals) expands an iterable/object into individual items.',
  'What are tagged template literals?':
    'A function call syntax like ``tag`Hello ${name}` `` where the function receives string segments and interpolated values separately—used by `styled-components`, GraphQL (`gql`), and SQL sanitizers.',
  'What is callback hell and how do Promises fix it?':
    'Callback hell is deeply nested callbacks that are hard to read and handle errors for. Promises flatten async steps into `.then()` chains (or `async/await`) with centralized `.catch()` error handling.',
  'What is a predicate function?':
    'A function that takes an input and returns a boolean (`true` or `false`), commonly passed to `.filter()`, `.some()`, `.every()`, or `.find()`.',
  'Does `try/catch` catch errors inside `setTimeout`?':
    'No. `try/catch` only catches synchronous errors in the current call stack. A `setTimeout` callback runs later in a new stack, so it needs its own `try/catch` inside the callback.',
  'Why should you throw `new Error()` instead of a string?':
    'An `Error` instance automatically captures the `.stack` trace, `.message`, and `.name`, making debugging and error monitoring vastly easier.',
  'What is the difference between `__proto__` and `.prototype`?':
    '`.prototype` is a property on constructor functions used as the prototype for instances created with `new`. `__proto__` (or `Object.getPrototypeOf`) is an instance’s internal link to its parent prototype.',
  'What ends the prototype chain?':
    '`Object.prototype` sits at the top of normal objects, and its prototype is `null`, which terminates the lookup chain.',
  'Why must `super()` be called before `this` in a subclass constructor?':
    'In ES6 classes, the parent constructor initializes and creates the `this` object for the subclass; accessing `this` before `super()` throws a `ReferenceError`.',
  'Are class methods enumerable?':
    'No. Methods defined inside a `class` body are non-enumerable by default, so they do not appear in `for...in` or `Object.keys()`.',
  'What error does `Promise.any` throw when all reject?':
    'It rejects with an `AggregateError` whose `.errors` array contains all the individual rejection reasons.',
  'Can a settled Promise change state?':
    'No. Once a Promise is fulfilled or rejected, it is immutable and its state and value can never change.',
  'What happens if you `await` inside `Array.prototype.forEach`?':
    '`forEach` does not await async callbacks—it fires all iterations concurrently and returns `undefined` immediately. Use `for...of` for sequential awaits or `Promise.all(arr.map(...))` for parallel.',
  'How do you handle errors in `async/await`?':
    'Wrap `await` calls in `try/catch/finally` blocks, or attach `.catch()` to the returned Promise.',
  'How does `pipe` differ from `compose`?':
    'Both chain functions together, but `pipe` executes left-to-right (top-to-bottom), while `compose` executes right-to-left (mathematical order).',
  'When are generators useful in real apps?':
    'For lazy infinite sequences, paginated API streams, custom iterators, and stateful step-by-step workflows without loading everything into memory.',
  'What built-in types are iterable in JS?':
    '`Array`, `String`, `Map`, `Set`, `TypedArray`, `arguments`, and DOM `NodeList` all implement `[Symbol.iterator]`. Plain objects `{}` are not iterable by default.',
  'How do async iterators (`for await...of`) work?':
    'They consume `[Symbol.asyncIterator]`, awaiting each yielded Promise sequentially—ideal for paginated APIs, Node streams, or SSE chunks.',
  'Why does `WeakMap` not have `.size` or iteration?':
    'Because keys can be garbage-collected at any unpredictable moment; exposing `.size` or keys would leak non-deterministic GC timing.',
  'Why is `Set.has()` faster than `Array.includes()`?':
    '`Set.has()` uses a hash-table lookup averaging `O(1)` time, whereas `Array.includes()` scans linearly in `O(n)` time.',
  'What is tree-shaking?':
    'A bundler optimization (enabled by static ES `import`/`export`) that removes unused exports from the final production bundle.',
  'When do you use dynamic `import()`?':
    'For code-splitting heavy modules, routes, charts, or modals so they only download when actually needed, speeding up initial load.',
  'What causes a stack overflow error?':
    'Recursion without a valid base case (or exceeding the JS engine’s call stack limit), filling up all stack frames.',
  'What is the Lexical Environment?':
    'The internal engine structure that holds a scope’s local variable bindings (Environment Record) and a reference to its outer parent Lexical Environment.',
  'How do you profile memory leaks in Chrome DevTools?':
    'Use the Memory tab to take Heap Snapshots before and after an action (or Allocation Timeline), then compare retained objects and detached DOM nodes.',
  'Stack vs Heap memory?':
    'The Stack stores primitive values and function call frames in fast, fixed-size LIFO order. The Heap stores dynamically sized objects, arrays, and closures managed by GC.',
  'What is the difference between Reflow and Repaint?':
    'Reflow (layout) recalculates element geometry and positions—expensive. Repaint only redraws visual styles like `color` or `background` without changing layout.',
  'What is `textContent` vs `innerHTML`?':
    '`textContent` inserts plain text safely without parsing HTML. `innerHTML` parses HTML markup, which is slower and introduces XSS risks with untrusted input.',
  'What is `event.target` vs `event.currentTarget`?':
    '`event.target` is the exact element that triggered the event; `event.currentTarget` is the element the event listener is attached to.',
  'What does `stopPropagation()` do?':
    'It stops the event from bubbling (or capturing) further up/down the DOM tree to parent listeners, without cancelling default browser actions like `preventDefault()` does.',
  'How do you abort a `fetch` request?':
    'Pass an `AbortController.signal` into `fetch(url, { signal })` and call `controller.abort()`.',
  'What is the storage limit of `localStorage`?':
    'Typically around 5 MB per origin (synchronous string key-value storage).',
  'What is referential transparency?':
    'An expression is referentially transparent if replacing it with its return value does not change program behavior—a core property of pure functions.',
  'Why does React care about immutability?':
    'React detects changes using fast shallow reference checks (`Object.is`). Creating new objects/arrays lets React reliably know when to re-render.',
  'How do ES Modules behave like Singletons?':
    'An ES module is evaluated only once when first imported; subsequent imports across the app receive the exact same cached module exports.',
  'What is the Decorator pattern?':
    'Wrapping a function or object to add behavior (like logging, caching, or auth checks) without modifying its original source code.',
  'Why are `EXPO_PUBLIC_*` or `NEXT_PUBLIC_*` env vars not secret?':
    'Anything prefixed with `EXPO_PUBLIC_` or `NEXT_PUBLIC_` is inlined directly into the client JS bundle, so anyone inspecting the app can read it.',
  'What is Content Security Policy (CSP)?':
    'An HTTP response header that restricts which scripts, styles, images, and API origins a browser is allowed to load/execute, mitigating XSS.',
  'What is JIT deoptimization?':
    'When a JS engine optimizes a hot function assuming consistent types, and later receives a different object shape or type, forcing it to fall back to slower unoptimized execution.',
  'Why is `delete obj.prop` discouraged in hot paths?':
    '`delete` mutates the object’s hidden class/shape, preventing V8 inline-cache optimizations. Setting `obj.prop = undefined` or creating a new object preserves shape.',
  'How do you find the longest substring without repeating characters?':
    'Use a sliding window with two pointers (`left`, `right`) and a `Map`/`Set` tracking the last seen index of each character, moving `left` past duplicates in `O(n)` time.',
  'How do you flatten a nested array without `.flat(Infinity)`?':
    'Use recursion or an explicit stack (`while (stack.length)`) that pops items and pushes elements back if `Array.isArray(item)`, otherwise appends to the result.',
  'How do you handle circular references in a custom deep clone?':
    'Pass a `WeakMap` (`seen`) mapping each original object to its cloned copy; if `seen.has(obj)` is true, return `seen.get(obj)` immediately.',
  'How do you compare floating-point numbers safely (`Number.EPSILON`)?':
    'Check `Math.abs(a - b) < Number.EPSILON` (or a small tolerance like `1e-9`) instead of `a === b` to avoid binary rounding issues like `0.1 + 0.2 !== 0.3`.',
  'When would you convert recursion to an explicit stack?':
    'When tree or graph depth can exceed the JS call stack limit (~10k frames), risking a `RangeError: Maximum call stack size exceeded`.',
  'Why does `[10, 2, 1].sort()` return `[1, 10, 2]` without a comparator?':
    'By default, `Array.prototype.sort()` converts elements to strings and sorts lexicographically (`"10"` comes before `"2"`). Always pass `(a, b) => a - b` for numbers.',
  'How do you implement a Queue using two Stacks?':
    'Push new items onto an `inStack`. On `dequeue`, if `outStack` is empty, pop everything from `inStack` into `outStack` (reversing order), then pop from `outStack` for amortized `O(1)` time.',
  'What is Big-O time vs space complexity?':
    'Time complexity measures how operation count grows with input size `n`; space complexity measures how extra memory usage grows with `n`.',
  'What changes if `var` is replaced with `let`?':
    'The variable becomes block-scoped instead of function-scoped, enters the Temporal Dead Zone before declaration, and creates a fresh binding per loop iteration.',
  'How would you implement a `retry(fn, attempts)` helper with exponential backoff?':
    'Loop up to `attempts` times inside `try/catch`; on failure, if attempts remain, `await new Promise(r => setTimeout(r, baseMs * 2 ** attempt))`, then rethrow on the final failure.',
  // WordPress Follow-Ups
  'Why should you never edit WordPress core files?':
    'WordPress core updates overwrite `wp-admin` and `wp-includes`, wiping out any direct edits and leaving security holes if you skip updates. Always extend behavior via hooks (`add_action`, `add_filter`) in a plugin or child theme.',
  'How does WordPress handle requests before rendering HTML?':
    '`index.php` loads `wp-load.php` -> `wp-config.php` -> `wp-settings.php`, boots mu-plugins and active plugins, fires `init`, parses permalinks via `WP_Rewrite`, executes the main `WP_Query`, and then loads the matched theme template.',
  'Why is DISALLOW_FILE_EDIT important in production?':
    'It removes the built-in Plugin and Theme File Editor from `wp-admin`, so even if an admin account is compromised, an attacker cannot inject arbitrary PHP directly through the dashboard.',
  'What happens if you change $table_prefix on an existing site?':
    'WordPress will look for tables with the new prefix and think the site is unconfigured unless you also rename the tables AND update prefixed usermeta/options keys like `wp_capabilities` and `wp_user_level`.',
  'What is the difference between plugins_loaded and init?':
    '`plugins_loaded` fires right after all active plugins are included (before the theme and current user are set up). `init` fires later once WordPress, theme `functions.php`, and the logged-in user are ready—making `init` the right place for CPTs and taxonomies.',
  'What are Must-Use (mu-plugins) and when should you use them?':
    'Files in `wp-content/mu-plugins/` load automatically on every request before normal plugins and cannot be deactivated from wp-admin. Use them for critical infrastructure like SSO, security headers, or hosting integration.',
  'Why is wp_enqueue_style preferred over @import in style.css?':
    'CSS `@import` blocks parallel downloads and forces sequential waterfall requests, slowing First Contentful Paint. `wp_enqueue_style()` outputs `<link>` tags that browsers download in parallel and lets WordPress manage dependencies and versioning.',
  'When should code go into a plugin instead of functions.php?':
    'Put presentation/styling helpers in the theme’s `functions.php`, and put business logic (CPTs, shortcodes, REST routes, integrations) in a plugin so switching themes never deletes your data or features.',
  'What is the fallback if single-product.php does not exist?':
    'WordPress falls back to `single.php`, then `singular.php`, and finally `index.php` (unless WooCommerce’s template loader provides its own plugin fallback).',
  'How do Block Themes (FSE) change the Template Hierarchy?':
    'Block Themes resolve HTML templates inside `templates/` (e.g., `templates/single.html`) using the exact same Template Hierarchy order before falling back to PHP templates or `templates/index.html`.',
  'What happens if a shortcode echoes instead of returning?':
    'WordPress evaluates shortcodes while filtering `the_content` before printing the post body, so echoed text appears at the very top of the page or breaks REST/JSON responses.',
  'When should you build a Gutenberg block instead of a shortcode?':
    'Build a Gutenberg block when editors need live visual previews, structured sidebar controls, and native block validation—use shortcodes only for quick legacy embeds.',
  'What is the difference between deactivation and uninstall hooks?':
    'Deactivation temporarily turns a plugin off (keep user data intact, flush rewrite rules). Uninstall (`uninstall.php`) runs only when the user clicks Delete—that is where you clean up custom tables and options.',
  'Why should you never call flush_rewrite_rules() on init?':
    '`flush_rewrite_rules()` regenerates and writes all rewrite rules to `wp_options` in MySQL—running it on every `init` adds expensive DB writes to every page load.',
  'What happens if you omit the 4th argument when a hook passes 3 parameters?':
    'WordPress defaults `$accepted_args` to `1`, so your callback only receives the first parameter and throws an `ArgumentCountError` if it expects 2 or 3.',
  'How do you inspect which callbacks are attached to a hook?':
    'Inspect the global `$wp_filter["hook_name"]` array or use Query Monitor’s Hooks & Actions panel in local development.',
  'Why is it hard to remove an anonymous closure hook?':
    '`remove_action()` / `remove_filter()` requires the exact same function reference. Anonymous closures cannot be referenced externally unless stored in a variable or replaced with a named function/class method.',
  'What happens if a filter callback forgets to return a value?':
    'PHP implicitly returns `null`, wiping out the filtered content, title, or array for every subsequent filter and the final output.',
  'Why does a newly registered CPT return 404 until permalinks are saved?':
    'WordPress caches permalink regex rules in the `rewrite_rules` option in `wp_options`; until rules are flushed, WordPress does not know how to route the new CPT slug.',
  'What does show_in_rest => true control?':
    'It exposes the CPT or taxonomy under `/wp-json/wp/v2/...` AND enables the modern Gutenberg Block Editor (without it, WordPress falls back to the Classic Editor).',
  'Why is tax_query faster than meta_query for filtering?':
    'Taxonomy lookups join integer IDs in indexed `wp_term_relationships` tables, whereas `meta_query` filters against an unindexed `LONGTEXT` `meta_value` column.',
  'What is the difference between hierarchical => true and false?':
    '`hierarchical => true` behaves like Categories (parent/child tree with checkboxes); `false` behaves like Tags (flat comma-separated labels).',
  'Why do we call wp_unslash() before sanitizing $_POST in WordPress?':
    'For legacy reasons WordPress runs `wp_magic_quotes()` on superglobals, adding backslashes to quotes—so you must strip them with `wp_unslash()` before sanitizing or saving.',
  'What does the third parameter $single = true do in get_post_meta()?':
    '`true` returns the single scalar value (string/array) directly; `false` wraps all matching meta rows in an indexed array.',
  'How do ACF Blocks differ from standard React Gutenberg blocks?':
    'ACF Blocks let PHP/WordPress developers build custom Gutenberg blocks using `block.json` + a PHP render template and ACF fields instead of writing React `edit.js` components.',
  'Why can querying repeater subfields in WP_Query be slow?':
    'ACF Repeaters store rows as `repeater_0_field`, `repeater_1_field` in `wp_postmeta`, forcing slow `LIKE "repeater_%_field"` wildcard scans on an unindexed `meta_key`/`meta_value`.',
  'What causes the "Attempt Block Recovery" validation error in Gutenberg?':
    'It happens when a Static Block’s `save()` function is changed in JS, so the HTML stored in `post_content` no longer matches the markup `save()` now produces.',
  'Why is block.json recommended over JS-only registerBlockType?':
    '`block.json` lets WordPress register assets lazily (loading block JS/CSS only when the block is actually used on a page) and shares metadata cleanly between PHP and JS.',
  'Why should you never use query_posts()?':
    '`query_posts()` overwrites the global `$wp_query` main loop, breaks pagination and conditionals, and wastes a second SQL query on top of the main query that already ran.',
  'What does wp_reset_postdata() do vs wp_reset_query()?':
    '`wp_reset_postdata()` restores the global `$post` object after a custom `new WP_Query()` loop; `wp_reset_query()` restores the entire `$wp_query` global (only needed after `query_posts()`).',
  'Why is permission_callback required on every REST route?':
    'It forces developers to explicitly declare who can access an endpoint (`current_user_can(...)` or `__return_true` for public reads), preventing accidental open write/delete APIs.',
  'How does cookie auth with X-WP-Nonce work in the REST API?':
    'Logged-in browser users send their auth cookie automatically, plus an `X-WP-Nonce` header generated with `wp_create_nonce("wp_rest")` to prove the request came from your site (stopping CSRF).',
  'Why does wp_postmeta use the Entity-Attribute-Value (EAV) pattern, and what is its downside?':
    'EAV lets plugins store arbitrary custom fields without altering DB schemas, but it requires expensive self-joins and cannot efficiently index or sort mixed types in `LONGTEXT`.',
  'What is stored in wp_posts besides blog posts?':
    'Pages, Custom Post Types, media attachments, revisions, navigation menu items, and WooCommerce legacy orders/coupons.',
  'What is the difference between $wpdb->get_results, get_row, and get_var?':
    '`get_results()` returns an array of rows, `get_row()` returns a single row object/array, and `get_var()` returns a single scalar value (like a `COUNT(*)`).',
  'How do you safely handle IN (...) clauses with $wpdb->prepare()?':
    'Generate one `%d` or `%s` placeholder per array item (e.g., `implode(",", array_fill(0, count($ids), "%d"))`) and pass `$ids` as the arguments to `$wpdb->prepare()`.',
  'Why should add_role() never run on every init request?':
    '`add_role()` writes serialized role data to `wp_options` on every call; running it on `init` causes unnecessary DB writes on every page load.',
  'What is the difference between primitive and meta capabilities (e.g. edit_posts vs edit_post)?':
    'Primitive capabilities (`edit_posts`) are stored directly on roles, while meta capabilities (`edit_post`, `$post_id`) are mapped dynamically by `map_meta_cap()` based on post ownership and status.',
  'What is the difference between wp_ajax_ and wp_ajax_nopriv_?':
    '`wp_ajax_{action}` only fires for logged-in users, whereas `wp_ajax_nopriv_{action}` fires for logged-out visitors.',
  'Why are nonces alone not enough without capability checks?':
    'A nonce only proves a logged-in user intentionally triggered the request (anti-CSRF)—it does NOT prove that user has permission (e.g. a Subscriber could still have a valid nonce if you don’t check `current_user_can()`).',
  'Why did WooCommerce introduce HPOS?':
    'Moving orders out of `wp_posts`/`wp_postmeta` into dedicated `wp_wc_orders` tables eliminates table contention with blog/product queries and speeds up order filtering by 5x–10x.',
  'How do you declare HPOS compatibility in a custom WooCommerce plugin?':
    'Hook `before_woocommerce_init` and call `Automattic\\WooCommerce\\Utilities\\FeaturesUtil::declare_compatibility("custom_order_tables", __FILE__, true)`.',
  'Why should you avoid overriding entire WooCommerce templates when a hook exists?':
    'Overridden templates freeze old HTML and require manual diffs whenever WooCommerce updates templates, whereas action/filter hooks stay compatible across updates.',
  'How do WooCommerce Checkout Blocks change checkout customization?':
    'Block-based Checkout renders in React using Store API endpoints instead of classic PHP templates, so customizations use SlotFills, Store API extensions, and `woocommerce_store_api_*` hooks.',
  'What happens if you call wp_schedule_event() without checking wp_next_scheduled()?':
    'WordPress queues a duplicate cron event on every single page load, flooding `wp_options` and running the job thousands of times.',
  'When is Action Scheduler better than wp_schedule_single_event()?':
    'Action Scheduler stores jobs in custom indexed tables, processes batches safely within memory/time limits, and provides built-in retries and UI logging.',
  'Where are Transients stored if no persistent Object Cache (Redis) is installed?':
    'Without Redis/Memcached, WordPress stores transients in `wp_options`—so expired transients can bloat the database if not cleaned up.',
  'Why can full-page caching break WooCommerce cart or user-specific widgets?':
    'Full-page HTML caches serve the exact same static HTML to everyone, so logged-in headers or cart counts must either bypass cache (`woocommerce_items_in_cart` cookie) or load via AJAX/REST.',
  'Why is posts_per_page => -1 dangerous in production?':
    'If a table grows to 50,000 posts, `posts_per_page => -1` loads every post and its meta into PHP memory at once, causing OOM crashes. Always set a sane upper cap like `100`.',
  'How does Query Monitor help pinpoint a slow plugin?':
    'Its Queries by Component and HTTP API panels show exact query time, caller stack trace, and plugin/theme attribution for every slow SQL or external request.',
  'What is the difference between esc_html() and esc_attr()?':
    '`esc_html()` escapes text inside HTML element bodies, while `esc_attr()` escapes values inside HTML tag attributes (running through the `attribute_escape` filter).',
  'Why is a WordPress nonce not a substitute for current_user_can()?':
    'Nonces protect against CSRF; `current_user_can()` enforces authorization. You need both on privileged actions.',
  'Why does WP_DEBUG_DISPLAY = true break AJAX or REST API responses?':
    'Any PHP warning or notice printed directly to output corrupts the JSON response body, causing `JSON.parse` errors on the client.',
  'How do you inspect all SQL queries executed on a page?':
    'Enable `define("SAVEQUERIES", true)` in local dev and inspect `$wpdb->queries` or use Query Monitor.',
  'Why does raw SQL REPLACE() corrupt WordPress options and ACF data?':
    'PHP `serialize()` records exact byte lengths (e.g. `s:22:"https://old-site.local"`). Changing the URL length without updating `s:22` makes `unserialize()` fail and return `false`.',
  'What are the benefits of Bedrock over a standard WordPress folder layout?':
    'Bedrock manages WordPress core and plugins via Composer, moves `wp-config` to `.env`, places `wp-content` under `web/app/`, and keeps `wp/` isolated from custom code.',
  'When is Headless WordPress overkill compared to a classic/block theme?':
    'For standard content/marketing sites where SEO plugins, WooCommerce checkout, and visual page builders are needed out-of-the-box, a classic/block theme with CDN caching is far simpler and cheaper.',
  'How do you handle Gutenberg previews in a decoupled Next.js frontend?':
    'Generate a short-lived signed preview token on WordPress that redirects to Next.js Draft Mode (`/api/draft?secret=...&id=...`), which fetches the latest revision using authenticated credentials.',
  'How do you prevent race conditions when two requests update the same wp_option?':
    'Use Redis atomic locks (`wp_cache_add` / Redis `SET NX`), or store high-concurrency counters in a custom SQL table with `UPDATE ... SET count = count + 1` instead of serialized `wp_options`.',
  'How do you scale WordPress media uploads across multiple web servers?':
    'Offload `wp-content/uploads` to S3/Cloudflare R2 (via WP Offload Media) behind a CDN so all app servers stay stateless.',
  // PHP, Laravel & MySQL Follow-Ups
  'What changed with `0 == ""` in PHP 8 compared to PHP 7?':
    'In PHP 7, `0 == ""` was `true` because `""` coerced to `0`. In PHP 8+, non-numeric strings are compared as strings (`"0" == ""` -> `false`), fixing a huge source of bugs.',
  'What is the difference between `const` and `define()` in PHP?':
    '`const` is evaluated at compile time (can be used inside classes/namespaces, slightly faster), while `define()` runs at runtime (can be placed inside `if` blocks).',
  'Why does json_encode sometimes turn a filtered PHP array into a JSON object?':
    '`array_filter()` preserves original array keys—so `[0 => "a", 2 => "c"]` has non-sequential keys, causing `json_encode` to emit `{"0":"a","2":"c"}`. Call `array_values()` first.',
  'What is the difference between array_merge() and + for arrays?':
    '`array_merge()` re-indexes numeric keys and overwrites duplicate string keys with later values; `+` keeps the left-hand array’s values on key collisions.',
  'Can an arrow function in PHP modify a variable in the outer scope?':
    'No—PHP arrow functions (`fn() => ...`) always capture outer variables by value. Use a full `function () use (&$var) {}` closure to mutate an outer variable.',
  'What is the `mixed` vs `never` return type in PHP 8?':
    '`mixed` accepts any type (equivalent to `object|resource|array|string|int|float|bool|null`), while `never` means the function always `throw`s or `exit`s and never returns.',
  'Why is $_POST empty when a client sends application/json?':
    'PHP only populates `$_POST` for `application/x-www-form-urlencoded` and `multipart/form-data`. For JSON, read `file_get_contents("php://input")` and `json_decode()`.',
  'Why is PHP_SELF dangerous if echoed unescaped in a form action?':
    'An attacker can append `/"><script>...</script>` to the URL, injecting XSS via `$_SERVER["PHP_SELF"]`. Always escape with `htmlspecialchars()` or omit `action` for self-submit.',
  'Why does session_regenerate_id(true) prevent session fixation?':
    'It issues a brand-new random `PHPSESSID` and deletes the old session file, invalidating any session ID an attacker may have planted before login.',
  'Why use Redis instead of default file sessions when scaling across multiple servers?':
    'Local `/tmp` session files only exist on one web server; a load balancer routing the next request to Server B would log the user out unless sessions live in shared Redis.',
  'What is the difference between `self::` and `static::` (late static binding) in PHP?':
    '`self::` resolves to the class where the method is defined; `static::` resolves to the runtime subclass that was actually called.',
  'Why mark concrete service classes `final`?':
    'Marking leaf classes `final` prevents fragile deep inheritance hierarchies and encourages composition via interfaces.',
  'What is the difference between composer install and composer update?':
    '`composer install` installs exact versions from `composer.lock`; `composer update` resolves newer versions matching `composer.json` and rewrites `composer.lock`.',
  'Why do libraries avoid committing composer.lock while applications commit it?':
    'Applications need reproducible deploys; libraries must remain compatible across whatever versions downstream apps resolve.',
  'What is the difference between LogicException and RuntimeException in PHP?':
    '`LogicException` indicates a programmer bug (bad argument, invalid state) that should be fixed in code; `RuntimeException` represents an external runtime failure (network timeout, disk full).',
  'Why is the @ error suppression operator discouraged?':
    '`@` hides real failures, makes debugging painful, and in older PHP versions temporarily altered `error_reporting` on every call.',
  'What is the difference between bindParam() and bindValue() in PDO?':
    '`bindValue()` binds the value immediately when called; `bindParam()` binds a variable by reference, reading its value only when `execute()` runs (useful in loops).',
  'Can prepared statements parameterize table or column names?':
    'No—SQL parameters only bind data values, never identifiers. To allow dynamic `ORDER BY` columns safely, whitelist allowed column names in PHP first.',
  'How does `match` differ from `switch` in PHP 8?':
    '`match` uses strict `===`, returns a value, has no fall-through `break` bugs, and throws `UnhandledMatchError` if no arm matches.',
  'What does `readonly class` enforce in PHP 8.2+?':
    'Every declared property in the class is automatically `readonly` and dynamic properties are forbidden, making immutable DTOs concise.',
  'How do you calculate the right pm.max_children for a server?':
    'Divide available RAM (after OS/DB/Redis) by the average memory per PHP-FPM worker (typically 30–60 MB), e.g. 2 GB / 50 MB = ~40 workers.',
  'Why do long-running PHP processes like Laravel Octane change memory rules?':
    'Workers stay booted across thousands of requests instead of resetting after each one, so static arrays or singletons holding request/user state will leak memory and cross-contaminate users.',
  'What is the difference between register() and boot() in a Service Provider?':
    '`register()` is only for binding things into the Service Container (other providers may not be registered yet). `boot()` runs after ALL providers are registered, so you can safely resolve services, register listeners, or view composers.',
  'What is the difference between `with()` and `load()`?':
    '`with()` eager-loads relations as part of the initial query builder; `load()` eager-loads relations onto an already-fetched Eloquent Collection.',
  'What HTTP status code does Laravel return when FormRequest validation fails on an API request?':
    '`422 Unprocessable Entity` with a JSON `errors` object keyed by field name.',
  'What is the difference between `lockForUpdate()` and `sharedLock()`?':
    '`lockForUpdate()` (`SELECT ... FOR UPDATE`) blocks other transactions from both reading-with-lock and modifying the row; `sharedLock()` (`LOCK IN SHARE MODE`) allows concurrent reads but blocks writes.',
  'Why does applying a function like `WHERE YEAR(created_at) = 2026` break index usage?':
    'The B-Tree index stores raw `created_at` timestamps, not computed `YEAR()` values, so MySQL must compute `YEAR()` for every row (full scan). Rewrite as a range `>= "2026-01-01" AND < "2027-01-01"`.',
  'What UI trade-off does cursor pagination have vs numbered pages?':
    'Cursor pagination supports fast Next/Previous and infinite scroll, but cannot jump directly to arbitrary page numbers like "Page 14" without an offset.',
  'What is the difference between a dirty read, non-repeatable read, and phantom read?':
    'Dirty read: reading uncommitted data. Non-repeatable read: re-reading a row sees updated committed values. Phantom read: re-running a range query sees newly inserted matching rows.',
  'Why is `DENSE_RANK()` better than `ROW_NUMBER()` for "2nd highest salary"?':
    'If two employees tie for the highest salary ($100k), `ROW_NUMBER()` assigns them 1 and 2 (returning $100k as 2nd!), whereas `DENSE_RANK()` assigns both rank 1 and the next distinct salary rank 2.',
};

export function resolveFollowUpAnswer(
  question: string,
  topicTitle?: string,
  categoryName?: string
): string {
  const exact = FOLLOW_UP_ANSWERS[question.trim()];
  if (exact) return exact;

  const subject = topicTitle ? `${topicTitle}` : 'this concept';
  const tech = categoryName ? ` in ${categoryName}` : '';
  return `In an interview, explain ${subject}${tech} clearly by stating the core mechanism, when to choose it over alternatives, and one concrete production trade-off or pitfall to watch out for.`;
}
