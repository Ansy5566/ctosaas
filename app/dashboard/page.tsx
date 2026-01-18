'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { systemApi, userApi } from '@/lib/api';
import { TASK_STATUS_CONFIG } from '@/lib/constants';
import type { Statistics } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [announcements, setAnnouncements] = useState<Array<{ id: string; title: string; content: string; type: string }>>([]);

  useEffect(() => {
    userApi.getStatistics().then((res) => {
      if (res.success) setStats(res.data ?? null);
    });
    systemApi.getAnnouncements().then((res) => {
      if (res.success) setAnnouncements(res.data ?? []);
    });
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">工作台</h1>
          <p className="text-gray-600">欢迎回来，查看您的商品采集数据</p>
        </div>

        {announcements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📢 系统公告</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {announcements.map((a) => (
                <div key={a.id} className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-900">{a.title}</div>
                  <div className="text-sm text-blue-700">{a.content}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">总商品数</CardTitle>
              <CardDescription>已采集的商品总数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats?.totalProducts ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">总任务数</CardTitle>
              <CardDescription>创建的采集任务总数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.totalTasks ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">成功任务</CardTitle>
              <CardDescription>已完成的采集任务数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats?.completedTasks ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/tasks" className="block">
                <Button variant="outline" className="w-full justify-start">
                  🚀 创建采集任务
                </Button>
              </Link>
              <Link href="/products" className="block">
                <Button variant="outline" className="w-full justify-start">
                  📦 查看商品列表
                </Button>
              </Link>
              <Link href="/export" className="block">
                <Button variant="outline" className="w-full justify-start">
                  📤 导出商品数据
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近任务</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentTasks && stats.recentTasks.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="text-sm">
                        <div className="font-medium">{task.platform}</div>
                        <div className="text-xs text-gray-500">{task.type}</div>
                      </div>
                      <div className="text-xs text-gray-600">{TASK_STATUS_CONFIG[task.status].icon}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">暂无任务</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
