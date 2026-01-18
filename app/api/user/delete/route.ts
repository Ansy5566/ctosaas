import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie, requireUserFromRequest } from '@/lib/server/auth';
import { userDeleteAccount } from '@/lib/server/store';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    userDeleteAccount(user.id);

    const response = NextResponse.json<ApiResponse<null>>({
      success: true,
      message: '账户已注销',
    });
    clearSessionCookie(response, request);

    return response;
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '注销失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
