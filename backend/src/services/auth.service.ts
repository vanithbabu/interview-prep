import crypto from 'node:crypto';

import { env } from '../config/env.js';
import { prisma } from '../config/prisma.js';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

export interface ActivityEntry {
  id: string;
  userId: string;
  actionType: string;
  targetId?: string;
  title: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const usersByEmail = new Map<string, StoredUser>();
const usersById = new Map<string, StoredUser>();
const activitiesByUser = new Map<string, ActivityEntry[]>();

const DEFAULT_EMAIL = 'developer@interviewprep.app';
const DEFAULT_PASSWORD = process.env.DEFAULT_USER_PASSWORD ?? 'Interview@2026';

function ensureDefaultInMemoryUser() {
  if (!usersByEmail.has(DEFAULT_EMAIL)) {
    const defaultUser: StoredUser = {
      id: 'usr-developer-1',
      email: DEFAULT_EMAIL,
      name: 'Developer',
      passwordHash: hashPassword(DEFAULT_PASSWORD),
      createdAt: new Date().toISOString(),
    };
    usersByEmail.set(DEFAULT_EMAIL, defaultUser);
    usersById.set(defaultUser.id, defaultUser);
  }
}

ensureDefaultInMemoryUser();

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(keyHex, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

export function signToken(user: AuthUser): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    })
  );
  const signature = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): { sub: string; email: string } | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, sig] = parts;
  const expected = crypto
    .createHmac('sha256', env.JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: string;
      email?: string;
      exp?: number;
    };
    if (!decoded.sub || !decoded.email || (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000))) {
      return null;
    }
    return { sub: decoded.sub, email: decoded.email };
  } catch {
    return null;
  }
}

export async function recordUserActivity(params: {
  userId: string;
  actionType: string;
  targetId?: string;
  title: string;
  metadata?: Record<string, unknown>;
}): Promise<ActivityEntry> {
  const fallbackEntry: ActivityEntry = {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId: params.userId,
    actionType: params.actionType,
    targetId: params.targetId,
    title: params.title,
    metadata: params.metadata,
    createdAt: new Date().toISOString(),
  };

  try {
    const row = await prisma.activityLog.create({
      data: {
        userId: params.userId,
        actionType: params.actionType,
        targetId: params.targetId ?? null,
        title: params.title,
        metadataJson: (params.metadata as object) ?? undefined,
      },
    });
    return {
      id: row.id,
      userId: row.userId,
      actionType: row.actionType,
      targetId: row.targetId ?? undefined,
      title: row.title,
      createdAt: row.createdAt.toISOString(),
    };
  } catch {
    const existing = activitiesByUser.get(params.userId) ?? [];
    activitiesByUser.set(params.userId, [fallbackEntry, ...existing].slice(0, 100));
    return fallbackEntry;
  }
}

export async function getUserActivities(userId: string): Promise<ActivityEntry[]> {
  try {
    const rows = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    if (rows.length > 0) {
      return rows.map((r) => ({
        id: r.id,
        userId: r.userId,
        actionType: r.actionType,
        targetId: r.targetId ?? undefined,
        title: r.title,
        createdAt: r.createdAt.toISOString(),
      }));
    }
  } catch {
    // Fallback to memory if Postgres is offline
  }
  return activitiesByUser.get(userId) ?? [];
}

export async function registerUser(params: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ token: string; user: AuthUser }> {
  const normalizedEmail = params.email.trim().toLowerCase();
  const displayName = params.name?.trim() || normalizedEmail.split('@')[0];
  const passwordHash = hashPassword(params.password);

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) throw new Error('EMAIL_EXISTS');

    const created = await prisma.user.create({
      data: { email: normalizedEmail, name: displayName, passwordHash },
    });
    const publicUser: AuthUser = {
      id: created.id,
      email: created.email,
      name: created.name ?? displayName,
      createdAt: created.createdAt.toISOString(),
    };
    await recordUserActivity({
      userId: publicUser.id,
      actionType: 'REGISTER',
      title: 'Created Interview Prep account',
    });
    return { token: signToken(publicUser), user: publicUser };
  } catch (err) {
    if (err instanceof Error && err.message === 'EMAIL_EXISTS') throw err;
    if (usersByEmail.has(normalizedEmail)) throw new Error('EMAIL_EXISTS');

    const user: StoredUser = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      name: displayName,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    usersByEmail.set(normalizedEmail, user);
    usersById.set(user.id, user);
    const publicUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
    await recordUserActivity({
      userId: user.id,
      actionType: 'REGISTER',
      title: 'Created Interview Prep account',
    });
    return { token: signToken(publicUser), user: publicUser };
  }
}

export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  const normalizedEmail = params.email.trim().toLowerCase();

  try {
    const found = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (found) {
      if (!verifyPassword(params.password, found.passwordHash)) {
        throw new Error('INVALID_CREDENTIALS');
      }
      const publicUser: AuthUser = {
        id: found.id,
        email: found.email,
        name: found.name ?? normalizedEmail.split('@')[0],
        createdAt: found.createdAt.toISOString(),
      };
      await recordUserActivity({
        userId: publicUser.id,
        actionType: 'LOGIN',
        title: 'Signed in to Interview Prep',
      });
      return { token: signToken(publicUser), user: publicUser };
    }
  } catch (err) {
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') throw err;
  }

  const stored = usersByEmail.get(normalizedEmail);
  if (!stored || !verifyPassword(params.password, stored.passwordHash)) {
    throw new Error('INVALID_CREDENTIALS');
  }
  const publicUser: AuthUser = {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    createdAt: stored.createdAt,
  };
  await recordUserActivity({
    userId: stored.id,
    actionType: 'LOGIN',
    title: 'Signed in to Interview Prep',
  });
  return { token: signToken(publicUser), user: publicUser };
}

export async function getUserById(userId: string): Promise<AuthUser | undefined> {
  try {
    const found = await prisma.user.findUnique({ where: { id: userId } });
    if (found) {
      return {
        id: found.id,
        email: found.email,
        name: found.name ?? found.email.split('@')[0],
        createdAt: found.createdAt.toISOString(),
      };
    }
  } catch {
    // Fallback to memory
  }
  const stored = usersById.get(userId);
  if (!stored) return undefined;
  return {
    id: stored.id,
    email: stored.email,
    name: stored.name,
    createdAt: stored.createdAt,
  };
}
