'use client';

import { useEffect, useState } from 'react';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { Icon } from '@iconify/react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardStats } from '@/types';
import { fetchJson } from '@/lib/api-client';
import { mockDashboard } from '@/lib/mock-data';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(mockDashboard);

  useEffect(() => {
    fetchJson<DashboardStats>('/api/dashboard')
      .then(setStats)
      .catch(() => setStats(mockDashboard));
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="数据看板" description="今天系统替护理员筛掉了 126 条普通画面，只留下 7 条值得立刻看的风险事件。" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="今日事件总数" value={stats.todayEvents} helper="已过滤普通画面 126 条" icon={<Icon icon="mdi:counter" className="text-xl" />} />
        <StatCard label="高风险事件" value={stats.retainedCritical} helper="系统优先展示最危险的 7 条" icon={<Icon icon="mdi:alert-octagon-outline" className="text-xl" />} />
        <StatCard label="已处理率" value={stats.handledRate + '%'} helper="已处理 112 / 133" icon={<Icon icon="mdi:check-decagram-outline" className="text-xl" />} />
        <StatCard label="平均响应时间" value={stats.avgResponseMinutes + ' 分钟'} helper="比人工回放快 6.2 倍" icon={<Icon icon="mdi:timer-outline" className="text-xl" />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
          <p className="text-sm font-semibold text-warm-50">高风险事件趋势</p>
          <p className="mt-1 text-xs text-warm-100/50">过去一周，系统每天筛出的高风险事件数量</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyCriticalTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(245,241,235,0.4)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(245,241,235,0.4)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#16181d', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }} />
                <Area type="monotone" dataKey="value" stroke="#e07d3c" fill="#e07d3c22" strokeWidth={2} name="高风险事件" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
          <p className="text-sm font-semibold text-warm-50">风险类型分布</p>
          <p className="mt-1 text-xs text-warm-100/50">今天检测到的各类风险事件数量</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.riskTypeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(245,241,235,0.4)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="rgba(245,241,235,0.4)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#16181d', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }} />
                <Bar dataKey="value" fill="#d6a243" radius={[12, 12, 0, 0]} name="事件数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
        <p className="text-sm font-semibold text-warm-50">不同区域风险热度排名</p>
        <p className="mt-1 text-xs text-warm-100/50">热度越高，说明该区域发生风险事件越频繁，需要重点关注</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {stats.zoneHotspots.map((item, index) => (
            <div key={item.zone} className="rounded-2xl border border-white/5 bg-surface-900/60 p-4">
              <p className="text-xs text-warm-100/50">第 {index + 1} 名</p>
              <p className="mt-2 text-base font-semibold text-warm-50">{item.zone}</p>
              <div className="mt-2 h-1.5 rounded-full bg-surface-900">
                <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${item.score}%` }} />
              </div>
              <p className="mt-1 text-xs text-orange-300">热度 {item.score}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
