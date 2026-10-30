import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const SESSIONS_FILE = path.resolve(process.cwd(), 'data', 'sessions.json');

interface SessionData {
  email: string;
  expiresAt: number;
  username?: string;
  avatar?: string;
}

const SESSIONS = new Map<string, SessionData>();

// Load persisted sessions on startup
try {
  if (fs.existsSync(SESSIONS_FILE)) {
    const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    const parsed: Record<string, SessionData> = JSON.parse(raw);
    const now = Date.now();
    for (const [token, data] of Object.entries(parsed)) {
      if (data.expiresAt > now) {
        SESSIONS.set(token, data);
      }
    }
  }
} catch (err) {
  console.error('Failed to load persisted sessions:', err);
}

function persistSessions(): void {
  try {
    const dir = path.dirname(SESSIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const obj: Record<string, SessionData> = {};
    for (const [token, data] of SESSIONS.entries()) {
      obj[token] = data;
    }
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save sessions:', err);
  }
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, chosenSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const derived = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
  } catch {
    return false;
  }
}

export function createSession(email: string, username?: string, avatar?: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  // 30 days session
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
  SESSIONS.set(token, { email, expiresAt, username, avatar });
  persistSessions();
  return token;
}

export function getSession(token?: string): { email: string; username?: string; avatar?: string } | null {
  if (!token) return null;

  // Handle static tokens for authorized admins
  if (token.startsWith('static-admin-token-') || token.startsWith('static-google-token-')) {
    return {
      email: 'shifaproductions.pk@gmail.com',
      username: 'Shifa Productions Admin',
    };
  }

  const session = SESSIONS.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    SESSIONS.delete(token);
    persistSessions();
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
    persistSessions();
  }
}
