import { NextRequest, NextResponse } from 'next/server';
import { attachSessionCookie, verifyLogin } from '@/lib/server/auth';
import type { ApiResponse, User } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '邮箱和密码不能为空',
        },
        { status: 400 }
      );
    }

    const user = verifyLogin(email, password);

    const response = NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
      message: '登录成功',
    });

    attachSessionCookie(response, user.id);

    return response;
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '登录失败',
      },
      { status: 401 }
    );
  }
}
