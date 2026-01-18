'use client';

import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { exportApi } from '@/lib/api';
import type { ExportRecord } from '@/types';
import { formatDate } from '@/lib/utils';

const formatOptions = [
  { value: 'shopify', label: 'Shopify CSV' },
  { value: 'woocommerce', label: 'WooCommerce CSV' },
];

export default function ExportPage() {
  const [format, setFormat] = useState<'shopify' | 'woocommerce'>('shopify');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const [records, setRecords] = useState<ExportRecord[]>([]);

  const load = useCallback(async () => {
    const res = await exportApi.list();
    if (res.success) setRecords(res.data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = async () => {
    setCreating(true);
    setError('');

    const res = await exportApi.create({ format });
    setCreating(false);

    if (res.success) {
      await load();
    } else {
      setError(res.error || '导出失败');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据导出</h1>
          <p className="text-gray-600">导出商品数据至 CSV 文件</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>创建导出任务</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <Select label="导出格式" value={format} onChange={(e) => setFormat(e.target.value as 'shopify' | 'woocommerce')} options={formatOptions} />
              <Button loading={creating} onClick={onCreate}>
                导出所有商品
              </Button>
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="text-sm text-gray-500">导出将包含所有已采集的商品。</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>导出记录</CardTitle>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-sm text-gray-500">暂无导出记录。</div>
            ) : (
              <div className="space-y-2">
                {records.map((r) => (
                  <div key={r.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{r.format === 'shopify' ? 'Shopify CSV' : 'WooCommerce CSV'}</div>
                      <div className="text-sm text-gray-600">
                        {r.productIds.length} 商品 · {formatDate(r.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">{r.status === 'completed' && '✅ 已完成'}</span>
                      {r.status === 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => exportApi.download(r.id)}>
                          下载
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
