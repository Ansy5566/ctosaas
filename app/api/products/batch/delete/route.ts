import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { productsBatchDelete } from '@/lib/server/store';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const body = await request.json();
    const { productIds } = body as { productIds: string[] };

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'productIds不能为空',
        },
        { status: 400 }
      );
    }

    const result = productsBatchDelete(user.id, productIds);

    return NextResponse.json<ApiResponse<{ deleted: number }>>({
      success: true,
      data: result,
      message: '商品已批量删除',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '批量删除失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
