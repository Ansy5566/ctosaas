import { NextResponse } from 'next/server';
import { systemAnnouncements } from '@/lib/server/store';
import type { ApiResponse } from '@/types';

export async function GET(): Promise<NextResponse> {
  const data = systemAnnouncements();
  return NextResponse.json<ApiResponse<typeof data>>({
    success: true,
    data,
  });
}
