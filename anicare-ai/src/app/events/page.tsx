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
  const pendingCount = mockEvents.filter((event) => event.status !== '已处理').length;
  const handledCount = mockEvents.filter((event) => event.status === '已处理').length;
  const highRiskCount = mockEvents.filter((event) => event.risk === '紧急' || event.risk === '高风险').length;

  return (
    <div className="space-y-8">
      <SectionHeader title="事件管理" description="按识别、研判、派单、处置、归档的闭环管理风险事件。" />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: '事件总数', value: mockEvents.length, icon: 'mdi:archive-clock-outline', tone: 'text-[#172033]' },
          { label: '待跟进', value: pendingCount, icon: 'mdi:timer-sand', tone: 'text-orange-600' },
          { label: '高风险', value: highRiskCount, icon: 'mdi:alert-circle-outline', tone: 'text-red-600' },
          { label: '已归档', value: handledCount, icon: 'mdi:check-circle-outline', tone: 'text-emerald-700' },
        ].map((item) => (
          <div key={item.label} className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5d6b82]">{item.label}</span>
              <Icon icon={item.icon} className={`text-lg ${item.tone}`} />
            </div>
            <p className={`mt-2 text-2xl font-bold ${item.tone}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#5d6b82]/50 mr-1">状态：</span>
          {statusOptions.map((item) => (
            <button key={item} onClick={() => setStatus(item)} className={`rounded-2xl border px-3 py-1.5 text-xs transition-colors ${status === item ? 'border-teal-500/30 bg-teal-500/10 text-teal-700' : 'border-[#172033]/8 text-[#5d6b82] hover:border-[#172033]/15'}`}>
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="self-center text-xs text-[#5d6b82]/50 mr-1">等级：</span>
          {riskOptions.map((item) => (
            <button key={item} onClick={() => setRisk(item)} className={`rounded-2xl border px-3 py-1.5 text-xs transition-colors ${risk === item ? 'border-teal-500/30 bg-teal-500/10 text-teal-700' : 'border-[#172033]/8 text-[#5d6b82] hover:border-[#172033]/15'}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((event) => (
          <div key={event.id} className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5 transition-colors hover:border-teal-500/25">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-teal-500/10 p-2 text-teal-600">
                  <Icon icon="mdi:alert-octagon-outline" className="text-xl" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#172033]">{event.type}</p>
                  <p className="text-xs text-[#5d6b82]/50">{event.id}</p>
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
            <p className="mt-3 text-sm text-[#5d6b82] leading-relaxed">{event.summary}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              <div className="rounded-2xl bg-[#f5f7fb] px-3 py-2">
                <p className="text-[11px] text-[#5d6b82]/50">研判依据</p>
                <p className="mt-1 truncate text-xs font-medium text-[#172033]">{event.decision?.cause ?? '视觉识别与护理规则联合判断'}</p>
              </div>
              <div className="rounded-2xl bg-[#f5f7fb] px-3 py-2">
                <p className="text-[11px] text-[#5d6b82]/50">建议动作</p>
                <p className="mt-1 truncate text-xs font-medium text-[#172033]">{event.decision?.suggestion ?? '安排护理员复核现场'}</p>
              </div>
              <div className="rounded-2xl bg-[#f5f7fb] px-3 py-2">
                <p className="text-[11px] text-[#5d6b82]/50">闭环状态</p>
                <p className="mt-1 text-xs font-medium text-[#172033]">识别 → 研判 → 派单 → 归档</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5d6b82]/50">
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1"><Icon icon="mdi:map-marker-outline" className="text-sm" />{event.zone}</span>
                <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" className="text-sm" />{event.time}</span>
                <span className="flex items-center gap-1"><Icon icon="mdi:account-outline" className="text-sm" />{event.handler}</span>
                <span>置信度 {(event.confidence * 100).toFixed(0)}%</span>
              </div>
              <Link href={`/events/${event.id}`} className="inline-flex items-center gap-1 rounded-xl border border-[#172033]/10 px-3 py-1.5 text-[#5d6b82] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                查看详情
                <Icon icon="mdi:arrow-right" className="text-sm" />
              </Link>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-[#172033]/10 p-12 text-center">
            <Icon icon="mdi:inbox-outline" className="mx-auto text-4xl text-[#5d6b82]/30" />
            <p className="mt-3 text-sm text-[#5d6b82]/50">当前筛选条件下没有事件</p>
          </div>
        )}
      </div>
    </div>
  );
}
