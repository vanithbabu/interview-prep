import type { TopicDetail } from '@/types/content';

import { EXAMPLES_01_10 } from './examples-01-10';
import { EXAMPLES_11_20 } from './examples-11-20';
import { EXAMPLES_21_30 } from './examples-21-30';
import { EXAMPLES_31_40 } from './examples-31-40';
import { EXAMPLES_41_50 } from './examples-41-50';

export const JS_FUNCTIONS_TOPIC: TopicDetail = {
  id: 'js-functions',
  categoryId: 'javascript',
  title: 'Functions, Arrow Functions & Parameters',
  level: 'beginner',
  estimatedMinutes: 35,
  introduction:
    'Functions are the building blocks of every JavaScript application. Whether you are handling a button click in React, transforming API data in Next.js, or writing custom middleware in Express, you are writing and composing functions.',
  simpleExplanation:
    'Think of a function like a coffee machine: you put ingredients in (parameters), it runs a repeatable recipe inside, and it hands you back a drink (return value). In JavaScript, functions are even more flexible—you can store them in variables, pass them to other functions, and return them.',
  whyWeUseIt:
    'Functions eliminate code duplication, give meaningful names to complex logic, isolate variables in local scope so they do not collide, and let us pass behavior around as callbacks, event handlers, and hooks.',
  howItWorksInternally:
    'When JavaScript parses a script, function declarations are hoisted into memory during the creation phase. When a function is invoked, JS pushes a new Execution Context onto the Call Stack with its own Lexical Environment (local variables + reference to outer scope) and `this` binding, then pops it when `return` is reached.',
  syntaxVariations: [
    { label: 'Function Declaration', pattern: 'function add(a, b) { return a + b; }' },
    { label: 'Function Expression', pattern: 'const add = function(a, b) { return a + b; };' },
    { label: 'Arrow Function (Concise)', pattern: 'const add = (a, b) => a + b;' },
    { label: 'Default + Rest Params', pattern: 'const log = (tag = "INFO", ...msgs) => {};' },
    { label: 'Destructured Params', pattern: 'const render = ({ title, count = 0 } = {}) => {};' },
  ],
  examples: [
    ...EXAMPLES_01_10,
    ...EXAMPLES_11_20,
    ...EXAMPLES_21_30,
    ...EXAMPLES_31_40,
    ...EXAMPLES_41_50,
  ],
  realWorldUsage: [
    'React functional components and custom hooks (`useDebounce`, `useFetch`).',
    'Array data pipelines (`.map()`, `.filter()`, `.reduce()`) for API responses.',
    'Express/Next.js middleware and route handlers.',
    'Debouncing search inputs and throttling scroll listeners.',
  ],
  commonMistakes: [
    'Forgetting parentheses `({})` when returning an object literal from a concise arrow function.',
    'Using arrow functions as object methods or constructors when dynamic `this` or `new` is needed.',
    'Calling a `const` function expression before its declaration line (Temporal Dead Zone `ReferenceError`).',
    'Using `var` in loops with async callbacks or closures instead of `let`.',
  ],
  bestPractices: [
    'Keep functions small, single-purpose, and use early return guard clauses.',
    'Prefer `const` arrow functions or named declarations consistently, and avoid mutating input arguments.',
    'Use default parameters (`= {}`) with destructured options objects to prevent `TypeError` on missing args.',
    'Give function expressions names when writing recursive logic for clearer stack traces.',
  ],
  interviewQuestions: [
    {
      id: 'js-fn-q1',
      level: 'beginner',
      question: 'What is the difference between a function declaration and a function expression?',
      spokenAnswer:
        'A function declaration uses the `function` keyword at the top level of a statement and is hoisted completely, so you can call it before it appears in the file. A function expression assigns a function to a variable—like `const fn = function() {}`—so it follows variable scoping and cannot be called before initialization.',
      detailedAnswer:
        'During the creation phase of an Execution Context, function declarations are stored in memory with their full body. Function expressions (`const`/`let`) remain in the Temporal Dead Zone until assignment, or if declared with `var`, are initialized as `undefined` (throwing `TypeError` if invoked early). Function expressions are great for conditional assignment, callbacks, and IIFEs.',
      followUps: [
        {
          question: 'When would you choose a named function expression over an anonymous one?',
          answer:
            'When the function needs to call itself recursively or when you want clear function names in production error stack traces.',
        },
      ],
    },
    {
      id: 'js-fn-q2',
      level: 'intermediate',
      question: 'How do arrow functions differ from regular functions?',
      spokenAnswer:
        'Three main differences: arrow functions do not have their own `this`—they inherit `this` lexically from the surrounding scope; they do not have an `arguments` object (we use `...args` instead); and they cannot be called with `new` as constructors.',
      detailedAnswer:
        'Arrow functions were designed for short callbacks and preserving `this` inside methods or React class/hook callbacks. Because `this` is lexically bound at creation time, `.call()`, `.apply()`, and `.bind()` cannot change an arrow function’s `this`. They also lack a `.prototype` property.',
      followUps: [
        {
          question: 'Should you use arrow functions for object methods?',
          answer:
            'Usually no, because `this` inside an arrow method will point to the outer module/window scope rather than the object itself.',
        },
      ],
    },
    {
      id: 'js-fn-q3',
      level: 'advanced',
      question: 'What is a closure, and what are its practical uses and memory trade-offs?',
      spokenAnswer:
        'A closure is when an inner function remembers and can access variables from its outer function even after the outer function has finished executing. We use closures for private state, memoization, debouncing, and factory functions. The trade-off is that captured variables stay in memory as long as the inner function is referenced.',
      detailedAnswer:
        'Lexical scoping means a function’s scope chain is decided where it is written. When an inner function outlives its outer execution context, the JS garbage collector keeps the referenced outer lexical environment alive. If a closure accidentally captures a huge object or DOM node that is no longer needed, it can cause a memory leak.',
      followUps: [
        {
          question: 'How does `let` fix the classic `for` loop closure bug?',
          answer:
            '`let` is block-scoped and creates a fresh binding for each iteration of the loop, whereas `var` shares a single binding across all iterations.',
        },
      ],
    },
    {
      id: 'js-fn-q4',
      level: 'senior',
      question: 'A search bar fires an API request on every keystroke and occasionally shows stale results out of order. How do you solve this?',
      spokenAnswer:
        'First, I would wrap the search handler in a `debounce` function (around 300ms) so we only call the API after the user pauses typing. Second, to prevent out-of-order stale responses, I would pass an `AbortController` signal to cancel any previous in-flight request whenever a new one starts.',
      detailedAnswer:
        'Debouncing reduces unnecessary server load and rate-limit pressure. However, debouncing alone does not fix race conditions if an earlier slow request resolves after a newer fast request. Combining `debounce` with `AbortController` (or tracking a latest-request ID inside a closure) guarantees both fewer requests and consistent UI state.',
      followUps: [
        {
          question: 'When would you use throttle instead of debounce?',
          answer:
            'When you need steady periodic updates during continuous activity—like scroll progress tracking or drag gestures—rather than waiting for activity to stop.',
        },
      ],
    },
  ],
  practicalExercises: [
    {
      id: 'ex-1',
      title: 'Build a `once(fn)` Wrapper',
      prompt: 'Write a function `once(fn)` that runs `fn` only on the first call and returns the cached result on subsequent calls.',
      hint: 'Use a closure with `let called = false` and `let cached`.',
      solutionCode: `function once(fn) {\n  let called = false;\n  let cached;\n  return (...args) => {\n    if (!called) {\n      called = true;\n      cached = fn(...args);\n    }\n    return cached;\n  };\n}\nconst init = once(() => 'Ready');\nconsole.log(init(), init());`,
      expectedOutput: 'Ready Ready',
    },
    {
      id: 'ex-2',
      title: 'Implement `pipe` for String Cleanup',
      prompt: 'Write `pipe(...fns)` and use it to trim, lowercase, and replace spaces with underscores.',
      hint: 'Use `fns.reduce((value, fn) => fn(value), initial)`.',
      solutionCode: `const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst normalize = pipe(\n  (s) => s.trim(),\n  (s) => s.toLowerCase(),\n  (s) => s.replace(/\\s+/g, '_')\n);\nconsole.log(normalize('  Hello World  '));`,
      expectedOutput: 'hello_world',
    },
  ],
  advancedUseCases: [
    'Middleware composition in Express.js and Redux.',
    'Memoized selectors and debounced search hooks in React / React Native.',
    'Sandboxed plugin hooks and curried configuration builders.',
  ],
};
