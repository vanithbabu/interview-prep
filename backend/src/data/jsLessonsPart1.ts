import type { TopicLesson } from './topicLessonsFeed.js';

type Level = 'beginner' | 'intermediate' | 'advanced';

function makeJsLesson(
  id: string,
  title: string,
  level: Level,
  estimatedMinutes: number,
  coreQuestion: string,
  simpleHumanAnswer: string,
  realWorldExample: string,
  codeExamples: TopicLesson['codeExamples'],
  interviewSpeakingAnswer: string,
  followUpQuestions: string[]
): TopicLesson {
  return {
    id,
    categoryId: 'javascript',
    categoryName: 'JavaScript',
    title,
    level,
    estimatedMinutes,
    coreQuestion,
    simpleHumanAnswer,
    realWorldExample,
    codeExamples,
    interviewSpeakingAnswer,
    followUpQuestions,
  };
}

export const JS_LESSONS_PART_1: Record<string, TopicLesson> = {
  'js-introduction': makeJsLesson(
    'js-introduction',
    '1. Introduction',
    'beginner',
    20,
    'What is JavaScript and how is it executed?',
    'JavaScript is a single-threaded, dynamically typed language that powers interactive web apps, mobile apps (React Native), and backends (Node.js).',
    'When you tap a Like button without reloading the page, JavaScript updates the UI and sends the API request in the background.',
    [
      {
        title: 'Example 1: Dynamic Typing & Execution',
        language: 'JavaScript',
        code: `let status = 'Loading';\nconsole.log(typeof status);\nstatus = 200;\nconsole.log(typeof status);`,
        expectedOutput: 'string\nnumber',
      },
      {
        title: 'Example 2: Expression Evaluation',
        language: 'JavaScript',
        code: `const appName = 'Interview Prep';\nconsole.log(\`\${appName} v\${1 + 1}\`);`,
        expectedOutput: 'Interview Prep v2',
      },
    ],
    'JavaScript is a high-level, single-threaded, garbage-collected language with first-class functions and an event-driven non-blocking runtime.',
    ['What does single-threaded mean?', 'How does JS run outside the browser?']
  ),
  'js-data-types': makeJsLesson(
    'js-data-types',
    '3. Data Types',
    'beginner',
    25,
    'What are primitive vs reference data types in JavaScript?',
    'Primitives (string, number, boolean, undefined, null, symbol, bigint) are copied by value, while objects/arrays/functions are copied by reference.',
    'Copying a user ID string creates an independent copy, while copying a user object shares the same reference unless cloned.',
    [
      {
        title: 'Example 1: Value vs Reference Copy',
        language: 'JavaScript',
        code: `let a = 10; let b = a; b = 20;\nconst obj1 = { x: 1 }; const obj2 = obj1; obj2.x = 9;\nconsole.log(a, obj1.x);`,
        expectedOutput: '10 9',
      },
      {
        title: 'Example 2: typeof null Quirk & BigInt',
        language: 'JavaScript',
        code: `console.log(typeof null, typeof 9007199254740993n, typeof Symbol('id'));`,
        expectedOutput: 'object bigint symbol',
      },
    ],
    'JavaScript has 7 primitive types passed by value and Objects passed by reference. A famous quirk is that `typeof null` returns `"object"` for historical reasons.',
    ['Why does `typeof null` return `"object"`?', 'When do you need `BigInt`?']
  ),
  'js-operators': makeJsLesson(
    'js-operators',
    '4. Operators',
    'beginner',
    25,
    'How do `??` (nullish coalescing) and `?.` (optional chaining) differ from `||`?',
    '`||` falls back on any falsy value (`0`, `""`, `false`), while `??` only falls back on `null` or `undefined`. `?.` safely reads nested properties without crashing.',
    'Reading `user?.profile?.score ?? 0` ensures a score of `0` is kept instead of replaced by a default.',
    [
      {
        title: 'Example 1: Nullish Coalescing vs OR',
        language: 'JavaScript',
        code: `const count = 0;\nconsole.log(count || 10, count ?? 10);`,
        expectedOutput: '10 0',
      },
      {
        title: 'Example 2: Optional Chaining',
        language: 'JavaScript',
        code: `const user = { name: 'Dev' };\nconsole.log(user?.address?.city ?? 'Remote');`,
        expectedOutput: 'Remote',
      },
    ],
    'I use `??` instead of `||` whenever `0` or `""` are valid values, and `?.` to guard deeply nested API responses safely.',
    ['What values are falsy in JS?', 'How does short-circuiting work with `&&` and `||`?']
  ),
  'js-type-conversion': makeJsLesson(
    'js-type-conversion',
    '5. Type Conversion',
    'beginner',
    25,
    'What is implicit coercion vs explicit conversion in JavaScript?',
    'Explicit conversion is when you call `Number()`, `String()`, or `Boolean()` intentionally; implicit coercion is when JS converts types automatically during `+` or `==`.',
    'Form inputs always arrive as strings (`"25"`), so explicitly converting with `Number(value)` avoids `"25" + 5 === "255"`.',
    [
      {
        title: 'Example 1: Explicit vs Implicit Coercion',
        language: 'JavaScript',
        code: `console.log('5' + 2, '5' - 2, Number('5') + 2);`,
        expectedOutput: '52 3 7',
      },
      {
        title: 'Example 2: Truthy & Falsy Check',
        language: 'JavaScript',
        code: `const vals = [0, '', null, undefined, NaN, '0', []];\nconsole.log(vals.map(Boolean).join(','));`,
        expectedOutput: 'false,false,false,false,false,true,true',
      },
    ],
    'I always prefer explicit conversions like `Number()` and strict equality `===` so type bugs cannot hide behind implicit coercion.',
    ['Why is `Boolean([])` true?', 'How do you check for `NaN` reliably?']
  ),
  'js-statements-expressions': makeJsLesson(
    'js-statements-expressions',
    '6. Statements & Expressions',
    'beginner',
    20,
    'What is the difference between a statement and an expression?',
    'An expression produces a value (like `2 + 2` or `isLoggedIn ? "Hi" : "Login"`), while a statement performs an action (like `if`, `for`, or `return`).',
    'In React JSX `{ ... }`, you can only embed expressions (like ternaries or `.map()`), not `if/else` statements.',
    [
      {
        title: 'Example 1: Ternary Expression vs if Statement',
        language: 'JavaScript',
        code: `const score = 85;\nconst grade = score >= 80 ? 'Pass' : 'Retry';\nconsole.log(grade);`,
        expectedOutput: 'Pass',
      },
      {
        title: 'Example 2: Short-Circuit Expression',
        language: 'JavaScript',
        code: `const isAdmin = true;\nconsole.log(isAdmin && 'Admin Panel');`,
        expectedOutput: 'Admin Panel',
      },
    ],
    'Expressions evaluate to a value and can be passed into functions or JSX; statements control program flow.',
    ['Why cannot `if` be placed inside `{}` in JSX?', 'What is Automatic Semicolon Insertion (ASI)?']
  ),
  'js-conditionals': makeJsLesson(
    'js-conditionals',
    '7. Conditional Statements',
    'beginner',
    25,
    'When should you use `if/else`, `switch`, or an object lookup map?',
    'Use `if/else` for range/boolean checks, `switch` for discrete cases, and an object/Map lookup when mapping keys to values cleanly.',
    'Mapping HTTP status codes (`200`, `404`, `500`) to user messages is much cleaner with an object map than a 20-line `if/else` chain.',
    [
      {
        title: 'Example 1: Object Lookup Instead of Long Switch',
        language: 'JavaScript',
        code: `const labels = { beginner: 'Level 1', intermediate: 'Level 2' };\nconsole.log(labels['beginner'] ?? 'Unknown');`,
        expectedOutput: 'Level 1',
      },
      {
        title: 'Example 2: Guard Clause Pattern',
        language: 'JavaScript',
        code: `function shipOrder(paid) {\n  if (!paid) return 'Payment required';\n  return 'Shipped';\n}\nconsole.log(shipOrder(false), '|', shipOrder(true));`,
        expectedOutput: 'Payment required | Shipped',
      },
    ],
    'I prefer early-return guard clauses and lookup maps over deeply nested `if/else` blocks to keep code readable.',
    ['What happens if you forget `break` in a `switch` statement?', 'How do guard clauses reduce nesting?']
  ),
  'js-loops': makeJsLesson(
    'js-loops',
    '8. Loops',
    'beginner',
    30,
    'What is the difference between `for...of` and `for...in`?',
    '`for...of` loops over values of iterables (arrays, strings, Maps), while `for...in` loops over enumerable property keys of an object.',
    'Use `for...of` when iterating over API items (especially with `await` inside a loop), and `Object.entries()` with `for...of` for objects.',
    [
      {
        title: 'Example 1: for...of vs for...in',
        language: 'JavaScript',
        code: `const arr = ['JS', 'TS'];\nfor (const item of arr) console.log('val:', item);\nfor (const idx in arr) console.log('key:', idx);`,
        expectedOutput: 'val: JS\nval: TS\nkey: 0\nkey: 1',
      },
      {
        title: 'Example 2: break and continue',
        language: 'JavaScript',
        code: `const out = [];\nfor (let i = 1; i <= 5; i++) {\n  if (i === 2) continue;\n  if (i === 5) break;\n  out.push(i);\n}\nconsole.log(out.join(','));`,
        expectedOutput: '1,3,4',
      },
    ],
    '`for...of` iterates values of iterables and works with `async/await`, while `for...in` iterates enumerable keys and should be avoided on arrays.',
    ['Why should you avoid `for...in` on arrays?', 'Can you `break` out of `.forEach()`?']
  ),
  'js-strings': makeJsLesson(
    'js-strings',
    '10. Strings',
    'beginner',
    30,
    'How do JavaScript string methods and immutability work?',
    'Strings in JavaScript are immutable—methods like `.trim()`, `.slice()`, `.replaceAll()`, and `.split()` always return a new string.',
    'Normalizing user search queries with `query.trim().toLowerCase()` before filtering.',
    [
      {
        title: 'Example 1: Clean & Split URL Slug',
        language: 'JavaScript',
        code: `const raw = '  Learn JS Closures  ';\nconst slug = raw.trim().toLowerCase().replace(/\\s+/g, '-');\nconsole.log(slug);`,
        expectedOutput: 'learn-js-closures',
      },
      {
        title: 'Example 2: padStart & includes',
        language: 'JavaScript',
        code: `const code = '7'.padStart(3, '0');\nconsole.log(code, 'JavaScript'.includes('Script'));`,
        expectedOutput: '007 true',
      },
    ],
    'Strings are immutable primitives, so every transformation returns a new string. Template literals make interpolation and multiline strings clean.',
    ['What is the difference between `slice` and `substring`?', 'How do you reverse a string safely with Unicode?']
  ),
  'js-arrays': makeJsLesson(
    'js-arrays',
    '11. Arrays',
    'intermediate',
    30,
    'Which array methods mutate the original array vs return a new copy?',
    '`push`, `pop`, `splice`, and `sort` mutate in place, while `slice`, `concat`, `map`, `filter`, and `toSorted` return a new array.',
    'In React/Zustand state, always use non-mutating methods (`[...arr, item]`, `.filter()`) so UI re-renders trigger properly.',
    [
      {
        title: 'Example 1: Immutable Add & Remove',
        language: 'JavaScript',
        code: `const tags = ['js', 'react', 'node'];\nconst withoutNode = tags.filter((t) => t !== 'node');\nconst withTs = [...withoutNode, 'ts'];\nconsole.log(tags.length, withTs.join(','));`,
        expectedOutput: '3 js,react,ts',
      },
      {
        title: 'Example 2: slice vs splice',
        language: 'JavaScript',
        code: `const nums = [1, 2, 3, 4];\nconsole.log(nums.slice(1, 3), nums);`,
        expectedOutput: '[ 2, 3 ] [ 1, 2, 3, 4 ]',
      },
    ],
    'Mutating methods like `splice` and `sort` modify the array in place; in modern React apps I clone first or use immutable methods like `filter`, `slice`, and spread.',
    ['What is the difference between `slice` and `splice`?', 'How does `Array.isArray()` work?']
  ),
  'js-array-methods': makeJsLesson(
    'js-array-methods',
    '12. Array Methods',
    'intermediate',
    35,
    'How do `find`, `some`, `every`, and `flatMap` differ from `filter` and `map`?',
    '`find` returns the first match, `some` checks if at least one matches, `every` checks if all match, and `flatMap` maps and flattens one level in one pass.',
    'Checking `cart.every(item => item.inStock)` before enabling the Checkout button.',
    [
      {
        title: 'Example 1: some, every & find',
        language: 'JavaScript',
        code: `const scores = [80, 92, 65];\nconsole.log(scores.some((s) => s > 90), scores.every((s) => s >= 60), scores.find((s) => s < 70));`,
        expectedOutput: 'true true 65',
      },
      {
        title: 'Example 2: flatMap',
        language: 'JavaScript',
        code: `const groups = [{ tags: ['js', 'ts'] }, { tags: ['react'] }];\nconsole.log(groups.flatMap((g) => g.tags).join(','));`,
        expectedOutput: 'js,ts,react',
      },
    ],
    '`find`, `some`, and `every` short-circuit as soon as the result is known, making them faster than `filter` when you only need one match or a boolean.',
    ['Does `some()` stop iterating once it finds `true`?', 'How do you flatten a deeply nested array?']
  ),
  'js-objects': makeJsLesson(
    'js-objects',
    '13. Objects',
    'intermediate',
    35,
    'How do computed property names, shorthand properties, and nested destructuring work?',
    'Computed keys `[key]: val` set dynamic property names, shorthand `{ name }` avoids `name: name`, and nested destructuring unpacks deep fields cleanly.',
    'Updating a single dynamic form field in React: `setForm(prev => ({ ...prev, [fieldName]: value }))`.',
    [
      {
        title: 'Example 1: Dynamic Key & Shorthand',
        language: 'JavaScript',
        code: `const field = 'email';\nconst name = 'Sara';\nconst user = { name, [field]: 'sara@dev.io' };\nconsole.log(JSON.stringify(user));`,
        expectedOutput: '{"name":"Sara","email":"sara@dev.io"}',
      },
      {
        title: 'Example 2: Nested Destructuring',
        language: 'JavaScript',
        code: `const res = { data: { user: { role: 'Admin' } } };\nconst { data: { user: { role } } } = res;\nconsole.log(role);`,
        expectedOutput: 'Admin',
      },
    ],
    'Object shorthand, computed keys, and destructuring make state updates and API response parsing concise and readable.',
    ['How do you check if a property exists on an object itself (`Object.hasOwn`)?', 'What happens when you spread an object with nested objects?']
  ),
  'js-object-methods': makeJsLesson(
    'js-object-methods',
    '14. Object Methods',
    'intermediate',
    30,
    'How do `Object.keys`, `Object.entries`, `Object.fromEntries`, and `Object.freeze` work?',
    '`keys`/`values`/`entries` convert objects into arrays for iteration, `fromEntries` converts `[key, val]` pairs back into an object, and `freeze` prevents top-level mutation.',
    'Filtering an object’s properties with `Object.fromEntries(Object.entries(obj).filter(...))`.',
    [
      {
        title: 'Example 1: Transform Object with entries & fromEntries',
        language: 'JavaScript',
        code: `const prices = { book: 10, pen: 2 };\nconst doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));\nconsole.log(JSON.stringify(doubled));`,
        expectedOutput: '{"book":20,"pen":4}',
      },
      {
        title: 'Example 2: Object.freeze (Shallow)',
        language: 'JavaScript',
        code: `'use strict';\nconst cfg = Object.freeze({ mode: 'prod' });\nconsole.log(Object.isFrozen(cfg), cfg.mode);`,
        expectedOutput: 'true prod',
      },
    ],
    '`Object.entries` + `Object.fromEntries` let you use array methods on objects, while `Object.freeze` enforces shallow immutability.',
    ['Is `Object.freeze` deep or shallow?', 'What is the difference between `Object.freeze` and `Object.seal`?']
  ),
  'js-scope': makeJsLesson(
    'js-scope',
    '15. Scope',
    'intermediate',
    30,
    'What are Global, Function, Block, and Lexical Scope?',
    'Scope controls where variables are visible. Lexical scope means a function looks up variables based on where it was written in code, not where it is called.',
    'Keeping helper constants inside a module or block so they never collide with other files.',
    [
      {
        title: 'Example 1: Lexical Scope Lookup',
        language: 'JavaScript',
        code: `const env = 'prod';\nfunction getEnv() { return env; }\nfunction test() { const env = 'dev'; return getEnv(); }\nconsole.log(test());`,
        expectedOutput: 'prod',
      },
      {
        title: 'Example 2: Block Scope Isolation',
        language: 'JavaScript',
        code: `const x = 1;\n{ const x = 2; console.log('inner:', x); }\nconsole.log('outer:', x);`,
        expectedOutput: 'inner: 2\nouter: 1',
      },
    ],
    'JavaScript uses lexical (static) scoping: inner scopes can access outer scopes up the chain, determined at author time.',
    ['What is the scope chain?', 'What is variable shadowing?']
  ),
  'js-hoisting': makeJsLesson(
    'js-hoisting',
    '16. Hoisting',
    'intermediate',
    30,
    'How does hoisting work for `var`, `let`, `const`, and functions?',
    'Function declarations are hoisted with their full body. `var` is hoisted and initialized to `undefined`. `let` and `const` are hoisted but stay in the Temporal Dead Zone until initialized.',
    'Calling a helper function declared lower in the file works cleanly with `function` declarations, but fails with `const` arrow functions.',
    [
      {
        title: 'Example 1: Function vs var Hoisting',
        language: 'JavaScript',
        code: `console.log(greet());\nconsole.log(x);\nvar x = 5;\nfunction greet() { return 'Hello'; }`,
        expectedOutput: 'Hello\nundefined',
      },
      {
        title: 'Example 2: Temporal Dead Zone (TDZ)',
        language: 'JavaScript',
        code: `try {\n  console.log(y);\n} catch (e) {\n  console.log(e.name);\n}\nlet y = 10;`,
        expectedOutput: 'ReferenceError',
      },
    ],
    'During the creation phase, JS allocates memory for declarations. Function declarations get their body; `var` gets `undefined`; `let`/`const` remain uninitialized in the TDZ.',
    ['What is the Temporal Dead Zone?', 'Are class declarations hoisted?']
  ),
  'js-es6-plus': makeJsLesson(
    'js-es6-plus',
    '18. ES6+',
    'intermediate',
    35,
    'Which ES6+ features do you use most in modern JavaScript?',
    'Destructuring, spread/rest, arrow functions, template literals, optional chaining, nullish coalescing, modules, and `async/await`.',
    'Merging updated props or state immutably with `{ ...state, loading: false }`.',
    [
      {
        title: 'Example 1: Spread Merge & Override',
        language: 'JavaScript',
        code: `const defaults = { theme: 'light', page: 1 };\nconst userPrefs = { theme: 'dark' };\nconsole.log(JSON.stringify({ ...defaults, ...userPrefs }));`,
        expectedOutput: '{"theme":"dark","page":1}',
      },
      {
        title: 'Example 2: Dynamic Property & Template Literal',
        language: 'JavaScript',
        code: `const role = 'Admin';\nconsole.log(\`Role: \${role.toUpperCase()}\`);`,
        expectedOutput: 'Role: ADMIN',
      },
    ],
    'ES6+ features like spread/rest, destructuring, `?.`, `??`, and `async/await` make JavaScript cleaner, safer, and far less verbose.',
    ['How does rest differ from spread?', 'What are tagged template literals?']
  ),
  'js-callbacks': makeJsLesson(
    'js-callbacks',
    '19. Callbacks',
    'intermediate',
    35,
    'What is a callback and a higher-order function?',
    'A callback is a function passed as an argument to another function; a higher-order function takes a function as input or returns a function.',
    'Array `.map()`, `.filter()`, and Express middleware `(req, res, next) => ...` are all higher-order patterns.',
    [
      {
        title: 'Example 1: Custom HOF Pipeline',
        language: 'JavaScript',
        code: `function applyTwice(fn, val) { return fn(fn(val)); }\nconsole.log(applyTwice((n) => n * 3, 2));`,
        expectedOutput: '18',
      },
      {
        title: 'Example 2: Error-First Callback',
        language: 'JavaScript',
        code: `function parse(str, cb) {\n  try { cb(null, JSON.parse(str)); } catch (e) { cb(e.message, null); }\n}\nparse('{"ok":1}', (err, data) => console.log(err, data.ok));`,
        expectedOutput: 'null 1',
      },
    ],
    'Callbacks let us pass behavior into generic functions, while higher-order functions compose and reuse that behavior cleanly.',
    ['What is callback hell and how do Promises fix it?', 'What is a predicate function?']
  ),
  'js-error-handling': makeJsLesson(
    'js-error-handling',
    '20. Error Handling',
    'intermediate',
    30,
    'How do `try/catch/finally` and custom Error classes work?',
    '`try` runs risky code, `catch` handles thrown errors, `finally` always runs for cleanup, and extending `Error` lets you attach status codes or domain types.',
    'Closing a loading spinner in `finally` regardless of whether an API call succeeded or failed.',
    [
      {
        title: 'Example 1: finally Cleanup Guarantee',
        language: 'JavaScript',
        code: `let loading = true;\ntry {\n  throw new Error('Network down');\n} catch (e) {\n  console.log('Caught:', e.message);\n} finally {\n  loading = false;\n}\nconsole.log('loading:', loading);`,
        expectedOutput: 'Caught: Network down\nloading: false',
      },
      {
        title: 'Example 2: Custom ValidationError',
        language: 'JavaScript',
        code: `class ValidationError extends Error {\n  constructor(msg) { super(msg); this.name = 'ValidationError'; }\n}\nconst err = new ValidationError('Invalid email');\nconsole.log(err.name, err instanceof Error);`,
        expectedOutput: 'ValidationError true',
      },
    ],
    'I use `try/catch/finally` for async error boundaries and cleanup, and custom `Error` subclasses so callers can distinguish validation errors from system errors.',
    ['Does `try/catch` catch errors inside `setTimeout`?', 'Why should you throw `new Error()` instead of a string?']
  ),
  'js-prototypes': makeJsLesson(
    'js-prototypes',
    '22. Prototypes',
    'advanced',
    40,
    'How does JavaScript prototype inheritance work?',
    'Every object has an internal `[[Prototype]]` link. If a property is missing on the object, JS walks up the prototype chain until it finds it or hits `null`.',
    'All arrays share methods like `.map()` from `Array.prototype` instead of duplicating them on every array instance.',
    [
      {
        title: 'Example 1: Object.create Prototype Link',
        language: 'JavaScript',
        code: `const base = { greet() { return 'Hi ' + this.name; } };\nconst user = Object.create(base);\nuser.name = 'Leo';\nconsole.log(user.greet(), Object.getPrototypeOf(user) === base);`,
        expectedOutput: 'Hi Leo true',
      },
      {
        title: 'Example 2: Shared Prototype Method',
        language: 'JavaScript',
        code: `function Task(title) { this.title = title; }\nTask.prototype.label = function () { return '[' + this.title + ']'; };\nconsole.log(new Task('Build').label());`,
        expectedOutput: '[Build]',
      },
    ],
    'JavaScript uses prototypal inheritance: objects delegate missing properties up their prototype chain, saving memory by sharing methods on `.prototype`.',
    ['What is the difference between `__proto__` and `.prototype`?', 'What ends the prototype chain?']
  ),
  'js-classes': makeJsLesson(
    'js-classes',
    '23. Classes',
    'advanced',
    35,
    'How do ES6 classes, `extends`, `super`, `static`, and `#private` fields work?',
    'ES6 `class` is cleaner syntax over prototype inheritance, adding `constructor`, `super()` for parent calls, `static` class-level helpers, and `#` private fields.',
    'Building a typed API client or custom `Error` class with shared helper methods.',
    [
      {
        title: 'Example 1: Inheritance with super',
        language: 'JavaScript',
        code: `class User { constructor(name) { this.name = name; } }\nclass Admin extends User {\n  constructor(name, level) { super(name); this.level = level; }\n}\nconst a = new Admin('Maya', 1);\nconsole.log(a.name, a.level);`,
        expectedOutput: 'Maya 1',
      },
      {
        title: 'Example 2: Static Method & Private Field',
        language: 'JavaScript',
        code: `class Counter {\n  #count = 0;\n  inc() { return ++this.#count; }\n  static info() { return 'Counter v1'; }\n}\nconsole.log(Counter.info(), new Counter().inc());`,
        expectedOutput: 'Counter v1 1',
      },
    ],
    'Classes are syntactic sugar over prototypes, but enforce `new`, support `super()`, and provide true `#private` fields at runtime.',
    ['Why must `super()` be called before `this` in a subclass constructor?', 'Are class methods enumerable?']
  ),
  'js-promises': makeJsLesson(
    'js-promises',
    '25. Promises',
    'advanced',
    40,
    'What are Promise states and how do Promise combinators work?',
    'A Promise is `pending`, `fulfilled`, or `rejected`. Once settled it never changes. Combinators like `all`, `allSettled`, `race`, and `any` coordinate multiple Promises.',
    'Using `Promise.race` with a timeout Promise to abort slow network requests.',
    [
      {
        title: 'Example 1: Chaining & Error Recovery',
        language: 'JavaScript',
        code: `Promise.resolve(5)\n  .then((n) => n * 2)\n  .then((n) => console.log('Result:', n));`,
        expectedOutput: 'Result: 10',
      },
      {
        title: 'Example 2: Promise.any First Success',
        language: 'JavaScript',
        code: `Promise.any([Promise.reject('err'), Promise.resolve('Mirror B')])\n  .then((winner) => console.log(winner));`,
        expectedOutput: 'Mirror B',
      },
    ],
    '`Promise.all` fails fast, `allSettled` waits for all, `race` takes first settled, and `any` takes first fulfilled.',
    ['What error does `Promise.any` throw when all reject?', 'Can a settled Promise change state?']
  ),
  'js-async-await': makeJsLesson(
    'js-async-await',
    '26. Async/Await',
    'advanced',
    35,
    'How do you avoid sequential waterfalls when using `async/await`?',
    'Use `Promise.all([a(), b()])` for independent async calls instead of `await a(); await b();` which runs them one after another.',
    'Loading user profile and dashboard stats simultaneously with `Promise.all`.',
    [
      {
        title: 'Example 1: Parallel vs Sequential await',
        language: 'JavaScript',
        code: `async function loadAll() {\n  const [a, b] = await Promise.all([Promise.resolve('User'), Promise.resolve('Stats')]);\n  console.log(a, b);\n}\nloadAll();`,
        expectedOutput: 'User Stats',
      },
      {
        title: 'Example 2: Async Function Always Returns a Promise',
        language: 'JavaScript',
        code: `async function getNum() { return 42; }\ngetNum().then((v) => console.log(v));`,
        expectedOutput: '42',
      },
    ],
    '`async/await` is clean syntax over Promises. The biggest pitfall is accidental sequential awaits—for independent requests, I always start them together with `Promise.all`.',
    ['What happens if you `await` inside `Array.prototype.forEach`?', 'How do you handle errors in `async/await`?']
  ),
  'js-advanced-functions': makeJsLesson(
    'js-advanced-functions',
    '27. Advanced Functions',
    'advanced',
    45,
    'What are currying, composition, IIFE, and generator functions?',
    'Currying turns `f(a, b)` into `f(a)(b)`, composition chains functions together, an IIFE runs immediately for isolation, and generators (`function*`) pause/resume via `yield`.',
    'Creating reusable curried event handlers or lazy paginated ID generators.',
    [
      {
        title: 'Example 1: Currying & Partial Application',
        language: 'JavaScript',
        code: `const multiply = (a) => (b) => a * b;\nconst double = multiply(2);\nconsole.log(double(9));`,
        expectedOutput: '18',
      },
      {
        title: 'Example 2: Generator Function',
        language: 'JavaScript',
        code: `function* idGen() { let id = 1; while (true) yield id++; }\nconst gen = idGen();\nconsole.log(gen.next().value, gen.next().value);`,
        expectedOutput: '1 2',
      },
    ],
    'Currying and composition let us build small reusable pipelines, while generators provide lazy, pauseable sequences on demand.',
    ['How does `pipe` differ from `compose`?', 'When are generators useful in real apps?']
  ),
  'js-iterators': makeJsLesson(
    'js-iterators',
    '28. Iterators',
    'advanced',
    35,
    'How do the Iterator and Iterable protocols (`Symbol.iterator`) work?',
    'An iterable has a `[Symbol.iterator]()` method returning an iterator with `.next()`, which yields `{ value, done }` objects for `for...of` and spread `...`.',
    'Making a custom `Range(1, 5)` object work directly with `for...of` and `[...range]`.',
    [
      {
        title: 'Example 1: Custom Iterable Range',
        language: 'JavaScript',
        code: `const range = {\n  from: 1, to: 3,\n  [Symbol.iterator]() {\n    let cur = this.from;\n    return { next: () => (cur <= this.to ? { value: cur++, done: false } : { value: undefined, done: true }) };\n  },\n};\nconsole.log([...range].join(','));`,
        expectedOutput: '1,2,3',
      },
    ],
    'Any object implementing `[Symbol.iterator]()` returning `{ next() }` works seamlessly with `for...of`, spread, and destructuring.',
    ['What built-in types are iterable in JS?', 'How do async iterators (`for await...of`) work?']
  ),
  'js-map-set': makeJsLesson(
    'js-map-set',
    '29. Map & Set',
    'advanced',
    35,
    'When should you use `Map`/`Set` instead of plain Objects/Arrays?',
    '`Set` stores unique values with O(1) `.has()` lookup; `Map` preserves insertion order and allows any key type (including objects) with O(1) lookups.',
    'Deduplicating an array of IDs with `[...new Set(ids)]` or caching DOM/object metadata in a `WeakMap`.',
    [
      {
        title: 'Example 1: Set Deduplication',
        language: 'JavaScript',
        code: `const tags = ['js', 'react', 'js', 'ts'];\nconsole.log([...new Set(tags)].join(','));`,
        expectedOutput: 'js,react,ts',
      },
      {
        title: 'Example 2: Map with Non-String Keys',
        language: 'JavaScript',
        code: `const cache = new Map();\nconst keyObj = { id: 1 };\ncache.set(keyObj, 'Cached');\nconsole.log(cache.get(keyObj), cache.size);`,
        expectedOutput: 'Cached 1',
      },
    ],
    '`Set` gives instant uniqueness and O(1) membership checks; `Map` supports any key type and clean `.size` tracking; `WeakMap`/`WeakSet` prevent memory leaks on object keys.',
    ['Why does `WeakMap` not have `.size` or iteration?', 'Why is `Set.has()` faster than `Array.includes()`?']
  ),
  'js-modules': makeJsLesson(
    'js-modules',
    '30. Modules',
    'advanced',
    30,
    'How do ES Modules (`import`/`export`) differ from CommonJS (`require`)?',
    'ES Modules are statically analyzed at parse time (enabling tree-shaking and async `import()`), while CommonJS `require()` loads synchronously at runtime.',
    'Lazy-loading a heavy chart component only when the user opens the Analytics tab using `import()`.',
    [
      {
        title: 'Example 1: Named vs Default Export Pattern',
        language: 'JavaScript',
        code: `// export const PI = 3.14;\n// export default function calc() {}\nconsole.log('ESM enables static tree-shaking');`,
        expectedOutput: 'ESM enables static tree-shaking',
      },
    ],
    'ES Modules use static `import`/`export` syntax which allows bundlers like Metro/Webpack to tree-shake unused exports, and dynamic `import()` for code splitting.',
    ['What is tree-shaking?', 'When do you use dynamic `import()`?']
  ),
};
