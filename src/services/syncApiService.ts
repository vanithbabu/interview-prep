import { z } from 'zod';

import { getApiBaseUrl } from '@/services/apiBaseUrl';

const API_BASE_URL = getApiBaseUrl();

const cloudStateSchema = z.object({
  completedTopicIds: z.array(z.string()),
  completedExampleIds: z.array(z.string()),
  answeredQuestionResults: z.record(z.string(), z.enum(['correct', 'review'])),
  bookmarkedQuestionIds: z.array(z.string()),
  bookmarkedExampleIds: z.array(z.string()),
  notesById: z.record(z.string(), z.string()),
  dailyGoalTarget: z.number().int(),
  currentStreak: z.number().int(),
  longestStreak: z.number().int(),
  lastActiveDate: z.string().nullable(),
});

export type CloudSyncState = z.infer<typeof cloudStateSchema>;

export async function fetchCloudState(token: string): Promise<CloudSyncState> {
  const res = await fetch(`${API_BASE_URL}/api/v1/sync`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Sync fetch failed');
  const raw: unknown = await res.json();
  return z.object({ state: cloudStateSchema }).parse(raw).state;
}

export async function pushCloudState(
  token: string,
  state: CloudSyncState
): Promise<CloudSyncState> {
  const res = await fetch(`${API_BASE_URL}/api/v1/sync`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error('Sync save failed');
  const raw: unknown = await res.json();
  return z.object({ state: cloudStateSchema }).parse(raw).state;
}
