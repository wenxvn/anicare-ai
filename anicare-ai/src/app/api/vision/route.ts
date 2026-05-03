import { NextResponse } from 'next/server';

export async function POST() {
  // TODO: 接入 YOLO / Pose Estimation 检测服务
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return NextResponse.json({
    detections: [
      { label: '摔倒', confidence: 0.93 },
      { label: '老人', confidence: 0.97 },
    ],
    message: '当前为模拟视觉检测结果',
  });
}
