import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: 接入 LLM Agent / 规则引擎
  await new Promise((resolve) => setTimeout(resolve, 800));
  return NextResponse.json({
    riskScore: 86,
    cause: '夜间照明不足、步态异常、地面湿滑',
    suggestion: '立即派人确认现场，并启动二次巡检',
    message: '当前为模拟决策结果',
  });
}
