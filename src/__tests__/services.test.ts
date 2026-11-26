import assert from 'node:assert/strict';
import test from 'node:test';

import { JS_FUNCTIONS_TOPIC } from '../content/javascript/functions/index';
import { runSandboxedJavaScript } from '../services/codeRunnerService';
import {
  calculateUpdatedStreak,
  getPreviousDateKey,
  getTodayDateKey,
} from '../services/streakService';

test('streakService: increments on consecutive day and resets after gap', () => {
  const today = '2026-11-26';
  const yesterday = getPreviousDateKey(today);
  assert.equal(yesterday, '2026-11-25');

  const sameDay = calculateUpdatedStreak({
    lastActiveDate: today,
    currentStreak: 3,
    longestStreak: 5,
    todayKey: today,
  });
  assert.equal(sameDay.currentStreak, 3);
  assert.equal(sameDay.longestStreak, 5);

  const consecutive = calculateUpdatedStreak({
    lastActiveDate: yesterday,
    currentStreak: 3,
    longestStreak: 3,
    todayKey: today,
  });
  assert.equal(consecutive.currentStreak, 4);
  assert.equal(consecutive.longestStreak, 4);

  const broken = calculateUpdatedStreak({
    lastActiveDate: '2026-11-20',
    currentStreak: 6,
    longestStreak: 6,
    todayKey: today,
  });
  assert.equal(broken.currentStreak, 1);
  assert.equal(broken.longestStreak, 6);
});

test('streakService: formats date key as YYYY-MM-DD', () => {
  const key = getTodayDateKey(new Date(2026, 10, 26));
  assert.equal(key, '2026-11-26');
});

test('codeRunnerService: captures console.log and shadows globals', () => {
  const okRes = runSandboxedJavaScript('console.log(2 + 3);');
  assert.equal(okRes.ok, true);
  assert.equal(okRes.output, '5');

  const blockedRes = runSandboxedJavaScript('console.log(typeof fetch, typeof process);');
  assert.equal(blockedRes.ok, true);
  assert.equal(blockedRes.output, 'undefined undefined');

  const tooLong = runSandboxedJavaScript('a'.repeat(5000));
  assert.equal(tooLong.ok, false);
});

test('JS_FUNCTIONS_TOPIC: contains 50 unique numbered examples', () => {
  assert.equal(JS_FUNCTIONS_TOPIC.examples.length, 50);
  const numbers = new Set(JS_FUNCTIONS_TOPIC.examples.map((e) => e.number));
  assert.equal(numbers.size, 50);
  for (let i = 1; i <= 50; i++) {
    assert.equal(numbers.has(i), true);
  }
});
