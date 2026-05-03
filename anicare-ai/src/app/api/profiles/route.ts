import { NextResponse } from 'next/server';
import { mockResidentProfiles } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockResidentProfiles);
}