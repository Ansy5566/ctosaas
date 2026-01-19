import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { userGetSubscription } from '@/lib/server/store';
import type { ApiResponse, Subscription } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const sub = userGetSubscription(user.id);

    return NextResponse.json<ApiResponse<Subscription>>({
      success: true,
      data: sub,
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取订阅信息失败',
      },
      { status }
    );
  }
}
