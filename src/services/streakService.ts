export function getTodayDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getPreviousDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - 1);
  return getTodayDateKey(date);
}

export function calculateUpdatedStreak(params: {
  lastActiveDate: string | null;
  currentStreak: number;
  longestStreak: number;
  todayKey: string;
}): {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
} {
  const { lastActiveDate, currentStreak, longestStreak, todayKey } = params;

  if (lastActiveDate === todayKey) {
    return {
      currentStreak: Math.max(1, currentStreak),
      longestStreak: Math.max(1, longestStreak, currentStreak),
      lastActiveDate: todayKey,
    };
  }

  const yesterdayKey = getPreviousDateKey(todayKey);
  const nextStreak = lastActiveDate === yesterdayKey ? currentStreak + 1 : 1;

  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(longestStreak, nextStreak),
    lastActiveDate: todayKey,
  };
}
