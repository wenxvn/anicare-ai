'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { mockEvents } from '@/lib/mock-data';

const riskOrder: Record<string, number> = { '紧急': 1, '高风险': 2, '中风险': 3, '低风险': 4 };

const statusOptions = ['全部', '待处理', '已通知', '观察中', '已处理'];
const riskOptions = ['全部', '紧急', '高风险', '中风险', '低风险'];

export default function EventsPage() {
  const [status, setStatus] = useState('全部');
  const [risk, setRisk] = useState('全部');

  const filtered = useMemo(() => {
    return mockEvents
      .filter((item) => (status === '全部' ? true : item.status === status))
      .filter((item) => (risk === '全部' ? true : item.risk === risk))
      .sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
  }, [status, risk]);

  return (
    <div className="space-y-8">
      <SectionHeader title="事件管理" description="系统不会把所有画面都丢给你。它先把最危险的事挑出来，再按紧急程度排序。" />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-warm-100/50 mr-1">状态：</span>
          {statusOptions.map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={`rounded-2xl border px-3 py-1.5 text-xs transition-colors ${status === item ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' : 'border-white/5 text-warm-100/70 hover:border-white/10'}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-warm-100/50 mr-1">等级：</span>
          {riskOptions.map((item) => (
            <button key={item} onClick={() => setRisk(item)} className={`rounded-2xl border px-3 py-1.5 text-xs transition-colors ${risk === item ? 'border-orange-500/30 bg-orange-500/10 text-orange-200' : 'border-white/5 text-warm-100/70 hover:border-white/10'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((event) => (
          <div key={event.id} className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 transition-colors hover:border-orange-500/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-500/10 p-2 text-orange-300">
                  <Icon icon="mdi:alert-octagon-outline" className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-warm-50">{event.type}</p>
                  <p className="text-xs text-warm-100/50">{event.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  event.status === '待处理' ? 'bg-red-500/15 text-red-300 border border-red-500/20' :
                  event.status === '已通知' ? 'bg-orange-500/15 text-orange-300 border border-orange-500/20' :
                  event.status === '观察中' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20' :
                  'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                }`}>{event.status}</span>
                <RiskBadge risk={event.risk} />
              </div>
            </div>
            <p className="mt-3 text-sm text-warm-100/70 leading-relaxed">{event.summary}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-warm-100/50">
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1"><Icon icon="mdi:map-marker-outline" className="text-sm" />{event.zone}</span>
                <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" className="text-sm" />{event.time}</span>
                <span className="flex items-center gap-1"><Icon icon="mdi:account-outline" className="text-sm" />{event.handler}</span>
                <span>置信度 {(event.confidence * 100).toFixed(0)}%</span>
              </div>
              <Link href={`/events/${event.id}`} className="inline-flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-warm-100/80 transition-colors hover:border-orange-500/30 hover:text-orange-200">
                查看详情
                <Icon icon="mdi:arrow-right" className="text-sm" />
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
            <Icon icon="mdi:inbox-outline" className="mx-auto text-4xl text-warm-100/30" />
            <p className="mt-3 text-sm text-warm-100/50">当前筛选条件下没有事件</p>
          </div>
        )}
      </div>
    </div>
  );
}
