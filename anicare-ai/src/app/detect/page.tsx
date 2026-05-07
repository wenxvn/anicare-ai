'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { postJson } from '@/lib/api-client';
import type { DetectionResult, VisionDetectOutput } from '@/types';
import { scoreToRiskLevel } from '@/types';

interface CameraFeed {
  id: string;
  location: string;
  imageUrl: string;
  detections: DetectionResult[];
  riskScore: number;
}

const cameraFeeds: CameraFeed[] = [
  {
    id: 'cam-01',
    location: '3号楼A区-走廊',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=960&h=540&fit=crop',
    detections: [
      { label: '人员摔倒', confidence: 0.94, bbox: { x: 280, y: 120, w: 200, h: 280 }, category: 'fall' },
      { label: '周围无人响应', confidence: 0.82, category: 'no_response' },
    ],
    riskScore: 91,
  },
  {
    id: 'cam-02',
    location: '活动大厅-东侧',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=960&h=540&fit=crop',
    detections: [
      { label: '烟火疑似异常', confidence: 0.78, bbox: { x: 600, y: 80, w: 180, h: 160 }, category: 'fire' },
    ],
    riskScore: 72,
  },
  {
    id: 'cam-03',
    location: '2号楼B区-床位区',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=960&h=540&fit=crop',
    detections: [
      { label: '久卧未动', confidence: 0.89, bbox: { x: 350, y: 200, w: 240, h: 180 }, category: 'still' },
      { label: '异常滞留', confidence: 0.76, category: 'stuck' },
    ],
    riskScore: 68,
  },
  {
    id: 'cam-04',
    location: '花园入口-南门',
    imageUrl: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=960&h=540&fit=crop',
    detections: [
      { label: '夜间离床未归', confidence: 0.91, bbox: { x: 400, y: 150, w: 160, h: 300 }, category: 'leave' },
    ],
    riskScore: 85,
  },
];

type Phase = 'monitoring' | 'capturing' | 'analyzing' | 'results';

function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 ${String(now.getHours()).padStart(2, '0')}时${String(now.getMinutes()).padStart(2, '0')}分${String(now.getSeconds()).padStart(2, '0')}秒`
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="font-mono text-xs">{time}</span>;
}

function CameraOverlay({ feed }: { feed: CameraFeed }) {
  return (
    <>
      <div className="absolute top-0 left-0 z-10 flex items-center gap-1.5 rounded-br-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
        <Icon icon="mdi:cctv" className="text-xs text-red-400" />
        <span className="text-xs font-medium text-white">{feed.location}</span>
      </div>
      <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
        <LiveClock />
      </div>
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="text-xs font-medium text-white drop-shadow-lg">REC</span>
      </div>
    </>
  );
}

function AnnotatedCameraOverlay({ feed }: { feed: CameraFeed }) {
  return (
    <>
      <div className="absolute top-0 left-0 z-10 flex items-center gap-1.5 rounded-br-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
        <Icon icon="mdi:cctv" className="text-xs text-red-400" />
        <span className="text-xs font-medium text-white">{feed.location}</span>
      </div>
      <div className="absolute top-0 right-0 z-10 rounded-bl-lg bg-black/60 px-2.5 py-1.5 backdrop-blur-sm">
        <LiveClock />
      </div>
      {feed.detections.map((det, i) => det.bbox ? (
        <div
          key={i}
          className="absolute z-20 border-2 border-red-500/80 bg-red-500/10"
          style={{
            left: `${(det.bbox.x / 960) * 100}%`,
            top: `${(det.bbox.y / 540) * 100}%`,
            width: `${(det.bbox.w / 960) * 100}%`,
            height: `${(det.bbox.h / 540) * 100}%`,
          }}
        >
          <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
            {det.label} {(det.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ) : null)}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/60 px-3 py-2 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs text-red-400">⚠ 检测到 {feed.detections.length} 项异常</span>
          <RiskBadge risk={scoreToRiskLevel(feed.riskScore)} />
        </div>
      </div>
    </>
  );
}

export default function DetectPage() {
  const [phase, setPhase] = useState<Phase>('monitoring');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleCapture = useCallback(async () => {
    setPhase('capturing');
    setTimeout(() => setPhase('analyzing'), 800);

    setAnalysisProgress(0);
    const steps = [
      { progress: 20, delay: 400 },
      { progress: 45, delay: 600 },
      { progress: 70, delay: 800 },
      { progress: 90, delay: 600 },
      { progress: 100, delay: 400 },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, step.delay));
      setAnalysisProgress(step.progress);
    }

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      await postJson<VisionDetectOutput>('/api/vision', {
        imageUrl: cameraFeeds[0].imageUrl,
        zone: '多摄像头联合检测',
      }, { signal: controller.signal });
      clearTimeout(timer);
    } catch {
      // 使用本地数据展示
    }

    setPhase('results');
  }, []);

  const handleBackToLive = () => {
    setPhase('monitoring');
    setAnalysisProgress(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="实时监测" description="" />
        <div className="flex items-center gap-3">
          {phase === 'results' ? (
            <button onClick={handleBackToLive} className="inline-flex items-center gap-2 rounded-2xl border border-[#1a1615]/10 px-5 py-2.5 text-sm text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
              <Icon icon="mdi:video-outline" />
              返回实时画面
            </button>
          ) : (
            <button
              onClick={handleCapture}
              disabled={phase !== 'monitoring'}
              className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
            >
              <Icon icon="mdi:camera-iris" />
              抓拍检测
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {(phase === 'monitoring' || phase === 'capturing') && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 lg:grid-cols-2"
          >
            {cameraFeeds.map((feed, index) => (
              <motion.div
                key={feed.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-[#1a1615]/10 bg-black"
              >
                <div className="relative aspect-video">
                  <Image
                    src={feed.imageUrl}
                    alt={feed.location}
                    fill
                    className="object-cover brightness-75 contrast-110"
                    priority={index < 2}
                  />
                  <CameraOverlay feed={feed} />
                </div>
                {phase === 'capturing' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-30 flex items-center justify-center bg-black/40"
                  >
                    <div className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-[#1a1615] backdrop-blur">
                      <Icon icon="mdi:camera" className="mr-1 inline text-teal-600" />
                      正在抓拍...
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-2xl card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-8 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10">
              <Icon icon="mdi:brain" className="animate-pulse text-3xl text-teal-600" />
            </div>
            <p className="mt-4 text-lg font-semibold text-[#1a1615]">正在分析 4 路摄像头画面...</p>
            <div className="mx-auto mt-6 max-w-md space-y-3">
              {[
                { label: '抓拍画面采集', threshold: 20 },
                { label: '视觉感知模型推理', threshold: 45 },
                { label: '人员姿态与行为识别', threshold: 70 },
                { label: '多路风险综合评估', threshold: 90 },
                { label: '生成检测报告', threshold: 100 },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                      analysisProgress >= step.threshold
                        ? 'border-teal-500/40 bg-teal-500/10 text-teal-700'
                        : 'border-[#1a1615]/10 text-[#5c524a]/40'
                    }`}
                  >
                    {analysisProgress >= step.threshold ? '✓' : i + 1}
                  </span>
                  <span className={analysisProgress >= step.threshold ? 'text-[#1a1615]' : 'text-[#5c524a]/40'}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-6 max-w-sm">
              <div className="h-1.5 rounded-full bg-[#f8f5f0]">
                <motion.div
                  className="h-1.5 rounded-full bg-teal-500"
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                <Icon icon="mdi:check-circle" className="text-lg" />
              </div>
              <p className="text-base font-semibold text-[#1a1615]">抓拍检测完成 — 共检测 4 路摄像头，发现 {cameraFeeds.reduce((s, f) => s + f.detections.length, 0)} 项异常</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {cameraFeeds.map((feed, index) => (
                <motion.div
                  key={feed.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12 }}
                  className="card-glow overflow-hidden rounded-2xl border border-[#1a1615]/10 bg-white"
                >
                  <div className="relative aspect-video">
                    <Image
                      src={feed.imageUrl}
                      alt={feed.location}
                      fill
                      className="object-cover"
                      priority={index < 2}
                    />
                    <AnnotatedCameraOverlay feed={feed} />
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1a1615]">{feed.location}</p>
                      <span className="text-xs text-[#5c524a]">风险分 {feed.riskScore}/100</span>
                    </div>
                    <div className="space-y-1.5">
                      {feed.detections.map((det, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-[#f8f5f0] px-3 py-2">
                          <span className="text-sm text-[#5c524a]">{det.label}</span>
                          <span className="text-sm font-medium text-teal-600">{(det.confidence * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
