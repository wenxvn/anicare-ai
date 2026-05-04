'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { RiskBadge } from '@/components/ui/risk-badge';
import { fetchJson } from '@/lib/api-client';
import type { DispatchItem } from '@/types';

const fallbackQueue: DispatchItem[] = [
  {
    id: 'dsp-001', eventId: 'evt-20250501-001', type: '摔倒未响应', risk: '紧急', riskLevel: 'critical',
    zone: 'A栋-3层-走廊', waitMinutes: 8, residentName: '张建国', priority: 1, priorityScore: 100,
    reason: '风险等级为紧急，老人跌倒后超过 3 分钟未出现明显移动，周围无护理人员，已超过黄金响应时间。',
    status: '待指派', time: '2025-05-01 03:12:05',
  },
  {
    id: 'dsp-002', eventId: 'evt-20250501-008', type: '楼梯口摔倒', risk: '紧急', riskLevel: 'critical',
    zone: 'B栋-1层-楼梯口', waitMinutes: 3, residentName: '刘德华', priority: 2, priorityScore: 95,
    reason: '楼梯口摔倒存在二次碰撞风险，且楼梯湿滑，需要优先确认是否骨折。',
    status: '处理中', assignee: '赵文强', time: '2025-05-01 09:15:33',
  },
  {
    id: 'dsp-003', eventId: 'evt-20250501-005', type: '久卧未动', risk: '高风险', riskLevel: 'high',
    zone: 'B栋-3层-房间302', waitMinutes: 22, residentName: '王秀兰', priority: 3, priorityScore: 83,
    reason: '床位连续 50 分钟未检测到翻身动作，存在压疮和低体温风险，且室温低于安全阈值。',
    status: '待指派', time: '2025-05-01 08:42:10',
  },
  {
    id: 'dsp-004', eventId: 'evt-20250501-002', type: '夜间离床未归', risk: '高风险', riskLevel: 'high',
    zone: 'B栋-5层-房间508', waitMinutes: 15, residentName: '陈国华', priority: 4, priorityScore: 79,
    reason: '老人行动不便，凌晨离床超过 15 分钟未归，夜间照明不足，跌倒风险较高。',
    status: '待指派', time: '2025-05-01 02:16:33',
  },
  {
    id: 'dsp-005', eventId: 'evt-20250501-003', type: '烟火疑似异常', risk: '高风险', riskLevel: 'high',
    zone: 'C栋-1层-茶水间', waitMinutes: 5, residentName: '—', priority: 5, priorityScore: 77,
    reason: '茶水间烟雾浓度持续上升，可能涉及电器故障，需要确认设备状态和通风口。',
    status: '待指派', time: '2025-05-01 11:05:18',
  },
  {
    id: 'dsp-006', eventId: 'evt-20250501-009', type: '无人看护', risk: '中风险', riskLevel: 'medium',
    zone: 'C栋-3层-康复区', waitMinutes: 18, residentName: '多名老人', priority: 6, priorityScore: 72,
    reason: '康复区有 3 名老人活动但无护理人员在场，存在安全隐患。',
    status: '待指派', time: '2025-05-01 15:48:22',
  },
  {
    id: 'dsp-007', eventId: 'evt-20250501-004', type: '长时间滞留', risk: '中风险', riskLevel: 'medium',
    zone: 'A栋-1层-电梯口', waitMinutes: 25, residentName: '李明辉', priority: 7, priorityScore: 67,
    reason: '老人在电梯口滞留超过 10 分钟，可能存在迷路风险，需确认是否需要引导。',
    status: '待指派', time: '2025-05-01 16:30:45',
  },
];

export default function DispatchPage() {
  const [queue, setQueue] = useState<DispatchItem[]>(fallbackQueue);
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<DispatchItem[]>('/api/dispatch').then(setQueue).catch(() => {});
  }, []);

  const pendingCount = queue.filter((d) => d.status === '待指派').length;
  const urgentCount = queue.filter((d) => d.riskLevel === 'critical' || d.risk === '紧急').length;
  const avgWait = queue.length > 0 ? (queue.reduce((s, d) => s + d.waitMinutes, 0) / queue.length).toFixed(1) : '0';
  const doneRate = queue.length > 0 ? Math.round((queue.filter((d) => d.status === '已完成').length / queue.length) * 100) : 0;

  const handleAssign = (id: string) => {
    setAssigning(id);
    setTimeout(() => {
      setQueue((prev) => prev.map((d) => d.id === id ? { ...d, status: '处理中' as const, assignee: '系统指派' } : d));
      setAssigning(null);
    }, 800);
  };

  const topItem = queue.find((d) => d.status === '待指派');

  return (
    <div className="space-y-8">
      <SectionHeader title="风险调度中心" description="多个事件同时发生时，系统先把最危险的事排到最前面。护理员一看就知道先处理哪件事。" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="当前待处理" value={pendingCount} icon={<Icon icon="mdi:clock-alert-outline" className="text-xl" />} helper="等待指派的风险事件" />
        <StatCard label="紧急事件" value={urgentCount} icon={<Icon icon="mdi:alert-circle-outline" className="text-xl" />} helper="需要立即响应的事件" />
        <StatCard label="平均等待时长" value={`${avgWait} 分钟`} icon={<Icon icon="mdi:timer-sand" className="text-xl" />} helper="从事件发生到指派的平均时间" />
        <StatCard label="调度完成率" value={`${doneRate}%`} icon={<Icon icon="mdi:check-circle-outline" className="text-xl" />} helper="今天调度任务完成比例" />
      </div>

      {topItem && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-white to-white p-6">
          <div className="flex items-center gap-3 text-teal-700">
            <Icon icon="mdi:lightbulb-on-outline" className="text-xl" />
            <p className="text-sm font-semibold">AI 调度建议</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#5c524a]">
            建议优先处理 <span className="font-semibold text-[#1a1615]">{topItem.zone} {topItem.type}</span> 事件，
            因为该事件风险等级为 <span className="font-semibold text-[#1a1615]">{topItem.risk}</span>，
            受影响老人为 <span className="font-semibold text-[#1a1615]">{topItem.residentName}</span>，
            已等待 <span className="font-semibold text-[#1a1615]">{topItem.waitMinutes} 分钟</span>，已超过黄金响应时间。
          </p>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#1a1615]">风险优先级队列</h3>
        <p className="text-sm text-[#5c524a]">系统根据风险等级、等待时间和影响范围自动排序，最紧急的排在最前面。</p>
        {queue.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                  <span className="text-lg font-bold">#{item.priority}</span>
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1a1615]">{item.type}</p>
                  <p className="text-xs text-[#5c524a]/50">{item.eventId}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  item.status === '待指派' ? 'bg-red-50 text-red-600 border border-red-200' :
                  item.status === '处理中' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-200'
                }`}>{item.status}</span>
                <RiskBadge risk={item.riskLevel || item.risk} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5c524a]">
              <span className="flex items-center gap-1"><Icon icon="mdi:map-marker-outline" className="text-sm" />{item.zone}</span>
              <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" className="text-sm" />等待 {item.waitMinutes} 分钟</span>
              <span className="flex items-center gap-1"><Icon icon="mdi:account-outline" className="text-sm" />受影响：{item.residentName}</span>
              {item.assignee && <span className="flex items-center gap-1"><Icon icon="mdi:account-check-outline" className="text-sm" />指派：{item.assignee}</span>}
            </div>

            <p className="mt-3 rounded-2xl bg-[#f8f5f0] px-4 py-3 text-sm text-[#5c524a]">
              <span className="text-[#5c524a]/50">推荐理由：</span>{item.reason}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {item.status === '待指派' && (
                <button onClick={() => handleAssign(item.id)} disabled={assigning === item.id} className="inline-flex items-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50">
                  <Icon icon="mdi:account-plus-outline" className="text-sm" />
                  {assigning === item.id ? '指派中...' : '指派护理员'}
                </button>
              )}
              {item.status === '待指派' && (
                <button className="inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                  <Icon icon="mdi:play-circle-outline" className="text-sm" />
                  标记处理中
                </button>
              )}
              <Link href="/emergency" className="inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:ambulance" className="text-sm" />
                查看应急流程
              </Link>
              <Link href={`/events/${item.eventId}`} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:arrow-right" className="text-sm" />
                查看事件详情
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
