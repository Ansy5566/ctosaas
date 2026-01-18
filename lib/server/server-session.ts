import 'server-only';

import { cookies } from 'next/headers';
import type { User } from '@/types';
import { authGetUserBySession } from '@/lib/server/store';

const SESSION_COOKIE = 'session_id';

export function getUserFromCookies(): User | null {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  return authGetUserBySession(sessionId);
}
