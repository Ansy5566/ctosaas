import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { exportCreate, exportList } from '@/lib/server/store';
import type { ApiResponse, ExportRecord } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const list = exportList(user.id);

    return NextResponse.json<ApiResponse<ExportRecord[]>>({
      success: true,
      data: list,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取导出记录失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const body = await request.json();
    const { format, productIds } = body as { format: 'shopify' | 'woocommerce'; productIds?: string[] };

    if (format !== 'shopify' && format !== 'woocommerce') {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '不支持的导出格式',
        },
        { status: 400 }
      );
    }

    const record = exportCreate(user.id, { format, productIds });

    return NextResponse.json<ApiResponse<ExportRecord>>({
      success: true,
      data: record,
      message: '导出任务已完成',
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '创建导出任务失败',
      },
      { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 }
    );
  }
}
