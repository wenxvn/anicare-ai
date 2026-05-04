'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ShortTermForecast as ForecastType } from '@/types';
import clsx from 'clsx';

const PRIORITY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  '紧急': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  '高': { bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' },
  '中': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
  '低': { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
};

interface ShortTermForecastProps {
  data: ForecastType;
  className?: string;
}

export function ShortTermForecastCard({ data, className }: ShortTermForecastProps) {
  const is15 = data.horizon === '15min';

  return (
    <div className={clsx('card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:chart-timeline-variant-shimmer" className="text-lg text-teal-600" />
            <p className="text-sm font-semibold text-[#1a1615]">
              未来{is15 ? '15' : '30'}分钟风险预测
            </p>
          </div>
          <p className="mt-1 text-xs text-[#5c524a]">
            基于多模态时序数据的短时风险趋势与高风险区域预判
          </p>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600">
          {data.horizon === '15min' ? '15 分钟窗口' : '30 分钟窗口'}
        </span>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-[#5c524a]">风险趋势曲线</p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trendData}>
              <defs>
                <linearGradient id={`forecastGrad-${data.horizon}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,21,0.06)" />
              <XAxis dataKey="time" stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis domain={[40, 100]} stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: '#fff', borderRadius: 16, border: '1px solid rgba(26,22,21,0.08)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12,
                }}
                formatter={(value: number) => [`${value} 分`, '预测风险']}
              />
              <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: '紧急阈值', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
              <ReferenceLine y={65} stroke="#f97316" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: '高风险阈值', position: 'insideTopRight', fontSize: 10, fill: '#f97316' }} />
              <Area type="monotone" dataKey="score" stroke="#0d9488" fill={`url(#forecastGrad-${data.horizon})`} strokeWidth={2.5} dot={{ r: 3, fill: '#0d9488' }} name="风险分" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-[#5c524a]">
          高风险 TOP {data.highRiskRooms.length} 区域/房间
        </p>
        <div className="space-y-2">
          {data.highRiskRooms.map((room, i) => {
            const ps = PRIORITY_STYLES[room.patrolPriority] || PRIORITY_STYLES['中'];
            return (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3 rounded-2xl border border-[#1a1615]/6 bg-[#faf8f5] p-3.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#1a1615]">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1a1615]">{room.roomName}</span>
                    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', ps.bg, ps.text)}>
                      <span className={clsx('h-1.5 w-1.5 rounded-full', ps.dot)} />
                      {room.patrolPriority}优先
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#5c524a]/70">{room.reasons[0]}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-[#5c524a]/50">{room.currentScore}</span>
                    <Icon icon="mdi:arrow-right-thin" className="text-xs text-[#5c524a]/30" />
                    <span className="text-base font-bold text-[#1a1615]">{room.predictedScore}</span>
                  </div>
                  <p className="text-[10px] text-[#5c524a]/50">预计 {room.triggerTime}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-teal-50/50 p-3">
        <div className="flex items-start gap-2">
          <Icon icon="mdi:lightbulb-on-outline" className="mt-0.5 text-sm text-teal-600" />
          <p className="text-xs leading-relaxed text-teal-800">{data.summary}</p>
        </div>
      </div>
    </div>
  );
}
