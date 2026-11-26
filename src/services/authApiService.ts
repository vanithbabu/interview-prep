import { z } from 'zod';

import { getApiBaseUrl } from '@/services/apiBaseUrl';

const API_BASE_URL = getApiBaseUrl();

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string(),
});

const authResponseSchema = z.object({
  token: z.string(),
  user: userSchema,
});

const activitySchema = z.object({
  id: z.string(),
  userId: z.string(),
  actionType: z.string(),
  targetId: z.string().optional(),
  title: z.string(),
  createdAt: z.string(),
});

export type AuthUser = z.infer<typeof userSchema>;
export type RemoteActivity = z.infer<typeof activitySchema>;

export async function loginRequest(params: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const raw: unknown = await res.json();
  if (!res.ok) {
    const msg = (raw as { error?: string })?.error ?? 'Login failed';
    throw new Error(msg);
  }
  return authResponseSchema.parse(raw);
}

export async function registerRequest(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const raw: unknown = await res.json();
  if (!res.ok) {
    const msg = (raw as { error?: string })?.error ?? 'Registration failed';
    throw new Error(msg);
  }
  return authResponseSchema.parse(raw);
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Session expired');
    const raw: unknown = await res.json();
    return z.object({ user: userSchema }).parse(raw).user;
  } finally {
    clearTimeout(timer);
  }
}

export async function postActivity(
  token: string,
  payload: { actionType: string; targetId?: string; title: string; metadata?: Record<string, unknown> }
): Promise<RemoteActivity> {
  const res = await fetch(`${API_BASE_URL}/api/v1/activity`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to log activity');
  const raw: unknown = await res.json();
  return z.object({ activity: activitySchema }).parse(raw).activity;
}

export async function fetchActivities(token: string): Promise<RemoteActivity[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/activity`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error('Failed to fetch activities');
    const raw: unknown = await res.json();
    return z.object({ activities: z.array(activitySchema) }).parse(raw).activities;
  } finally {
    clearTimeout(timer);
  }
}
