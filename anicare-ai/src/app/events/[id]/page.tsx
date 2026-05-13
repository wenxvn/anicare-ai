'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
import { LiveDecision } from '@/components/decision/live-decision';
import { mockEvents } from '@/lib/mock-data';
import { mockElderHealthData } from '@/lib/mock-health';
import type { RiskLevel } from '@/types';

const eventHealthMap: Record<string, string> = {
  'evt-20250501-001': 'health-001',
  'evt-20250501-002': 'health-003',
  'evt-20250501-004': 'health-004',
  'evt-20250501-005': 'health-002',
  'evt-20250501-006': 'health-006',
  'evt-20250501-007': 'health-007',
  'evt-20250501-008': 'health-005',
};

const fallbackImages = ['/pictures/6.jpg', '/pictures/7.jpg', '/pictures/4.jpg', '/pictures/5.jpg'];

function imageFor(eventId: string) {
  const index = Math.abs(eventId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % fallbackImages.length;
  return fallbackImages[index];
}

function statusTone(done: boolean, active?: boolean) {
  if (done) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (active) return 'border-teal-200 bg-teal-50 text-teal-700';
  return 'border-[#172033]/10 bg-[#f5f7fb] text-[#5d6b82]';
}

export default function EventDetailPage() {
  const params = useParams();
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
  const event = mockEvents.find((item) => item.id === eventId);

  if (!event) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border-2 border-dashed border-[#172033]/10 bg-white p-12 text-center">
        <Icon icon="mdi:file-search-outline" className="mx-auto text-4xl text-[#5d6b82]/30" />
        <p className="mt-3 text-sm text-[#5d6b82]/60">事件不存在或已被归档。</p>
        <Link href="/events" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#172033]/10 px-4 py-2 text-sm text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700">
          <Icon icon="mdi:arrow-left" />
          返回事件列表
        </Link>
      </div>
    );
  }

  const healthData = mockElderHealthData.find((item) => item.id === eventHealthMap[event.id]);
  const closed = event.status.includes('已处理') || event.status.includes('已完成');
  const dispatched = closed || event.status.includes('已通知') || event.status.includes('处理中') || event.status.includes('观察');
  const arrived = closed || event.status.includes('处理中') || event.status.includes('观察');

  const timeline = [
    { title: 'AI识别', note: `${event.camera} 捕获异常画面，置信度 ${(event.confidence * 100).toFixed(0)}%`, done: true },
    { title: '风险研判', note: `综合评分 ${event.decision.riskScore}，判定为 ${event.risk}`, done: true },
    { title: '派单通知', note: event.handler ? `已通知 ${event.handler}` : '等待值班主管派单', done: dispatched, active: !dispatched },
    { title: '护理员到场', note: arrived ? '护理员已反馈现场状态' : '等待到场确认', done: arrived, active: dispatched && !arrived },
    { title: '处置记录', note: closed ? '已填写处置记录和护理建议' : '待补充现场处置备注', done: closed, active: arrived && !closed },
    { title: '归档', note: closed ? '事件已归档，可用于复盘统计' : '完成后自动进入事件归档', done: closed },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/events" className="mb-3 inline-flex items-center gap-1 text-xs text-[#5d6b82] hover:text-teal-700">
            <Icon icon="mdi:arrow-left" />
            返回事件列表
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-[#172033]">{event.type}</h1>
            <RiskBadge risk={event.riskLevel as RiskLevel} />
          </div>
          <p className="mt-2 text-sm text-[#5d6b82]">事件编号 {event.id} · {event.zone}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dispatch" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-500">
            <Icon icon="mdi:account-arrow-right-outline" />
            派单
          </Link>
          <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
            <Icon icon="mdi:arrow-up-bold-hexagon-outline" />
            升级
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#172033]/10 bg-white px-4 py-2 text-sm text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700">
            <Icon icon="mdi:check-circle-outline" />
            完成归档
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.85fr]">
        <section className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-[#172033]/8 bg-white">
            <div className="relative aspect-video">
              <Image src={imageFor(event.id)} alt={event.type} fill className="object-cover" priority />
              <div className="absolute left-3 top-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-medium text-white">
                {event.camera} · {event.zone}
              </div>
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs text-white">
                识别置信度 {(event.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:timeline-check-outline" className="text-lg text-teal-600" />
              <h2 className="text-base font-semibold text-[#172033]">处置闭环时间线</h2>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-6">
              {timeline.map((step, index) => (
                <div key={step.title} className={`rounded-xl border p-3 ${statusTone(step.done, step.active)}`}>
                  <div className="flex items-center justify-between">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold">{index + 1}</span>
                    <Icon icon={step.done ? 'mdi:check-circle' : step.active ? 'mdi:progress-clock' : 'mdi:circle-outline'} className="text-base" />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed opacity-80">{step.note}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <h2 className="text-base font-semibold text-[#172033]">识别摘要</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5d6b82]">{event.summary}</p>
            {event.detections?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {event.detections.map((det) => (
                  <div key={det.label} className="rounded-xl bg-[#f5f7fb] p-3">
                    <p className="text-sm font-medium text-[#172033]">{det.label}</p>
                    <p className="mt-1 font-mono text-xs text-teal-700">{(det.confidence * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </section>

        <aside className="space-y-5">
          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#172033]">基本信息</h2>
              <RiskBadge risk={event.riskLevel as RiskLevel} />
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3"><span className="text-[#5d6b82]">处理状态</span><span className="font-medium text-[#172033]">{event.status}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[#5d6b82]">负责人</span><span className="font-medium text-[#172033]">{event.handler}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[#5d6b82]">发生时间</span><span className="text-right font-medium text-[#172033]">{event.time}</span></div>
              <div className="flex justify-between gap-3"><span className="text-[#5d6b82]">摄像头</span><span className="font-medium text-[#172033]">{event.camera}</span></div>
            </div>
          </section>

          <LiveDecision decision={event.decision} />

          {healthData && (
            <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:heart-pulse" className="text-lg text-teal-600" />
                <h2 className="text-base font-semibold text-[#172033]">关联健康状态</h2>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#f5f7fb] p-3">
                  <p className="text-xs text-[#5d6b82]">身体健康</p>
                  <p className="mt-1 text-2xl font-semibold text-[#172033]">{healthData.bodyHealthScore}</p>
                  <p className="mt-1 text-xs text-[#5d6b82]">{healthData.bodyRiskLevel}</p>
                </div>
                <div className="rounded-xl bg-[#f5f7fb] p-3">
                  <p className="text-xs text-[#5d6b82]">心理健康</p>
                  <p className="mt-1 text-2xl font-semibold text-[#172033]">{healthData.mentalHealthScore}</p>
                  <p className="mt-1 text-xs text-[#5d6b82]">{healthData.mentalRiskLevel}</p>
                </div>
              </div>
              <p className="mt-4 rounded-xl bg-teal-50 px-3 py-2 text-sm leading-relaxed text-teal-800">
                {healthData.suggestions.caregiver}
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
