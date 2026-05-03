import { NextResponse } from 'next/server';
import { mockEmergencyPlans } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockEmergencyPlans);
}

export async function POST(req: Request) {
  const { planId, stepId } = await req.json();
  const plan = mockEmergencyPlans.find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ error: '应急方案不存在' }, { status: 404 });
  }
  const step = plan.steps.find((s) => s.id === stepId);
  if (!step) {
    return NextResponse.json({ error: '步骤不存在' }, { status: 404 });
  }
  return NextResponse.json({ success: true, message: `步骤 "${step.title}" 已标记完成` });
}
