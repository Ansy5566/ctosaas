import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { userUpdateProfile } from '@/lib/server/store';
import type { ApiResponse, User } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: '未登录',
      },
      { status: 401 }
    );
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const body = await request.json();

    const updated = userUpdateProfile(user.id, {
      name: typeof body.name === 'string' ? body.name : undefined,
      avatar: typeof body.avatar === 'string' ? body.avatar : undefined,
    });

    return NextResponse.json<ApiResponse<User>>({
      success: true,
      data: updated,
      message: '用户信息已更新',
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 422;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '更新失败',
      },
      { status }
    );
  }
}
