'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { apiClient } from '@/lib/api-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiClient.post<{ token: string }>('/api/auth/forgot-password', { email });
    setLoading(false);

    if (res.success && res.data) {
      setSuccess(true);
      setToken(res.data.token);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>忘记密码</CardTitle>
          <CardDescription>输入邮箱以重置密码</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="邮箱"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                发送重置链接
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-green-600">✅ 如果邮箱存在，我们已发送重置链接。</div>
              <div className="text-xs text-gray-500">（演示版直接显示 Token）</div>
              <div className="bg-gray-100 p-2 rounded border">
                <div className="text-xs font-mono break-all">{token}</div>
              </div>
              <Link href={`/auth/reset-password?token=${token}`} className="block">
                <Button className="w-full">前往重置密码</Button>
              </Link>
            </div>
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
