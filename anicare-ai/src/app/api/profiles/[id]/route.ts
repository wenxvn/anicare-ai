import { NextResponse } from 'next/server';
import { mockResidentProfiles } from '@/lib/mock-data';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const profile = mockResidentProfiles.find((p) => p.id === params.id);
  if (!profile) {
    return NextResponse.json({ error: '老人档案不存在' }, { status: 404 });
  }
  return NextResponse.json(profile);
}
