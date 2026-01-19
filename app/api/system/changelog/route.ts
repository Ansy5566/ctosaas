import { NextResponse } from 'next/server';
import { systemChangelog } from '@/lib/server/store';
import type { ApiResponse } from '@/types';

export async function GET(): Promise<NextResponse> {
  const data = systemChangelog();
  return NextResponse.json<ApiResponse<typeof data>>({
    success: true,
    data,
  });
}
