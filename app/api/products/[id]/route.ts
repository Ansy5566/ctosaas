import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { productsGet, productsUpdate, productsDelete } from '@/lib/server/store';
import type { ApiResponse, Product } from '@/types';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { id } = await context.params;

    const product = productsGet(user.id, id);

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: product,
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 404;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '获取商品失败',
      },
      { status }
    );
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { id } = await context.params;
    const body = await request.json();

    const product = productsUpdate(user.id, id, body);

    return NextResponse.json<ApiResponse<Product>>({
      success: true,
      data: product,
      message: '商品已更新',
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 404;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '更新商品失败',
      },
      { status }
    );
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { id } = await context.params;

    productsDelete(user.id, id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: '商品已删除',
    });
  } catch (error) {
    const status = error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 404;
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: error instanceof Error ? error.message : '删除商品失败',
      },
      { status }
    );
  }
}
