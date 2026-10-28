import crypto from 'node:crypto';

const SESSIONS = new Map<string, { email: string; expiresAt: number; username?: string; avatar?: string }>();

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

export function createSession(email: string, username?: string, avatar?: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 7 days session
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  SESSIONS.set(token, { email, expiresAt, username, avatar });
  return token;
}

export function getSession(token?: string): { email: string; username?: string; avatar?: string } | null {
  if (!token) return null;
  const session = SESSIONS.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    return null;
  }
  return session;
}

export function verifySession(token?: string): boolean {
  return getSession(token) !== null;
}

export function destroySession(token?: string): void {
  if (token) {
    SESSIONS.delete(token);
  }
}
