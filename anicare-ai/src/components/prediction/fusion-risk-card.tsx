'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { FusionRiskData, ModalityStatus } from '@/types';
import { RISK_LEVEL_LABEL } from '@/types';
import clsx from 'clsx';

const MODALITY_ICONS: Record<string, string> = {
  vision: 'mdi:cctv',
  bed_pressure: 'mdi:bed-outline',
  door_sensor: 'mdi:door-sliding-open',
  mmwave: 'mdi:radar',
};

const RISK_RING_COLORS: Record<string, { stroke: string; bg: string; glow: string }> = {
  low: { stroke: '#10b981', bg: 'from-emerald-50 to-emerald-100/50', glow: 'shadow-emerald-200/40' },
  medium: { stroke: '#f59e0b', bg: 'from-amber-50 to-amber-100/50', glow: 'shadow-amber-200/40' },
  high: { stroke: '#f97316', bg: 'from-orange-50 to-orange-100/50', glow: 'shadow-orange-200/40' },
  critical: { stroke: '#ef4444', bg: 'from-red-50 to-red-100/50', glow: 'shadow-red-200/40' },
};

function RiskRing({ score, riskLevel }: { score: number; riskLevel: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = RISK_RING_COLORS[riskLevel] || RISK_RING_COLORS.low;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="132" height="132" className="-rotate-90">
        <circle cx="66" cy="66" r={radius} fill="none" stroke="rgba(23,32,51,0.06)" strokeWidth="10" />
        <motion.circle
          cx="66" cy="66" r={radius} fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold text-[#172033]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-[#5d6b82]">风险总分</span>
      </div>
    </div>
  );
}

function ModalityRow({ modality, index }: { modality: ModalityStatus; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
      className="flex items-center gap-3 rounded-2xl border border-[#172033]/6 bg-[#f8fafc] px-4 py-3"
    >
      <div className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-xl',
        modality.online ? 'bg-teal-500/10 text-teal-600' : 'bg-gray-100 text-gray-400'
      )}>
        <Icon icon={MODALITY_ICONS[modality.type] || 'mdi:chip'} className="text-lg" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#172033]">{modality.label}</span>
          <span className={clsx(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
            modality.online ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
          )}>
            <span className={clsx('h-1.5 w-1.5 rounded-full', modality.online ? 'bg-emerald-500' : 'bg-gray-400')} />
            {modality.online ? '在线' : '离线'}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-[#5d6b82]/70">{modality.detail}</p>
      </div>
      <div className="text-right">
        <span className="text-lg font-semibold text-[#172033]">{modality.score}</span>
        <p className="text-[10px] text-[#5d6b82]/50">分</p>
      </div>
    </motion.div>
  );
}

interface FusionRiskCardProps {
  data: FusionRiskData;
  className?: string;
}

export function FusionRiskCard({ data, className }: FusionRiskCardProps) {
  const colors = RISK_RING_COLORS[data.riskLevel] || RISK_RING_COLORS.low;
  const trendIcon = data.trend === 'rising' ? 'mdi:trending-up' : data.trend === 'declining' ? 'mdi:trending-down' : 'mdi:trending-neutral';
  const trendColor = data.trend === 'rising' ? 'text-red-500' : data.trend === 'declining' ? 'text-emerald-500' : 'text-amber-500';

  return (
    <div className={clsx(
      'card-glow rounded-3xl border border-[#172033]/8 bg-gradient-to-br p-5',
      colors.bg,
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:merge" className="text-lg text-teal-600" />
            <p className="text-sm font-semibold text-[#172033]">多模态融合风险评估</p>
          </div>
          <p className="mt-1 text-xs text-[#5d6b82]">视觉 · 床压 · 门磁 · 毫米波四源融合</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1">
          <Icon icon={trendIcon} className={clsx('text-sm', trendColor)} />
          <span className={clsx('text-xs font-medium', trendColor)}>
            {data.trend === 'rising' ? '上升' : data.trend === 'declining' ? '下降' : '平稳'}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 lg:flex-row lg:items-start">
        <div className="flex flex-col items-center gap-3">
          <RiskRing score={data.totalScore} riskLevel={data.riskLevel} />
          <div className="flex items-center gap-2">
            <span className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold',
              data.riskLevel === 'critical' ? 'bg-red-100 text-red-600' :
              data.riskLevel === 'high' ? 'bg-orange-100 text-orange-600' :
              data.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' :
              'bg-emerald-100 text-emerald-600'
            )}>
              {RISK_LEVEL_LABEL[data.riskLevel]}
            </span>
            <span className="text-xs text-[#5d6b82]">置信度 {(data.confidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {data.modalities.map((m, i) => (
            <ModalityRow key={m.type} modality={m} index={i} />
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/60 p-4">
        <p className="text-xs font-medium text-[#5d6b82]">融合分析摘要</p>
        <p className="mt-1 text-sm leading-relaxed text-[#172033]/80">{data.summary}</p>
      </div>
    </div>
  );
}
