import type { BackendTopicSummary } from './categoriesFeed.js';

type Level = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'coding';

function jsTopic(
  id: string,
  title: string,
  level: Level,
  description: string,
  estimatedMinutes = 35
): BackendTopicSummary {
  return {
    id,
    categoryId: 'javascript',
    slug: id.replace(/^js-/, ''),
    title,
    level,
    estimatedMinutes,
    description,
    exampleCount: 50,
  };
}

export const JS_50_TOPICS: BackendTopicSummary[] = [
  // Level 1 – Beginner (1-10)
  jsTopic('js-introduction', '1. Introduction', 'beginner', 'What is JavaScript, history, features, execution.', 20),
  jsTopic('js-fundamentals', '2. Variables', 'beginner', 'var, let, const, declaration, initialization, reassignment.', 25),
  jsTopic('js-data-types', '3. Data Types', 'beginner', 'String, Number, Boolean, Undefined, Null, Symbol, BigInt.', 25),
  jsTopic('js-operators', '4. Operators', 'beginner', 'Arithmetic, comparison, logical, assignment, ternary.', 25),
  jsTopic('js-type-conversion', '5. Type Conversion', 'beginner', 'Explicit conversion, implicit coercion, truthy, falsy.', 25),
  jsTopic('js-statements-expressions', '6. Statements & Expressions', 'beginner', 'Statements, expressions, blocks, semicolons.', 20),
  jsTopic('js-conditionals', '7. Conditional Statements', 'beginner', 'if, else, else-if, switch, nested conditions.', 25),
  jsTopic('js-loops', '8. Loops', 'beginner', 'for, while, do-while, for...in, for...of.', 30),
  jsTopic('js-functions', '9. Functions', 'beginner', 'Declaration, expression, arrow, parameters, return.', 35),
  jsTopic('js-strings', '10. Strings', 'beginner', 'String methods, template literals, manipulation.', 30),

  // Level 2 – Intermediate (11-20)
  jsTopic('js-arrays', '11. Arrays', 'intermediate', 'Creation, indexing, methods, iteration.', 30),
  jsTopic('js-array-methods', '12. Array Methods', 'intermediate', 'map, filter, reduce, find, some, every, flat.', 35),
  jsTopic('js-objects', '13. Objects', 'intermediate', 'Properties, methods, nested objects, destructuring.', 35),
  jsTopic('js-object-methods', '14. Object Methods', 'intermediate', 'Object.keys, values, entries, assign, freeze.', 30),
  jsTopic('js-scope', '15. Scope', 'intermediate', 'Global, function, block, lexical scope.', 30),
  jsTopic('js-hoisting', '16. Hoisting', 'intermediate', 'var, let, const, function hoisting, TDZ.', 30),
  jsTopic('js-this-prototypes', '17. this Keyword', 'intermediate', 'Global, object, function, arrow function, binding.', 40),
  jsTopic('js-es6-plus', '18. ES6+', 'intermediate', 'let, const, spread, rest, destructuring, modules.', 35),
  jsTopic('js-callbacks', '19. Callbacks', 'intermediate', 'Callback functions, higher-order functions.', 35),
  jsTopic('js-error-handling', '20. Error Handling', 'intermediate', 'try, catch, finally, throw, custom errors.', 30),

  // Level 3 – Advanced (21-30)
  jsTopic('js-scope-closures', '21. Closures', 'advanced', 'Lexical environment, private variables, factory functions.', 40),
  jsTopic('js-prototypes', '22. Prototypes', 'advanced', 'Prototype chain, inheritance, prototype methods.', 40),
  jsTopic('js-classes', '23. Classes', 'advanced', 'Constructor, inheritance, super, static methods.', 35),
  jsTopic('js-async-event-loop', '24. Asynchronous JS', 'advanced', 'Event loop, call stack, microtasks, macrotasks.', 45),
  jsTopic('js-promises', '25. Promises', 'advanced', 'Pending, fulfilled, rejected, chaining, Promise APIs.', 40),
  jsTopic('js-async-await', '26. Async/Await', 'advanced', 'Await, error handling, parallel execution.', 35),
  jsTopic('js-advanced-functions', '27. Advanced Functions', 'advanced', 'Currying, composition, IIFE, generators.', 45),
  jsTopic('js-iterators', '28. Iterators', 'advanced', 'Iterator protocol, iterable, Symbol.iterator.', 35),
  jsTopic('js-map-set', '29. Map & Set', 'advanced', 'Map, Set, WeakMap, WeakSet.', 35),
  jsTopic('js-modules', '30. Modules', 'advanced', 'import, export, default export, dynamic import.', 30),

  // Level 4 – Expert and Senior Developer (31-40)
  jsTopic('js-execution-context', '31. Execution Context', 'expert', 'Global context, function context, lexical environment.', 40),
  jsTopic('js-memory-management', '32. Memory Management', 'expert', 'Heap, stack, garbage collection, memory leaks.', 45),
  jsTopic('js-dom', '33. DOM', 'expert', 'DOM tree, selectors, manipulation, traversal.', 35),
  jsTopic('js-events', '34. Events', 'expert', 'Bubbling, capturing, delegation, propagation.', 40),
  jsTopic('js-browser-apis', '35. Browser APIs', 'expert', 'LocalStorage, SessionStorage, Fetch, URL, timers.', 40),
  jsTopic('js-performance-memory', '36. Performance', 'expert', 'Debouncing, throttling, lazy loading, optimization.', 45),
  jsTopic('js-functional-programming', '37. Functional Programming', 'expert', 'Pure functions, immutability, composition.', 40),
  jsTopic('js-design-patterns', '38. Design Patterns', 'expert', 'Singleton, factory, observer, module.', 45),
  jsTopic('js-security', '39. Security', 'expert', 'XSS, CSRF, input validation, secure storage.', 40),
  jsTopic('js-internals', '40. JavaScript Internals', 'expert', 'Engine, JIT, garbage collection, runtime.', 45),

  // Level 5 – Coding interview preparation (41-50)
  jsTopic('js-coding-strings', '41. String Coding Problems', 'coding', 'Reversals, palindromes, anagrams, sliding window.', 45),
  jsTopic('js-coding-arrays', '42. Array Coding Problems', 'coding', 'Two pointers, prefix sums, deduplication, chunking.', 45),
  jsTopic('js-coding-objects', '43. Object Manipulation', 'coding', 'Deep clone, flatten object, deep equality, grouping.', 45),
  jsTopic('js-coding-numbers', '44. Number-Based Problems', 'coding', 'Primes, Fibonacci, bitwise, precision handling.', 40),
  jsTopic('js-coding-recursion', '45. Recursion', 'coding', 'Base cases, tree traversal, nested flattening.', 45),
  jsTopic('js-coding-sorting', '46. Sorting & Searching', 'coding', 'Binary search, merge sort, quick sort, comparators.', 50),
  jsTopic('js-coding-ds', '47. Data Structures', 'coding', 'Stacks, queues, linked lists, hash maps, trees.', 50),
  jsTopic('js-coding-algorithms', '48. Algorithms & Complexity', 'coding', 'Big-O time/space, greedy, DP, memoization.', 50),
  jsTopic('js-coding-output', '49. Output-Based Questions', 'coding', 'Hoisting, closures, this, event loop output puzzles.', 45),
  jsTopic('js-coding-scenarios', '50. Real-World JS Scenarios', 'coding', 'Custom Promise.all, retry, LRU cache, rate limiter.', 50),
];
