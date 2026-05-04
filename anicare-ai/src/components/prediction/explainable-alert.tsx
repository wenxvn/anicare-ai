'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { ExplainableAlert as AlertType, AlertStatus } from '@/types';
import { RISK_LEVEL_LABEL } from '@/types';
import clsx from 'clsx';

const RISK_STYLES: Record<string, { border: string; bg: string; badge: string; icon: string }> = {
  critical: { border: 'border-red-200', bg: 'bg-red-50/50', badge: 'bg-red-100 text-red-600', icon: 'text-red-500' },
  high: { border: 'border-orange-200', bg: 'bg-orange-50/50', badge: 'bg-orange-100 text-orange-600', icon: 'text-orange-500' },
  medium: { border: 'border-amber-200', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-600', icon: 'text-amber-500' },
  low: { border: 'border-emerald-200', bg: 'bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-600', icon: 'text-emerald-500' },
};

const STATUS_CONFIG: Record<AlertStatus, { label: string; color: string; next?: AlertStatus; nextLabel?: string }> = {
  pending: { label: '待确认', color: 'bg-amber-100 text-amber-700', next: 'dispatched', nextLabel: '派单' },
  dispatched: { label: '已派单', color: 'bg-blue-100 text-blue-700', next: 'resolved', nextLabel: '已处理' },
  resolved: { label: '已处理', color: 'bg-emerald-100 text-emerald-700' },
};

interface AlertCardProps {
  alert: AlertType;
  index: number;
  onStatusChange: (id: string, status: AlertStatus) => void;
}

function AlertCard({ alert, index, onStatusChange }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const style = RISK_STYLES[alert.riskLevel] || RISK_STYLES.low;
  const statusCfg = STATUS_CONFIG[alert.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={clsx('rounded-2xl border bg-white p-4 transition-shadow hover:shadow-md', style.border)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={clsx('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', style.badge)}>
              {RISK_LEVEL_LABEL[alert.riskLevel]} · {alert.riskScore}分
            </span>
            <span className={clsx('rounded-full px-2.5 py-0.5 text-[11px] font-medium', statusCfg.color)}>
              {statusCfg.label}
            </span>
            <span className="text-xs text-[#5c524a]/50">{alert.alertType}</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-[#1a1615]">{alert.zone} · {alert.roomName}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#5c524a]/80">{alert.triggerReason}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {statusCfg.next && (
            <button
              onClick={() => onStatusChange(alert.id, statusCfg.next!)}
              className="rounded-xl bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-500/20"
            >
              {statusCfg.nextLabel}
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-xl p-1.5 text-[#5c524a] transition-colors hover:bg-[#f8f5f0] hover:text-[#1a1615]"
          >
            <Icon icon={expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} className="text-lg" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t border-[#1a1615]/6 pt-3">
              <div>
                <p className="text-xs font-medium text-[#5c524a]">触发贡献因子</p>
                <div className="mt-2 space-y-2">
                  {alert.contributors.map((c, ci) => (
                    <div key={ci}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#1a1615]">{c.factor}</span>
                        <span className="font-medium text-[#1a1615]">{(c.weight * 100).toFixed(0)}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-[#f0ece5]">
                        <motion.div
                          className="h-1.5 rounded-full bg-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${c.weight * 100}%` }}
                          transition={{ delay: ci * 0.1, duration: 0.5 }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-[#5c524a]/60">{c.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-teal-50/50 p-3">
                <p className="text-xs font-medium text-teal-700">处置建议</p>
                <p className="mt-1 text-xs leading-relaxed text-teal-800">{alert.suggestion}</p>
              </div>

              <div className="flex items-center gap-4 text-[10px] text-[#5c524a]/50">
                <span>置信度 {(alert.confidence * 100).toFixed(0)}%</span>
                <span>触发时间 {alert.createdAt}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ExplainableAlertListProps {
  alerts: AlertType[];
  className?: string;
}

export function ExplainableAlertList({ alerts: initialAlerts, className }: ExplainableAlertListProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<'all' | AlertStatus>('all');

  const handleStatusChange = (id: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.status === filter);
  const counts = {
    all: alerts.length,
    pending: alerts.filter((a) => a.status === 'pending').length,
    dispatched: alerts.filter((a) => a.status === 'dispatched').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  };

  return (
    <div className={clsx('card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:message-alert-outline" className="text-lg text-teal-600" />
            <p className="text-sm font-semibold text-[#1a1615]">可解释预警队列</p>
          </div>
          <p className="mt-1 text-xs text-[#5c524a]">每条预警附带触发依据、贡献因子与处置建议</p>
        </div>
        <div className="flex gap-1.5">
          {[
            { key: 'all' as const, label: '全部' },
            { key: 'pending' as const, label: '待确认' },
            { key: 'dispatched' as const, label: '已派单' },
            { key: 'resolved' as const, label: '已处理' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={clsx(
                'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                filter === f.key ? 'bg-teal-500/10 text-teal-700' : 'text-[#5c524a] hover:bg-[#f8f5f0]'
              )}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-[#5c524a]/40">
            <Icon icon="mdi:check-circle-outline" className="text-3xl" />
            <p className="text-sm">当前筛选条件下暂无预警</p>
          </div>
        ) : (
          filtered.map((alert, i) => (
            <AlertCard key={alert.id} alert={alert} index={i} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>
    </div>
  );
}
