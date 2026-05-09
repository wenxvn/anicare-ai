'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
import { postJson } from '@/lib/api-client';
import type { DetectionResult, RiskLevel, VisionDetectOutput } from '@/types';

interface CameraFeed {
  id: string;
  code: string;
  location: string;
  imageUrl: string;
  analyzedImageUrl: string;
  status: 'online' | 'warning' | 'critical';
  riskLevel: RiskLevel;
  riskScore: number;
  assignee: string;
  detections: DetectionResult[];
  poses: NonNullable<VisionDetectOutput['poses']>;
  riskSignals: NonNullable<VisionDetectOutput['riskSignals']>;
  imageSize?: VisionDetectOutput['imageSize'];
  modelVersion?: string;
  processingTimeMs?: number;
  cause: string;
  suggestion: string;
}

const initialFeeds: CameraFeed[] = [
  {
    id: 'cam-01',
    code: 'CAM-A3-01',
    location: 'A栋 3层走廊',
    imageUrl: '/1/1.jpg',
    analyzedImageUrl: '/1/5.jpg',
    status: 'online',
    riskLevel: 'low',
    riskScore: 0,
    assignee: '待研判',
    detections: [],
    poses: [],
    riskSignals: [],
    cause: '等待本地视觉模型分析当前画面。',
    suggestion: '点击“重新分析当前画面”获取 YOLO 检测与姿态研判结果。',
  },
  {
    id: 'cam-02',
    code: 'CAM-C1-02',
    location: 'C栋 1层茶水间',
    imageUrl: '/1/2.jpg',
    analyzedImageUrl: '/1/6.jpg',
    status: 'online',
    riskLevel: 'low',
    riskScore: 0,
    assignee: '待研判',
    detections: [],
    poses: [],
    riskSignals: [],
    cause: '等待本地视觉模型分析当前画面。',
    suggestion: '烟火异常第一版建议结合传感器，不从 COCO 预训练模型伪造烟雾结果。',
  },
  {
    id: 'cam-03',
    code: 'CAM-B3-302',
    location: 'B栋 302房床位区',
    imageUrl: '/1/3.jpg',
    analyzedImageUrl: '/1/7.jpg',
    status: 'online',
    riskLevel: 'low',
    riskScore: 0,
    assignee: '待研判',
    detections: [],
    poses: [],
    riskSignals: [],
    cause: '等待本地视觉模型分析当前画面。',
    suggestion: '如果检测到人员与床位重叠，可结合床压规则判断久卧风险。',
  },
  {
    id: 'cam-04',
    code: 'CAM-A1-04',
    location: 'A栋 1层电梯口',
    imageUrl: '/1/4.jpg',
    analyzedImageUrl: '/1/8.jpg',
    status: 'online',
    riskLevel: 'low',
    riskScore: 0,
    assignee: '待研判',
    detections: [],
    poses: [],
    riskSignals: [],
    cause: '等待本地视觉模型分析当前画面。',
    suggestion: '静态图无法证明长时间滞留，后续可接入视频帧时间窗口。',
  },
];

function statusStyle(status: CameraFeed['status']) {
  if (status === 'critical') return 'bg-red-500';
  if (status === 'warning') return 'bg-orange-500';
  return 'bg-emerald-500';
}

function severityRank(level: RiskLevel) {
  return { low: 0, medium: 1, high: 2, critical: 3 }[level];
}

function scoreFromSignals(signals: NonNullable<VisionDetectOutput['riskSignals']>) {
  if (signals.some((signal) => signal.severity === 'critical')) return 91;
  if (signals.some((signal) => signal.severity === 'high')) return 78;
  if (signals.some((signal) => signal.severity === 'medium')) return 62;
  if (signals.some((signal) => signal.code === 'person_detected')) return 35;
  return 0;
}

function riskFromSignals(signals: NonNullable<VisionDetectOutput['riskSignals']>): RiskLevel {
  return signals.reduce<RiskLevel>((current, signal) => (
    severityRank(signal.severity) > severityRank(current) ? signal.severity : current
  ), 'low');
}

function statusFromRisk(level: RiskLevel): CameraFeed['status'] {
  if (level === 'critical') return 'critical';
  if (level === 'high' || level === 'medium') return 'warning';
  return 'online';
}

function causeFromResult(result: VisionDetectOutput) {
  const signal = result.riskSignals?.find((item) => item.severity === 'critical')
    ?? result.riskSignals?.find((item) => item.severity === 'high')
    ?? result.riskSignals?.[0];
  if (signal) return signal.reason;
  if (result.detections.length > 0) return `模型检测到 ${result.detections.length} 个目标，暂未形成高风险信号。`;
  return '当前画面未检测到高风险目标。';
}

function suggestionFromResult(result: VisionDetectOutput) {
  const signals = result.riskSignals ?? [];
  if (signals.some((item) => item.code === 'fall_suspected')) return '建议立即派单复核现场，先确认意识、呼吸和疼痛部位，避免盲目移动老人。';
  if (signals.some((item) => item.code === 'pose_abnormal')) return '建议护理员到场确认姿态和行动能力，并记录处置结果。';
  if (signals.some((item) => item.code === 'lying_on_bed')) return '建议结合床压传感器和时序数据判断是否久卧未动。';
  if (signals.some((item) => item.code === 'person_detected')) return '当前检测到人员目标，建议继续观察并结合行为时序分析。';
  return '无需绘制风险框，保持当前画面观察。';
}

function eventQueue(feeds: CameraFeed[]) {
  return feeds
    .map((feed, index) => ({
      id: `vision-${feed.id}`,
      type: '安全',
      zone: feed.location,
      riskLevel: 'low' as RiskLevel,
      wait: index + 1,
      status: '持续监测',
    }));
}

const poseEdges = [
  [5, 7], [7, 9],
  [6, 8], [8, 10],
  [5, 6],
  [5, 11], [6, 12],
  [11, 12],
  [11, 13], [13, 15],
  [12, 14], [14, 16],
  [0, 1], [0, 2],
  [1, 3], [2, 4],
];

function PoseOverlay({ feed, imageWidth, imageHeight }: { feed: CameraFeed; imageWidth: number; imageHeight: number }) {
  if (feed.poses.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {feed.poses.map((pose, poseIndex) => (
        <g key={`pose-${poseIndex}`}>
          {poseEdges.map(([from, to]) => {
            const a = pose.keypoints[from];
            const b = pose.keypoints[to];
            if (!a || !b || a.confidence < 0.25 || b.confidence < 0.25) return null;
            return (
              <line
                key={`${poseIndex}-${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#22d3ee"
                strokeWidth={Math.max(5, imageWidth / 700)}
                strokeLinecap="round"
                opacity="0.92"
              />
            );
          })}
          {pose.keypoints.map((point, pointIndex) => {
            if (point.confidence < 0.25) return null;
            return (
              <circle
                key={`${poseIndex}-${pointIndex}`}
                cx={point.x}
                cy={point.y}
                r={Math.max(9, imageWidth / 430)}
                fill="#facc15"
                stroke="#111827"
                strokeWidth={Math.max(3, imageWidth / 1200)}
              />
            );
          })}
        </g>
      ))}
    </svg>
  );
}

function CameraCard({ feed, active, currentTime, onClick }: { feed: CameraFeed; active: boolean; currentTime: string; onClick: () => void }) {
  const imageWidth = feed.imageSize?.width ?? 1024;
  const imageHeight = feed.imageSize?.height ?? 768;

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border bg-black text-left transition-all ${active ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-[#1a1615]/8 hover:border-teal-500/40'}`}
      style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
    >
      <Image src={feed.imageUrl} alt={feed.location} fill sizes="(min-width: 1280px) 50vw, 100vw" className="object-cover opacity-95 transition-transform group-hover:scale-[1.02]" priority={feed.id === 'cam-01'} />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusStyle(feed.status)}`} />
          <span className="text-xs font-medium text-white">{feed.code}</span>
        </div>
        <span className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-[11px] text-white/90">{currentTime}</span>
      </div>

      {feed.detections.map((det, i) => det.bbox ? (
        <div
          key={`${det.label}-${i}`}
          className="absolute z-10 border-2 border-red-500/90 bg-red-500/10"
          style={{
            left: `${(det.bbox.x / imageWidth) * 100}%`,
            top: `${(det.bbox.y / imageHeight) * 100}%`,
            width: `${(det.bbox.w / imageWidth) * 100}%`,
            height: `${(det.bbox.h / imageHeight) * 100}%`,
          }}
        >
          <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {det.label} {(det.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ) : null)}

      <PoseOverlay feed={feed} imageWidth={imageWidth} imageHeight={imageHeight} />
    </button>
  );
}

export default function DetectPage() {
  const [feeds, setFeeds] = useState<CameraFeed[]>(initialFeeds);
  const [selectedId, setSelectedId] = useState(initialFeeds[0].id);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const selected = useMemo(() => feeds.find((feed) => feed.id === selectedId) ?? feeds[0], [feeds, selectedId]);
  const queue = useMemo(() => eventQueue(feeds), [feeds]);

  useEffect(() => {
    const formatTime = () => new Date().toLocaleString('zh-CN', {
      hour12: false,
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).replace(/\//g, '-');
    setCurrentTime(formatTime());
    const timer = window.setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const applyVisionResult = useCallback((feedId: string, result: VisionDetectOutput) => {
    const riskSignals = result.riskSignals ?? [];
    const riskLevel = riskFromSignals(riskSignals);
    setFeeds((prev) => prev.map((feed) => feed.id === feedId ? {
      ...feed,
      imageUrl: feed.analyzedImageUrl,
      detections: result.detections ?? [],
      poses: result.poses ?? [],
      riskSignals,
      imageSize: result.imageSize,
      modelVersion: result.modelVersion,
      processingTimeMs: result.processingTimeMs,
      riskLevel,
      riskScore: scoreFromSignals(riskSignals),
      status: statusFromRisk(riskLevel),
      assignee: riskLevel === 'critical' ? '待派单' : riskLevel === 'low' ? '观察中' : '待复核',
      cause: causeFromResult(result),
      suggestion: suggestionFromResult(result),
    } : feed));
  }, []);

  const markVisionUnavailable = useCallback((feedId: string) => {
    setFeeds((prev) => prev.map((feed) => feed.id === feedId ? {
      ...feed,
      detections: [],
      poses: [],
      riskSignals: [{
        code: 'vision_service_unavailable',
        label: '视觉服务未连接',
        severity: 'low',
        confidence: 1,
        reason: '本地 YOLO 服务未启动或模型依赖未安装，当前不绘制预设检测框。',
      }],
      riskLevel: 'low',
      riskScore: 0,
      status: 'online',
      cause: '本地视觉服务暂不可用。',
      suggestion: '启动 vision_service 后重新分析当前画面。',
    } : feed));
  }, []);

  const analyzeFeed = useCallback(async (feed: CameraFeed) => {
    const result = await postJson<VisionDetectOutput>('/api/vision', {
      imageUrl: feed.analyzedImageUrl,
      cameraId: feed.code,
      zone: feed.location,
    });
    applyVisionResult(feed.id, result);
  }, [applyVisionResult]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    try {
      for (const step of [25, 48, 72, 91]) {
        await new Promise((resolve) => window.setTimeout(resolve, 180));
        setAnalysisProgress(step);
      }
      await analyzeFeed(selected);
      setAnalysisProgress(100);
    } catch {
      markVisionUnavailable(selected.id);
    } finally {
      setAnalyzing(false);
    }
  }, [analyzeFeed, markVisionUnavailable, selected]);

  const handleAnalyzeAll = useCallback(async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    let completed = 0;
    await Promise.all(feeds.map(async (feed) => {
      try {
        await analyzeFeed(feed);
      } catch {
        markVisionUnavailable(feed.id);
      } finally {
        completed += 1;
        setAnalysisProgress(Math.round((completed / feeds.length) * 100));
      }
    }));
    setAnalyzing(false);
  }, [analyzeFeed, feeds, markVisionUnavailable]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5c524a]">实时监测中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#1a1615]">视频墙与真实视觉分析</h1>
          <p className="mt-2 text-sm text-[#5c524a]">检测框和人体关键点来自本地 YOLO 检测/姿态服务；服务未连接时不再绘制预设假框。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="inline-flex items-center gap-2 rounded-lg border border-[#1a1615]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#1a1615] transition-colors hover:border-teal-500/40 hover:text-teal-700 disabled:opacity-50"
          >
            <Icon icon={analyzing ? 'mdi:loading' : 'mdi:radar'} className={analyzing ? 'animate-spin' : ''} />
            {analyzing ? `分析中 ${analysisProgress}%` : '重新分析当前画面'}
          </button>
          <button
            onClick={handleAnalyzeAll}
            disabled={analyzing}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
          >
            <Icon icon={analyzing ? 'mdi:loading' : 'mdi:camera-metering-center'} className={analyzing ? 'animate-spin' : ''} />
            {analyzing ? `分析中 ${analysisProgress}%` : '分析全部画面'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-3 sm:grid-cols-2">
          {feeds.map((feed) => (
            <CameraCard key={feed.id} feed={feed} active={feed.id === selected.id} currentTime={currentTime} onClick={() => setSelectedId(feed.id)} />
          ))}
        </section>

        <aside className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1a1615]">实时事件队列</h2>
              <p className="mt-1 text-xs text-[#5c524a]">当前画面安全巡检状态</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{queue.length} 路</span>
          </div>
          <div className="mt-4 space-y-3">
            {queue.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[#1a1615]/10 px-4 py-8 text-center text-sm text-[#5c524a]/60">
                暂无模型事件。请选择画面并点击分析。
              </div>
            ) : queue.map((item) => (
              <Link key={item.id} href="/events" className="block rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 transition-colors hover:border-emerald-300 hover:bg-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-emerald-800">{item.type}</span>
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">安全</span>
                </div>
                <p className="mt-1 text-xs text-[#5c524a]">{item.zone}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-[#5c524a]">{item.status}</span>
                  <span className="font-mono text-emerald-700">实时更新</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:brain" className="text-lg text-teal-600" />
                <h2 className="text-base font-semibold text-[#1a1615]">AI 识别详情</h2>
              </div>
              <p className="mt-1 text-sm text-[#5c524a]">{selected.code} · {selected.location}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RiskBadge risk={selected.riskLevel} />
              <span className="rounded-full border border-[#1a1615]/10 px-2.5 py-1 text-xs text-[#5c524a]">负责人：{selected.assignee}</span>
              {selected.modelVersion && <span className="rounded-full border border-[#1a1615]/10 px-2.5 py-1 text-xs text-[#5c524a]">{selected.modelVersion} · {selected.processingTimeMs} ms</span>}
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr]">
            <div className="rounded-xl bg-[#f8f5f0] p-4">
              <p className="text-xs font-medium text-[#5c524a]">模型检测目标</p>
              <div className="mt-3 space-y-2">
                {selected.detections.length === 0 ? (
                  <p className="text-sm text-[#5c524a]">当前画面暂无模型检测框。</p>
                ) : selected.detections.map((det, index) => (
                  <div key={`${det.label}-${index}`} className="flex items-center justify-between text-sm">
                    <span className="text-[#1a1615]">{det.label}</span>
                    <span className="font-mono text-teal-700">{(det.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[#f8f5f0] p-4">
              <p className="text-xs font-medium text-[#5c524a]">姿态估计</p>
              <div className="mt-3 space-y-2">
                {selected.poses.length === 0 ? (
                  <p className="text-sm text-[#5c524a]">当前画面暂无人体关键点。</p>
                ) : selected.poses.map((pose, index) => {
                  const validPoints = pose.keypoints.filter((point) => point.confidence >= 0.25).length;
                  return (
                    <div key={`pose-detail-${index}`} className="rounded-lg bg-white px-3 py-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#1a1615]">人体姿态 #{index + 1}</span>
                        <span className="font-mono text-cyan-700">{(pose.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="mt-1 text-xs text-[#5c524a]">有效关键点 {validPoints}/17，已叠加骨架连线。</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl bg-[#f8f5f0] p-4">
              <p className="text-xs font-medium text-[#5c524a]">规则信号</p>
              <div className="mt-3 space-y-2">
                {selected.riskSignals.length === 0 ? (
                  <p className="text-sm text-[#5c524a]">等待模型输出。</p>
                ) : selected.riskSignals.map((signal) => (
                  <div key={signal.code} className="rounded-lg bg-white px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1a1615]">{signal.label}</span>
                      <RiskBadge risk={signal.severity} />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[#5c524a]">{signal.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-teal-50 p-4">
              <p className="text-xs font-medium text-teal-700">建议动作</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1a1615]">{selected.suggestion}</p>
              <div className="mt-4 rounded-lg bg-white/70 px-3 py-2 text-xs leading-relaxed text-[#5c524a]">
                静态图片只能证明“检测到目标/姿态异常”，久卧、滞留和无人响应应结合时序帧或传感器数据。
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
