'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useSession } from '@/components/features/useSession';

const navItems = [
  { href: '/dashboard', label: '工作台' },
  { href: '/tasks', label: '采集任务' },
  { href: '/products', label: '商品管理' },
  { href: '/export', label: '数据导出' },
  { href: '/settings', label: '系统设置' },
] as const;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useSession();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const title = useMemo(() => {
    const match = navItems.find((n) => pathname === n.href);
    return match?.label ?? '控制台';
  }, [pathname]);

  const onLogout = async () => {
    setLogoutLoading(true);
    await authApi.logout();
    setLogoutLoading(false);
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-blue-600">
              商品采集SaaS
            </Link>
            <span className="text-sm text-gray-500">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <div className="text-sm text-gray-600">{user.name}</div>
            ) : (
              <div className="text-sm text-gray-400">未登录</div>
            )}
            <Button variant="outline" size="sm" loading={logoutLoading} onClick={onLogout}>
              退出
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white border rounded-lg p-3 h-fit">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm hover:bg-gray-50',
                  pathname === item.href ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
