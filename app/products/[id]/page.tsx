'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { productsApi } from '@/lib/api';
import type { Product } from '@/types';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (showLoading: boolean) => {
    if (showLoading) setLoading(true);
    const res = await productsApi.get(params.id);
    setLoading(false);

    if (res.success) setProduct(res.data ?? null);
    else setError(res.error || '加载失败');
  }, [params.id]);

  useEffect(() => {
    load(false);
  }, [load]);

  const onSave = async () => {
    if (!product) return;
    setSaving(true);
    setError('');

    const res = await productsApi.update(product.id, product);
    setSaving(false);

    if (res.success) {
      setProduct(res.data ?? null);
    } else {
      setError(res.error || '保存失败');
    }
  };

  const onDelete = async () => {
    if (!product) return;
    setSaving(true);
    await productsApi.delete(product.id);
    setSaving(false);
    router.push('/products');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">商品详情</h1>
            <p className="text-gray-600">查看与编辑商品信息</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              返回
            </Button>
            <Button variant="danger" loading={saving} onClick={onDelete}>
              删除
            </Button>
            <Button loading={saving} onClick={onSave}>
              保存
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-sm text-gray-500">加载中...</div>}
            {!loading && !product && <div className="text-sm text-gray-500">商品不存在</div>}

            {product && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="标题"
                  value={product.title}
                  onChange={(e) => setProduct({ ...product, title: e.target.value })}
                />
                <Input
                  label="Handle"
                  value={product.handle}
                  onChange={(e) => setProduct({ ...product, handle: e.target.value })}
                />
                <Select
                  label="状态"
                  value={product.status}
                  onChange={(e) => setProduct({ ...product, status: e.target.value as Product['status'] })}
                  options={[
                    { value: 'active', label: '上架' },
                    { value: 'draft', label: '草稿' },
                    { value: 'archived', label: '归档' },
                  ]}
                />
                <Input
                  label="供应商"
                  value={product.vendor || ''}
                  onChange={(e) => setProduct({ ...product, vendor: e.target.value })}
                />
                <Input
                  label="分类"
                  value={product.productType || ''}
                  onChange={(e) => setProduct({ ...product, productType: e.target.value })}
                />
                <Input
                  label="标签（逗号分隔）"
                  value={(product.tags || []).join(', ')}
                  onChange={(e) => setProduct({ ...product, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                />
                <div className="md:col-span-2">
                  <Input
                    label="描述"
                    value={product.description || ''}
                    onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  />
                </div>
              </div>
            )}

            {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
          </CardContent>
        </Card>

        {product?.variants?.[0] && (
          <Card>
            <CardHeader>
              <CardTitle>SKU / 价格</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="SKU" value={product.variants[0].sku || ''} disabled />
                <Input label="价格" value={String(product.variants[0].price)} disabled />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
