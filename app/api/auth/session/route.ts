import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/server/auth';
import type { ApiResponse, User } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = getUserFromRequest(request);
  if (!user) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: '未登录',
      },
      { status: 401 }
    );
  }

  return NextResponse.json<ApiResponse<User>>({
    success: true,
    data: user,
  });
}
