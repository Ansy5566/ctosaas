'use client';

import { useCallback, useEffect, useState } from 'react';
import type { User } from '@/types';
import { authApi } from '@/lib/api';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await authApi.getSession();
    if (res.success) {
      setUser(res.data ?? null);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh };
}
