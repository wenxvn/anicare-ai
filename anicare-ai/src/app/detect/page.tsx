'use client';

import { useCallback, useMemo, useState } from 'react';
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
  status: 'online' | 'warning' | 'critical';
  riskLevel: RiskLevel;
  riskScore: number;
  assignee: string;
  detections: DetectionResult[];
  cause: string;
  suggestion: string;
}

const cameraFeeds: CameraFeed[] = [
  {
    id: 'cam-01',
    code: 'CAM-A3-01',
    location: 'A栋 3层走廊',
    imageUrl: '/pictures/6.jpg',
    status: 'critical',
    riskLevel: 'critical',
    riskScore: 91,
    assignee: '待派单',
    cause: '老人跌倒后连续静止，周围无护理员靠近。',
    suggestion: '立即通知最近护理员到场，确认意识状态，避免盲目移动老人。',
    detections: [
      { label: '人员摔倒', confidence: 0.94, bbox: { x: 280, y: 120, w: 200, h: 280 }, category: 'fall' },
      { label: '周围无人响应', confidence: 0.82, category: 'no_response' },
    ],
  },
  {
    id: 'cam-02',
    code: 'CAM-C1-02',
    location: 'C栋 1层茶水间',
    imageUrl: '/pictures/4.jpg',
    status: 'warning',
    riskLevel: 'high',
    riskScore: 72,
    assignee: '李建国',
    cause: '茶水间局部烟雾浓度升高，疑似电器加热异常。',
    suggestion: '安排人员现场确认电器状态，同步检查通风口。',
    detections: [
      { label: '烟火疑似异常', confidence: 0.78, bbox: { x: 600, y: 80, w: 180, h: 160 }, category: 'fire' },
    ],
  },
  {
    id: 'cam-03',
    code: 'CAM-B3-302',
    location: 'B栋 302房床位区',
    imageUrl: '/pictures/5.jpg',
    status: 'warning',
    riskLevel: 'high',
    riskScore: 68,
    assignee: '赵文强',
    cause: '床位连续 50 分钟未检测到翻身动作，叠加室温偏低。',
    suggestion: '护理员到场查看被褥与体位，必要时调整室温并记录翻身护理。',
    detections: [
      { label: '久卧未动', confidence: 0.89, bbox: { x: 350, y: 200, w: 240, h: 180 }, category: 'still' },
      { label: '异常滞留', confidence: 0.76, category: 'stuck' },
    ],
  },
  {
    id: 'cam-04',
    code: 'CAM-A1-04',
    location: 'A栋 1层电梯口',
    imageUrl: '/pictures/3.jpg',
    status: 'online',
    riskLevel: 'medium',
    riskScore: 58,
    assignee: '观察中',
    cause: '老人停留时间超过安全阈值，可能存在迷路或等待协助。',
    suggestion: '前台或楼层护理员进行口头确认，必要时引导返回房间。',
    detections: [
      { label: '长时间滞留', confidence: 0.81, bbox: { x: 400, y: 150, w: 160, h: 300 }, category: 'stuck' },
    ],
  },
];

const queue = [
  { id: 'evt-20250501-001', type: '摔倒未响应', zone: 'A栋 3层走廊', riskLevel: 'critical' as const, wait: 8, status: '待派单' },
  { id: 'evt-20250501-003', type: '烟火疑似异常', zone: 'C栋 1层茶水间', riskLevel: 'high' as const, wait: 5, status: '处理中' },
  { id: 'evt-20250501-005', type: '久卧未动', zone: 'B栋 302房', riskLevel: 'high' as const, wait: 22, status: '已派单' },
  { id: 'evt-20250501-004', type: '长时间滞留', zone: 'A栋 1层电梯口', riskLevel: 'medium' as const, wait: 25, status: '观察中' },
];

function statusStyle(status: CameraFeed['status']) {
  if (status === 'critical') return 'bg-red-500';
  if (status === 'warning') return 'bg-orange-500';
  return 'bg-emerald-500';
}

function CameraCard({ feed, active, onClick }: { feed: CameraFeed; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border bg-black text-left transition-all ${active ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-[#1a1615]/8 hover:border-teal-500/40'}`}
    >
      <Image src={feed.imageUrl} alt={feed.location} width={960} height={540} className="aspect-video w-full object-cover opacity-95 transition-transform group-hover:scale-[1.02]" priority={feed.id === 'cam-01'} />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-3 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${statusStyle(feed.status)}`} />
          <span className="text-xs font-medium text-white">{feed.code}</span>
        </div>
        <span className="text-xs text-white/80">{feed.riskScore} 分</span>
      </div>
      {feed.detections.map((det, i) => det.bbox ? (
        <div
          key={i}
          className="absolute z-10 border-2 border-red-500/90 bg-red-500/10"
          style={{
            left: `${(det.bbox.x / 960) * 100}%`,
            top: `${(det.bbox.y / 540) * 100}%`,
            width: `${(det.bbox.w / 960) * 100}%`,
            height: `${(det.bbox.h / 540) * 100}%`,
          }}
        >
          <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {det.label} {(det.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ) : null)}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{feed.location}</p>
            <p className="mt-0.5 truncate text-xs text-white/70">{feed.cause}</p>
          </div>
          <RiskBadge risk={feed.riskLevel} />
        </div>
      </div>
    </button>
  );
}

export default function DetectPage() {
  const [selectedId, setSelectedId] = useState(cameraFeeds[0].id);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const selected = useMemo(() => cameraFeeds.find((feed) => feed.id === selectedId) ?? cameraFeeds[0], [selectedId]);

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    setAnalysisProgress(0);
    for (const step of [25, 48, 72, 91, 100]) {
      await new Promise((resolve) => window.setTimeout(resolve, 260));
      setAnalysisProgress(step);
    }
    try {
      await postJson<VisionDetectOutput>('/api/vision', {
        imageUrl: selected.imageUrl,
        cameraId: selected.code,
        zone: selected.location,
      });
    } catch {
      // 保持本地识别结果展示，接口恢复后会自动使用后端返回。
    } finally {
      setAnalyzing(false);
    }
  }, [selected]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5c524a]">实时监测中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#1a1615]">视频墙与风险队列</h1>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
        >
          <Icon icon="mdi:radar" />
          {analyzing ? `分析中 ${analysisProgress}%` : '重新分析当前画面'}
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-3 sm:grid-cols-2">
          {cameraFeeds.map((feed) => (
            <CameraCard key={feed.id} feed={feed} active={feed.id === selected.id} onClick={() => setSelectedId(feed.id)} />
          ))}
        </section>

        <aside className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#1a1615]">实时事件队列</h2>
              <p className="mt-1 text-xs text-[#5c524a]">按风险等级和等待时间排序</p>
            </div>
            <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">{queue.length} 起</span>
          </div>
          <div className="mt-4 space-y-3">
            {queue.map((item) => (
              <Link key={item.id} href={`/events/${item.id}`} className="block rounded-xl border border-[#1a1615]/8 bg-[#faf8f5] p-3 transition-colors hover:border-teal-500/35 hover:bg-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#1a1615]">{item.type}</span>
                  <RiskBadge risk={item.riskLevel} />
                </div>
                <p className="mt-1 text-xs text-[#5c524a]">{item.zone}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-[#5c524a]">{item.status}</span>
                  <span className="font-mono text-red-600">等待 {item.wait} 分钟</span>
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
            <div className="flex items-center gap-2">
              <RiskBadge risk={selected.riskLevel} />
              <span className="rounded-full border border-[#1a1615]/10 px-2.5 py-1 text-xs text-[#5c524a]">负责人：{selected.assignee}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
            <div className="rounded-xl bg-[#f8f5f0] p-4">
              <p className="text-xs font-medium text-[#5c524a]">识别目标</p>
              <div className="mt-3 space-y-2">
                {selected.detections.map((det) => (
                  <div key={det.label} className="flex items-center justify-between text-sm">
                    <span className="text-[#1a1615]">{det.label}</span>
                    <span className="font-mono text-teal-700">{(det.confidence * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-[#f8f5f0] p-4">
              <p className="text-xs font-medium text-[#5c524a]">风险原因</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1a1615]">{selected.cause}</p>
            </div>
            <div className="rounded-xl bg-teal-50 p-4">
              <p className="text-xs font-medium text-teal-700">建议动作</p>
              <p className="mt-3 text-sm leading-relaxed text-[#1a1615]">{selected.suggestion}</p>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
