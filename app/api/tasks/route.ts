import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { tasksCreate, tasksList } from '@/lib/server/store';
import type { ApiResponse, CollectionTask, CollectionType, Platform } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const tasks = tasksList(user.id);

    return NextResponse.json<ApiResponse<CollectionTask[]>>({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取任务列表失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const body = await request.json();
    const { platform, type, url } = body as { platform: Platform; type: CollectionType; url: string };

    if (!platform || !type || !url) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '缺少必要参数',
        },
        { status: 400 }
      );
    }

    const task = tasksCreate({
      userId: user.id,
      platform,
      type,
      url,
    });

    return NextResponse.json<ApiResponse<CollectionTask>>({
      success: true,
      data: task,
      message: '采集任务已创建',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '创建任务失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
