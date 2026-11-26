import type { TopicLesson, TopicLessonCodeExample } from './topicLessonsFeed.js';

function makeRnLesson(
  categoryId: 'react' | 'nextjs',
  categoryName: 'React.js' | 'Next.js',
  id: string,
  title: string,
  level: TopicLesson['level'],
  estimatedMinutes: number,
  coreQuestion: string,
  simpleHumanAnswer: string,
  realWorldExample: string,
  codeExamples: TopicLessonCodeExample[],
  interviewSpeakingAnswer: string,
  followUpQuestions: string[]
): TopicLesson {
  return {
    id,
    categoryId,
    categoryName,
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

export const REACT_NEXT_LESSONS: Record<string, TopicLesson> = {
  // ======================== REACT (31 missing) ========================
  'react-jsx': makeRnLesson(
    'react',
    'React.js',
    'react-jsx',
    '2. JSX',
    'beginner',
    25,
    'What is JSX under the hood, and why must React components return a single root element?',
    'JSX is syntactic sugar for `React.createElement()` (or `_jsx()` in React 17+ automatic runtime). Because JSX compiles into a single JavaScript function call returning one object, a component must return one root element—or a Fragment `<>...</>` when you do not want an extra `<div>` in the DOM.',
    'Wrapping table columns `<td>` in `<>...</>` keeps valid HTML without breaking table layout with an extra `<div>`.',
    [
      {
        title: 'Example 1: Fragment Avoiding Extra DOM Wrapper',
        language: 'TSX',
        code: `function Columns() {
  return (
    <>
      <td>Alice</td>
      <td>Senior</td>
    </>
  );
}`,
        expectedOutput: 'Renders two <td> elements without any extra wrapper node.',
      },
      {
        title: 'Example 2: Automatic Escaping in JSX',
        language: 'TSX',
        code: `const bio = '<script>alert(1)</script>';
return <p>{bio}</p>; // Rendered safely as escaped text`,
        expectedOutput: 'Escapes HTML characters automatically to prevent XSS.',
      },
    ],
    'JSX compiles to `_jsx()` calls returning plain JS objects. It also escapes embedded expressions automatically, protecting against accidental XSS unless you explicitly use `dangerouslySetInnerHTML`.',
    ['Why do we write `className` and `htmlFor` instead of `class` and `for` in JSX?', 'What is the difference between `<>...</>` and `<React.Fragment key={id}>`?']
  ),

  'react-components': makeRnLesson(
    'react',
    'React.js',
    'react-components',
    '3. Components',
    'beginner',
    30,
    'How should you decide when to split a React component, and why is composition preferred over inheritance?',
    'Split a component when it has a distinct responsibility, is reused in multiple places, or holds isolated state whose re-renders shouldn’t slow down siblings. React favors composition (`children` and props) over class inheritance because UI pieces combine flexibly without rigid hierarchies.',
    'A `<Card>` component accepting `header` and `children` props can render a user profile, a pricing tier, or a chart without subclassing.',
    [
      {
        title: 'Example 1: Composition with children',
        language: 'TSX',
        code: `function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}`,
        expectedOutput: 'Reusable Card shell wrapping any nested JSX.',
      },
      {
        title: 'Example 2: Never Define Components Inside Components',
        language: 'TSX',
        code: `// BAD: defining Child inside Parent creates a new function type every render -> unmounts state!
// GOOD: define Child at module top level and pass props.`,
        expectedOutput: 'Preserves DOM nodes and child state across parent re-renders.',
      },
    ],
    'I keep components pure, small, and composed via `children` or slot props—and never declare a component inside another component, because changing its reference unmounts and resets child state on every render.',
    ['Why does defining a component inside another component destroy input focus?', 'What makes a React component "pure"?']
  ),

  'react-props-state': makeRnLesson(
    'react',
    'React.js',
    'react-props-state',
    '4. Props & State',
    'beginner',
    30,
    'What is the difference between Props and State, and what does "lifting state up" mean?',
    '**Props** are read-only inputs passed down from parent to child. **State** is private, mutable memory owned by a component that triggers a re-render when updated. When two sibling components need to stay in sync, you "lift state up" to their closest common parent.',
    'If a `<SearchBar>` and `<ProductList>` live side by side, lifting `query` state into `<ProductPage>` lets typing in `<SearchBar>` filter `<ProductList>`.',
    [
      {
        title: 'Example 1: Lifting State Up to Parent',
        language: 'TSX',
        code: `function ProductPage() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ResultsList query={query} />
    </>
  );
}`,
        expectedOutput: 'Single source of truth synced across sibling components.',
      },
      {
        title: 'Example 2: Derived State Instead of Duplicate State',
        language: 'TSX',
        code: `const [items, setItems] = useState([{ price: 10 }, { price: 20 }]);
const total = items.reduce((sum, i) => sum + i.price, 0); // Derive during render!`,
        expectedOutput: 'Computes total cleanly without an extra useState + useEffect.',
      },
    ],
    'Props flow down read-only; state lives at the lowest common ancestor of components that need it. I always compute derived values during render instead of mirroring props into duplicate `useState`.',
    ['Why should you avoid copying props into `useState`?', 'What is prop drilling and how do you solve it?']
  ),

  'react-conditional': makeRnLesson(
    'react',
    'React.js',
    'react-conditional',
    '5. Conditional Rendering',
    'beginner',
    25,
    'Why can `{count && <Badge />}` render a stray `0` in React, and how do you avoid it?',
    'In JavaScript, `0 && <Badge />` evaluates to `0`—and React renders the number `0` to the DOM (or crashes in React Native with "Text strings must be rendered within a <Text> component"!). Always convert to boolean (`count > 0 && ...`) or use a ternary `count > 0 ? <Badge /> : null`.',
    'Using `items.length > 0 && <List />` prevents `"0"` from appearing on screen when `items` is empty.',
    [
      {
        title: 'Example 1: Safe Boolean Check vs Falsy 0 Trap',
        language: 'TSX',
        code: `// BAD: {unreadCount && <Badge count={unreadCount} />} -> renders "0"
// GOOD:
{unreadCount > 0 ? <Badge count={unreadCount} /> : null}`,
        expectedOutput: 'Renders nothing when unreadCount is 0.',
      },
      {
        title: 'Example 2: Early Return for Loading/Error States',
        language: 'TSX',
        code: `if (isLoading) return <Spinner />;
if (error) return <ErrorBanner message={error} />;
return <Dashboard data={data} />;`,
        expectedOutput: 'Keeps happy-path JSX flat and easy to read.',
      },
    ],
    'I guard `&&` conditions with explicit booleans (`items.length > 0`) or ternaries so `0` never leaks into the UI—especially critical in React Native where raw strings/numbers outside `<Text>` crash.',
    ['What values does React ignore vs render in JSX (`false`, `null`, `undefined`, `0`, `""`)?', 'When are early returns cleaner than nested ternaries?']
  ),

  'react-lists-keys': makeRnLesson(
    'react',
    'React.js',
    'react-lists-keys',
    '6. Lists & Keys',
    'beginner',
    30,
    'Why are stable `key` props required in React lists, and what bug happens if you use array `index`?',
    'React uses `key` to match elements between old and new renders during reconciliation. If you use array `index` on a list that can reorder, insert at the top, or delete items, React pairs existing DOM/input state with the wrong item!',
    'In a todo list where each row has a checkbox or `<input>`, deleting item 0 shifts item 1 into index 0—so item 1 inherits item 0’s DOM focus or unchecked state.',
    [
      {
        title: 'Example 1: Stable Database ID as Key',
        language: 'TSX',
        code: `{todos.map((todo) => (
  <TodoRow key={todo.id} todo={todo} />
))}`,
        expectedOutput: 'Matches each DOM row to its exact todo.id across inserts/sorts.',
      },
      {
        title: 'Example 2: Resetting Component State Intentionally via Key',
        language: 'TSX',
        code: `<ProfileEditor key={selectedUserId} userId={selectedUserId} />`,
        expectedOutput: 'Cleanly resets internal form state whenever selectedUserId changes.',
      },
    ],
    'I always use stable unique IDs for `key`—never `index` on dynamic lists, and never `Math.random()` during render (which remounts every item on every render). Changing a `key` intentionally is also a great pattern to reset child state.',
    ['Why is `key={Math.random()}` even worse than `key={index}`?', 'When IS using array index as `key` acceptable?']
  ),

  'react-events': makeRnLesson(
    'react',
    'React.js',
    'react-events',
    '7. Event Handling',
    'beginner',
    25,
    'How do React SyntheticEvents work, and why should you pass `() => handleClick(id)` instead of `handleClick(id)`?',
    'React wraps native browser events in a cross-browser `SyntheticEvent` and delegates listeners at the root container (`#root`). Writing `onClick={handleClick(id)}` invokes the function **immediately during render** instead of on click—always pass a function reference `onClick={() => handleClick(id)}`.',
    'Calling `e.stopPropagation()` inside a nested Delete button prevents the parent Card’s `onClick` navigation from firing too.',
    [
      {
        title: 'Example 1: Passing Arguments & Stopping Bubbling',
        language: 'TSX',
        code: `<div onClick={() => openCard(item.id)}>
  <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}>
    Delete
  </button>
</div>`,
        expectedOutput: 'Deletes item without triggering parent card click.',
      },
      {
        title: 'Example 2: Typed Form Submit Handler',
        language: 'TSX',
        code: `function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // Submit form state via fetch
}`,
        expectedOutput: 'Prevents full-page browser reload on form submit.',
      },
    ],
    'React attaches delegated event listeners at the root and normalizes them into `SyntheticEvent`. I always pass function references to handlers and use `e.stopPropagation()` when nested interactive buttons sit inside clickable cards.',
    ['What changed with React event delegation in React 17+ (`document` vs `#root`)?', 'Why did React 17 remove event pooling (`e.persist()`)?']
  ),

  'react-lifecycle': makeRnLesson(
    'react',
    'React.js',
    'react-lifecycle',
    '8. Component Lifecycle',
    'beginner',
    30,
    'How do mounting, updating, and unmounting map to modern functional components with `useEffect`?',
    'A component **mounts** when first inserted into the DOM, **updates** when state/props change, and **unmounts** when removed. `useEffect(fn, [])` runs after mount, `useEffect(fn, [dep])` runs after `dep` changes, and the returned cleanup function runs before the next effect and on unmount.',
    'In React 18+ StrictMode in development, React mounts -> unmounts -> remounts components on purpose to expose missing `useEffect` cleanups (like unclosed WebSockets or intervals).',
    [
      {
        title: 'Example 1: Mount + Unmount Cleanup Pattern',
        language: 'TSX',
        code: `useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 1000);
  return () => clearInterval(id);
}, []);`,
        expectedOutput: 'Starts interval on mount and clears it on unmount.',
      },
      {
        title: 'Example 2: Aborting Stale Fetch on Dep Change / Unmount',
        language: 'TSX',
        code: `useEffect(() => {
  const controller = new AbortController();
  fetch(\`/api/users/\${id}\`, { signal: controller.signal }).then(...);
  return () => controller.abort();
}, [id]);`,
        expectedOutput: 'Cancels in-flight fetch if id changes or component unmounts.',
      },
    ],
    'Rather than thinking in class lifecycle methods, I think of `useEffect` as **synchronizing** with external systems (subscriptions, timers, network)—with a cleanup function that undoes the setup cleanly.',
    ['Why does React 18 StrictMode run `useEffect` twice in development?', 'Why do `useEffect` callbacks run *after* browser paint while `useLayoutEffect` runs *before* paint?']
  ),

  'react-usestate': makeRnLesson(
    'react',
    'React.js',
    'react-usestate',
    '9. useState',
    'intermediate',
    30,
    'Why must you use functional updates `setCount(c => c + 1)` and immutable updates for objects/arrays in `useState`?',
    'React batches state updates and closures capture the render’s snapshot of `count`. Calling `setCount(count + 1)` twice in one handler increments by only 1, whereas `setCount(c => c + 1)` queues against the latest state. Mutating an array/object in place keeps the same reference, so React skips re-rendering.',
    'Using `useState(() => JSON.parse(localStorage.getItem("prefs") || "{}"))` (lazy initializer function) runs `JSON.parse` only once on mount instead of on every re-render.',
    [
      {
        title: 'Example 1: Functional Updater & Immutable Array Update',
        language: 'TSX',
        code: `setCount((prev) => prev + 1);
setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done: true } : it)));`,
        expectedOutput: 'Safely updates based on latest state without mutating.',
      },
      {
        title: 'Example 2: Lazy Initializer for Expensive Setup',
        language: 'TSX',
        code: `const [draft, setDraft] = useState(() => loadSavedDraft());`,
        expectedOutput: 'Calls loadSavedDraft() only on initial mount.',
      },
    ],
    'I use functional updaters `prev => ...` whenever new state depends on old state, keep updates immutable so `Object.is` detects changes, and pass a lazy initializer function `() => ...` for expensive initial reads.',
    ['How does React 18 Automatic Batching work inside `setTimeout` and `fetch`?', 'Why does mutating `arr.push(x); setArr(arr)` fail to re-render?']
  ),

  'react-useeffect': makeRnLesson(
    'react',
    'React.js',
    'react-useeffect',
    '10. useEffect',
    'intermediate',
    40,
    'When is `useEffect` an anti-pattern ("You Might Not Need an Effect"), and how do you avoid stale closures and infinite loops?',
    'Do NOT use `useEffect` to compute derived state (like `fullName = first + last`) or reset state when props change—compute during render or use a `key`. Use `useEffect` only to sync with external systems (APIs, DOM, timers). Always include every reactive dependency, or use `AbortController` to stop race conditions.',
    'If you call `setUsers(...)` inside `useEffect(..., [users])`, updating `users` triggers the effect again -> infinite re-render loop!',
    [
      {
        title: 'Example 1: Race-Free Async Fetch in useEffect',
        language: 'TSX',
        code: `useEffect(() => {
  let ignore = false;
  fetchUser(id).then((u) => {
    if (!ignore) setUser(u);
  });
  return () => { ignore = true; };
}, [id]);`,
        expectedOutput: 'Ignores stale responses if user clicks rapidly between IDs.',
      },
      {
        title: 'Example 2: No Effect Needed for Derived Filtering',
        language: 'TSX',
        code: `// Compute directly during render (or wrap in useMemo if huge):
const visible = items.filter((i) => i.title.includes(query));`,
        expectedOutput: 'Avoids extra render pass and stale state bugs.',
      },
    ],
    'I treat `useEffect` strictly for external synchronization—never derived state—always clean up subscriptions/timers/fetches, and follow the ESLint exhaustive-deps rule rather than suppressing it.',
    ['How do you fix an infinite loop caused by an object/function in a `useEffect` dependency array?', 'When should you use `useLayoutEffect` instead of `useEffect`?']
  ),

  'react-useref': makeRnLesson(
    'react',
    'React.js',
    'react-useref',
    '11. useRef',
    'intermediate',
    30,
    'What are the two main uses of `useRef`, and how does `useRef` differ from `useState`?',
    '1) Holding a mutable value (`timerId`, `previousValue`) across renders **without** triggering a re-render when `.current` changes. 2) Accessing a DOM element (`.focus()`, `.scrollIntoView()`) directly via `ref={inputRef}`.',
    'In a debounce hook or stopwatch, storing `intervalRef.current = setInterval(...)` lets you clear the timer later without causing an extra render.',
    [
      {
        title: 'Example 1: Focusing an Input DOM Node',
        language: 'TSX',
        code: `const inputRef = useRef<HTMLInputElement>(null);
return <input ref={inputRef} onKeyDown={(e) => e.key === 'Escape' && inputRef.current?.blur()} />;`,
        expectedOutput: 'Blurs the DOM input cleanly on Escape.',
      },
      {
        title: 'Example 2: Storing Mutable Timer ID Without Re-rendering',
        language: 'TSX',
        code: `const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const schedule = () => {
  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(saveDraft, 500);
};`,
        expectedOutput: 'Persists timer ID across renders with zero extra re-renders.',
      },
    ],
    'Updating `state` schedules a re-render; mutating `ref.current` does not. Note that in React 19, `ref` can be passed directly as a prop without `forwardRef`!',
    ['Why shouldn’t you read or write `ref.current` during render?', 'What is `useImperativeHandle` used for?']
  ),

  'react-usecontext': makeRnLesson(
    'react',
    'React.js',
    'react-usecontext',
    '13. useContext',
    'intermediate',
    30,
    'How does `useContext` avoid prop drilling, and why can putting fast-changing state in Context hurt performance?',
    '`useContext` lets any descendant read a Provider’s value directly without passing props through every middle component. The catch: **every** consumer of that Context re-renders whenever the Provider’s `value` reference changes—even if it only uses one field.',
    'Wrapping `<AuthContext.Provider value={{ user, theme }}>` with a new inline object literal on every render forces all consumers to re-render needlessly.',
    [
      {
        title: 'Example 1: Memoizing Context Value + Custom Hook',
        language: 'TSX',
        code: `const value = useMemo(() => ({ user, logout }), [user, logout]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;`,
        expectedOutput: 'Prevents unnecessary consumer re-renders when parent re-renders.',
      },
      {
        title: 'Example 2: Splitting State & Dispatch Contexts',
        language: 'TSX',
        code: `// Components that only call dispatch() won't re-render when state changes!`,
        expectedOutput: 'Isolates action-only consumers from state updates.',
      },
    ],
    'Context is great for low-frequency globals like theme, auth, or locale—always memoize the Provider `value` object, and split state vs dispatch contexts (or use Zustand) for high-frequency updates.',
    ['How is `useContext` different from Redux or Zustand for performance?', 'What happens if `useContext` is called outside its Provider?']
  ),

  'react-usereducer': makeRnLesson(
    'react',
    'React.js',
    'react-usereducer',
    '14. useReducer',
    'intermediate',
    35,
    'When should you choose `useReducer` over `useState`?',
    'Choose `useReducer` when a component has complex, interdependent state transitions (e.g., multi-step forms, fetch state `{ status, data, error }`) or when the next state depends on multiple previous values—keeping state logic pure and easy to unit-test outside React.',
    'Modeling an async request as `idle -> loading -> success | error` via a reducer makes impossible states (like `isLoading: true` AND `error: "Failed"` simultaneously) impossible.',
    [
      {
        title: 'Example 1: Typed Discriminated Union Reducer',
        language: 'TSX',
        code: `type Action = { type: 'INC' } | { type: 'RESET'; to: number };
function reducer(state: number, action: Action) {
  switch (action.type) {
    case 'INC': return state + 1;
    case 'RESET': return action.to;
  }
}`,
        expectedOutput: 'Exhaustive, pure state transition function.',
      },
      {
        title: 'Example 2: Using Reducer in Component',
        language: 'TSX',
        code: `const [count, dispatch] = useReducer(reducer, 0);
// dispatch({ type: 'RESET', to: 10 })`,
        expectedOutput: 'Cleanly dispatches semantic actions instead of scattered setters.',
      },
    ],
    '`useReducer` shines when multiple state fields change together or transitions follow strict state-machine rules—and `dispatch` has a stable reference automatically, so you don’t need `useCallback` around it.',
    ['Is `dispatch` from `useReducer` guaranteed to be reference-stable across renders?', 'Can a reducer perform side effects like `fetch`?']
  ),

  'react-custom-hooks': makeRnLesson(
    'react',
    'React.js',
    'react-custom-hooks',
    '15. Custom Hooks',
    'intermediate',
    40,
    'How do Custom Hooks share stateful logic, and do two components using the same hook share state?',
    'A Custom Hook is any `use*` function that composes built-in hooks (`useState`, `useEffect`, `useRef`). **No**, components do NOT share state—each call to `useDebounce()` or `useFetch()` creates its own independent state inside that component instance.',
    '`useDebounce(query, 300)` encapsulates `useState` + `useEffect` + `clearTimeout` so every search bar across the app reuses the exact same tested debounce logic.',
    [
      {
        title: 'Example 1: Reusable useDebounce Hook',
        language: 'TSX',
        code: `export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}`,
        expectedOutput: 'Delays value updates cleanly with automatic timer cleanup.',
      },
      {
        title: 'Example 2: Reusable useToggle Hook',
        language: 'TSX',
        code: `export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn((v) => !v), []);
  return [on, toggle] as const;
}`,
        expectedOutput: 'Returns typed tuple with stable toggle function.',
      },
    ],
    'Custom hooks let us extract and test stateful behavior (`useDebounce`, `useLocalStorage`, `useMediaQuery`) without wrapper hell—remembering that hooks share *logic*, not *state*.',
    ['Why must custom hook names start with `use`?', 'How do you share actual *state* across components instead of just logic?']
  ),

  'react-router': makeRnLesson(
    'react',
    'React.js',
    'react-router',
    '16. React Router',
    'intermediate',
    35,
    'How does client-side routing work in React Router, and how do you implement Protected Routes?',
    'React Router intercepts link clicks (`<Link>`) and updates the browser History API without full page reloads, matching nested `<Route>`s and rendering child routes inside `<Outlet />`. A Protected Route wrapper checks auth state and redirects unauthenticated users with `<Navigate to="/login" replace />`.',
    'Using `replace` on `<Navigate to="/login" replace />` prevents the user from clicking the browser Back button into a protected page loop.',
    [
      {
        title: 'Example 1: Protected Route Wrapper with Outlet',
        language: 'TSX',
        code: `function RequireAuth() {
  const user = useAuthStore((s) => s.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}`,
        expectedOutput: 'Gates nested routes cleanly with one parent wrapper.',
      },
      {
        title: 'Example 2: Reading Dynamic URL Params',
        language: 'TSX',
        code: `const { topicId } = useParams<{ topicId: string }>();`,
        expectedOutput: 'Reads :topicId from /topics/:topicId.',
      },
    ],
    'I structure nested layouts with `<Outlet />`, protect private sections with a `<RequireAuth />` layout route using `<Navigate replace />`, and lazy-load route components for smaller initial bundles.',
    ['Why use `<Link>` instead of `<a href>` in a SPA?', 'What does `replace` do in `navigate("/login", { replace: true })`?']
  ),

  'react-forms': makeRnLesson(
    'react',
    'React.js',
    'react-forms',
    '17. Forms & Validation',
    'intermediate',
    40,
    'What is the difference between Controlled and Uncontrolled components, and why use React Hook Form?',
    'In a **Controlled** input, React state (`value` + `onChange`) is the single source of truth—re-rendering on every keystroke. In an **Uncontrolled** input, the DOM holds the value (`ref` or `FormData`). **React Hook Form** uses uncontrolled `ref`s under the hood so large forms stay fast without re-rendering on every keystroke.',
    'A 40-field checkout or KYC form with React Hook Form + Zod validates cleanly and avoids typing lag on low-end mobile devices.',
    [
      {
        title: 'Example 1: Controlled Input',
        language: 'TSX',
        code: `<input value={email} onChange={(e) => setEmail(e.target.value)} />`,
        expectedOutput: 'React state drives input value on every keystroke.',
      },
      {
        title: 'Example 2: Uncontrolled FormData on Submit',
        language: 'TSX',
        code: `function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
}`,
        expectedOutput: 'Reads form values on submit with zero keystroke re-renders.',
      },
    ],
    'For simple 1–2 field inputs I use controlled state; for complex multi-field forms I use React Hook Form + Zod so validation is schema-driven and keystrokes don’t re-render the whole form tree.',
    ['When do you actually *need* a controlled input (e.g. instant formatting or disabling submit live)?', 'What causes the React warning "A component is changing an uncontrolled input to be controlled"?']
  ),

  'react-api-integration': makeRnLesson(
    'react',
    'React.js',
    'react-api-integration',
    '18. API Integration',
    'intermediate',
    40,
    'Why do teams use TanStack Query (React Query) instead of raw `useEffect` + `fetch` for server state?',
    'Raw `useEffect` + `fetch` forces you to hand-code caching, deduplication, loading/error states, race-condition cancellation, background refetching, and pagination. TanStack Query handles all of those declaratively and distinguishes **server state** (cached remote data) from **client UI state**.',
    'If 3 components on a page call `useQuery({ queryKey: ["user"], ... })`, TanStack Query sends only ONE network request and shares the cached result.',
    [
      {
        title: 'Example 1: Fetch Helper Checking response.ok',
        language: 'TS',
        code: `// Remember: fetch() does NOT reject on HTTP 404/500!
const res = await fetch('/api/topics');
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
return res.json();`,
        expectedOutput: 'Properly throws on non-2xx HTTP status codes.',
      },
      {
        title: 'Example 2: TanStack Query with Stale Time',
        language: 'TSX',
        code: `const { data, isPending, error } = useQuery({
  queryKey: ['category', id],
  queryFn: () => fetchCategory(id),
  staleTime: 60_000,
});`,
        expectedOutput: 'Caches category for 60s and deduplicates concurrent mounts.',
      },
    ],
    'I keep server state in TanStack Query (or RTK Query) for caching, deduplication, and optimistic mutations, and always check `res.ok` when wrapping native `fetch()` since `fetch` only rejects on network failure.',
    ['Why doesn’t `fetch()` reject on HTTP 404 or 500?', 'What is the difference between `staleTime` and `gcTime` in TanStack Query?']
  ),

  'react-redux': makeRnLesson(
    'react',
    'React.js',
    'react-redux',
    '20. Redux & Redux Toolkit',
    'advanced',
    45,
    'How does Redux Toolkit (RTK) simplify Redux, and how does Immer allow "mutating" syntax safely?',
    'RTK’s `createSlice` removes action-type boilerplate and bundles **Immer** so writing `state.items.push(item)` inside a reducer actually produces a brand-new immutable state copy via JS Proxies. RTK Query also handles API caching and invalidation tags.',
    'Instead of writing `return { ...state, cart: [...state.cart, item] }`, `createSlice` lets you write `state.cart.push(item)` safely.',
    [
      {
        title: 'Example 1: Redux Toolkit Slice with Immer',
        language: 'TS',
        code: `const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as string[] },
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push(action.payload); // Safe immutable update via Immer!
    },
  },
});`,
        expectedOutput: 'Generates action creators and immutable reducer cleanly.',
      },
      {
        title: 'Example 2: Selecting Minimal Slice State',
        language: 'TSX',
        code: `const count = useAppSelector((s) => s.cart.items.length);`,
        expectedOutput: 'Only re-renders when item count changes.',
      },
    ],
    'Redux Toolkit is great for large teams needing strict predictable state transitions, Redux DevTools time-travel debugging, and RTK Query—while Zustand is lighter when we just need fast client state.',
    ['Why must Redux reducers be pure and never call `fetch()` directly?', 'What is `createAsyncThunk` vs RTK Query?']
  ),

  'react-zustand': makeRnLesson(
    'react',
    'React.js',
    'react-zustand',
    '21. Zustand',
    'advanced',
    35,
    'Why is Zustand popular in React & React Native apps, and how do selectors prevent extra re-renders?',
    'Zustand requires zero `<Provider>` wrappers, has minimal boilerplate, and works seamlessly with `persist` middleware (e.g. `AsyncStorage` in React Native). Passing a **selector** `useStore(s => s.user)` ensures a component ONLY re-renders when `user` changes, not when unrelated store keys update.',
    'In this app, `useProgressStore(s => s.completedTopicIds)` only re-renders when topics are completed, ignoring unrelated state changes.',
    [
      {
        title: 'Example 1: Typed Zustand Store',
        language: 'TS',
        code: `export const useFilterStore = create<{ query: string; setQuery: (q: string) => void }>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}));`,
        expectedOutput: 'Creates lightweight reactive store usable anywhere.',
      },
      {
        title: 'Example 2: Granular Selector Avoiding Re-renders',
        language: 'TSX',
        code: `// GOOD: subscribes only to query
const query = useFilterStore((s) => s.query);
// BAD: subscribes to entire store -> re-renders on every change!
// const { query } = useFilterStore();`,
        expectedOutput: 'Minimizes component re-renders via atomic selector.',
      },
    ],
    'I love Zustand for client/app state (auth, theme, offline progress) because it needs no Provider boilerplate, pairs cleanly with `AsyncStorage` persistence, and keeps renders surgical via selectors.',
    ['What happens if a Zustand selector returns a new object `{ a: s.a, b: s.b }` on every render?', 'How does `useShallow` solve multi-field selectors in Zustand?']
  ),

  'react-context-patterns': makeRnLesson(
    'react',
    'React.js',
    'react-context-patterns',
    '22. Context API Patterns',
    'advanced',
    35,
    'How do you structure Compound Components with Context (like `<Tabs>` / `<Tabs.Panel>`)?',
    'Compound Components share implicit state through a parent Context so callers compose clean, declarative JSX (`<Tabs><Tabs.Tab id="a" /><Tabs.Panel id="a" /></Tabs>`) without wiring props manually on every child.',
    'Throwing a helpful error inside `useTabsContext()` when used outside `<Tabs>` catches developer misuse immediately.',
    [
      {
        title: 'Example 1: Custom Guarded Context Hook',
        language: 'TSX',
        code: `function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be rendered inside <Tabs>');
  return ctx;
}`,
        expectedOutput: 'Gives clear error message if child is used outside parent.',
      },
      {
        title: 'Example 2: Compound Component Usage',
        language: 'TSX',
        code: `<Tabs defaultTab="guide">
  <Tabs.Tab id="guide" label="Quick Guide" />
  <Tabs.Panel id="guide"><LessonView /></Tabs.Panel>
</Tabs>`,
        expectedOutput: 'Clean, flexible API without prop explosion.',
      },
    ],
    'Compound Components with a guarded `useContext` hook let us build flexible design-system components without 15 boolean props.',
    ['What is the Inversion of Control benefit of Compound Components?', 'How do you avoid re-rendering inactive tab panels?']
  ),

  'react-reconciliation': makeRnLesson(
    'react',
    'React.js',
    'react-reconciliation',
    '23. React Reconciliation',
    'advanced',
    40,
    'How does React’s Reconciliation diffing algorithm achieve O(n) complexity instead of O(n³)?',
    'React makes two key heuristics: 1) Elements of **different types** (`<div>` -> `<span>` or `<A>` -> `<B>`) tear down the old subtree and build a new one. 2) Sibling lists use **`key`** props to match, move, or reuse existing Fiber nodes in O(n) time.',
    'Switching `<div className="a">` to `<div className="b">` only updates the `className` attribute in place; switching `<div>` to `<section>` destroys and recreates all children inside.',
    [
      {
        title: 'Example 1: Same Type Preserves State, Different Type Resets',
        language: 'TSX',
        code: `{isAdmin ? <Counter key="admin" /> : <Counter key="user" />}
// Different keys tell React these are distinct instances -> resets Counter state!`,
        expectedOutput: 'Uses reconciliation key heuristic intentionally to reset state.',
      },
      {
        title: 'Example 2: Attribute-Only Diffing',
        language: 'TSX',
        code: `<button disabled={isSaving} className={isSaving ? 'opacity-50' : ''}>Save</button>`,
        expectedOutput: 'Patches only changed DOM attributes without recreating the node.',
      },
    ],
    'React’s diffing relies on element type equality and list `key`s to run in linear O(n) time—meaning preserving element types keeps DOM state intact, while changing type or `key` deliberately resets it.',
    ['Why does changing a component type unmount all its children too?', 'How does React decide whether to move vs recreate a list item?']
  ),

  'react-virtual-dom': makeRnLesson(
    'react',
    'React.js',
    'react-virtual-dom',
    '24. Virtual DOM',
    'advanced',
    35,
    'What is the Virtual DOM really, and why isn’t it "always faster than vanilla DOM"?',
    'The Virtual DOM is a lightweight tree of plain JS objects describing what the UI should look like. It is NOT inherently faster than hand-tuned vanilla DOM updates—its real superpower is **declarative UI**: you describe the target state, and React batches and computes minimal DOM mutations automatically without manual DOM bookkeeping.',
    'Because React diffs JS objects in memory before touching the real DOM, it avoids costly layout thrashing from scattered manual DOM reads/writes.',
    [
      {
        title: 'Example 1: Declarative UI vs Imperative DOM',
        language: 'TSX',
        code: `// React computes the minimal diff between previous and next element trees
return <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;`,
        expectedOutput: 'Updates only added/removed/changed <li> nodes.',
      },
      {
        title: 'Example 2: Element Object Shape',
        language: 'TS',
        code: `// <h1 className="title">Hi</h1> compiles to:
// { $$typeof: Symbol(react.transitional.element), type: 'h1', props: { className: 'title', children: 'Hi' } }`,
        expectedOutput: 'Lightweight JS object compared during reconciliation.',
      },
    ],
    'The Virtual DOM isn’t magic speed—it’s the abstraction that makes declarative UI practical by batching diffs and minimizing expensive real-DOM mutations.',
    ['What is layout thrashing in browsers?', 'How does React Native bridge Virtual DOM concepts to native iOS/Android views?']
  ),

  'react-fiber': makeRnLesson(
    'react',
    'React.js',
    'react-fiber',
    '25. Fiber Architecture',
    'advanced',
    45,
    'What problem did React Fiber solve compared to the old Stack Reconciler?',
    'The old Stack Reconciler walked the component tree synchronously and recursively—once started, it couldn’t pause, causing dropped frames during typing or animations. **Fiber** turns each component into a linked-list node (`child`, `sibling`, `return`) so React can pause, resume, prioritize urgent updates (typing) over transitions (`useTransition`), and commit the finished tree atomically.',
    'Wrapping a heavy 5,000-row table filter in `startTransition(() => setFilter(val))` lets React keep the search input responsive at 60fps while pausing/restarting the background table render.',
    [
      {
        title: 'Example 1: Concurrent Prioritization with useTransition',
        language: 'TSX',
        code: `const [isPending, startTransition] = useTransition();
function onSearch(text: string) {
  setInput(text); // Urgent: updates input immediately
  startTransition(() => setFilterQuery(text)); // Interruptible background render
}`,
        expectedOutput: 'Keeps typing smooth while heavy list filtering yields to user input.',
      },
      {
        title: 'Example 2: Deferring Expensive Child Input',
        language: 'TSX',
        code: `const deferredQuery = useDeferredValue(query);`,
        expectedOutput: 'Lets urgent input render first and defers heavy child re-render.',
      },
    ],
    'Fiber is React’s linked-list work scheduler with two phases: an interruptible **Render phase** (pure, can pause/restart) and an atomic **Commit phase** (applies DOM mutations and runs effects).',
    ['Why must the Render phase be pure with zero side effects in Concurrent React?', 'What is the difference between `useTransition` and `setTimeout` debouncing?']
  ),

  'react-rendering-behavior': makeRnLesson(
    'react',
    'React.js',
    'react-rendering-behavior',
    '26. Rendering Behavior',
    'advanced',
    40,
    'When does a React component re-render, and why is "passing `children`" often better than `React.memo`?',
    'A component re-renders when: 1) its own state changes, 2) its **parent** re-renders (even if props didn’t change!), or 3) a Context it reads changes. Moving state down or passing slow subtrees as `children` prevents those children from re-rendering when the wrapper’s state changes—without needing `React.memo`.',
    'If `<ScrollWrapper>` tracks `scrollY` state and renders `{children}`, `<ExpensiveChart />` passed as `children` keeps the exact same React element reference and skips re-rendering!',
    [
      {
        title: 'Example 1: Children Slot Preventing Re-renders',
        language: 'TSX',
        code: `function ScrollTracker({ children }: { children: React.ReactNode }) {
  const [y, setY] = useState(0);
  return <div onScroll={(e) => setY(e.currentTarget.scrollTop)}>{children}</div>;
}
// <ScrollTracker><ExpensiveChart /></ScrollTracker>`,
        expectedOutput: 'ExpensiveChart does not re-render when y changes!',
      },
      {
        title: 'Example 2: Moving State Down to Leaf Component',
        language: 'TSX',
        code: `// Put hover/tooltip/modal open state inside the small Button/Modal wrapper, not Page!`,
        expectedOutput: 'Keeps parent tree untouched during local UI interactions.',
      },
    ],
    'Before reaching for `React.memo`, I optimize rendering structurally: move fast-changing state down into leaf components and pass heavy subtrees as `children` props.',
    ['Does a child component re-render when its props didn’t change if the parent re-rendered?', 'How does React Compiler (React 19) change manual `useMemo`/`React.memo`?']
  ),

  'react-lazy-loading': makeRnLesson(
    'react',
    'React.js',
    'react-lazy-loading',
    '28. Lazy Loading',
    'expert',
    35,
    'How do `React.lazy()` and dynamic `import()` reduce initial bundle size?',
    '`React.lazy(() => import("./HeavyChart"))` splits the component and its dependencies (like Chart.js or a Markdown editor) into a separate JS chunk that downloads only when rendered, wrapped inside `<Suspense fallback={<Spinner />}>`.',
    'Code-splitting Admin Analytics or PDF export modals keeps the main landing/login bundle fast on 3G mobile networks.',
    [
      {
        title: 'Example 1: Route/Feature Code Splitting',
        language: 'TSX',
        code: `const AdminPanel = React.lazy(() => import('./AdminPanel'));
return (
  <Suspense fallback={<LoadingScreen />}>
    {isAdmin && <AdminPanel />}
  </Suspense>
);`,
        expectedOutput: 'Downloads AdminPanel chunk only when isAdmin is true.',
      },
      {
        title: 'Example 2: Preloading Chunk on Hover',
        language: 'TSX',
        code: `const loadSettings = () => import('./SettingsModal');
<button onMouseEnter={loadSettings} onClick={() => setOpen(true)}>Settings</button>`,
        expectedOutput: 'Warms up chunk on hover so modal opens instantly on click.',
      },
    ],
    'I code-split heavy routes, charts, and admin-only modals with `React.lazy` + `Suspense`, and preload chunks on hover/focus when instant interaction matters.',
    ['Why does `React.lazy` require a default export?', 'What happens if a lazy chunk fails to load (Error Boundary)?']
  ),

  'react-suspense': makeRnLesson(
    'react',
    'React.js',
    'react-suspense',
    '29. Suspense',
    'expert',
    35,
    'How does `<Suspense>` coordinate loading states for code-splitting, streaming SSR, and async data?',
    '`<Suspense fallback={...}>` catches a suspended child (a lazy component or a Suspense-enabled data/Promise read like React 19 `use(promise)`), renders the `fallback` declaratively, and swaps in the real UI once ready—without `isLoading` boolean spaghetti across every child.',
    'Nesting `<Suspense>` boundaries around independent dashboard widgets lets fast widgets appear immediately while a slow analytics widget keeps showing its skeleton.',
    [
      {
        title: 'Example 1: Granular Nested Suspense Boundaries',
        language: 'TSX',
        code: `<div className="grid">
  <Suspense fallback={<CardSkeleton />}><RevenueCard /></Suspense>
  <Suspense fallback={<ChartSkeleton />}><SlowChart /></Suspense>
</div>`,
        expectedOutput: 'RevenueCard renders immediately without waiting for SlowChart.',
      },
      {
        title: 'Example 2: React 19 use() Unwrapping Promise',
        language: 'TSX',
        code: `function Comments({ commentsPromise }: { commentsPromise: Promise<string[]> }) {
  const comments = use(commentsPromise);
  return <ul>{comments.map((c, i) => <li key={i}>{c}</li>)}</ul>;
}`,
        expectedOutput: 'Suspends cleanly until commentsPromise resolves.',
      },
    ],
    '`Suspense` lets us place loading skeletons at UI boundaries rather than inside every leaf component, enabling progressive streaming in Next.js and clean async composition with `use()` in React 19.',
    ['What is a "fetch waterfall" and how do you avoid it with Suspense?', 'How does `Suspense` interact with `startTransition`?']
  ),

  'react-error-boundaries': makeRnLesson(
    'react',
    'React.js',
    'react-error-boundaries',
    '30. Error Boundaries',
    'expert',
    35,
    'What errors do React Error Boundaries catch, and what do they NOT catch?',
    'Error Boundaries (`getDerivedStateFromError` + `componentDidCatch` or `react-error-boundary`) catch **render, lifecycle, and constructor** errors in their child tree so one broken widget shows a fallback instead of white-screening the whole app. They do **NOT** catch errors inside `onClick` event handlers, `setTimeout`/async callbacks, or SSR!',
    'Wrapping each dashboard widget in its own `<ErrorBoundary>` ensures a bug in the Weather widget doesn’t crash the Billing table.',
    [
      {
        title: 'Example 1: Error Boundary with Reset Support',
        language: 'TSX',
        code: `<ErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <div>
      <p>Failed to load: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  )}
>
  <AnalyticsWidget />
</ErrorBoundary>`,
        expectedOutput: 'Isolates widget crashes and lets users retry cleanly.',
      },
      {
        title: 'Example 2: Handling Async/Event Errors',
        language: 'TSX',
        code: `// Use try/catch in event handlers (or useErrorBoundary().showBoundary(err))`,
        expectedOutput: 'Captures event handler errors that Error Boundaries miss.',
      },
    ],
    'I place Error Boundaries around route sections and independent widgets (with `react-error-boundary`), log to Sentry in `onError`, and remember to `try/catch` event handlers and async code separately.',
    ['Why do Error Boundaries still use a class component (or `react-error-boundary`) under the hood?', 'How do you reset an Error Boundary after a transient error?']
  ),

  'react-rsc': makeRnLesson(
    'react',
    'React.js',
    'react-rsc',
    '31. React Server Components',
    'expert',
    45,
    'What are React Server Components (RSC), and why can’t you use `useState` inside them?',
    'Server Components run **only on the server** (or at build time) and stream serialized UI over the wire—shipping **0 KB of component JavaScript** to the browser. Because they never run or re-render on the client, browser-only hooks like `useState`, `useEffect`, and `onClick` belong in `"use client"` leaf components.',
    'A `<TopicPage>` Server Component can read Postgres directly with Prisma and pass the plain JSON data as props into a tiny `<BookmarkButton />` Client Component.',
    [
      {
        title: 'Example 1: Server Component Passing Data to Client Leaf',
        language: 'TSX',
        code: `// Server Component (no 'use client')
export default async function TopicPage({ id }: { id: string }) {
  const topic = await db.topic.findUnique({ where: { id } });
  return <BookmarkButton topicId={topic.id} />; // Tiny Client Component
}`,
        expectedOutput: 'Keeps Prisma and DB logic completely out of the client JS bundle.',
      },
      {
        title: 'Example 2: Passing Server Component as Children to Client Wrapper',
        language: 'TSX',
        code: `<ClientModal>
  <ServerUserDetails id={userId} />
</ClientModal>`,
        expectedOutput: 'Renders Server Component inside Client wrapper without making it a Client Component.',
      },
    ],
    'RSC shifts non-interactive data-fetching and heavy markdown/syntax libraries to the server so client bundles stay tiny, while `"use client"` marks only interactive leaf boundaries.',
    ['What happens if a `"use client"` file imports a Server Component directly?', 'What types of props can be passed from a Server Component to a Client Component (serialization)?']
  ),

  'react-testing': makeRnLesson(
    'react',
    'React.js',
    'react-testing',
    '32. Testing',
    'expert',
    40,
    'How does React Testing Library encourage better tests than testing component internals?',
    'React Testing Library tests components the way users actually use them—querying by accessible role/label (`getByRole("button", { name: /submit/i })`) and simulating real interactions with `userEvent`, rather than testing internal state variables or CSS class names.',
    'Testing by `getByRole` simultaneously verifies accessibility (screen-reader labels and semantic buttons) AND survives internal refactors cleanly.',
    [
      {
        title: 'Example 1: User-Centric Testing Library Test',
        language: 'TSX',
        code: `render(<LoginForm onSubmit={mockSubmit} />);
await userEvent.type(screen.getByLabelText(/email/i), 'dev@app.dev');
await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
expect(mockSubmit).toHaveBeenCalledWith({ email: 'dev@app.dev' });`,
        expectedOutput: 'Tests accessibility labels, user typing, and callback payload.',
      },
      {
        title: 'Example 2: Mocking Network with MSW',
        language: 'TS',
        code: `// Mock Service Worker (MSW) intercepts fetch() at the network layer in tests`,
        expectedOutput: 'Tests real fetch/TanStack Query logic without mocking hooks.',
      },
    ],
    'I test behavior over implementation: `getByRole` / `getByLabelText` queries, `userEvent` over `fireEvent`, `findBy*` for async UI, and MSW to stub HTTP responses cleanly.',
    ['What is the difference between `getBy*`, `queryBy*`, and `findBy*` in Testing Library?', 'Why prefer `userEvent` over `fireEvent`?']
  ),

  'react-security-arch': makeRnLesson(
    'react',
    'React.js',
    'react-security-arch',
    '33. Security & Architecture',
    'expert',
    45,
    'What are the biggest security risks in React apps (XSS, `javascript:` URLs, tokens in `localStorage`)?',
    'React escapes `{text}` automatically, but XSS can still happen via `dangerouslySetInnerHTML` (always sanitize with **DOMPurify**) or unvalidated `href={userUrl}` (`javascript:alert(1)`!). Also avoid storing long-lived auth secrets in `localStorage` on web when `HttpOnly` cookies are possible.',
    'Always validate external links start with `https://` or `http://` before passing them to `<a href={url}>`.',
    [
      {
        title: 'Example 1: Sanitizing HTML with DOMPurify',
        language: 'TSX',
        code: `import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />`,
        expectedOutput: 'Strips <script> and onerror handlers from untrusted HTML.',
      },
      {
        title: 'Example 2: Blocking javascript: Protocol Links',
        language: 'TS',
        code: `const isSafeUrl = (url: string) => /^https?:\\/\\//i.test(url);`,
        expectedOutput: 'Prevents javascript: XSS via user-submitted profile URLs.',
      },
    ],
    'Even though React escapes JSX text, I sanitize rich HTML with DOMPurify, validate `href` protocols against `https?://`, and keep sensitive tokens in `HttpOnly` cookies on web or SecureStore on mobile.',
    ['Why is `<a href="javascript:...">` a classic React XSS vector?', 'Why is `localStorage` vulnerable to XSS compared to `HttpOnly` cookies?']
  ),

  'react-coding-hooks': makeRnLesson(
    'react',
    'React.js',
    'react-coding-hooks',
    '34. Custom Hooks Coding',
    'coding',
    45,
    'Implement a `usePrevious(value)` or `useFetch(url)` custom hook without race conditions.',
    'For `usePrevious`, store the value in a `useRef` and update it inside `useEffect` (so during render `ref.current` still holds the *previous* render’s value). For `useFetch`, use `AbortController` in `useEffect` cleanup so stale responses never overwrite newer ones.',
    '`usePrevious(price)` lets a stock ticker highlight green/red by comparing `price > prevPrice`.',
    [
      {
        title: 'Example 1: usePrevious Hook',
        language: 'TS',
        code: `export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}`,
        expectedOutput: 'Returns value from the previous completed render.',
      },
      {
        title: 'Example 2: Race-Safe useFetch Hook',
        language: 'TS',
        code: `export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    const ac = new AbortController();
    fetch(url, { signal: ac.signal }).then((r) => r.json()).then(setData).catch(() => {});
    return () => ac.abort();
  }, [url]);
  return data;
}`,
        expectedOutput: 'Aborts stale requests when url changes.',
      },
    ],
    'In hook coding interviews, always handle cleanup (`AbortController`, `clearTimeout`), avoid stale closures, and return stable callbacks or typed tuples.',
    ['Why does `usePrevious` update `ref.current` inside `useEffect` instead of during render?', 'How would you also expose `loading` and `error` from `useFetch` cleanly?']
  ),

  'react-senior-scenarios': makeRnLesson(
    'react',
    'React.js',
    'react-senior-scenarios',
    '35. Senior Interview Scenarios',
    'coding',
    50,
    'A React dashboard with a 10,000-row table and live search lags badly. How do you diagnose and fix it?',
    '1) Profile with **React DevTools Profiler** (Flamegraph) to see what re-renders and why. 2) Virtualize the 10k rows using **TanStack Virtual** (`@tanstack/react-virtual`) or `FlatList` in RN so only ~20 visible rows mount in the DOM. 3) Wrap search filtering in `useDeferredValue` / `useTransition` and move local input state down so the whole dashboard doesn’t re-render on every keystroke.',
    'Rendering 10,000 DOM `<tr>` nodes takes seconds; virtualizing to 25 visible rows drops render time to <5ms.',
    [
      {
        title: 'Example 1: Keeping Typing Fast with useDeferredValue',
        language: 'TSX',
        code: `const [query, setQuery] = useState('');
const deferredQuery = useDeferredValue(query);
const filtered = useMemo(() => filterRows(rows, deferredQuery), [rows, deferredQuery]);`,
        expectedOutput: 'Keeps input responsive while heavy filtering updates smoothly.',
      },
      {
        title: 'Example 2: Virtualizing Large Lists',
        language: 'TSX',
        code: `// Mount only visible viewport rows (~20 items instead of 10,000 DOM nodes)
// Web: @tanstack/react-virtual | React Native: FlatList / FlashList`,
        expectedOutput: 'Cuts DOM/native node count by 99%.',
      },
    ],
    'My senior React optimization order: 1) Measure with React Profiler, 2) Virtualize long lists (`FlashList`/`react-virtual`), 3) Restructure state/children to stop cascade re-renders, 4) `useTransition`/`useDeferredValue` for heavy filters, and 5) `React.lazy` for bundle size.',
    ['How do you investigate a React memory leak in production?', 'When does `React.memo` actually make performance *worse*?']
  ),

  // ======================== NEXT.JS (27 missing) ========================
  'next-intro': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-intro',
    '1. Next.js Introduction',
    'beginner',
    20,
    'What does Next.js add on top of React, and when would you choose Next.js vs plain React (Vite)?',
    'React is a UI library; **Next.js** is a full-stack React framework providing App Router, Server Components, SSR/SSG/ISR, Server Actions, Route Handlers, Image/Font optimization, and SEO Metadata. Choose Next.js for SEO, fast initial load, or full-stack BFF routes; choose Vite + React for purely behind-login internal tools or static SPAs.',
    'An e-commerce storefront needs SSR/ISR + Metadata API so Google indexes product pages and social shares show rich OpenGraph cards.',
    [
      {
        title: 'Example 1: Zero-JS Server Component Page',
        language: 'TSX',
        code: `export default async function HomePage() {
  const posts = await getLatestPosts();
  return <main>{posts.map((p) => <h2 key={p.id}>{p.title}</h2>)}</main>;
}`,
        expectedOutput: 'Renders HTML on server with zero client component JS.',
      },
      {
        title: 'Example 2: Built-in SEO Metadata Export',
        language: 'TS',
        code: `export const metadata = {
  title: 'Interview Prep',
  description: 'Full-stack developer roadmaps and mock interviews.',
};`,
        expectedOutput: 'Generates <title> and <meta> tags on the server.',
      },
    ],
    'Next.js turns React into a production full-stack framework with server-first rendering, built-in caching/revalidation, SEO metadata, and asset optimization.',
    ['What is the biggest difference between Next.js Pages Router and App Router?', 'When is Vite + React SPA a better fit than Next.js?']
  ),

  'next-setup': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-setup',
    '2. Project Setup',
    'beginner',
    25,
    'What are the key files in a Next.js App Router project (`layout.tsx`, `page.tsx`, `next.config.ts`)?',
    'In `app/`, `page.tsx` makes a route publicly reachable, `layout.tsx` wraps child pages and preserves state across navigations, `loading.tsx` wraps pages in `<Suspense>`, and `error.tsx` wraps them in an Error Boundary.',
    'Putting a navbar inside `app/layout.tsx` keeps it mounted without re-rendering when navigating between `/courses` and `/pricing`.',
    [
      {
        title: 'Example 1: Root Layout (Required html & body)',
        language: 'TSX',
        code: `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
        expectedOutput: 'Defines root document shell for all App Router pages.',
      },
      {
        title: 'Example 2: next.config.ts Remote Images Config',
        language: 'TS',
        code: `const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }] },
};
export default nextConfig;`,
        expectedOutput: 'Whitelists external CDN hostnames for next/image optimization.',
      },
    ],
    'App Router uses special file conventions (`page`, `layout`, `loading`, `error`, `not-found`) so routing, Suspense boundaries, and Error Boundaries stay co-located per route segment.',
    ['Can a folder in `app/` exist without a `page.tsx`?', 'What is the purpose of `next.config.ts` `remotePatterns`?']
  ),

  'next-pages-router': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-pages-router',
    '3. Pages Router',
    'beginner',
    30,
    'How did `getServerSideProps` and `getStaticProps` work in Pages Router, and how did App Router replace them?',
    'In the legacy Pages Router (`pages/`), every component ran on the client and hydrated; `getServerSideProps` ran on every request (SSR), while `getStaticProps` ran at build time (SSG/ISR). App Router replaces them with `async` Server Components using `fetch()` caching options or direct DB queries.',
    'Instead of serializing props from `getServerSideProps` to the page, App Router Server Components `await` data directly inside the component.',
    [
      {
        title: 'Example 1: Legacy Pages Router SSR (For Maintenance Context)',
        language: 'TSX',
        code: `export async function getServerSideProps() {
  return { props: { time: Date.now() } };
}`,
        expectedOutput: 'Runs on every request in pages/ directory.',
      },
      {
        title: 'Example 2: Modern App Router Equivalent',
        language: 'TSX',
        code: `export const dynamic = 'force-dynamic';
export default async function Page() {
  return <p>{Date.now()}</p>;
}`,
        expectedOutput: 'Renders dynamically per request in app/ with zero client JS.',
      },
    ],
    'Pages Router used `getStaticProps`/`getServerSideProps` and shipped full page JS to hydrate; App Router replaces them with Server Components, streaming Suspense, and nested layouts.',
    ['Why did App Router eliminate `getInitialProps` and `getServerSideProps`?', 'Can Pages Router and App Router coexist during a gradual migration?']
  ),

  'next-app-router': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-app-router',
    '4. App Router',
    'beginner',
    35,
    'How does App Router navigation work with `<Link>` prefetching and Soft Navigation?',
    'Next.js `<Link>` prefetches linked route RSC payloads in the background when visible in the viewport. Clicking navigates **softly**—updating only the changed nested segments while keeping shared `layout.tsx` state intact without a full browser reload.',
    'Non-`page.tsx` files (components, hooks, utils) can live safely inside `app/` or `src/` without accidentally becoming public URLs.',
    [
      {
        title: 'Example 1: App Router Link & Programmatic Navigation',
        language: 'TSX',
        code: `import Link from 'next/link';
<Link href="/topics/js-closures" prefetch={true}>Closures</Link>`,
        expectedOutput: 'Prefetches RSC payload and performs fast soft navigation.',
      },
      {
        title: 'Example 2: Route Groups Without Affecting URL',
        language: 'Text',
        code: `app/(marketing)/pricing/page.tsx  -> /pricing
app/(dashboard)/settings/page.tsx -> /settings`,
        expectedOutput: 'Applies separate layouts without adding folder names to the URL.',
      },
    ],
    'App Router’s nested segment tree + Route Groups `(group)` let different app sections share different layouts cleanly while `<Link>` prefetches RSC payloads for instant transitions.',
    ['When should you set `prefetch={false}` on `<Link>`?', 'What is the difference between `router.push()` and `router.refresh()` in App Router?']
  ),

  'next-dynamic-routes': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-dynamic-routes',
    '6. Dynamic Routes',
    'beginner',
    30,
    'How do Dynamic Routes `[slug]`, Catch-all `[...slug]`, and `generateStaticParams` work in Next.js 15+?',
    'Folders like `app/blog/[slug]/page.tsx` match dynamic URLs (`[...slug]` matches multi-segment paths; `[[...slug]]` is optional). **Important Next.js 15+ change:** `params` and `searchParams` are now **Promises** (`await params`)!',
    'Exporting `generateStaticParams()` pre-renders popular blog slugs at build time while still generating new slugs on demand.',
    [
      {
        title: 'Example 1: Next.js 15+ Async params in Dynamic Page',
        language: 'TSX',
        code: `export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <h1>Topic: {slug}</h1>;
}`,
        expectedOutput: 'Awaits params Promise per Next.js 15+ standard.',
      },
      {
        title: 'Example 2: Pre-building Static Slugs',
        language: 'TS',
        code: `export async function generateStaticParams() {
  const topics = await getTopTopics();
  return topics.map((t) => ({ slug: t.slug }));
}`,
        expectedOutput: 'Generates static HTML/RSC for known slugs at build time.',
      },
    ],
    'In Next.js 15+, `params` and `searchParams` are async Promises so pages must `await` them—and pairing dynamic routes with `generateStaticParams()` gives instant static speed.',
    ['What is the difference between `[...slug]` and `[[...slug]]`?', 'What does `dynamicParams = false` do alongside `generateStaticParams`?']
  ),

  'next-layouts-templates': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-layouts-templates',
    '7. Layouts & Templates',
    'beginner',
    30,
    'What is the exact difference between `layout.tsx` and `template.tsx` in Next.js App Router?',
    'A **`layout.tsx`** persists across child route navigations—keeping DOM nodes, scroll position, and React state alive without remounting. A **`template.tsx`** creates a brand-new instance and remounts on every navigation (useful for enter animations or per-page `useEffect` analytics).',
    'Use `layout.tsx` for persistent sidebars and navbars; use `template.tsx` only when you intentionally want state and effects to reset on every route change.',
    [
      {
        title: 'Example 1: Persistent Dashboard Layout',
        language: 'TSX',
        code: `export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}`,
        expectedOutput: 'Keeps Sidebar mounted and stateful across child routes.',
      },
      {
        title: 'Example 2: Remounting Template for Page Transitions',
        language: 'TSX',
        code: `// app/template.tsx remounts on every route navigation`,
        expectedOutput: 'Re-triggers CSS enter animations or page-view effects per route.',
      },
    ],
    'Layouts persist across navigations (preserving sidebar scroll and state), whereas Templates remount fresh on every route change.',
    ['Why shouldn’t you read `searchParams` inside `layout.tsx`?', 'Can a nested `layout.tsx` pass props directly to `{children}`?']
  ),

  'next-server-components': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-server-components',
    '8. Server Components',
    'intermediate',
    40,
    'Why are Server Components the default in Next.js App Router, and how do you avoid importing server secrets into Client Components?',
    'Server Components execute only on the server, can `await` databases/filesystems directly, and ship 0 KB of component JS to the browser. To prevent accidental bundling of server-only DB/API keys into `"use client"` files, mark server utilities with `import "server-only"` so Next.js fails the build immediately if a Client Component imports them.',
    'Putting `import "server-only"` at the top of `lib/db.ts` guarantees your database credentials can never leak into browser bundles.',
    [
      {
        title: 'Example 1: Enforcing Server-Only Boundary',
        language: 'TS',
        code: `import 'server-only';
export async function getSecretConfig() {
  return process.env.API_SECRET_KEY;
}`,
        expectedOutput: 'Throws build error if imported from a "use client" module.',
      },
      {
        title: 'Example 2: Parallel Data Fetching in Server Component',
        language: 'TSX',
        code: `const [user, courses] = await Promise.all([getUser(id), getCourses()]);`,
        expectedOutput: 'Avoids sequential await waterfalls on the server.',
      },
    ],
    'I keep pages and data-fetching components as Server Components by default, guard server modules with `import "server-only"`, and use `Promise.all` (or `<Suspense>`) to avoid server waterfalls.',
    ['How do you handle `window` or `localStorage` errors in Next.js?', 'How does React’s `cache()` function deduplicate DB calls across Server Components in one request?']
  ),

  'next-client-components': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-client-components',
    '9. Client Components',
    'intermediate',
    35,
    'Do `"use client"` components still pre-render on the server in Next.js, and where should you place `"use client"`?',
    '**Yes!** A common misconception is that `"use client"` skips the server. Client Components STILL pre-render initial HTML on the server for fast FCP, then hydrate in the browser! Push `"use client"` as deep as possible to interactive leaf components (like a SearchBar or LikeButton) rather than top-level layouts.',
    'Marking `app/layout.tsx` with `"use client"` pulls the entire app tree into the client JS bundle—keep layouts on the server and isolate `"use client"` to small interactive leaves.',
    [
      {
        title: 'Example 1: Interactive Leaf Client Component',
        language: 'TSX',
        code: `'use client';
import { useState } from 'react';
export function LikeButton({ initial }: { initial: number }) {
  const [likes, setLikes] = useState(initial);
  return <button onClick={() => setLikes((n) => n + 1)}>♥ {likes}</button>;
}`,
        expectedOutput: 'Pre-renders HTML on server and hydrates button interactivity on client.',
      },
      {
        title: 'Example 2: Passing Server Children Through Client Provider',
        language: 'TSX',
        code: `'use client';
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeCtx.Provider value="dark">{children}</ThemeCtx.Provider>;
}`,
        expectedOutput: 'Lets Server Components stay on the server inside a Client Provider.',
      },
    ],
    'Keep `"use client"` at leaf boundaries! Client Components still SSR their initial HTML (so `window` still needs `useEffect` or checks), and wrapping Server Components via `{children}` keeps them server-only.',
    ['What causes Next.js Hydration Mismatch errors (`Text content did not match`)?', 'How do you fix a hydration mismatch caused by `new Date().toLocaleTimeString()`?']
  ),

  'next-ssr': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-ssr',
    '10. SSR (Server-Side Rendering)',
    'intermediate',
    35,
    'When does Next.js App Router switch a route from Static to Dynamic (SSR), and what are the trade-offs?',
    'A route becomes Dynamic (rendered per request on the server) whenever it reads request-specific data: `cookies()`, `headers()`, `searchParams`, `fetch(..., { cache: "no-store" })`, or `export const dynamic = "force-dynamic"`. SSR gives always-fresh personalized HTML, at the cost of higher TTFB and server compute.',
    'A user’s `/dashboard` reading `cookies()` automatically renders dynamically per request, while `/about` stays static at the CDN edge.',
    [
      {
        title: 'Example 1: Dynamic Per-Request Rendering',
        language: 'TSX',
        code: `import { cookies } from 'next/headers';
export default async function Dashboard() {
  const cookieStore = await cookies(); // Opts route into dynamic SSR
  const token = cookieStore.get('session')?.value;
  return <p>{token ? 'Logged in' : 'Guest'}</p>;
}`,
        expectedOutput: 'Renders fresh per-user HTML on every request.',
      },
      {
        title: 'Example 2: Opting Out of Fetch Cache',
        language: 'TS',
        code: `const res = await fetch('https://api.example.com/live-price', { cache: 'no-store' });`,
        expectedOutput: 'Fetches fresh data on every request.',
      },
    ],
    'Next.js statically renders routes by default unless dynamic APIs (`cookies`, `headers`, `searchParams`, `no-store`) are used—giving static CDN speed where possible and dynamic SSR only where needed.',
    ['In Next.js 15, what is the default `fetch()` cache behavior (`no-store` vs `force-cache`)?', 'How does PPR (Partial Prerendering) combine static shells with dynamic SSR holes?']
  ),

  'next-ssg': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-ssg',
    '11. SSG (Static Site Generation)',
    'intermediate',
    30,
    'How does Static Site Generation work in Next.js, and what types of pages benefit most?',
    'SSG pre-renders HTML and RSC payloads once at `next build` time and serves them straight from CDN edge nodes with near-zero TTFB and zero server DB load. Best for marketing pages, docs, blog posts, and curriculum pages that rarely change.',
    'Our Interview Prep marketing pages and documentation routes render once at build time and handle traffic spikes effortlessly.',
    [
      {
        title: 'Example 1: Static Page with Cached Fetch',
        language: 'TSX',
        code: `export default async function DocsPage() {
  const docs = await fetch('https://api.example.com/docs', { cache: 'force-cache' }).then((r) => r.json());
  return <article>{docs.title}</article>;
}`,
        expectedOutput: 'Generated once at build time and served from CDN.',
      },
      {
        title: 'Example 2: Forcing Static Rendering',
        language: 'TS',
        code: `export const dynamic = 'force-static';`,
        expectedOutput: 'Guarantees route is statically built without dynamic opt-in.',
      },
    ],
    'SSG gives unbeatable speed and reliability for public content; whenever content updates occasionally without rebuilding the whole site, I upgrade SSG to ISR.',
    ['What is the downside of pure SSG for a site with 100,000 product pages?', 'How do `generateStaticParams` and ISR solve huge SSG build times?']
  ),

  'next-isr': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-isr',
    '12. ISR (Incremental Static Regeneration)',
    'intermediate',
    35,
    'How does ISR work (time-based vs on-demand), and what does "stale-while-revalidate" mean?',
    'ISR serves fast cached static pages, and either regenerates them in the background after `revalidate: N` seconds (stale-while-revalidate: the first visitor after N seconds still gets instant cached HTML while Next.js rebuilds in the background) OR regenerates immediately on demand via `revalidateTag()` / `revalidatePath()`.',
    'When an editor updates a WordPress post, a webhook calls `revalidateTag("wp-posts")` on Next.js so the static page refreshes within 1 second.',
    [
      {
        title: 'Example 1: Time-Based ISR',
        language: 'TS',
        code: `export const revalidate = 60; // Revalidate page in background at most every 60s`,
        expectedOutput: 'Serves cached page while refreshing asynchronously every minute.',
      },
      {
        title: 'Example 2: On-Demand Tag Revalidation',
        language: 'TS',
        code: `import { revalidateTag } from 'next/cache';
// Inside webhook Route Handler or Server Action:
revalidateTag('products');`,
        expectedOutput: 'Purges cached fetches tagged "products" immediately.',
      },
    ],
    'ISR gives the best of SSG and SSR: CDN-level speed with fresh content. I prefer On-Demand ISR (`revalidateTag`) triggered by CMS/DB writes over guessing a short `revalidate` timer.',
    ['Why does the *first* user after `revalidate` seconds expire still see the old page once?', 'When would you choose `revalidateTag` over `revalidatePath`?']
  ),

  'next-csr': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-csr',
    '13. CSR (Client-Side Rendering)',
    'intermediate',
    25,
    'When should you still fetch data on the client (CSR) inside a Next.js App Router app?',
    'Use CSR (`"use client"` + TanStack Query / SWR) for live-updating dashboards (polling every 5s), user-triggered search/filtering, infinite scroll, or browser-dependent widgets (`navigator.geolocation`) where SEO isn’t needed.',
    'Streaming a Server Component shell first and letting TanStack Query poll live server metrics on the client gives instant initial load + live updates.',
    [
      {
        title: 'Example 1: Client-Side Polling with TanStack Query',
        language: 'TSX',
        code: `'use client';
const { data } = useQuery({
  queryKey: ['metrics'],
  queryFn: () => fetch('/api/metrics').then((r) => r.json()),
  refetchInterval: 5000,
});`,
        expectedOutput: 'Polls live metrics every 5 seconds in the browser.',
      },
      {
        title: 'Example 2: Disabling SSR for Browser-Only Widget',
        language: 'TSX',
        code: `const MapWidget = dynamic(() => import('./MapWidget'), { ssr: false });`,
        expectedOutput: 'Loads MapWidget only in the browser where window/canvas exist.',
      },
    ],
    'I combine Server Components for initial page data + SEO with CSR (TanStack Query) for live polling, infinite feeds, and browser-only canvas/map libraries.',
    ['Why can’t `next/dynamic(..., { ssr: false })` be called directly inside a Server Component in Next.js 15?', 'What is the SEO risk of rendering primary article text purely with CSR?']
  ),

  'next-loading-states': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-loading-states',
    '15. Loading States',
    'intermediate',
    25,
    'How does `loading.tsx` work under the hood in Next.js App Router?',
    '`loading.tsx` automatically wraps the segment’s `page.tsx` and child layouts inside a React `<Suspense fallback={<Loading />}>` boundary—so navigation feels instant while slow server queries stream in.',
    'Because `layout.tsx` sits *outside* the `<Suspense>` boundary created by `loading.tsx`, the navbar and sidebar stay interactive while the page skeleton spins.',
    [
      {
        title: 'Example 1: Instant Route Skeleton via loading.tsx',
        language: 'TSX',
        code: `// app/courses/loading.tsx
export default function Loading() {
  return <div className="animate-pulse h-48 rounded-xl bg-neutral-800" />;
}`,
        expectedOutput: 'Streams skeleton immediately on route navigation.',
      },
      {
        title: 'Example 2: Granular Suspense Inside a Page',
        language: 'TSX',
        code: `<Suspense fallback={<TableSkeleton />}><SlowOrdersTable /></Suspense>`,
        expectedOutput: 'Shows fast header immediately while only the slow table loads.',
      },
    ],
    '`loading.tsx` gives zero-config route-level Suspense, and for complex pages I add nested `<Suspense>` boundaries so fast sections don’t wait on one slow query.',
    ['Does `loading.tsx` wrap `layout.tsx` or sit *inside* `layout.tsx`?', 'How do you prevent layout shift (CLS) with loading skeletons?']
  ),

  'next-error-handling': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-error-handling',
    '16. Error Handling',
    'intermediate',
    30,
    'Why must `error.tsx` be a `"use client"` component, and what does `global-error.tsx` handle?',
    '`error.tsx` wraps `page.tsx` in a React Error Boundary—which requires client-side state/handlers (like `reset()` to retry rendering), so it MUST have `"use client"`. `error.tsx` does NOT catch errors thrown in the Root `layout.tsx`; `app/global-error.tsx` (with its own `<html><body>`) catches those.',
    'Calling `notFound()` in a Server Component renders the closest `not-found.tsx` with HTTP 404 instead of triggering `error.tsx` (500).',
    [
      {
        title: 'Example 1: Recoverable Route error.tsx',
        language: 'TSX',
        code: `'use client';
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}`,
        expectedOutput: 'Renders local error UI and lets user retry the segment.',
      },
      {
        title: 'Example 2: Triggering 404 via notFound()',
        language: 'TSX',
        code: `import { notFound } from 'next/navigation';
const topic = await getTopic(id);
if (!topic) notFound();`,
        expectedOutput: 'Renders not-found.tsx with proper 404 status.',
      },
    ],
    'I pair `notFound()` + `not-found.tsx` for missing resources (404), `"use client"` `error.tsx` for recoverable segment errors, and `global-error.tsx` as the root fallback.',
    ['Why doesn’t `error.tsx` catch errors thrown in `layout.tsx` at the same folder level?', 'What is the difference between `reset()` and `router.refresh()`?']
  ),

  'next-server-actions': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-server-actions',
    '17. Server Actions',
    'advanced',
    45,
    'What are Next.js Server Actions (`"use server"`), and what security checks are mandatory inside them?',
    'Server Actions are async functions running on the server that Next.js exposes as automatic POST endpoints for forms and client mutations. **Critical rule:** Server Actions are public HTTP POST endpoints! You MUST authenticate the caller, authorize the action, and validate inputs with Zod inside every Server Action—never trust hidden form fields.',
    'Paired with `useActionState` (React 19) and `revalidatePath()`, forms work cleanly with progressive enhancement and automatic pending states.',
    [
      {
        title: 'Example 1: Authenticated & Validated Server Action',
        language: 'TS',
        code: `'use server';
export async function createNoteAction(prev: unknown, formData: FormData) {
  const user = await requireAuthUser(); // MANDATORY auth check!
  const parsed = noteSchema.safeParse({ title: formData.get('title') });
  if (!parsed.success) return { error: 'Invalid title' };
  await db.note.create({ data: { title: parsed.data.title, userId: user.id } });
  revalidatePath('/notes');
  return { ok: true };
}`,
        expectedOutput: 'Authenticates, validates with Zod, mutates DB, and refreshes cache.',
      },
      {
        title: 'Example 2: Pending Button with useFormStatus',
        language: 'TSX',
        code: `'use client';
import { useFormStatus } from 'react-dom';
export function SubmitBtn() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}`,
        expectedOutput: 'Disables submit button automatically while Server Action runs.',
      },
    ],
    'Treat every `"use server"` function like a public REST endpoint: check `session`/user, enforce ownership, validate with Zod, and call `revalidateTag` / `revalidatePath` after mutation.',
    ['Why shouldn’t you use Server Actions for high-volume GET data fetching?', 'What happens if you call `redirect()` inside a `try/catch` block in a Server Action?']
  ),

  'next-api-routes': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-api-routes',
    '18. API Routes (Pages)',
    'advanced',
    25,
    'How do legacy Pages Router API routes (`pages/api/*`) differ from App Router Route Handlers (`app/api/*/route.ts`)?',
    'Pages Router used Node-style `(req: NextApiRequest, res: NextApiResponse)` handlers with `res.status(200).json(...)`. App Router replaces them with Web Standard `Request` / `Response` (`NextRequest` / `NextResponse`) exports named `GET`, `POST`, `PUT`, `DELETE` inside `route.ts`.',
    'Using Web Standard `Request`/`Response` makes App Router Route Handlers portable across Node.js, Edge runtimes, and Web Streams.',
    [
      {
        title: 'Example 1: Legacy Pages API Route',
        language: 'TS',
        code: `export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();
  res.status(200).json({ ok: true });
}`,
        expectedOutput: 'Pages Router Node-style handler.',
      },
      {
        title: 'Example 2: Modern App Router Route Handler',
        language: 'TS',
        code: `export async function GET() {
  return Response.json({ ok: true });
}`,
        expectedOutput: 'App Router Web-Standard GET handler.',
      },
    ],
    'Pages API routes used `(req, res)` Express-like signatures, while App Router `route.ts` uses Web Standard `Request`/`Response` and named HTTP method exports.',
    ['Can `route.ts` and `page.tsx` exist in the same folder?', 'How do you read raw webhook body in App Router `route.ts` (`await req.text()`)?']
  ),

  'next-route-handlers': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-route-handlers',
    '19. Route Handlers',
    'advanced',
    40,
    'When should you build a Route Handler (`route.ts`) instead of a Server Action, and how are GET Route Handlers cached?',
    'Use **Route Handlers** for webhooks (Stripe/Clerk), public REST APIs consumed by mobile apps (React Native!), OAuth callbacks, or streaming SSE responses. **Note:** In Next.js 15+, `GET` Route Handlers are **uncached by default** (unlike Next.js 14 where static GETs were cached!).',
    'A Stripe webhook at `app/api/webhooks/stripe/route.ts` reads `const raw = await req.text()` to verify `stripe-signature`.',
    [
      {
        title: 'Example 1: POST Route Handler with Zod & Auth',
        language: 'TS',
        code: `export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 });
  return Response.json({ created: true }, { status: 201 });
}`,
        expectedOutput: 'Validates JSON body and returns 201 or 400.',
      },
      {
        title: 'Example 2: Webhook Raw Body Verification',
        language: 'TS',
        code: `export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get('x-signature');
  // Verify HMAC against rawBody
  return Response.json({ received: true });
}`,
        expectedOutput: 'Preserves exact raw string for cryptographic verification.',
      },
    ],
    'Route Handlers (`route.ts`) are ideal for webhooks, mobile/external APIs, and streaming—and in Next.js 15+, `GET` handlers are dynamic by default unless you export `dynamic = "force-static"`.',
    ['What happens if you put `page.tsx` and `route.ts` in the exact same directory?', 'How do you stream responses from a Route Handler?']
  ),

  'next-middleware': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-middleware',
    '20. Middleware & Proxy',
    'advanced',
    40,
    'What is Next.js Middleware (`middleware.ts`, or `proxy.ts` convention in newer Next.js) best used for—and what should you NEVER rely on it for alone?',
    'Middleware runs **before** every matched route for fast redirects, A/B rewrites, i18n locale routing, and optimistic cookie-presence checks (`matcher` filters out static assets). **Never rely on Middleware as your only auth check**—always verify the session/token again inside Server Components, Server Actions, and Route Handlers (Defense in Depth)!',
    'Checking `req.cookies.get("session")` in Middleware redirects unauthenticated users to `/login` fast, while `requireUser()` inside Server Components validates the actual JWT/DB session.',
    [
      {
        title: 'Example 1: Middleware with Matcher Excluding Static Assets',
        language: 'TS',
        code: `import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const hasSession = req.cookies.has('session');
  if (!hasSession && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/dashboard/:path*'] };`,
        expectedOutput: 'Redirects unauthenticated dashboard hits without slowing static assets.',
      },
      {
        title: 'Example 2: Always Re-Verify Session in Data Access Layer',
        language: 'TS',
        code: `// CVE-2025-29927 lesson: NEVER trust middleware alone for authorization!
// Always verify auth inside Server Actions, Route Handlers, and DAL functions.`,
        expectedOutput: 'Enforces defense-in-depth security.',
      },
    ],
    'I use Middleware with a tight `matcher` for fast redirects, headers, and locale rewrites—and always re-verify auth/permissions in the Data Access Layer so security never depends on Middleware alone.',
    ['Why should heavy database queries be avoided in Edge Middleware?', 'Why is `matcher` important in `middleware.ts`?']
  ),

  'next-caching-revalidation': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-caching-revalidation',
    '21. Caching & Revalidation',
    'advanced',
    45,
    'Explain the 4 caching layers in Next.js App Router and what changed in Next.js 15.',
    '1) **Request Memoization** (deduplicates identical `GET` `fetch` / `React.cache` calls within a single render). 2) **Data Cache** (persists `fetch` / `unstable_cache` across requests; **changed to opt-in `no-store` by default in Next.js 15!**). 3) **Full Route Cache** (static HTML/RSC output). 4) **Router Cache** (client-side in-memory cache; `staleTime: 0` for pages in Next.js 15).',
    'Tagging fetches with `{ next: { tags: ["courses"] } }` and calling `revalidateTag("courses")` clears both Data Cache and affected Full Route Cache entries together.',
    [
      {
        title: 'Example 1: Tagged Data Caching',
        language: 'TS',
        code: `const res = await fetch('https://api.example.com/courses', {
  cache: 'force-cache',
  next: { tags: ['courses'] },
});`,
        expectedOutput: 'Caches response across requests until revalidateTag("courses").',
      },
      {
        title: 'Example 2: Deduplicating Non-Fetch DB Calls with React cache()',
        language: 'TS',
        code: `import { cache } from 'react';
export const getCurrentUser = cache(async (id: string) => prisma.user.findUnique({ where: { id } }));`,
        expectedOutput: 'Runs Prisma query once per request even if Layout and Page both call it.',
      },
    ],
    'In Next.js 15, caching became opt-in (`force-cache` / `revalidateTag`) rather than surprising developers by caching everything silently. I use `React.cache()` for per-request DB deduplication and `revalidateTag` for surgical invalidation.',
    ['What is the difference between `Request Memoization` and `Data Cache`?', 'How does `revalidatePath("/blog", "layout")` differ from `revalidatePath("/blog")`?']
  ),

  'next-seo-metadata': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-seo-metadata',
    '22. Metadata & SEO',
    'advanced',
    30,
    'How do you generate dynamic SEO tags, OpenGraph images, and sitemaps in Next.js App Router?',
    'Export static `metadata` or async `generateMetadata({ params })` from `page.tsx`/`layout.tsx`—Next.js deduplicates `fetch` calls between `generateMetadata` and `Page` automatically! Add `app/sitemap.ts` and `app/robots.ts` for dynamic search engine crawling.',
    'Dynamic `generateMetadata` sets `<title>`, `<meta description>`, and `openGraph.images` per course page so links shared on WhatsApp/LinkedIn show custom previews.',
    [
      {
        title: 'Example 1: Dynamic generateMetadata in Next.js 15+',
        language: 'TS',
        code: `export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug); // Deduplicated with Page!
  return { title: post.title, description: post.summary };
}`,
        expectedOutput: 'Generates per-page SEO tags without duplicate fetching.',
      },
      {
        title: 'Example 2: Dynamic app/sitemap.ts',
        language: 'TS',
        code: `export default async function sitemap() {
  const topics = await getAllTopics();
  return topics.map((t) => ({ url: \`https://app.dev/topics/\${t.slug}\`, lastModified: new Date() }));
}`,
        expectedOutput: 'Serves valid XML sitemap at /sitemap.xml.',
      },
    ],
    'App Router’s `generateMetadata` + `sitemap.ts` + `robots.ts` handle SEO declaratively on the server, and Next.js automatically deduplicates shared `fetch` / `React.cache()` calls between metadata and page rendering.',
    ['Does calling the same `fetch` in both `generateMetadata` and `Page` hit the API twice?', 'How does `title.template` in `layout.tsx` work?']
  ),

  'next-image-font': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-image-font',
    '23. Image & Font Optimization',
    'advanced',
    30,
    'How do `next/image` and `next/font` improve Core Web Vitals (LCP and CLS)?',
    '`next/image` automatically resizes images per device viewport, serves modern WebP/AVIF formats, lazy-loads below-the-fold images, and reserves aspect-ratio space to prevent **CLS** (Cumulative Layout Shift). `next/font` self-hosts Google Fonts at build time with `size-adjust` fallbacks—zero external font requests and zero layout shift.',
    'Adding `priority` on the hero `next/image` preloads it immediately to boost **LCP** (Largest Contentful Paint).',
    [
      {
        title: 'Example 1: Hero Image with priority & Responsive sizes',
        language: 'TSX',
        code: `<Image src="/hero.png" alt="Course banner" width={1200} height={630} priority sizes="(max-width: 768px) 100vw, 1200px" />`,
        expectedOutput: 'Preloads hero image in WebP/AVIF with zero layout shift.',
      },
      {
        title: 'Example 2: Self-Hosted Google Font via next/font',
        language: 'TSX',
        code: `import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
// <body className={inter.className}>`,
        expectedOutput: 'Self-hosts font files locally at build time with zero CLS.',
      },
    ],
    'Using `next/image` with `priority` on the LCP hero image and `next/font` for self-hosted fonts eliminates external font round-trips and layout shift.',
    ['When should you add `priority` to `next/image` (and why not on every image)?', 'Why does `next/image` require `width`/`height` or `fill`?']
  ),

  'next-auth': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-auth',
    '24. Authentication',
    'expert',
    45,
    'How should authentication and session checks be structured in a Next.js App Router app?',
    'Store signed/encrypted session tokens in `HttpOnly; Secure; SameSite=Lax` cookies. Create a server-only Data Access Layer helper `getSessionUser()` wrapped in `React.cache()` and call it inside Server Components, Server Actions, and Route Handlers—never trusting client-sent `userId`s.',
    'Calling `await getSessionUser()` in a Server Component and passing only safe DTO fields (`{ id, name, role }`) to Client Components keeps tokens completely invisible to browser JavaScript.',
    [
      {
        title: 'Example 1: Cached Server Session Helper',
        language: 'TS',
        code: `import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';

export const getSessionUser = cache(async () => {
  const token = (await cookies()).get('session')?.value;
  return token ? verifySessionToken(token) : null;
});`,
        expectedOutput: 'Reads & verifies session cookie once per server request.',
      },
      {
        title: 'Example 2: Returning Safe DTO to Client',
        language: 'TS',
        code: `// Never return passwordHash or internal flags from Server Components/Actions!
return { id: user.id, name: user.name, role: user.role };`,
        expectedOutput: 'Prevents accidental serialization of sensitive DB columns.',
      },
    ],
    'I keep sessions in `HttpOnly` cookies, verify them in a `server-only` + `React.cache()` helper inside every Server Action and Route Handler, and only serialize minimal user DTOs to Client Components.',
    ['Why shouldn’t you pass a full Prisma `User` row directly into a Client Component?', 'How do OAuth callbacks work in App Router?']
  ),

  'next-authorization': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-authorization',
    '25. Authorization & Security',
    'expert',
    40,
    'What are the top security rules for Next.js App Router (Data Access Layer, Server Actions, Tainting)?',
    '1) Never rely on `middleware.ts` alone—enforce auth + ownership in every Data Access Layer function and Server Action. 2) Never pass sensitive objects (`process.env`, tokens, `passwordHash`) as props to `"use client"` components (since Next.js serializes them into the HTML payload!). 3) Validate every Server Action input with Zod.',
    'Because React serializes props passed to `"use client"` components inside `<script>` flight payloads, passing a full `user` object containing `passwordHash` leaks it in page source!',
    [
      {
        title: 'Example 1: Enforcing Ownership in Data Access Layer',
        language: 'TS',
        code: `export async function getInvoiceForUser(invoiceId: string) {
  const user = await requireSessionUser();
  return prisma.invoice.findFirst({ where: { id: invoiceId, userId: user.id } });
}`,
        expectedOutput: 'Prevents IDOR even if caller guesses another invoiceId.',
      },
      {
        title: 'Example 2: Next.js Security Headers in next.config.ts',
        language: 'TS',
        code: `// Set X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy`,
        expectedOutput: 'Hardens responses against clickjacking and MIME sniffing.',
      },
    ],
    'Security in Next.js centers on a centralized Data Access Layer (`server-only`) that verifies both authentication and resource ownership before returning DTOs—never leaking secrets across the `"use client"` boundary.',
    ['How can props passed to `"use client"` leak secrets even if the UI doesn’t render them?', 'How does Next.js protect Server Actions against CSRF?']
  ),

  'next-env-vars': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-env-vars',
    '26. Environment Variables',
    'expert',
    25,
    'How does `NEXT_PUBLIC_` work in Next.js, and what happens if you forget it or misuse it?',
    'Variables **without** `NEXT_PUBLIC_` exist ONLY on the server (`Server Components`, `Route Handlers`, `Server Actions`). Variables **with** `NEXT_PUBLIC_` are inlined directly into the client JS bundle at **build time**—never put API secrets in `NEXT_PUBLIC_*`, and remember changing them requires a rebuild unless read dynamically on the server.',
    'Putting `NEXT_PUBLIC_OPENAI_KEY` in `.env` ships your secret key to every visitor’s browser DevTools!',
    [
      {
        title: 'Example 1: Server-Only Secret vs Public URL',
        language: 'TS',
        code: `// Server Component / Route Handler:
const secret = process.env.STRIPE_SECRET_KEY; // Safe, never bundled to client
// Client Component:
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Inlined at build time`,
        expectedOutput: 'Keeps secrets server-side and public config client-accessible.',
      },
      {
        title: 'Example 2: Validating Env Vars at Startup with Zod',
        language: 'TS',
        code: `const serverEnv = z.object({ DATABASE_URL: z.string().url() }).parse(process.env);`,
        expectedOutput: 'Fails fast if required server environment variable is missing.',
      },
    ],
    'Non-prefixed env vars stay strictly on the server; `NEXT_PUBLIC_` vars are baked into the JS bundle at build time—so secrets never get `NEXT_PUBLIC_`, and runtime Docker env changes should be read on the server.',
    ['Why does changing a `NEXT_PUBLIC_` env var in Docker at runtime not update Client Components?', 'How does `.env.local` priority work in Next.js?']
  ),

  'next-streaming': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-streaming',
    '27. Streaming & Suspense',
    'expert',
    40,
    'How does HTTP Streaming with `<Suspense>` improve TTFB on data-heavy Next.js pages?',
    'Without Streaming, a page with one 2-second analytics query blocks the entire HTML response for 2 seconds. With `<Suspense>`, Next.js sends the static shell and fast sections immediately (TTFB ~50ms), and streams the slow `<Suspense>` chunk over the same HTTP connection as soon as its promise resolves.',
    'Showing the product title, price, and Add-to-Cart button instantly while streaming "Recommended Products" 800ms later keeps bounce rates low.',
    [
      {
        title: 'Example 1: Streaming Slow Widget Independently',
        language: 'TSX',
        code: `export default function ProductPage() {
  return (
    <>
      <ProductHero />
      <Suspense fallback={<ReviewsSkeleton />}>
        <SlowReviews />
      </Suspense>
    </>
  );
}`,
        expectedOutput: 'Flushes ProductHero immediately while SlowReviews streams in.',
      },
      {
        title: 'Example 2: Starting Fetch Early, Awaiting Inside Child',
        language: 'TSX',
        code: `const reviewsPromise = getReviews(id); // Start in parallel!
return <Suspense fallback={<p>Loading...</p>}><ReviewsList promise={reviewsPromise} /></Suspense>;`,
        expectedOutput: 'Avoids waiting for parent render before starting slow fetch.',
      },
    ],
    'Streaming with `<Suspense>` decouples fast UI from slow backend queries so users see meaningful content immediately instead of staring at a blank screen.',
    ['Why do you need async sub-components inside `<Suspense>` instead of `await`ing at the top of `page.tsx`?', 'Does streaming work with `loading.tsx` automatically?']
  ),

  'next-architecture': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-architecture',
    '29. Next.js Architecture',
    'coding',
    45,
    'How would you structure a large production Next.js SaaS application?',
    'Keep `app/` thin (routing, layouts, loading/error boundaries), organize domain features in `src/features/*` (UI components, hooks, schemas), centralize DB/auth access in a `server-only` Data Access Layer (`src/server/dal/*`), validate all inputs with Zod, and use `revalidateTag` for surgical cache updates.',
    'Keeping `app/(dashboard)/orders/page.tsx` as a 20-line Server Component that calls `ordersDal.listForUser()` keeps routing decoupled from business logic.',
    [
      {
        title: 'Example 1: Clean Feature + DAL Structure',
        language: 'Text',
        code: `src/
  app/          # Thin routes, layouts, loading/error boundaries
  features/     # Domain UI + client hooks
  server/dal/   # 'server-only' auth-checked DB queries & DTOs
  lib/          # Shared Zod schemas & pure utils`,
        expectedOutput: 'Separates routing, client interactivity, and secure server data access.',
      },
      {
        title: 'Example 2: Thin Route Calling DAL',
        language: 'TSX',
        code: `export default async function OrdersPage() {
  const orders = await ordersDal.listForCurrentUser();
  return <OrdersTable orders={orders} />;
}`,
        expectedOutput: 'Route file stays clean and authorization lives in the DAL.',
      },
    ],
    'I keep `app/` strictly for routing and boundaries, isolate all DB + auth checks in a `server-only` Data Access Layer returning safe DTOs, and co-locate interactive components inside `features/`.',
    ['What are Parallel Routes (`@modal`) and Intercepting Routes (`(.)photo`) used for?', 'When should you use a dedicated backend (Express/Laravel) alongside Next.js vs doing everything in Next.js?']
  ),

  'next-senior-questions': makeRnLesson(
    'nextjs',
    'Next.js',
    'next-senior-questions',
    '30. Senior Interview Scenarios',
    'coding',
    50,
    'A Next.js App Router e-commerce page shows stale prices after an admin update and ships a 600 KB client bundle. How do you fix both?',
    '1) **Stale prices**: Tag product fetches with `next: { tags: ["product-" + id] }` and trigger `revalidateTag("product-" + id)` from the admin Server Action or CMS webhook (or use `no-store` for live inventory/cart). 2) **600 KB bundle**: Run `@next/bundle-analyzer`, push `"use client"` down to small leaf buttons, move heavy markdown/date/icon libs to Server Components, and lazy-load admin/chart modals with `next/dynamic`.',
    'Often one accidental `"use client"` on a shared wrapper or importing a huge library in a Client Component pulls 300 KB into every page.',
    [
      {
        title: 'Example 1: Surgical Cache Invalidation on Price Update',
        language: 'TS',
        code: `'use server';
export async function updateProductPrice(id: string, price: number) {
  await requireAdmin();
  await db.product.update({ where: { id }, data: { price } });
  revalidateTag(\`product-\${id}\`);
}`,
        expectedOutput: 'Refreshes only the updated product page immediately.',
      },
      {
        title: 'Example 2: Auditing Bundle with Next Bundle Analyzer',
        language: 'Bash',
        code: `ANALYZE=true npm run build`,
        expectedOutput: 'Opens treemap showing which client modules bloat the bundle.',
      },
    ],
    'For stale data I audit Data Cache tags and call `revalidateTag` on mutations; for bundle bloat I run `@next/bundle-analyzer`, push `"use client"` down to leaf widgets, and dynamic-import heavy client-only libraries.',
    ['How do you debug why a Next.js page is unexpectedly rendering dynamically instead of statically?', 'How do you handle multi-region caching and rate limiting in Next.js?']
  ),
};
