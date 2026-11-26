import type { InterviewQuestion } from '@/types/content';

export const JAVASCRIPT_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'js-q-introduction',
    categoryId: 'javascript',
    topicId: 'js-introduction',
    title: 'What is JavaScript and how is it executed?',
    difficulty: 'beginner',
    shortAnswer:
      'JavaScript is a high-level, single-threaded, dynamically typed language executed by JS engines like V8 via parsing, JIT compilation, and an event-driven runtime.',
    humanInterviewAnswer:
      'JavaScript is a single-threaded, dynamically typed language that powers interactive web UIs, mobile apps, and Node.js backends. Under the hood, a JS engine like V8 parses your code into an AST, compiles hot paths with JIT, and runs synchronous code on one call stack while delegating async work to the event loop.',
    detailedExplanation:
      'JavaScript engines (V8, SpiderMonkey, JavaScriptCore) combine an interpreter and a Just-In-Time (JIT) compiler. Because JS has one main call stack, long synchronous tasks block the UI, while I/O and timers are offloaded to host APIs (browser Web APIs or libuv in Node.js) and queued back via microtasks and macrotasks.',
    practicalExample:
      'When a user taps a Like button, JS updates the UI immediately on the main thread while `fetch()` runs asynchronously in the background.',
    codeExample: {
      language: 'javascript',
      code: `let status = 'Loading';\nconsole.log(typeof status);\nstatus = 200;\nconsole.log(typeof status);`,
      expectedOutput: 'string\nnumber',
    },
    followUpQuestions: [
      'What does single-threaded mean?',
      'How does JS run outside the browser?',
    ],
    interviewerExpectations: [
      'Mention single-threaded call stack and dynamic typing.',
      'Briefly explain JS engine (V8) + host runtime (Browser / Node.js).',
    ],
    keyConcepts: ['single-threaded', 'dynamic typing', 'V8', 'event loop', 'JIT'],
    tags: ['introduction', 'fundamentals', 'runtime'],
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
      '`var` declarations are hoisted to the top of their enclosing function (or global scope) and initialized to `undefined`, and they allow redeclaration in the same scope. `let` and `const` are block-scoped (`{}`, `if`, `for`), cannot be redeclared in the same scope, and remain uninitialized in the Temporal Dead Zone (TDZ) until execution reaches their declaration. Note that `const` locks the variable binding, not the contents of an object or array.',
    practicalExample:
      'Using `let` in a `for` loop with async callbacks (`setTimeout`) ensures each iteration gets its own block-scoped value instead of sharing one `var` variable.',
    codeExample: {
      language: 'javascript',
      code: `if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a);\nconsole.log(typeof b);`,
      expectedOutput: '1\nundefined',
    },
    followUpQuestions: [
      'Can you mutate properties of an object declared with `const`?',
      'What happens if you access a `let` variable inside its block before the line where it is declared?',
    ],
    interviewerExpectations: [
      'Mention block scope vs. function scope.',
      'Explain Temporal Dead Zone (TDZ) accurately.',
      'Clarify that `const` prevents reassignment, not object mutation.',
    ],
    keyConcepts: ['block scope', 'function scope', 'hoisting', 'temporal dead zone', 'reassignment'],
    tags: ['fundamentals', 'variables', 'scope'],
  },
  {
    id: 'js-q-equality',
    categoryId: 'javascript',
    topicId: 'js-fundamentals',
    title: 'How does `==` differ from `===`, and when would you ever use `==`?',
    difficulty: 'beginner',
    shortAnswer:
      '`===` checks both value and type without coercion, while `==` performs type coercion before comparing.',
    humanInterviewAnswer:
      '`===` is strict equality—it checks that both the type and value match, so `"5" === 5` is false. `==` tries to convert types first, which causes weird edge cases like `"" == 0` being true. In practice I always use `===`, except one common shortcut: `value == null` cleanly checks for both `null` and `undefined` at once.',
    detailedExplanation:
      'Strict equality (`===`) immediately returns `false` if operands have different types (except `NaN === NaN` is `false` and `+0 === -0` is `true`). Loose equality (`==`) follows the Abstract Equality Comparison algorithm, coercing strings/booleans to numbers or calling `valueOf`/`toString` on objects.',
    practicalExample:
      'Validating API query parameters or checking `if (user == null)` to handle both missing (`undefined`) and explicitly empty (`null`) fields.',
    codeExample: {
      language: 'javascript',
      code: `console.log(0 == '');\nconsole.log(0 === '');\nconsole.log(null == undefined);\nconsole.log(null === undefined);`,
      expectedOutput: 'true\nfalse\ntrue\nfalse',
    },
    followUpQuestions: [
      'How does `Object.is(NaN, NaN)` differ from `NaN === NaN`?',
      'Why is `[] == ![]` true in JavaScript?',
    ],
    interviewerExpectations: [
      'Explain type coercion clearly.',
      'Give a concrete pitfall of `==` and mention `== null` as the one acceptable idiom.',
    ],
    keyConcepts: ['type coercion', 'strict equality', 'null', 'undefined'],
    tags: ['operators', 'coercion'],
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
      'A closure happens when an inner function remembers variables from its outer function even after that outer function finishes running. I use closures all the time for private state, custom React hooks, memoization caches, and `debounce`/`throttle` helpers where the timer ID needs to persist between calls without polluting global scope.',
    detailedExplanation:
      'Because JavaScript uses lexical scoping, a function’s scope chain is determined by where it is defined. When an inner function is returned or passed as a callback, it keeps a live reference to its outer Lexical Environment, preventing those referenced variables from being garbage-collected.',
    practicalExample:
      'Building a `debounce(fn, delay)` search handler where `timerId` lives inside the closure across keystrokes.',
    codeExample: {
      language: 'javascript',
      code: `function createCounter(start = 0) {\n  let count = start;\n  return () => ++count;\n}\nconst next = createCounter(5);\nconsole.log(next(), next());`,
      expectedOutput: '6 7',
    },
    followUpQuestions: [
      'Can closures cause memory leaks? How do you avoid them?',
      'How do closures behave inside a `for` loop with `var` vs `let`?',
    ],
    interviewerExpectations: [
      'Explain lexical scope and persistence after outer return.',
      'Give at least 2 real-world examples (debounce, private state, memoization).',
      'Acknowledge memory retention trade-offs.',
    ],
    keyConcepts: ['lexical scope', 'outer function', 'private state', 'memory'],
    tags: ['closures', 'scope', 'functions'],
  },
  {
    id: 'js-q-this-binding',
    categoryId: 'javascript',
    topicId: 'js-this-prototypes',
    title: 'How is the value of `this` determined in JavaScript?',
    difficulty: 'intermediate',
    shortAnswer:
      'For regular functions, `this` depends on how the function is called (receiver, `call/apply/bind`, `new`, or global/undefined). Arrow functions inherit `this` lexically.',
    humanInterviewAnswer:
      'The easiest way to think about `this` is: for a normal function, look at *how it was called*, not where it was written. If you call `user.greet()`, `this` is `user`. If you call a detached function on its own, `this` is `undefined` in strict mode. You can override it explicitly with `call`, `apply`, or `bind`. Arrow functions are the exception—they have no `this` of their own and just inherit it from the surrounding scope.',
    detailedExplanation:
      'There are 4 binding rules for regular functions (in order of precedence): 1) `new` binding (newly created object), 2) Explicit binding (`call`, `apply`, `bind`), 3) Implicit binding (`obj.method()`), and 4) Default binding (`undefined` in strict mode, `globalThis` in sloppy mode). Arrow functions bypass these rules and capture `this` lexically.',
    practicalExample:
      'Passing an object method as a `setTimeout` or event callback loses implicit `this` unless wrapped in an arrow function or bound with `.bind(this)`.',
    codeExample: {
      language: 'javascript',
      code: `const dev = { name: 'Sara', say() { return this.name; } };\nconst detached = dev.say;\nconsole.log(dev.say());\nconsole.log(detached.call({ name: 'Alex' }));`,
      expectedOutput: 'Sara\nAlex',
    },
    followUpQuestions: [
      'What is the difference between `call`, `apply`, and `bind`?',
      'Can you change an arrow function’s `this` using `.bind()`?',
    ],
    interviewerExpectations: [
      'Explain call-site determination for regular functions.',
      'Contrast with lexical `this` in arrow functions.',
      'Know `call`/`apply`/`bind`.',
    ],
    keyConcepts: ['call site', 'implicit binding', 'call apply bind', 'new', 'lexical this'],
    tags: ['this', 'context', 'prototypes'],
  },
  {
    id: 'js-q-event-loop',
    categoryId: 'javascript',
    topicId: 'js-async-event-loop',
    title: 'Explain the JavaScript Event Loop, Microtasks, and Macrotasks.',
    difficulty: 'advanced',
    shortAnswer:
      'JavaScript runs synchronous code on the Call Stack, then drains the entire Microtask Queue (`Promise.then`, `queueMicrotask`) before taking the next Macrotask (`setTimeout`, I/O).',
    humanInterviewAnswer:
      'JavaScript is single-threaded, so it uses the Event Loop to handle async work without blocking. Synchronous code runs first on the Call Stack. Once the stack is empty, the Event Loop checks the Microtask Queue—like `Promise.then` or code after `await`—and runs *all* of them until the queue is empty. Only after that does it pick one Macrotask like `setTimeout` and repeat.',
    detailedExplanation:
      'Web APIs / Node libuv handle timers, network requests, and file I/O off the main thread. When they finish, their callbacks are queued: `setTimeout`, `setInterval`, and DOM events go to the Macrotask (Task) Queue, while Promise reactions (`.then`/`.catch`/`.finally`) and `queueMicrotask` go to the Microtask Queue. Microtasks always have priority over the next Macrotask and browser repaint.',
    practicalExample:
      'Predicting execution order when mixing `console.log`, `setTimeout(..., 0)`, and `Promise.resolve().then(...)`.',
    codeExample: {
      language: 'javascript',
      code: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
      expectedOutput: '1\n4\n3\n2',
    },
    followUpQuestions: [
      'What happens if a microtask continuously schedules another microtask?',
      'Where does `async/await` fit in the microtask queue?',
    ],
    interviewerExpectations: [
      'Distinguish Call Stack, Microtask Queue, and Macrotask Queue.',
      'State that all microtasks drain before the next macrotask.',
      'Accurately trace `1, 4, 3, 2`.',
    ],
    keyConcepts: ['call stack', 'microtask queue', 'macrotask queue', 'promise', 'setTimeout'],
    tags: ['event loop', 'async', 'promises'],
  },
  {
    id: 'js-q-shallow-deep-copy',
    categoryId: 'javascript',
    topicId: 'js-arrays-objects',
    title: 'What is the difference between a shallow copy and a deep copy?',
    difficulty: 'intermediate',
    shortAnswer:
      'A shallow copy duplicates only top-level properties (nested objects still share references), while a deep copy recursively clones all nested levels.',
    humanInterviewAnswer:
      'When you use spread `{ ...obj }` or `Object.assign`, it only copies the first level—any nested object or array still points to the same reference in memory, so mutating it mutates the original too. For a true deep copy in modern JS, I use `structuredClone(obj)` because it handles nested objects, arrays, Dates, Maps, and Sets cleanly without `JSON.stringify` quirks.',
    detailedExplanation:
      'Shallow copying (`{...obj}`, `[...arr]`, `Array.prototype.slice()`) is fast and ideal for immutable React state updates when you only replace the changed path. Deep copying (`structuredClone`) creates completely independent nested structures. `JSON.parse(JSON.stringify(obj))` drops functions, `undefined`, `Date` types, and fails on circular references.',
    practicalExample:
      'Preventing accidental state mutation when editing a nested user profile form in React or Zustand.',
    codeExample: {
      language: 'javascript',
      code: `const original = { user: { name: 'Leo' } };\nconst shallow = { ...original };\nshallow.user.name = 'Mia';\nconsole.log(original.user.name);`,
      expectedOutput: 'Mia',
    },
    followUpQuestions: [
      'What are the limitations of `JSON.parse(JSON.stringify(obj))`?',
      'What can `structuredClone` NOT clone?',
    ],
    interviewerExpectations: [
      'Explain shared nested references in shallow copies.',
      'Mention `structuredClone` and `JSON.parse(JSON.stringify)` trade-offs.',
    ],
    keyConcepts: ['reference', 'shallow copy', 'deep copy', 'structuredClone', 'spread'],
    tags: ['objects', 'immutability'],
  },
  {
    id: 'js-q-promise-combinators',
    categoryId: 'javascript',
    topicId: 'js-async-event-loop',
    title: 'Compare `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any`.',
    difficulty: 'advanced',
    shortAnswer:
      '`all` fails fast on any rejection, `allSettled` waits for all results regardless of failure, `race` settles with the first settled promise, and `any` resolves with the first fulfilled promise.',
    humanInterviewAnswer:
      'I pick the combinator based on how I want failures handled. If I need all API calls to succeed together, I use `Promise.all`—it rejects immediately if any one fails. If I am loading independent dashboard widgets and want partial results even if one fails, I use `Promise.allSettled`. For timeouts, `Promise.race` works great, and `Promise.any` is ideal when querying redundant mirrors and I just want the first success.',
    detailedExplanation:
      '- `Promise.all(iterable)`: Resolves to an array of values when all fulfill; rejects immediately on first rejection.\n- `Promise.allSettled(iterable)`: Never rejects; returns `{ status: "fulfilled", value }` or `{ status: "rejected", reason }` for every promise.\n- `Promise.race(iterable)`: Settles with the very first promise that fulfills OR rejects.\n- `Promise.any(iterable)`: Resolves with the first fulfilled promise; only rejects (with `AggregateError`) if all reject.',
    practicalExample:
      'Loading dashboard cards in parallel with `Promise.allSettled` so one failing widget does not break the entire screen.',
    codeExample: {
      language: 'javascript',
      code: `Promise.allSettled([\n  Promise.resolve('OK'),\n  Promise.reject('Fail'),\n]).then((res) => console.log(res.map((r) => r.status).join(',')));`,
      expectedOutput: 'fulfilled,rejected',
    },
    followUpQuestions: [
      'What error type does `Promise.any` throw if all promises reject?',
      'How do you implement a fetch timeout using `Promise.race` or `AbortController`?',
    ],
    interviewerExpectations: [
      'Accurately contrast fail-fast (`all`) vs resilient (`allSettled`) vs first-settled (`race`) vs first-success (`any`).',
      'Give a practical dashboard/timeout use case.',
    ],
    keyConcepts: ['Promise.all', 'Promise.allSettled', 'Promise.race', 'Promise.any'],
    tags: ['promises', 'async'],
  },
];
