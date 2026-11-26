import type { TopicLesson } from './topicLessonsFeed.js';

type Level = 'expert' | 'coding';

function makeAdvancedLesson(
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

export const JS_LESSONS_PART_2: Record<string, TopicLesson> = {
  'js-execution-context': makeAdvancedLesson(
    'js-execution-context',
    '31. Execution Context',
    'expert',
    40,
    'What happens inside a JavaScript Execution Context (Creation vs Execution phase)?',
    'Every time JS runs a script or function, it creates an Execution Context in two phases: Creation (hoisting variables/functions, setting `this` and outer scope) and Execution (running code line by line).',
    'Understanding why recursive functions without a base case overflow the Call Stack.',
    [
      {
        title: 'Example 1: Call Stack Push & Pop Order',
        language: 'JavaScript',
        code: `function second() { console.log('2: inside second'); }\nfunction first() { console.log('1: start first'); second(); console.log('3: end first'); }\nfirst();`,
        expectedOutput: '1: start first\n2: inside second\n3: end first',
      },
    ],
    'An Execution Context holds the Variable/Lexical Environment and `this` binding. Creation phase sets up declarations; Execution phase assigns values and pushes/pops frames on the Call Stack.',
    ['What causes a stack overflow error?', 'What is the Lexical Environment?']
  ),
  'js-memory-management': makeAdvancedLesson(
    'js-memory-management',
    '32. Memory Management',
    'expert',
    45,
    'How does JavaScript Garbage Collection work, and what causes memory leaks?',
    'JS uses mark-and-sweep garbage collection: anything unreachable from the root is freed. Leaks happen when forgotten timers, event listeners, or closures keep references alive.',
    'Always clearing `setInterval` and `AbortController` in a React `useEffect` cleanup function.',
    [
      {
        title: 'Example 1: Proper Timer Cleanup',
        language: 'JavaScript',
        code: `const id = setInterval(() => {}, 1000);\nclearInterval(id);\nconsole.log('Timer cleaned up');`,
        expectedOutput: 'Timer cleaned up',
      },
    ],
    'Mark-and-sweep frees unreachable objects on the heap. In production apps, the main leak sources are unremoved event listeners, forgotten timers, and detached DOM references.',
    ['How do you profile memory leaks in Chrome DevTools?', 'Stack vs Heap memory?']
  ),
  'js-dom': makeAdvancedLesson(
    'js-dom',
    '33. DOM',
    'expert',
    35,
    'How do you minimize expensive DOM reflows and repaints?',
    'Batch DOM updates using `DocumentFragment` or `requestAnimationFrame`, and avoid reading layout properties (`offsetHeight`) repeatedly inside write loops (layout thrashing).',
    'Appending 500 list rows into a `DocumentFragment` once instead of appending 500 times directly to `document.body`.',
    [
      {
        title: 'Example 1: querySelector vs Virtual DOM Concept',
        language: 'JavaScript',
        code: `const items = ['A', 'B', 'C'];\nconst html = items.map((i) => \`<li>\${i}</li>\`).join('');\nconsole.log(html);`,
        expectedOutput: '<li>A</li><li>B</li><li>C</li>',
      },
    ],
    'DOM writes are fast when batched, whereas interleaving layout reads and writes causes forced synchronous reflows. Virtual DOM / DocumentFragment batching avoids layout thrashing.',
    ['What is the difference between Reflow and Repaint?', 'What is `textContent` vs `innerHTML`?']
  ),
  'js-events': makeAdvancedLesson(
    'js-events',
    '34. Events',
    'expert',
    40,
    'Explain Event Bubbling, Capturing, and Event Delegation.',
    'Events travel down during Capturing, hit the target, and bubble back up. Event Delegation attaches one listener to a parent container to handle clicks on many child elements.',
    'Attaching one `onClick` listener on a `<ul>` table/list instead of 1,000 listeners on every `<li>`.',
    [
      {
        title: 'Example 1: Event Delegation Pattern',
        language: 'JavaScript',
        code: `function handleListClick(targetTag, id) {\n  if (targetTag === 'BUTTON') return 'Deleted ' + id;\n  return 'Ignored';\n}\nconsole.log(handleListClick('BUTTON', 42));`,
        expectedOutput: 'Deleted 42',
      },
    ],
    'Event delegation leverages bubbling so a single parent handler manages dynamic children, saving memory and working automatically for newly added elements.',
    ['What is `event.target` vs `event.currentTarget`?', 'What does `stopPropagation()` do?']
  ),
  'js-browser-apis': makeAdvancedLesson(
    'js-browser-apis',
    '35. Browser APIs',
    'expert',
    40,
    'Compare `localStorage`, `sessionStorage`, and `HttpOnly` Cookies, and how `fetch` handles errors.',
    '`localStorage` persists across restarts, `sessionStorage` clears on tab close, and `HttpOnly` cookies protect auth tokens from JS XSS. Note: `fetch` only rejects on network errors, not HTTP 404/500!',
    'Always checking `if (!res.ok) throw new Error(res.status)` after `await fetch(url)`.',
    [
      {
        title: 'Example 1: Safe Fetch Wrapper',
        language: 'JavaScript',
        code: `async function checkStatus(ok, status) {\n  if (!ok) throw new Error('HTTP ' + status);\n  return 'Success';\n}\ncheckStatus(false, 404).catch((e) => console.log(e.message));`,
        expectedOutput: 'HTTP 404',
      },
    ],
    'A classic `fetch` gotcha is that 4xx/5xx responses still resolve—you must check `response.ok`. For sensitive tokens, `HttpOnly` cookies (web) or `SecureStore` (mobile) are far safer than `localStorage`.',
    ['How do you abort a `fetch` request?', 'What is the storage limit of `localStorage`?']
  ),
  'js-functional-programming': makeAdvancedLesson(
    'js-functional-programming',
    '37. Functional Programming',
    'expert',
    40,
    'What are Pure Functions, Immutability, and Function Composition?',
    'Pure functions always return the same output for the same input with zero side effects; immutability avoids mutating existing data; composition combines small pure functions into pipelines.',
    'Redux reducers and React state selectors rely on pure, immutable functions for predictable UI updates.',
    [
      {
        title: 'Example 1: Pure Immutable Update',
        language: 'JavaScript',
        code: `const addItem = (list, item) => [...list, item];\nconst base = [1, 2];\nconsole.log(addItem(base, 3).length, base.length);`,
        expectedOutput: '3 2',
      },
    ],
    'Functional programming minimizes shared mutable state, making code deterministic, easy to memoize, and simple to unit test.',
    ['What is referential transparency?', 'Why does React care about immutability?']
  ),
  'js-design-patterns': makeAdvancedLesson(
    'js-design-patterns',
    '38. Design Patterns',
    'expert',
    45,
    'How do Singleton, Factory, and Observer (Pub/Sub) patterns work in JavaScript?',
    'Singleton ensures one shared instance, Factory creates objects without exposing `new`, and Observer lets subscribers react whenever an event or state changes.',
    'Zustand stores and `EventEmitter` use the Observer pattern to notify components when state updates.',
    [
      {
        title: 'Example 1: Mini Observer / Pub-Sub',
        language: 'JavaScript',
        code: `function createBus() {\n  const subs = new Set();\n  return {\n    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); },\n    emit: (val) => subs.forEach((fn) => fn(val)),\n  };\n}\nconst bus = createBus();\nbus.subscribe((m) => console.log('Got:', m));\nbus.emit('Updated');`,
        expectedOutput: 'Got: Updated',
      },
    ],
    'Observer powers state management and event buses, Factory decouples object creation, and ES modules naturally act as Singletons.',
    ['How do ES Modules behave like Singletons?', 'What is the Decorator pattern?']
  ),
  'js-security': makeAdvancedLesson(
    'js-security',
    '39. Security',
    'expert',
    40,
    'How do you prevent XSS and CSRF in JavaScript applications?',
    'Prevent XSS by never injecting untrusted HTML (`dangerouslySetInnerHTML`), escaping output, and using CSP; prevent CSRF with `SameSite` cookies and CSRF tokens.',
    'Using `textContent` instead of `innerHTML` and validating every API payload with Zod.',
    [
      {
        title: 'Example 1: Simple HTML Escaper',
        language: 'JavaScript',
        code: `const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\nconsole.log(escapeHtml('<script>alert(1)</script>'));`,
        expectedOutput: '&lt;script&gt;alert(1)&lt;/script&gt;',
      },
    ],
    'Never trust client input: sanitize/validate with schemas, escape HTML output to block XSS, use `HttpOnly` + `SameSite` cookies, and keep secrets off the client.',
    ['Why are `EXPO_PUBLIC_*` or `NEXT_PUBLIC_*` env vars not secret?', 'What is Content Security Policy (CSP)?']
  ),
  'js-internals': makeAdvancedLesson(
    'js-internals',
    '40. JavaScript Internals',
    'expert',
    45,
    'How do the V8 Engine, JIT Compilation, and Hidden Classes optimize JavaScript?',
    'V8 parses JS into an AST, runs it in the Ignition interpreter, and uses TurboFan JIT to compile hot functions into fast machine code—especially when object shapes stay consistent.',
    'Initializing all object properties in the constructor in the same order so V8 reuses Hidden Classes.',
    [
      {
        title: 'Example 1: Consistent Object Shapes',
        language: 'JavaScript',
        code: `class Point { constructor(x, y) { this.x = x; this.y = y; } }\nconst p1 = new Point(1, 2);\nconst p2 = new Point(3, 4);\nconsole.log(p1.x + p2.y);`,
        expectedOutput: '5',
      },
    ],
    'Modern engines combine an interpreter with a JIT compiler. Keeping object shapes predictable and avoiding `delete` on hot objects lets JIT inline property lookups.',
    ['What is JIT deoptimization?', 'Why is `delete obj.prop` discouraged in hot paths?']
  ),
  'js-coding-strings': makeAdvancedLesson(
    'js-coding-strings',
    '41. String Coding Problems',
    'coding',
    45,
    'How do you check anagrams or palindromes in O(n) time?',
    'Use two pointers from both ends for palindromes (O(1) space), and a character frequency map for anagrams (O(n) time).',
    'Checking valid anagrams in live coding interviews.',
    [
      {
        title: 'Example 1: O(n) Anagram Check',
        language: 'JavaScript',
        code: `function isAnagram(a, b) {\n  if (a.length !== b.length) return false;\n  const counts = {};\n  for (const ch of a) counts[ch] = (counts[ch] || 0) + 1;\n  for (const ch of b) { if (!counts[ch]) return false; counts[ch]--; }\n  return true;\n}\nconsole.log(isAnagram('listen', 'silent'), isAnagram('rat', 'car'));`,
        expectedOutput: 'true false',
      },
    ],
    'Frequency maps solve anagrams in O(n) time instead of O(n log n) sorting.',
    ['How do you find the longest substring without repeating characters?']
  ),
  'js-coding-arrays': makeAdvancedLesson(
    'js-coding-arrays',
    '42. Array Coding Problems',
    'coding',
    45,
    'How do you solve Two Sum or Array Chunking cleanly?',
    'Use a `Map` to store seen complements in O(n) time for Two Sum instead of O(n^2) nested loops.',
    'Classic frontend/DSA screening question.',
    [
      {
        title: 'Example 1: O(n) Two Sum',
        language: 'JavaScript',
        code: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\nconsole.log(JSON.stringify(twoSum([2, 7, 11, 15], 9)));`,
        expectedOutput: '[0,1]',
      },
    ],
    'A hash map trades O(n) extra space to reduce Two Sum from O(n^2) to O(n) time.',
    ['How do you flatten a nested array without `.flat(Infinity)`?']
  ),
  'js-coding-objects': makeAdvancedLesson(
    'js-coding-objects',
    '43. Object Manipulation',
    'coding',
    45,
    'How do you flatten or deep-clone a nested object recursively?',
    'Walk keys recursively: if a value is a plain object, recurse with the dot-joined path; otherwise assign the leaf value.',
    'Flattening nested form errors or analytics payloads.',
    [
      {
        title: 'Example 1: Flatten Nested Object',
        language: 'JavaScript',
        code: `function flatten(obj, prefix = '', out = {}) {\n  for (const [k, v] of Object.entries(obj)) {\n    const key = prefix ? \`\${prefix}.\${k}\` : k;\n    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);\n    else out[key] = v;\n  }\n  return out;\n}\nconsole.log(JSON.stringify(flatten({ a: { b: 1 }, c: 2 })));`,
        expectedOutput: '{"a.b":1,"c":2}',
      },
    ],
    'Recursive traversal with a clear base case for primitives/arrays cleanly handles arbitrary nesting.',
    ['How do you handle circular references in a custom deep clone?']
  ),
  'js-coding-numbers': makeAdvancedLesson(
    'js-coding-numbers',
    '44. Number-Based Problems',
    'coding',
    40,
    'Why is `0.1 + 0.2 !== 0.3` in JavaScript, and how do you solve Fibonacci efficiently?',
    'JS uses IEEE 754 binary floating-point numbers; work in integer cents for currency, and use iterative DP for O(n) time / O(1) space Fibonacci.',
    'Calculating e-commerce prices in cents (`1999`) before formatting as `$19.99`.',
    [
      {
        title: 'Example 1: Iterative O(1)-Space Fibonacci',
        language: 'JavaScript',
        code: `function fib(n) {\n  let a = 0, b = 1;\n  for (let i = 0; i < n; i++) [a, b] = [b, a + b];\n  return a;\n}\nconsole.log(fib(7));`,
        expectedOutput: '13',
      },
    ],
    'Avoid naive recursive `fib(n)` (O(2^n))—use memoization or a two-variable iterative loop for O(n) time and O(1) space.',
    ['How do you compare floating-point numbers safely (`Number.EPSILON`)?']
  ),
  'js-coding-recursion': makeAdvancedLesson(
    'js-coding-recursion',
    '45. Recursion',
    'coding',
    45,
    'How do you flatten an arbitrarily nested array using recursion?',
    'Loop through elements: if `Array.isArray(item)`, recursively flatten and push; otherwise push the element directly.',
    'Flattening nested category trees or comment threads.',
    [
      {
        title: 'Example 1: Recursive Flatten Array',
        language: 'JavaScript',
        code: `function flatDeep(arr) {\n  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), []);\n}\nconsole.log(JSON.stringify(flatDeep([1, [2, [3, 4]], 5])));`,
        expectedOutput: '[1,2,3,4,5]',
      },
    ],
    'Every recursive solution needs a clear base case and a smaller subproblem on each call to guarantee termination.',
    ['When would you convert recursion to an explicit stack?']
  ),
  'js-coding-sorting': makeAdvancedLesson(
    'js-coding-sorting',
    '46. Sorting & Searching',
    'coding',
    50,
    'How does Binary Search achieve O(log n) time?',
    'On a sorted array, compare the target with the midpoint and discard half of the search space on every step.',
    'Searching sorted timestamps, logs, or autocomplete indexes.',
    [
      {
        title: 'Example 1: Binary Search',
        language: 'JavaScript',
        code: `function binarySearch(arr, target) {\n  let l = 0, r = arr.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}\nconsole.log(binarySearch([2, 5, 8, 12, 16], 12));`,
        expectedOutput: '3',
      },
    ],
    'Binary search halves the search range each iteration for O(log n) time, provided the input array is sorted.',
    ['Why does `[10, 2, 1].sort()` return `[1, 10, 2]` without a comparator?']
  ),
  'js-coding-ds': makeAdvancedLesson(
    'js-coding-ds',
    '47. Data Structures',
    'coding',
    50,
    'How do you validate balanced brackets using a Stack?',
    'Push opening brackets onto a stack; when seeing a closing bracket, pop and verify it matches the expected opener.',
    'Validating expressions, HTML tags, or JSON syntax.',
    [
      {
        title: 'Example 1: Valid Parentheses',
        language: 'JavaScript',
        code: `function isValidBrackets(s) {\n  const map = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (const ch of s) {\n    if (ch in map) { if (stack.pop() !== map[ch]) return false; }\n    else stack.push(ch);\n  }\n  return stack.length === 0;\n}\nconsole.log(isValidBrackets('({[]})'), isValidBrackets('([)]'));`,
        expectedOutput: 'true false',
      },
    ],
    'Stacks (LIFO) solve matching/undo problems in O(n), while Queues (FIFO) power BFS and task scheduling.',
    ['How do you implement a Queue using two Stacks?']
  ),
  'js-coding-algorithms': makeAdvancedLesson(
    'js-coding-algorithms',
    '48. Algorithms & Complexity',
    'coding',
    50,
    'How does the Sliding Window pattern solve subarray problems in O(n)?',
    'Maintain a `left` and `right` pointer and update the window sum/set incrementally instead of recomputing from scratch.',
    'Finding max sum of K consecutive items or longest unique substring.',
    [
      {
        title: 'Example 1: Max Sum Subarray of Size K',
        language: 'JavaScript',
        code: `function maxSubarraySum(nums, k) {\n  let sum = 0, best = -Infinity;\n  for (let i = 0; i < nums.length; i++) {\n    sum += nums[i];\n    if (i >= k) sum -= nums[i - k];\n    if (i >= k - 1) best = Math.max(best, sum);\n  }\n  return best;\n}\nconsole.log(maxSubarraySum([2, 1, 5, 1, 3, 2], 3));`,
        expectedOutput: '9',
      },
    ],
    'Sliding Window eliminates repeated work across overlapping subarrays, dropping complexity from O(n*k) to O(n).',
    ['What is Big-O time vs space complexity?']
  ),
  'js-coding-output': makeAdvancedLesson(
    'js-coding-output',
    '49. Output-Based Questions',
    'coding',
    45,
    'How do you trace tricky hoisting, `this`, closure, and event-loop output puzzles?',
    'Trace in order: 1) creation/hoisting, 2) synchronous Call Stack, 3) all Microtasks, 4) next Macrotask.',
    'Live whiteboard output prediction questions.',
    [
      {
        title: 'Example 1: Classic Closure + Event Loop Puzzle',
        language: 'JavaScript',
        code: `for (var i = 0; i < 2; i++) {\n  setTimeout(() => console.log('var:', i), 0);\n}\nPromise.resolve().then(() => console.log('microtask'));`,
        expectedOutput: 'microtask\nvar: 2\nvar: 2',
      },
    ],
    'Microtasks run before `setTimeout`, and `var` shares one function-scoped `i` whose final value after the loop is `2`.',
    ['What changes if `var` is replaced with `let`?']
  ),
  'js-coding-scenarios': makeAdvancedLesson(
    'js-coding-scenarios',
    '50. Real-World JS Scenarios',
    'coding',
    50,
    'How do you implement a custom `Promise.all` or API retry helper?',
    'Track resolved results by index (preserving input order), count completions, and reject immediately if any promise rejects.',
    'A classic senior frontend coding interview problem.',
    [
      {
        title: 'Example 1: Custom promiseAll Implementation',
        language: 'JavaScript',
        code: `function promiseAll(tasks) {\n  return new Promise((resolve, reject) => {\n    if (tasks.length === 0) return resolve([]);\n    const results = new Array(tasks.length);\n    let done = 0;\n    tasks.forEach((p, idx) => {\n      Promise.resolve(p).then((val) => {\n        results[idx] = val;\n        if (++done === tasks.length) resolve(results);\n      }, reject);\n    });\n  });\n}\npromiseAll([Promise.resolve('A'), Promise.resolve('B')]).then((r) => console.log(r.join(',')));`,
        expectedOutput: 'A,B',
      },
    ],
    'The key detail in custom `Promise.all` is storing each result at its original index `results[idx]`—not `.push()`—so output order matches input order even when promises resolve out of order.',
    ['How would you implement a `retry(fn, attempts)` helper with exponential backoff?']
  ),
};
