import type { DailyQuickWin } from '@/types/content';

export const DEVELOPER_TIPS: string[] = [
  'Explain the "why" and trade-offs before jumping into syntax — interviewers look for engineering judgment.',
  'If you forget an exact method name, talk through the data flow clearly. Problem-solving beats memorization.',
  'Keep your spoken interview answers under 90 seconds, then invite follow-up questions.',
  '15 focused minutes every day beats 4 hours crammed on Sunday. Protect your streak today!',
  'Always mention edge cases (null, empty arrays, race conditions) when explaining a solution.',
];

export const DAILY_QUICK_WINS: DailyQuickWin[] = [
  {
    id: 'qw-js-closure',
    categoryId: 'javascript',
    question: 'What does this log, and why?',
    codeSnippet: `function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nconsole.log(next(), next());`,
    answer: 'Logs `1 2`. The arrow function forms a closure over `count`, so it remembers and updates `count` across calls even after `makeCounter` has returned.',
  },
  {
    id: 'qw-react-key',
    categoryId: 'react',
    question: 'Why should you avoid using array index as a React `key` in dynamic lists?',
    answer: 'If items are reordered, inserted, or deleted, index keys cause React to match the wrong component state to the wrong item and trigger unnecessary DOM updates.',
  },
  {
    id: 'qw-next-rsc',
    categoryId: 'nextjs',
    question: 'When should you add `"use client"` in Next.js App Router?',
    answer: 'Only at the boundary where you need browser interactivity—such as React hooks (`useState`, `useEffect`), event listeners, or browser-only APIs like `localStorage`.',
  },
];

export function getDailyTip(dateKey: string): string {
  const sum = dateKey.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return DEVELOPER_TIPS[sum % DEVELOPER_TIPS.length];
}

export function getDailyQuickWin(dateKey: string): DailyQuickWin {
  const sum = dateKey.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return DAILY_QUICK_WINS[sum % DAILY_QUICK_WINS.length];
}
