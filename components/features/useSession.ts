'use client';

import { useEffect, useState } from 'react';
import type { User } from '@/types';
import { authApi } from '@/lib/api';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchSession = async () => {
      setLoading(true);
      const res = await authApi.getSession();
      if (!cancelled) {
        if (res.success) {
          setUser(res.data ?? null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    };

    fetchSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    const res = await authApi.getSession();
    if (res.success) {
      setUser(res.data ?? null);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  return { user, loading, refresh };
}
