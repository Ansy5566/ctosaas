import { NextRequest, NextResponse } from 'next/server';
import { forgotPassword } from '@/lib/server/auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email : '';

  if (!email) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: '请输入邮箱',
      },
      { status: 400 }
    );
  }

  const result = forgotPassword(email);

  // 演示版本直接返回token（生产环境应发送邮件）
  return NextResponse.json<ApiResponse<{ token: string }>>({
    success: true,
    data: result,
    message: '如果邮箱存在，我们已发送重置链接',
  });
}
