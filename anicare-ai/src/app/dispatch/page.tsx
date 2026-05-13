'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
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

function displayStatus(item: DispatchItem) {
  if (item.status === '处理中' && item.assignee === '系统指派') return '已派单';
  return item.status;
}

function etaFor(item: DispatchItem) {
  if (item.status === '已完成') return '已归档';
  if (item.waitMinutes <= 5) return '预计 2 分钟到场';
  if (item.waitMinutes <= 15) return '预计 4 分钟到场';
  return '需立即确认';
}

function statusStyle(status: string) {
  if (status === '待指派') return 'bg-red-50 text-red-700 border-red-200';
  if (status === '已派单') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === '处理中') return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

export default function DispatchPage() {
  const [queue, setQueue] = useState<DispatchItem[]>(initialQueue);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState(initialQueue[0].id);

  useEffect(() => {
    fetchJson<DispatchItem[]>('/api/dispatch').then((items) => {
      if (items.length) {
        setQueue(items.slice(0, 8));
        setSelectedId(items[0].id);
      }
    }).catch(() => {});
  }, []);

  const sortedQueue = useMemo(() => (
    [...queue].sort((a, b) => b.priorityScore - a.priorityScore || b.waitMinutes - a.waitMinutes)
  ), [queue]);

  const selected = sortedQueue.find((item) => item.id === selectedId) ?? sortedQueue[0];
  const stats = useMemo(() => {
    const pending = queue.filter((item) => item.status === '待指派').length;
    const active = queue.filter((item) => item.status === '处理中').length;
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

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5d6b82]">风险调度中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#172033]">护理响应工作台</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5d6b82]">
            按事件优先级组织派单、到场和归档，值班人员只需要聚焦当前最需要处理的工单。
          </p>
        </div>
        <Link href="/emergency" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500">
          <Icon icon="mdi:ambulance" />
          应急流程
        </Link>
      </header>

      <section className="grid gap-2 rounded-2xl border border-[#172033]/8 bg-white/88 p-3 shadow-sm sm:grid-cols-4">
        {[
          { label: '待派单', value: stats.pending, icon: 'mdi:clock-alert-outline', tone: 'text-red-600' },
          { label: '响应中', value: stats.active, icon: 'mdi:run-fast', tone: 'text-orange-600' },
          { label: '紧急事件', value: stats.urgent, icon: 'mdi:alert-circle-outline', tone: 'text-red-600' },
          { label: '平均等待', value: `${stats.avgWait} 分钟`, icon: 'mdi:timer-sand', tone: 'text-teal-700' },
        ].map(({ label, value, icon, tone }) => (
          <div key={label} className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2.5">
            <div>
              <p className="text-xs text-[#5d6b82]">{label}</p>
              <p className="mt-1 text-lg font-semibold text-[#172033]">{value}</p>
            </div>
            <Icon icon={icon} className={`text-xl ${tone}`} />
          </div>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="card-glow overflow-hidden rounded-2xl border border-[#172033]/8 bg-white">
          <div className="border-b border-[#172033]/8 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#172033]">事件队列</h2>
                <p className="mt-1 text-xs text-[#5d6b82]">按优先级与等待时长排序，点击行查看调度详情。</p>
              </div>
              <span className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-medium text-[#5d6b82]">{queue.length} 起事件</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[820px] grid-cols-[80px_1.2fr_1fr_100px_120px_120px] bg-[#f8fafc] px-5 py-2 text-xs font-medium text-[#5d6b82]">
              <span>优先级</span>
              <span>事件</span>
              <span>位置 / 对象</span>
              <span>等待</span>
              <span>状态</span>
              <span>操作</span>
            </div>
            {sortedQueue.map((item, index) => {
              const active = selected?.id === item.id;
              const status = displayStatus(item);
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedId(item.id)}
                  className={`grid min-w-[820px] grid-cols-[80px_1.2fr_1fr_100px_120px_120px] items-center border-t border-[#172033]/8 px-5 py-3 text-left text-sm transition-colors ${active ? 'bg-teal-50/70' : 'bg-white hover:bg-[#f8fafc]'}`}
                >
                  <span className="font-mono text-xs font-semibold text-[#172033]">#{item.priority}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <RiskBadge risk={item.riskLevel} />
                      <span className="truncate font-semibold text-[#172033]">{item.type}</span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-[#5d6b82]">{item.reason}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[#172033]">{item.zone}</span>
                    <span className="mt-1 block text-xs text-[#5d6b82]">{item.residentName}</span>
                  </span>
                  <span className={item.waitMinutes > 10 ? 'font-semibold text-red-600' : 'text-[#172033]'}>{item.waitMinutes} 分钟</span>
                  <span>
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(status)}`}>{status}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {item.status === '待指派' ? (
                      <span className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white">
                        {assigning === item.id ? '派单中' : '派单'}
                      </span>
                    ) : (
                      <span className="rounded-lg border border-[#172033]/10 px-3 py-1.5 text-xs text-[#5d6b82]">查看</span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-4">
          {selected && (
            <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-[#5d6b82]">当前工单</p>
                  <h2 className="mt-1 text-lg font-semibold text-[#172033]">{selected.type}</h2>
                </div>
                <RiskBadge risk={selected.riskLevel} />
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                {[
                  ['位置', selected.zone],
                  ['对象', selected.residentName],
                  ['等待', `${selected.waitMinutes} 分钟`],
                  ['预计到场', etaFor(selected)],
                  ['当前处理人', selected.assignee ?? '未指派'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 border-b border-[#172033]/6 pb-2 last:border-0">
                    <dt className="text-[#5d6b82]">{label}</dt>
                    <dd className="text-right font-medium text-[#172033]">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
                <p className="text-xs font-medium text-[#5d6b82]">研判原因</p>
                <p className="mt-2 text-sm leading-relaxed text-[#172033]">{selected.reason}</p>
              </div>

              <div className="mt-4 grid gap-2">
                {selected.status === '待指派' && (
                  <button onClick={() => handleAssign(selected.id)} disabled={assigning === selected.id} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 disabled:opacity-50">
                    <Icon icon="mdi:account-plus-outline" />
                    {assigning === selected.id ? '正在派单' : '指派护理员'}
                  </button>
                )}
                {selected.status !== '已完成' && (
                  <button onClick={() => handleComplete(selected.id)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#172033]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700">
                    <Icon icon="mdi:check-circle-outline" />
                    完成并归档
                  </button>
                )}
                <Link href={`/events/${selected.eventId}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#172033]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700">
                  <Icon icon="mdi:file-document-outline" />
                  查看事件详情
                </Link>
              </div>
            </section>
          )}

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <h2 className="text-sm font-semibold text-[#172033]">当班护理员</h2>
            <div className="mt-4 space-y-2">
              {nurses.map((nurse) => (
                <div key={nurse.name} className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-3 py-2.5">
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

          <section className="rounded-2xl border border-[#172033]/8 bg-[#f8fafc] p-4">
            <h2 className="text-sm font-semibold text-[#172033]">响应规则</h2>
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-[#5d6b82]">
              <p>紧急事件 2 分钟内完成派单，5 分钟内到场确认。</p>
              <p>高风险事件 5 分钟内派单，10 分钟内反馈处置状态。</p>
              <p>所有事件完成后自动进入归档，保留处置记录。</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
