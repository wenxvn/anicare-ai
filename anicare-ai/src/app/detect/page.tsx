'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    location: 'A栋3层走廊',
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
    suggestion: '点击“重新分析当前画面”或“分析全部画面”获取 YOLO 检测与姿态结果。',
  },
  {
    id: 'cam-02',
    code: 'CAM-C1-02',
    location: 'C栋1层茶水间',
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
    suggestion: '烟火异常可结合传感器数据一起判断。',
  },
  {
    id: 'cam-03',
    code: 'CAM-B3-302',
    location: 'B栋302房间床位区',
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
    suggestion: '如检测到人员与床位重叠，可结合床压规则研判。',
  },
  {
    id: 'cam-04',
    code: 'CAM-A1-04',
    location: 'A栋1层电梯口',
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
    suggestion: '静态图用于识别长期滞留，后续可接入视频时间窗。',
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
  if (result.detections.length > 0) return `模型检测到 ${result.detections.length} 个目标，当前未形成高风险信号。`;
  return '当前画面未检测到高风险目标。';
}

function suggestionFromResult(result: VisionDetectOutput) {
  const signals = result.riskSignals ?? [];
  if (signals.some((item) => item.code === 'fall_suspected')) return '建议立即到场复核，先确认意识、呼吸和疼痛部位，避免盲目移动老人。';
  if (signals.some((item) => item.code === 'pose_abnormal')) return '建议护理员到场确认姿态和行动能力，并记录处置结果。';
  if (signals.some((item) => item.code === 'lying_on_bed')) return '建议结合床压传感器和时序数据判断是否久卧未动。';
  if (signals.some((item) => item.code === 'person_detected')) return '当前检测到人员目标，建议继续观察并结合行为时序分析。';
  return '无需绘制风险框，保持当前画面观察即可。';
}

function eventQueue(feeds: CameraFeed[]) {
  return feeds.map((feed, index) => ({
    id: `vision-${feed.id}`,
    type: '安全巡检',
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
      className={`group relative overflow-hidden rounded-2xl border bg-black text-left transition-all ${
        active ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-[#172033]/8 hover:border-teal-500/40'
      }`}
      style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
    >
      <Image
        src={feed.imageUrl}
        alt={feed.location}
        fill
        sizes="(min-width: 1280px) 50vw, 100vw"
        className="object-cover opacity-95 transition-transform group-hover:scale-[1.02]"
        priority={feed.id === 'cam-01'}
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusStyle(feed.status)}`} />
          <span className="text-xs font-medium text-white">{feed.code}</span>
        </div>
        <span className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-[11px] text-white/90">{currentTime}</span>
      </div>

      {feed.detections.map((det, i) => (det.bbox ? (
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
      ) : null))}

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
    setFeeds((prev) => prev.map((feed) => (feed.id === feedId ? {
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
    } : feed)));
  }, []);

  const markVisionUnavailable = useCallback((feedId: string) => {
    setFeeds((prev) => prev.map((feed) => (feed.id === feedId ? {
      ...feed,
      detections: [],
      poses: [],
      riskSignals: [{
        code: 'vision_service_unavailable',
        label: '视觉服务未连接',
        severity: 'low',
        confidence: 1,
        reason: '本地 YOLO 服务未启动或模型依赖缺失，当前展示原始画面。',
      }],
      riskLevel: 'low',
      riskScore: 0,
      status: 'online',
      cause: '本地视觉服务暂不可用。',
      suggestion: '启动 vision_service 后重新分析当前画面。',
    } : feed)));
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

  const overview = [
    { label: '当前画面', value: selected.code },
    { label: '风险等级', value: selected.riskLevel === 'low' ? '低风险' : selected.riskLevel === 'medium' ? '中风险' : selected.riskLevel === 'high' ? '高风险' : '紧急' },
    { label: '等待时长', value: `${selected.riskScore || 0} 分` },
    { label: '当前处置', value: selected.assignee },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5d6b82]">实时监测中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#172033]">视频墙与视觉分析</h1>
          <p className="mt-2 text-sm text-[#5d6b82]">
            集中查看重点区域画面、巡检队列和当前处置状态。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="inline-flex items-center gap-2 rounded-lg border border-[#172033]/10 bg-white px-4 py-2.5 text-sm font-semibold text-[#172033] transition-colors hover:border-teal-500/40 hover:text-teal-700 disabled:opacity-50"
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

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid gap-3 sm:grid-cols-2">
          {feeds.map((feed) => (
            <CameraCard
              key={feed.id}
              feed={feed}
              active={feed.id === selected.id}
              currentTime={currentTime}
              onClick={() => setSelectedId(feed.id)}
            />
          ))}
        </section>

        <aside className="space-y-4">
          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#172033]">监测概览</h2>
                <p className="mt-1 text-xs text-[#5d6b82]">当前选中画面的摘要</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{feeds.length} 路</span>
            </div>
            <div className="mt-4 grid gap-3">
              {overview.map((item) => (
                <div key={item.label} className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] px-3 py-2.5">
                  <p className="text-xs text-[#5d6b82]">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#172033]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#172033]">实时事件队列</h2>
                <p className="mt-1 text-xs text-[#5d6b82]">当前画面安全巡检状态</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{queue.length} 路</span>
            </div>
            <div className="mt-4 space-y-3">
              {queue.map((item) => (
                <Link key={item.id} href="/events" className="block rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 transition-colors hover:border-emerald-300 hover:bg-white">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-emerald-800">{item.type}</span>
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-medium text-white">在线</span>
                  </div>
                  <p className="mt-1 text-xs text-[#5d6b82]">{item.zone}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-[#5d6b82]">{item.status}</span>
                    <span className="font-mono text-emerald-700">实时更新</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="grid gap-3 rounded-2xl border border-[#172033]/8 bg-white p-4 sm:grid-cols-4">
        {[
          { label: '选中画面', value: selected.code },
          { label: '模型版本', value: selected.modelVersion ?? 'AniCare-Fusion-v2.3.1' },
          { label: '处理耗时', value: selected.processingTimeMs ? `${selected.processingTimeMs} ms` : '待分析' },
          { label: '当前状态', value: selected.cause },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-[#f8fafc] p-3">
            <p className="text-xs text-[#5d6b82]">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-[#172033]">{item.value}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
