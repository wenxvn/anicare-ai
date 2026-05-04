import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

export function apiSuccess<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  });
}

export function apiError(error: string, status = 500): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    {
      success: false,
      error,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function parseBody<T>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}
