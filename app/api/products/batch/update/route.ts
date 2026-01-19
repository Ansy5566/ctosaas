import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { productsBatchUpdate } from '@/lib/server/store';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const body = await request.json();

    const result = productsBatchUpdate(user.id, body);

    return NextResponse.json<ApiResponse<{ updated: number }>>({
      success: true,
      data: result,
      message: '商品已批量更新',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '批量更新失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
