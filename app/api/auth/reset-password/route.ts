import { NextRequest, NextResponse } from 'next/server';
import { resetPassword } from '@/lib/server/auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const token = typeof body.token === 'string' ? body.token : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';

    if (!token || !newPassword) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '缺少token或新密码',
        },
        { status: 400 }
      );
    }

    resetPassword(token, newPassword);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: '密码已重置，请重新登录',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '重置失败',
      },
      { status: 422 }
    );
  }
}
