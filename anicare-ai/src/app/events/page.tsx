'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { mockEvents } from '@/lib/mock-data';

const statusOptions = ['全部', '待处理', '已通知', '观察中', '已处理'];
const riskOptions = ['全部', '紧急', '高风险', '中风险', '低风险'];

export default function EventsPage() {
  const [status, setStatus] = useState('全部');
  const [risk, setRisk] = useState('全部');

  const filtered = mockEvents.filter((event) => {
    if (status !== '全部' && event.status !== status) return false;
    if (risk !== '全部' && event.risk !== risk) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <SectionHeader title="事件管理" description="系统自动识别并归类所有风险事件，支持按处理状态和风险等级双维度筛选。" />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#5c524a]/50 mr-1">状态：</span>
          {statusOptions.map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={`rounded-2xl border px-3 py-1.5 text-xs transition-colors ${status === item ? 'border-teal-500/30 bg-teal-500/10 text-teal-700' : 'border-[#1a1615]/8 text-[#5c524a] hover:border-[#1a1615]/15'}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#5c524a]/50 mr-1">等级：</span>
          {riskOptions.map((item) => (
            <button key={item} onClick={() => setRisk(item)} className={`rounded-2xl border px-3 py-1.5 text-xs transition-colors ${risk === item ? 'border-teal-500/30 bg-teal-500/10 text-teal-700' : 'border-[#1a1615]/8 text-[#5c524a] hover:border-[#1a1615]/15'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((event) => (
          <div key={event.id} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5 transition-colors hover:border-teal-500/25">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-teal-500/10 p-2 text-teal-600">
                  <Icon icon="mdi:alert-octagon-outline" className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1a1615]">{event.type}</p>
                  <p className="text-xs text-[#5c524a]/50">{event.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  event.status === '待处理' ? 'bg-red-50 text-red-600 border border-red-200' :
                  event.status === '已通知' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                  event.status === '观察中' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>{event.status}</span>
                <RiskBadge risk={event.risk} />
              </div>
            </div>
            <p className="mt-3 text-sm text-[#5c524a] leading-relaxed">{event.summary}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5c524a]/50">
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1"><Icon icon="mdi:map-marker-outline" className="text-sm" />{event.zone}</span>
                <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" className="text-sm" />{event.time}</span>
                <span className="flex items-center gap-1"><Icon icon="mdi:account-outline" className="text-sm" />{event.handler}</span>
                <span>置信度 {(event.confidence * 100).toFixed(0)}%</span>
              </div>
              <Link href={`/events/${event.id}`} className="inline-flex items-center gap-1 rounded-xl border border-[#1a1615]/10 px-3 py-1.5 text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                查看详情
                <Icon icon="mdi:arrow-right" className="text-sm" />
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-[#1a1615]/10 p-12 text-center">
            <Icon icon="mdi:inbox-outline" className="mx-auto text-4xl text-[#5c524a]/30" />
            <p className="mt-3 text-sm text-[#5c524a]/50">当前筛选条件下没有事件</p>
          </div>
        )}
      </div>
    </div>
  );
}
