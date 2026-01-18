import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { userStatistics } from '@/lib/server/store';
import type { ApiResponse, Statistics } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const stats = userStatistics(user.id);

    return NextResponse.json<ApiResponse<Statistics>>({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取统计数据失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
