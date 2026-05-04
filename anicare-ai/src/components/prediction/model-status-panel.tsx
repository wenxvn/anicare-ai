'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { ModelRunStatus } from '@/types';
import clsx from 'clsx';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  running: { label: '运行中', color: 'text-emerald-600', dot: 'bg-emerald-500 animate-pulse' },
  idle: { label: '空闲', color: 'text-amber-600', dot: 'bg-amber-500' },
  error: { label: '异常', color: 'text-red-600', dot: 'bg-red-500' },
};

interface ModelStatusPanelProps {
  status: ModelRunStatus;
  className?: string;
}

export function ModelStatusPanel({ status, className }: ModelStatusPanelProps) {
  const cfg = STATUS_CONFIG[status.status] || STATUS_CONFIG.idle;

  return (
    <div className={clsx('card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5', className)}>
      <div className="flex items-center gap-2">
        <Icon icon="mdi:cpu-64-bit" className="text-lg text-teal-600" />
        <p className="text-sm font-semibold text-[#1a1615]">模型运行状态</p>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium">
          <span className={clsx('h-2 w-2 rounded-full', cfg.dot)} />
          <span className={cfg.color}>{cfg.label}</span>
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: 'mdi:tag-outline', label: '模型版本', value: status.modelVersion },
          { icon: 'mdi:timer-outline', label: '推理延迟', value: `${status.inferenceLatencyMs} ms` },
          { icon: 'mdi:update', label: '数据新鲜度', value: status.dataFreshness },
          { icon: 'mdi:bullseye-arrow', label: '准确率', value: `${status.accuracy}%` },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35 }}
            className="rounded-2xl bg-[#faf8f5] p-3"
          >
            <Icon icon={item.icon} className="text-sm text-[#5c524a]/50" />
            <p className="mt-1 text-[10px] text-[#5c524a]/60">{item.label}</p>
            <p className="mt-0.5 text-sm font-semibold text-[#1a1615]">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-[#5c524a]/40">
        <Icon icon="mdi:clock-outline" className="text-xs" />
        <span>最近一次推理: {status.lastRunAt}</span>
      </div>
    </div>
  );
}
