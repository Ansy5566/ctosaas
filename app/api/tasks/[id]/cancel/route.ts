import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { tasksCancel } from '@/lib/server/store';
import type { ApiResponse, CollectionTask } from '@/types';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { id } = await context.params;

    const task = tasksCancel(user.id, id);

    return NextResponse.json<ApiResponse<CollectionTask>>({
      success: true,
      data: task,
      message: '任务已取消',
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 404;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '取消任务失败',
      },
      { status }
    );
  }
}
