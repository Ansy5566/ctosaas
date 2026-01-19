import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { productsList } from '@/lib/server/store';
import type { ApiResponse, PaginatedResponse, Platform, Product } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 20);
    const search = searchParams.get('search') || undefined;
    const platform = (searchParams.get('platform') || undefined) as Platform | undefined;
    const status = (searchParams.get('status') || undefined) as Product['status'] | undefined;

    const data = productsList(user.id, {
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 20,
      search,
      platform,
      status,
    });

    return NextResponse.json<ApiResponse<PaginatedResponse<Product>>>(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取商品列表失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
