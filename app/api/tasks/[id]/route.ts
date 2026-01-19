import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { tasksGet } from '@/lib/server/store';
import type { ApiResponse, CollectionTask } from '@/types';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { id } = await context.params;

    const task = tasksGet(user.id, id);

    return NextResponse.json<ApiResponse<CollectionTask>>({
      success: true,
      data: task,
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 404;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取任务失败',
      },
      { status }
    );
  }
}
