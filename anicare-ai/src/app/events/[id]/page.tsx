'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { LiveDecision } from '@/components/decision/live-decision';
import { mockEvents } from '@/lib/mock-data';
import { Icon } from '@iconify/react';

export default function EventDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const event = mockEvents.find((item) => item.id === id);

  if (!event) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-white/10 p-12 text-center">
        <Icon icon="mdi:file-search-outline" className="mx-auto text-4xl text-warm-100/30" />
        <p className="mt-3 text-sm text-warm-100/60">事件不存在或已被归档</p>
        <Link href="/events" className="mt-4 inline-block rounded-2xl border border-white/10 px-4 py-2 text-sm text-warm-100/80 hover:border-orange-500/30 hover:text-orange-200">返回事件列表</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader title={event.type} description={`事件编号：${event.id}｜区域：${event.zone}｜时间：${event.time}`} />
        <Link href="/events" className="mt-2 inline-flex items-center gap-1 rounded-2xl border border-white/10 px-4 py-2 text-sm text-warm-100/70 hover:border-orange-500/30 hover:text-orange-200">
          <Icon icon="mdi:arrow-left" className="text-sm" />
          返回列表
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/5">
            <div className="relative aspect-video">
              <Image src={`https://picsum.photos/seed/${event.id}/1280/720`} alt={event.type} fill className="object-cover" />
            </div>
          </div>
          <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
            <p className="text-sm text-warm-100/50">识别摘要</p>
            <p className="mt-2 text-sm leading-relaxed text-warm-100/80">{event.summary}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-warm-50">基本信息</p>
              <RiskBadge risk={event.risk} />
            </div>
            <div className="mt-4 space-y-2.5 text-sm text-warm-100/70">
              <div className="flex justify-between"><span className="text-warm-100/50">处理状态</span><span>{event.status}</span></div>
              <div className="flex justify-between"><span className="text-warm-100/50">处理人</span><span>{event.handler}</span></div>
              <div className="flex justify-between"><span className="text-warm-100/50">摄像头</span><span>{event.camera}</span></div>
              <div className="flex justify-between"><span className="text-warm-100/50">置信度</span><span>{(event.confidence * 100).toFixed(0)}%</span></div>
            </div>
          </div>
          <LiveDecision decision={event.decision} />
        </div>
      </div>
    </div>
  );
}
