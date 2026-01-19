import { NextRequest, NextResponse } from 'next/server';
import { attachSessionCookie } from '@/lib/server/auth';
import { authCreateUser } from '@/lib/server/store';
import type { ApiResponse, User } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '邮箱、密码和昵称不能为空',
        },
        { status: 400 }
      );
    }

    const user = authCreateUser({ email, password, name });

    const response = NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
      message: '注册成功',
    });

    attachSessionCookie(response, user.id);

    return response;
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '注册失败',
      },
      { status: 422 }
    );
  }
}
