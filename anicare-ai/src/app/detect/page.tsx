'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { mockDetectionResults, mockDetectionImage } from '@/lib/mock-data';
import type { DetectionResult } from '@/types';

type Phase = 'idle' | 'uploading' | 'analyzing' | 'done';

export default function DetectPage() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    startAnalysis();
  };

  const handleDemo = () => {
    setPreviewUrl(mockDetectionImage);
    startAnalysis();
  };

  const startAnalysis = () => {
    setPhase('uploading');
    setResults([]);
    setTimeout(() => setPhase('analyzing'), 800);
    setTimeout(() => {
      setResults(mockDetectionResults);
      setPhase('done');
    }, 3200);
  };

  const riskScore = 87;
  const mainBbox = results.find((r) => r.bbox)?.bbox;

  return (
    <div className="space-y-8">
      <SectionHeader title="智能检测" description="上传一张图片或直接体验演示，看看系统怎么从画面中识别风险。" />

      {phase === 'idle' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
          <div className="rounded-3xl border-2 border-dashed border-white/10 bg-surface-800/50 p-12 text-center transition-colors hover:border-orange-500/30">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-300">
              <Icon icon="mdi:cloud-upload-outline" className="text-3xl" />
            </div>
            <p className="mt-4 text-base font-semibold text-warm-50">拖拽图片到此处，或点击上传</p>
            <p className="mt-2 text-sm text-warm-100/50">支持 JPG、PNG 格式，最大 10MB</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={handleFileSelect} className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-400">
                <Icon icon="mdi:upload" />
                选择图片上传
              </button>
              <button onClick={handleDemo} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-2.5 text-sm text-warm-100/80 transition-colors hover:border-orange-500/30 hover:text-orange-200">
                <Icon icon="mdi:play-circle-outline" />
                体验演示模式
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
        </motion.div>
      )}

      {(phase === 'uploading' || phase === 'analyzing') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl rounded-3xl border border-white/5 bg-surface-800/80 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
            <Icon icon="mdi:loading" className="animate-spin text-3xl text-orange-300" />
          </div>
          <p className="mt-4 text-lg font-semibold text-warm-50">
            {phase === 'uploading' ? '正在上传图片...' : '正在分析画面风险...'}
          </p>
          <div className="mx-auto mt-6 max-w-md space-y-3">
            {['调用视觉感知模型', '识别人员姿态与行为', '分析场景风险等级'].map((step, i) => (
              <div key={step} className="flex items-center gap-3 text-sm">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${phase === 'analyzing' && i < 2 ? 'border-orange-400/40 bg-orange-500/10 text-orange-200' : 'border-white/10 text-warm-100/40'}`}>
                  {phase === 'analyzing' && i < 2 ? '✓' : i + 1}
                </span>
                <span className={phase === 'analyzing' && i < 2 ? 'text-warm-50' : 'text-warm-100/40'}>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {phase === 'done' && previewUrl && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl border border-white/5">
              <div className="relative aspect-video">
                <Image src={previewUrl} alt="检测画面" fill className="object-cover" />
                {mainBbox && (
                  <div className="absolute border-2 border-orange-500/80 bg-orange-500/10" style={{ left: `${(mainBbox.x / 1280) * 100}%`, top: `${(mainBbox.y / 720) * 100}%`, width: `${(mainBbox.w / 1280) * 100}%`, height: `${(mainBbox.h / 720) * 100}%` }}>
                    <span className="absolute -top-6 left-0 rounded bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">人员摔倒</span>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => { setPhase('idle'); setPreviewUrl(null); setResults([]); }} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-warm-100/70 transition-colors hover:border-orange-500/30 hover:text-orange-200">
              <Icon icon="mdi:refresh" />
              重新检测
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
              <p className="text-sm font-semibold text-warm-50">检测结果</p>
              <div className="mt-4 space-y-3">
                {results.map((r) => (
                  <div key={r.label} className="flex items-center justify-between rounded-2xl border border-white/5 bg-surface-900/60 p-3">
                    <span className="text-sm text-warm-100/80">{r.label}</span>
                    <span className="text-sm font-medium text-orange-300">{(r.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-warm-50">风险等级</p>
                <RiskBadge risk="高风险" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <p className="text-3xl font-bold text-warm-50">{riskScore}<span className="text-base text-warm-100/50">/100</span></p>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-surface-900">
                    <div className="h-2 rounded-full bg-orange-500" style={{ width: `${riskScore}%` }} />
                  </div>
                </div>
              </div>
            </div>
            <Link href="/decision" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400">
              <Icon icon="mdi:brain" />
              生成 AI 决策建议
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
