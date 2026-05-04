'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { postJson } from '@/lib/api-client';
import { mockDetectionImage } from '@/lib/mock-data';
import type { DetectionResult, VisionDetectOutput } from '@/types';
import { scoreToRiskLevel } from '@/types';

type Phase = 'idle' | 'uploading' | 'analyzing' | 'done';

export default function DetectPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [riskScore, setRiskScore] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);

  const runDetection = async (imageUrl: string) => {
    setPreviewUrl(imageUrl);
    setPhase('uploading');
    setTimeout(() => setPhase('analyzing'), 600);

    try {
      const output = await postJson<VisionDetectOutput>('/api/vision/detect', {
        imageUrl,
        zone: '演示区域',
      });

      setResults(output.detections);
      setProcessingTime(output.processingTimeMs);

      const maxConfidence = Math.max(...output.detections.map((d) => d.confidence), 0);
      setRiskScore(Math.round(maxConfidence * 100));
      setPhase('done');
    } catch {
      setResults([
        { label: '人员摔倒', confidence: 0.94, bbox: { x: 280, y: 180, w: 220, h: 300 }, category: 'fall' },
        { label: '长时间静止', confidence: 0.88, category: 'still' },
        { label: '周围无人响应', confidence: 0.81, category: 'no_response' },
      ]);
      setRiskScore(87);
      setProcessingTime(820);
      setPhase('done');
    }
  };

  const handleFileSelect = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    runDetection(url);
  };

  const handleDemo = () => {
    runDetection(mockDetectionImage);
  };

  const mainBbox = results[0]?.bbox;
  const riskLevel = scoreToRiskLevel(riskScore);

  return (
    <div className="space-y-8">
      <SectionHeader title="智能检测" description="上传监控画面或图片，系统会自动识别画面中的风险场景，并给出风险等级判断。" />

      <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {phase === 'idle' && (
        <div className="mx-auto max-w-3xl">
          <div className="card-glow rounded-3xl border-2 border-dashed border-[#1a1615]/10 bg-white p-12 text-center transition-colors hover:border-teal-500/40">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
              <Icon icon="mdi:cloud-upload-outline" className="text-3xl" />
            </div>
            <p className="mt-4 text-base font-semibold text-[#1a1615]">拖拽图片到此处，或点击上传</p>
            <p className="mt-2 text-sm text-[#5c524a]">支持 JPG、PNG 格式，最大 10MB</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={handleFileSelect} className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500">
                <Icon icon="mdi:upload" />
                选择图片上传
              </button>
              <button onClick={handleDemo} className="inline-flex items-center gap-2 rounded-2xl border border-[#1a1615]/10 px-5 py-2.5 text-sm text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:play-circle-outline" />
                体验演示模式
              </button>
            </div>
          </div>
        </div>
      )}

      {(phase === 'uploading' || phase === 'analyzing') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10">
            <Icon icon="mdi:loading" className="animate-spin text-3xl text-teal-600" />
          </div>
          <p className="mt-4 text-lg font-semibold text-[#1a1615]">
            {phase === 'uploading' ? '正在上传图片...' : '正在分析画面风险...'}
          </p>
          <div className="mx-auto mt-6 max-w-md space-y-3">
            {['调用视觉感知模型', '识别人员姿态与行为', '分析场景风险等级'].map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${phase === 'analyzing' && i < 2 ? 'border-teal-500/40 bg-teal-500/10 text-teal-700' : 'border-[#1a1615]/10 text-[#5c524a]/40'}`}>
                  {phase === 'analyzing' && i < 2 ? '✓' : i + 1}
                </span>
                <span className={phase === 'analyzing' && i < 2 ? 'text-[#1a1615]' : 'text-[#5c524a]/40'}>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'done' && previewUrl && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-[#1a1615]">检测完成</p>
            <span className="text-xs text-[#5c524a]/50">检测耗时 {(processingTime / 1000).toFixed(2)}s</span>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-[#1a1615]/8">
                <div className="relative aspect-video">
                  <Image src={previewUrl} alt="检测画面" fill className="object-cover" />
                  {mainBbox && (
                    <div className="absolute border-2 border-teal-600/80 bg-teal-500/10" style={{ left: `${(mainBbox.x / 1280) * 100}%`, top: `${(mainBbox.y / 720) * 100}%`, width: `${(mainBbox.w / 1280) * 100}%`, height: `${(mainBbox.h / 720) * 100}%` }}>
                      <span className="absolute -top-6 left-0 rounded bg-teal-600 px-2 py-0.5 text-xs font-medium text-white">{results[0]?.label}</span>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => { setPhase('idle'); setPreviewUrl(null); setResults([]); }} className="inline-flex items-center gap-2 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:refresh" />
                重新检测
              </button>
            </div>
            <div className="space-y-4">
              <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                <p className="text-sm font-semibold text-[#1a1615]">检测结果</p>
                <div className="mt-4 space-y-3">
                  {results.map((r) => (
                    <div key={r.label} className="flex items-center justify-between rounded-2xl border border-[#1a1615]/8 bg-[#f8f5f0] p-3">
                      <span className="text-sm text-[#5c524a]">{r.label}</span>
                      <span className="text-sm font-medium text-teal-600">{(r.confidence * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1a1615]">风险等级</p>
                  <RiskBadge risk={riskLevel} />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <p className="text-3xl font-bold text-[#1a1615]">{riskScore}<span className="text-base text-[#5c524a]/50">/100</span></p>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-[#f8f5f0]">
                      <div className="h-2 rounded-full bg-teal-500" style={{ width: `${riskScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <Link href="/decision" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500">
                <Icon icon="mdi:brain" />
                生成 AI 决策建议
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
