'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PLATFORM_CONFIG } from '@/lib/constants';
import { productsApi } from '@/lib/api';
import type { PaginatedResponse, Platform, Product } from '@/types';

const platformOptions = [{ value: '', label: '全部平台' }, ...Object.entries(PLATFORM_CONFIG).map(([value, p]) => ({ value, label: p.name }))];
const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'active', label: '上架' },
  { value: 'draft', label: '草稿' },
  { value: 'archived', label: '归档' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected]);

  const load = useCallback(
    async (showLoading: boolean) => {
      if (showLoading) setLoading(true);
      const res = await productsApi.list({
        page,
        limit: 20,
        search: search || undefined,
        platform: (platform || undefined) as Platform | undefined,
        status: (status || undefined) as Product['status'] | undefined,
      });
      setLoading(false);

      if (res.success) {
        setData(res.data ?? null);
      }
    },
    [page, search, platform, status]
  );

  useEffect(() => {
    load(false);
  }, [load]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setPage(1);
  };

  const toggleAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    data?.items.forEach((p) => {
      next[p.id] = checked;
    });
    setSelected(next);
  };

  const onBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    await productsApi.batchDelete(selectedIds);
    setSelected({});
    await load(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="text-gray-600">支持按 Handle 搜索、筛选、编辑与删除</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>筛选与搜索</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Input label="搜索" placeholder="输入Handle或标题" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Select label="平台" value={platform} onChange={(e) => setPlatform(e.target.value)} options={platformOptions} />
              <Select label="状态" value={status} onChange={(e) => setStatus(e.target.value)} options={statusOptions} />
              <Button type="submit" loading={loading}>
                查询
              </Button>
            </form>

            <div className="mt-4 flex items-center gap-2">
              <Button variant="danger" size="sm" onClick={onBatchDelete} disabled={selectedIds.length === 0}>
                批量删除 ({selectedIds.length})
              </Button>
              <Button variant="outline" size="sm" onClick={() => load(true)} loading={loading}>
                刷新
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>商品列表</CardTitle>
          </CardHeader>
          <CardContent>
            {!data || data.items.length === 0 ? (
              <div className="text-sm text-gray-500">暂无商品。请先在“采集任务”中创建任务。</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2 pr-2">
                        <input
                          type="checkbox"
                          checked={data.items.length > 0 && selectedIds.length === data.items.length}
                          onChange={(e) => toggleAll(e.target.checked)}
                        />
                      </th>
                      <th className="py-2 pr-4">标题</th>
                      <th className="py-2 pr-4">Handle</th>
                      <th className="py-2 pr-4">平台</th>
                      <th className="py-2 pr-4">价格</th>
                      <th className="py-2 pr-4">状态</th>
                      <th className="py-2">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((p) => (
                      <tr key={p.id} className="border-b last:border-b-0">
                        <td className="py-2 pr-2">
                          <input
                            type="checkbox"
                            checked={!!selected[p.id]}
                            onChange={(e) => setSelected((prev) => ({ ...prev, [p.id]: e.target.checked }))}
                          />
                        </td>
                        <td className="py-2 pr-4 font-medium">
                          <Link href={`/products/${p.id}`} className="text-blue-600 hover:underline">
                            {p.title}
                          </Link>
                        </td>
                        <td className="py-2 pr-4 text-gray-600">{p.handle}</td>
                        <td className="py-2 pr-4">{PLATFORM_CONFIG[p.platform].name}</td>
                        <td className="py-2 pr-4">¥{p.variants?.[0]?.price ?? 0}</td>
                        <td className="py-2 pr-4">{p.status}</td>
                        <td className="py-2">
                          <Link href={`/products/${p.id}`} className="text-sm text-blue-600 hover:underline">
                            编辑
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {data && data.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  第 {data.page} / {data.totalPages} 页，共 {data.total} 条
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setPage((p) => p - 1)}>
                    上一页
                  </Button>
                  <Button variant="outline" size="sm" disabled={data.page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                    下一页
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
