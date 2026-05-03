import { NextResponse } from 'next/server';
import { mockDispatchQueue } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockDispatchQueue);
}

export async function POST(req: Request) {
  const { id, assignee } = await req.json();
  const item = mockDispatchQueue.find((d) => d.id === id);
  if (!item) {
    return NextResponse.json({ error: '调度项不存在' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: `已指派 ${assignee} 处理 ${item.type}事件` });
}