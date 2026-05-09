'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { fetchJson } from '@/lib/api-client';
import { AreaChart, BarChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { DashboardStats, PredictionOverview } from '@/types';
import { mockPredictionOverview } from '@/lib/mock-prediction';

const fallbackStats: DashboardStats = {
  todayEvents: 12,
  retainedCritical: 3,
  handledRate: 92,
  avgResponseMinutes: 4,
  weeklyCriticalTrend: [
    { day: '周一', value: 5 }, { day: '周二', value: 8 }, { day: '周三', value: 3 },
    { day: '周四', value: 6 }, { day: '周五', value: 4 }, { day: '周六', value: 7 }, { day: '周日', value: 12 },
  ],
  riskTypeDistribution: [
    { name: '摔倒', value: 4 }, { name: '离床未归', value: 3 }, { name: '烟火异常', value: 2 },
    { name: '久卧未动', value: 2 }, { name: '异常滞留', value: 1 },
  ],
  zoneHotspots: [
    { zone: 'A区走廊', score: 92 }, { zone: 'B区卫生间', score: 85 }, { zone: 'C区休息室', score: 78 },
    { zone: 'D区楼梯', score: 65 }, { zone: 'E区花园', score: 48 },
  ],
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(fallbackStats);
  const [prediction, setPrediction] = useState<PredictionOverview>(mockPredictionOverview);

  useEffect(() => {
    fetchJson<DashboardStats>('/api/dashboard').then(setStats).catch(() => {});
    fetchJson<PredictionOverview>('/api/prediction').then(setPrediction).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="数据看板" description="实时监控今日关键指标，帮护理员看清全局。" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="今日事件总数" value={stats.todayEvents} icon={<Icon icon="mdi:alert-octagon-outline" className="text-xl" />} helper="自动检测并归类的风险事件" />
        <StatCard label="待处理高危事件" value={stats.retainedCritical} icon={<Icon icon="mdi:alert-circle-outline" className="text-xl" />} helper="已标注紧急且尚未处理的事件" />
        <StatCard label="已处理率" value={`${stats.handledRate}%`} icon={<Icon icon="mdi:check-circle-outline" className="text-xl" />} helper="今天发生的所有事件中已处理的比例" />
        <StatCard label="平均响应时长" value={`${stats.avgResponseMinutes} 分钟`} icon={<Icon icon="mdi:clock-fast" className="text-xl" />} helper="系统从识别到通知护理员的平均时间" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
          <p className="text-sm font-semibold text-[#1a1615]">高风险事件趋势</p>
          <p className="mt-1 text-xs text-[#5c524a]">过去一周，系统每天筛出的高风险事件数量</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyCriticalTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,21,0.06)" />
                <XAxis dataKey="day" stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(26,22,21,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="value" stroke="#0d9488" fill="#0d948822" strokeWidth={2} name="高风险事件" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
          <p className="text-sm font-semibold text-[#1a1615]">风险类型分布</p>
          <p className="mt-1 text-xs text-[#5c524a]">今天检测到的各类风险事件数量</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.riskTypeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,21,0.06)" />
                <XAxis dataKey="name" stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(26,22,21,0.08)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="value" fill="#0d9488" radius={[12, 12, 0, 0]} name="事件数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
        <p className="text-sm font-semibold text-[#1a1615]">不同区域风险热度排名</p>
        <p className="mt-1 text-xs text-[#5c524a]">热度越高，说明该区域发生风险事件越频繁，需要重点关注</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-5">
          {stats.zoneHotspots.map((item, index) => (
            <div key={item.zone} className="rounded-2xl border border-[#1a1615]/8 bg-[#f8f5f0] p-4">
              <p className="text-xs text-[#5c524a]/50">第 {index + 1} 名</p>
              <p className="mt-2 text-base font-semibold text-[#1a1615]">{item.zone}</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#f0ece5]">
                <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${item.score}%` }} />
              </div>
              <p className="mt-1 text-xs text-teal-600">热度 {item.score}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:shield-check-outline" className="text-lg text-teal-600" />
              <p className="text-sm font-semibold text-[#1a1615]">今日安全巡检概况</p>
            </div>
            <p className="mt-1 text-xs text-[#5c524a]">系统综合摄像头、床垫、门磁和毫米波设备给出的值班判断</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">运行正常</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {prediction.fusionRisk.modalities.map((m, i) => (
            <motion.div
              key={m.type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl bg-[#faf8f5] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#5c524a]">{m.label}</span>
                <span className="flex items-center gap-1 text-[10px]">
                  <span className={`h-1.5 w-1.5 rounded-full ${m.online ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  <span className={m.online ? 'text-emerald-600' : 'text-gray-400'}>{m.online ? '在线' : '离线'}</span>
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-[#1a1615]">{m.score}<span className="text-xs font-normal text-[#5c524a]/50"> 分</span></p>
              <p className="mt-1 truncate text-[11px] text-[#5c524a]/60">{m.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Icon icon="mdi:map-search-outline" className="text-lg text-teal-600" />
              <p className="text-sm font-semibold text-[#1a1615]">下一轮重点巡查建议</p>
            </div>
            <p className="mt-1 text-xs text-[#5c524a]">根据近期事件、老人画像和设备状态自动生成</p>
          </div>
          <span className="rounded-xl bg-teal-500/10 px-4 py-2 text-xs font-medium text-teal-700">已同步到值班任务</span>
        </div>
        <div className="mt-4 space-y-2">
          {prediction.forecast30min.highRiskRooms.slice(0, 3).map((room, i) => (
            <motion.div
              key={room.roomId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-2xl bg-[#faf8f5] px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#1a1615]">{i + 1}</div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-[#1a1615]">{room.roomName}</span>
                <p className="truncate text-xs text-[#5c524a]/70">{room.reasons[0]}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-[#1a1615]">{room.predictedScore}</span>
                <p className="text-[10px] text-[#5c524a]/50">预计 {room.triggerTime}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
