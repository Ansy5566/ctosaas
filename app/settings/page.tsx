'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useSession } from '@/components/features/useSession';
import { userApi } from '@/lib/api';
import type { Subscription } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useSession();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [sub, setSub] = useState<Subscription | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      const updateState = () => {
        setName(user.name);
        setAvatar(user.avatar || '');
      };
      updateState();
    }
  }, [user]);

  useEffect(() => {
    userApi.getSubscription().then((res) => {
      if (res.success) setSub(res.data ?? null);
    });
  }, []);

  const onSave = async () => {
    setSaving(true);
    setError('');

    const res = await userApi.updateProfile({ name, avatar });
    setSaving(false);

    if (!res.success) {
      setError(res.error || '保存失败');
    }
  };

  const onDelete = async () => {
    if (!window.confirm('确定要注销账户吗？此操作不可逆。')) return;
    setDeleting(true);
    await userApi.deleteAccount();
    setDeleting(false);
    router.push('/auth/login');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600">管理您的账户信息和偏好设置</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
            <CardDescription>更新您的个人资料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="邮箱" value={user?.email || ''} disabled />
            <Input label="昵称" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="头像URL" value={avatar} onChange={(e) => setAvatar(e.target.value)} />

            {error && <div className="text-sm text-red-600">{error}</div>}

            <Button loading={saving} onClick={onSave}>
              保存设置
            </Button>
          </CardContent>
        </Card>

        {sub && (
          <Card>
            <CardHeader>
              <CardTitle>套餐信息</CardTitle>
              <CardDescription>当前套餐与额度</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">套餐类型</span>
                <span className="font-medium">
                  {sub.plan === 'free' ? '免费版' : sub.plan === 'basic' ? '基础版' : sub.plan === 'pro' ? '专业版' : '企业版'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">已使用额度</span>
                <span className="font-medium">
                  {sub.quota.used} / {sub.quota.total === -1 ? '无限' : sub.quota.total}
                </span>
              </div>
              <div className="pt-3">
                <div className="text-sm text-gray-600 mb-2">套餐功能：</div>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {sub.features.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>危险区</CardTitle>
            <CardDescription>删除账户将清空所有数据且不可恢复</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" loading={deleting} onClick={onDelete}>
              注销账户
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
