import { NextRequest, NextResponse } from 'next/server';
import { requireUserFromRequest } from '@/lib/server/auth';
import { exportDownload } from '@/lib/server/store';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  try {
    const user = requireUserFromRequest(request);
    const { id } = await context.params;

    const { fileName, csv } = exportDownload(user.id, id);

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : '下载失败', {
      status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 404,
    });
  }
}
