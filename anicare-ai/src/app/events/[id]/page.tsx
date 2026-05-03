'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { LiveDecision } from '@/components/decision/live-decision';
import { mockEvents } from '@/lib/mock-data';

export default function EventDetailPage() {
  const params = useParams();
  const event = mockEvents.find((item) => item.id === params.id);

  if (!event) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-dashed border-[#1a1615]/10 p-12 text-center">
        <Icon icon="mdi:file-search-outline" className="mx-auto text-4xl text-[#5c524a]/30" />
        <p className="mt-3 text-sm text-[#5c524a]/60">事件不存在或已被归档</p>
        <Link href="/events" className="mt-4 inline-block rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] hover:border-teal-500/40 hover:text-teal-700">返回事件列表</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title={event.type} description={`事件编号：${event.id}`} />
      <div className="flex items-center gap-3">
        <RiskBadge risk={event.risk} />
        <Link href="/events" className="mt-2 inline-flex items-center gap-1 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] hover:border-teal-500/40 hover:text-teal-700">
          <Icon icon="mdi:arrow-left" className="text-base" />
          返回列表
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-[#1a1615]/8">
            <div className="relative aspect-video">
              <Image src={`https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1280&h=720&fit=crop&seed=${event.id}`} alt={event.type} fill className="object-cover" />
            </div>
          </div>
          <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <p className="text-sm text-[#5c524a]">识别摘要</p>
            <p className="mt-2 text-sm leading-relaxed text-[#5c524a]">{event.summary}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1a1615]">基本信息</p>
              <RiskBadge risk={event.risk} />
            </div>
            <div className="mt-4 space-y-2.5 text-sm text-[#5c524a]">
              <div className="flex justify-between"><span className="text-[#5c524a]/50">处理状态</span><span>{event.status}</span></div>
              <div className="flex justify-between"><span className="text-[#5c524a]/50">处理人</span><span>{event.handler}</span></div>
              <div className="flex justify-between"><span className="text-[#5c524a]/50">摄像头</span><span>{event.camera}</span></div>
              <div className="flex justify-between"><span className="text-[#5c524a]/50">置信度</span><span>{(event.confidence * 100).toFixed(0)}%</span></div>
            </div>
          </div>
          <LiveDecision decision={event.decision} />
        </div>
      </div>
    </div>
  );
}
