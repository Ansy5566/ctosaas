'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/api-client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await apiClient.post('/api/auth/reset-password', { token, newPassword });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000);
    } else {
      setError(res.error || '重置失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>重置密码</CardTitle>
          <CardDescription>请输入新密码</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-sm text-green-600">✅ 密码已重置，正在跳转...</div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="新密码"
                type="password"
                placeholder="至少6位"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              {error && <div className="text-sm text-red-600">{error}</div>}

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                重置密码
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Link href="/auth/login" className="text-sm text-gray-600 hover:underline">
            返回登录
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
