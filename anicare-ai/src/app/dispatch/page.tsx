'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
import { StatCard } from '@/components/ui/stat-card';
import { fetchJson } from '@/lib/api-client';
import type { DispatchItem } from '@/types';

const initialQueue: DispatchItem[] = [
  {
    id: 'dsp-001', eventId: 'evt-20250501-001', type: '摔倒未响应', risk: '紧急', riskLevel: 'critical',
    zone: 'A栋-3层-走廊', waitMinutes: 8, residentName: '张建国', priority: 1, priorityScore: 100,
    reason: '老人跌倒后超过 3 分钟未出现明显移动，周围无护理人员，已超过黄金响应时间。',
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
    reason: '床位连续 50 分钟未检测到翻身动作，存在压疮和低体温风险。',
    status: '待指派', time: '2025-05-01 08:42:10',
  },
  {
    id: 'dsp-004', eventId: 'evt-20250501-002', type: '夜间离床未归', risk: '高风险', riskLevel: 'high',
    zone: 'B栋-5层-房间508', waitMinutes: 15, residentName: '陈国华', priority: 4, priorityScore: 79,
    reason: '老人行动不便，凌晨离床超过 15 分钟未归，跌倒风险较高。',
    status: '待指派', time: '2025-05-01 02:16:33',
  },
  {
    id: 'dsp-005', eventId: 'evt-20250501-003', type: '烟火疑似异常', risk: '高风险', riskLevel: 'high',
    zone: 'C栋-1层-茶水间', waitMinutes: 5, residentName: '公共区域', priority: 5, priorityScore: 77,
    reason: '茶水间烟雾浓度持续上升，可能涉及电器故障。',
    status: '处理中', assignee: '李建国', time: '2025-05-01 11:05:18',
  },
  {
    id: 'dsp-006', eventId: 'evt-20250501-009', type: '无人看护', risk: '中风险', riskLevel: 'medium',
    zone: 'C栋-3层-康复区', waitMinutes: 18, residentName: '多名老人', priority: 6, priorityScore: 72,
    reason: '康复区有 3 名老人活动但无护理人员在场，存在安全隐患。',
    status: '已完成', assignee: '王美华', time: '2025-05-01 15:48:22',
  },
];

const nurses = [
  { name: '赵文强', floor: 'B栋1-3层', distance: '1 分钟', status: '处理中' },
  { name: '李建国', floor: 'C栋1层', distance: '2 分钟', status: '处理中' },
  { name: '王美华', floor: 'A栋1-2层', distance: '空闲', status: '可接单' },
  { name: '张晓梅', floor: 'A栋3-4层', distance: '空闲', status: '可接单' },
];

type BoardColumn = '待指派' | '已派单' | '处理中' | '已完成';

const columns: { key: BoardColumn; title: string; helper: string; icon: string }[] = [
  { key: '待指派', title: '待派单', helper: '需要值班主管确认', icon: 'mdi:clock-alert-outline' },
  { key: '已派单', title: '已派单', helper: '等待护理员接单', icon: 'mdi:account-arrow-right-outline' },
  { key: '处理中', title: '处理中', helper: '护理员已到场或在路上', icon: 'mdi:progress-clock' },
  { key: '已完成', title: '已完成', helper: '已记录并归档', icon: 'mdi:check-circle-outline' },
];

function displayStatus(item: DispatchItem): BoardColumn {
  if (item.status === '待指派') return '待指派';
  if (item.status === '处理中' && item.assignee === '系统指派') return '已派单';
  return item.status as BoardColumn;
}

function etaFor(item: DispatchItem) {
  if (displayStatus(item) === '已完成') return '已归档';
  if (item.waitMinutes <= 5) return '预计 2 分钟到场';
  if (item.waitMinutes <= 15) return '预计 4 分钟到场';
  return '需立即确认';
}

export default function DispatchPage() {
  const [queue, setQueue] = useState<DispatchItem[]>(initialQueue);
  const [assigning, setAssigning] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<DispatchItem[]>('/api/dispatch').then((items) => {
      if (items.length) setQueue(items.slice(0, 8));
    }).catch(() => {});
  }, []);

  const stats = useMemo(() => {
    const pending = queue.filter((item) => displayStatus(item) === '待指派').length;
    const active = queue.filter((item) => ['已派单', '处理中'].includes(displayStatus(item))).length;
    const urgent = queue.filter((item) => item.riskLevel === 'critical').length;
    const avgWait = queue.length ? (queue.reduce((sum, item) => sum + item.waitMinutes, 0) / queue.length).toFixed(1) : '0';
    return { pending, active, urgent, avgWait };
  }, [queue]);

  const handleAssign = (id: string) => {
    setAssigning(id);
    window.setTimeout(() => {
      setQueue((prev) => prev.map((item) => item.id === id ? { ...item, status: '处理中', assignee: '系统指派' } : item));
      setAssigning(null);
    }, 500);
  };

  const handleComplete = (id: string) => {
    setQueue((prev) => prev.map((item) => item.id === id ? { ...item, status: '已完成' } : item));
  };

  const topItem = queue.find((item) => displayStatus(item) === '待指派');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5d6b82]">风险调度中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#172033]">护理响应闭环</h1>
        </div>
        <Link href="/emergency" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500">
          <Icon icon="mdi:ambulance" />
          应急流程
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="待派单事件" value={stats.pending} icon={<Icon icon="mdi:clock-alert-outline" className="text-xl" />} helper="等待主管确认和派发" />
        <StatCard label="正在响应" value={stats.active} icon={<Icon icon="mdi:run-fast" className="text-xl" />} helper="已派单或处理中事件" />
        <StatCard label="紧急事件" value={stats.urgent} icon={<Icon icon="mdi:alert-circle-outline" className="text-xl" />} helper="需要立即到场确认" />
        <StatCard label="平均等待" value={`${stats.avgWait} 分钟`} icon={<Icon icon="mdi:timer-sand" className="text-xl" />} helper="从识别到当前状态" />
      </div>

      {topItem && (
        <section className="card-glow rounded-2xl border border-red-200 bg-red-50/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-red-700">
                <Icon icon="mdi:alert-decagram-outline" className="text-xl" />
                <p className="text-sm font-semibold">当前优先处理</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#172033]">
                {topItem.zone} 的 {topItem.type} 已等待 {topItem.waitMinutes} 分钟，建议立即指派 A栋当班护理员并同步应急流程。
              </p>
            </div>
            <button onClick={() => handleAssign(topItem.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500">
              <Icon icon="mdi:account-plus-outline" />
              立即派单
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <section className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {columns.map((column) => {
            const items = queue.filter((item) => displayStatus(item) === column.key);
            return (
              <div key={column.key} className="rounded-2xl border border-[#172033]/8 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Icon icon={column.icon} className="text-lg text-teal-600" />
                      <h2 className="text-sm font-semibold text-[#172033]">{column.title}</h2>
                    </div>
                    <p className="mt-1 text-xs text-[#5d6b82]">{column.helper}</p>
                  </div>
                  <span className="rounded-full bg-[#f5f7fb] px-2 py-1 text-xs font-semibold text-[#172033]">{items.length}</span>
                </div>
                <div className="mt-4 space-y-3">
                  {items.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#172033]">{item.type}</p>
                          <p className="mt-1 truncate text-xs text-[#5d6b82]">{item.zone}</p>
                        </div>
                        <RiskBadge risk={item.riskLevel} />
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-lg bg-white px-2 py-1.5">
                          <p className="text-[#5d6b82]/60">护理员</p>
                          <p className="mt-0.5 font-medium text-[#172033]">{item.assignee ?? '未指派'}</p>
                        </div>
                        <div className="rounded-lg bg-white px-2 py-1.5">
                          <p className="text-[#5d6b82]/60">预计到场</p>
                          <p className="mt-0.5 font-medium text-[#172033]">{etaFor(item)}</p>
                        </div>
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#5d6b82]">{item.reason}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {displayStatus(item) === '待指派' && (
                          <button onClick={() => handleAssign(item.id)} disabled={assigning === item.id} className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50">
                            {assigning === item.id ? '派单中' : '派单'}
                          </button>
                        )}
                        {displayStatus(item) !== '已完成' && (
                          <button onClick={() => handleComplete(item.id)} className="rounded-lg border border-[#172033]/10 px-3 py-1.5 text-xs text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700">
                            完成归档
                          </button>
                        )}
                        <Link href={`/events/${item.eventId}`} className="rounded-lg border border-[#172033]/10 px-3 py-1.5 text-xs text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700">
                          详情
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#172033]/10 px-3 py-8 text-center text-xs text-[#5d6b82]/60">
                      当前无事件
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        <aside className="space-y-4">
          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-4">
            <h2 className="text-sm font-semibold text-[#172033]">当班护理员</h2>
            <div className="mt-4 space-y-3">
              {nurses.map((nurse) => (
                <div key={nurse.name} className="flex items-center justify-between rounded-xl bg-[#f5f7fb] px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-[#172033]">{nurse.name}</p>
                    <p className="mt-0.5 text-xs text-[#5d6b82]">{nurse.floor}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${nurse.status === '可接单' ? 'text-emerald-600' : 'text-orange-600'}`}>{nurse.status}</p>
                    <p className="mt-0.5 text-xs text-[#5d6b82]/60">{nurse.distance}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-4">
            <h2 className="text-sm font-semibold text-[#172033]">响应规则</h2>
            <div className="mt-4 space-y-3 text-xs text-[#5d6b82]">
              <p className="rounded-xl bg-red-50 px-3 py-2 text-red-700">紧急事件：2 分钟内完成派单，5 分钟内到场。</p>
              <p className="rounded-xl bg-orange-50 px-3 py-2 text-orange-700">高风险事件：5 分钟内派单，10 分钟内反馈处置状态。</p>
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">所有事件完成后自动进入归档，保留处置记录。</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
