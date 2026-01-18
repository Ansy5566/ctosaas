'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PLATFORM_CONFIG, TASK_STATUS_CONFIG } from '@/lib/constants';
import { tasksApi } from '@/lib/api';
import type { CollectionTask, CollectionType, Platform } from '@/types';

const platformOptions = Object.entries(PLATFORM_CONFIG).map(([value, p]) => ({
  value,
  label: p.name,
}));

const typeOptions = [
  { value: 'single', label: '单品采集' },
  { value: 'category', label: '分类采集' },
];

export default function TasksPage() {
  const [platform, setPlatform] = useState<Platform>('shopify');
  const [type, setType] = useState<CollectionType>('single');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [refreshing, setRefreshing] = useState(true);

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) setRefreshing(true);
    const res = await tasksApi.list();
    if (res.success) setTasks(res.data ?? []);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const supportedTypes = useMemo(() => PLATFORM_CONFIG[platform].supportedTypes, [platform]);

  useEffect(() => {
    if (!supportedTypes.includes(type)) {
      setType(supportedTypes[0] as CollectionType);
    }
  }, [supportedTypes, type]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await tasksApi.create({ platform, type, url });
    setLoading(false);

    if (res.success) {
      setUrl('');
      await load(false);
    } else {
      setError(res.error || '创建任务失败');
    }
  };

  const onCancel = async (taskId: string) => {
    await tasksApi.cancel(taskId);
    await load(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">采集任务</h1>
          <p className="text-gray-600">提交采集任务并查看历史记录</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>创建采集任务</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Select
                label="平台"
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                options={platformOptions}
              />
              <Select
                label="采集类型"
                value={type}
                onChange={(e) => setType(e.target.value as CollectionType)}
                options={typeOptions.filter((t) => supportedTypes.includes(t.value as CollectionType))}
              />
              <Input
                label="链接"
                placeholder="请输入商品链接或分类链接"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />

              <div className="md:col-span-3 flex items-center gap-3">
                <Button type="submit" loading={loading}>
                  提交任务
                </Button>
                <Button type="button" variant="outline" loading={refreshing} onClick={() => load(true)}>
                  刷新
                </Button>
                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>任务列表</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-sm text-gray-500">暂无任务，先创建一个吧。</div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-3 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <span>{PLATFORM_CONFIG[task.platform].icon}</span>
                        <span>{PLATFORM_CONFIG[task.platform].name}</span>
                        <span className="text-xs text-gray-500">{task.type === 'single' ? '单品' : '分类'}</span>
                      </div>
                      <div className="text-sm text-gray-600 truncate">{task.url}</div>
                      <div className="text-xs text-gray-500">进度：{task.progress}% · 商品：{task.collectedProducts}/{task.totalProducts}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        {TASK_STATUS_CONFIG[task.status].icon} {TASK_STATUS_CONFIG[task.status].label}
                      </span>
                      <Link href="/products" className="text-sm text-blue-600 hover:underline">
                        查看商品
                      </Link>
                      {task.status !== 'completed' && task.status !== 'cancelled' && (
                        <Button size="sm" variant="danger" onClick={() => onCancel(task.id)}>
                          取消
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
