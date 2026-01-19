import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/server/auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json<ApiResponse<null>>({
    success: true,
    message: '已退出登录',
  });

  clearSessionCookie(response, request);

  return response;
}
