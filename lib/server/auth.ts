import 'server-only';

import type { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/types';
import {
  authCreatePasswordReset,
  authCreateSession,
  authDestroySession,
  authGetUserBySession,
  authResetPassword,
  authVerifyUser,
} from './store';

export const SESSION_COOKIE = 'session_id';

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
};

export function getSessionIdFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE)?.value;
}

export function getUserFromRequest(request: NextRequest): User | null {
  const sessionId = getSessionIdFromRequest(request);
  return authGetUserBySession(sessionId);
}

export function requireUserFromRequest(request: NextRequest): User {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export function attachSessionCookie(response: NextResponse, userId: string): void {
  const session = authCreateSession(userId);
  response.cookies.set(SESSION_COOKIE, session.id, SESSION_COOKIE_OPTIONS);
}

export function clearSessionCookie(response: NextResponse, request?: NextRequest): void {
  const sessionId = request ? getSessionIdFromRequest(request) : undefined;
  if (sessionId) authDestroySession(sessionId);
  response.cookies.delete(SESSION_COOKIE);
}

export function verifyLogin(email: string, password: string): User {
  return authVerifyUser({ email, password });
}

export function forgotPassword(email: string): { token: string } {
  return authCreatePasswordReset(email);
}

export function resetPassword(token: string, newPassword: string): void {
  authResetPassword(token, newPassword);
}
