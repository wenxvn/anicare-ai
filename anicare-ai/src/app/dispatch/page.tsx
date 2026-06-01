'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
import { fetchJson } from '@/lib/api-client';
import type { RiskLevel } from '@/types';

type DispatchStatus = '处理中' | '已完成';

interface DispatchRow {
  id: string;
  eventId: string;
  type: string;
  risk: string;
  riskLevel: RiskLevel;
  zone: string;
  waitSeconds: number;
  residentName: string;
  priority: number;
  priorityScore: number;
  reason: string;
  status: DispatchStatus;
  assignee?: string;
  time: string;
}

const initialQueue: DispatchRow[] = [
  {
    id: 'dsp-001', eventId: 'evt-20250501-001', type: '摔倒未响应', risk: '紧急', riskLevel: 'critical',
    zone: 'A栋-3层-走廊', waitSeconds: 8, residentName: '张建国', priority: 1, priorityScore: 100,
    reason: '老人跌倒后超过 3 分钟未出现明显移动，周围无护理人员，已超过黄金响应时间。',
    status: '处理中', assignee: '系统指派', time: '2025-05-01 03:12:05',
  },
  {
    id: 'dsp-002', eventId: 'evt-20250501-008', type: '楼梯口摔倒', risk: '紧急', riskLevel: 'critical',
    zone: 'B栋-1层-楼梯口', waitSeconds: 3, residentName: '刘德华', priority: 2, priorityScore: 95,
    reason: '楼梯口摔倒存在二次碰撞风险，且楼梯湿滑，需要优先确认是否骨折。',
    status: '处理中', assignee: '赵文强', time: '2025-05-01 09:15:33',
  },
  {
    id: 'dsp-003', eventId: 'evt-20250501-005', type: '久卧未动', risk: '高风险', riskLevel: 'high',
    zone: 'B栋-3层-房间302', waitSeconds: 6, residentName: '王秀兰', priority: 3, priorityScore: 83,
    reason: '床位连续 50 分钟未检测到翻身动作，存在压疮和低体温风险。',
    status: '处理中', assignee: '系统指派', time: '2025-05-01 08:42:10',
  },
  {
    id: 'dsp-004', eventId: 'evt-20250501-002', type: '夜间离床未归', risk: '高风险', riskLevel: 'high',
    zone: 'B栋-5层-房间508', waitSeconds: 7, residentName: '陈国华', priority: 4, priorityScore: 79,
    reason: '老人行动不便，凌晨离床超过 15 分钟未归，跌倒风险较高。',
    status: '处理中', assignee: '系统指派', time: '2025-05-01 02:16:33',
  },
  {
    id: 'dsp-005', eventId: 'evt-20250501-003', type: '烟火疑似异常', risk: '高风险', riskLevel: 'high',
    zone: 'C栋-1层-茶水间', waitSeconds: 4, residentName: '公共区域', priority: 5, priorityScore: 77,
    reason: '茶水间烟雾浓度持续上升，可能涉及电器故障，需要确认设备状态和通风口。',
    status: '处理中', assignee: '系统指派', time: '2025-05-01 11:05:18',
  },
  {
    id: 'dsp-006', eventId: 'evt-20250501-009', type: '无人看护', risk: '中风险', riskLevel: 'medium',
    zone: 'C栋-3层-康复区', waitSeconds: 5, residentName: '多名老人', priority: 6, priorityScore: 72,
    reason: '康复区有 3 名老人活动但无护理人员在场，存在安全隐患。',
    status: '已完成', assignee: '系统指派', time: '2025-05-01 15:48:22',
  },
  {
    id: 'dsp-007', eventId: 'evt-20250501-004', type: '长时间滞留', risk: '中风险', riskLevel: 'medium',
    zone: 'A栋-1层-电梯口', waitSeconds: 9, residentName: '李明辉', priority: 7, priorityScore: 67,
    reason: '老人在电梯口滞留超过 10 分钟，可能存在迷路风险，需确认是否需要引导。',
    status: '处理中', assignee: '系统指派', time: '2025-05-01 16:30:45',
  },
  {
    id: 'dsp-008', eventId: 'evt-20250501-010', type: '活动量骤降', risk: '中风险', riskLevel: 'medium',
    zone: 'A栋-4层-房间405', waitSeconds: 6, residentName: '孙丽芳', priority: 8, priorityScore: 61,
    reason: '今日活动量低于个人 7 日均值 45%，且情绪记录显示不愿交流。',
    status: '处理中', assignee: '系统指派', time: '2025-05-01 17:20:12',
  },
  {
    id: 'dsp-009', eventId: 'evt-20250501-011', type: '门磁异常开启', risk: '低风险', riskLevel: 'low',
    zone: 'A栋-2层-活动室', waitSeconds: 5, residentName: '周志明', priority: 9, priorityScore: 43,
    reason: '活动室门磁在非开放时段被连续触发，需确认是否为护理员巡查或老人误入。',
    status: '已完成', assignee: '系统指派', time: '2025-05-01 18:05:40',
  },
];

const nurses = [
  { name: '赵文强', floor: 'B栋1-3层', distance: '1 分钟', status: '处理中', load: 2 },
  { name: '李建国', floor: 'C栋1层', distance: '2 分钟', status: '处理中', load: 1 },
  { name: '王美华', floor: 'A栋1-2层', distance: '空闲', status: '可接单', load: 0 },
  { name: '张晓梅', floor: 'A栋3-4层', distance: '空闲', status: '可接单', load: 0 },
  { name: '陈小燕', floor: 'B栋4-5层', distance: '3 分钟', status: '可接单', load: 1 },
];

const dispatchPace = [
  { time: '08:00', value: 4 },
  { time: '10:00', value: 7 },
  { time: '12:00', value: 5 },
  { time: '14:00', value: 9 },
  { time: '16:00', value: 11 },
  { time: '18:00', value: 8 },
];

function etaFor(item: DispatchRow) {
  if (item.status === '已完成') return '已归档';
  if (item.waitSeconds <= 3) return '已派至最近护理员';
  if (item.waitSeconds <= 6) return '已通知责任楼层';
  return '已同步值班主管';
}

function statusStyle(status: DispatchStatus) {
  if (status === '处理中') return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
}

export default function DispatchPage() {
  const [queue, setQueue] = useState<DispatchRow[]>(initialQueue);
  const [selectedId, setSelectedId] = useState(initialQueue[0].id);

  useEffect(() => {
    fetchJson<DispatchRow[]>('/api/dispatch').then((items) => {
      if (items.length) {
        setQueue((prev) => {
          const normalized = items.slice(0, 8).map((item) => ({
            ...item,
            status: item.status === '已完成' ? '已完成' : '处理中',
          })) as DispatchRow[];
          return normalized.length >= prev.length ? normalized : prev;
        });
      }
    }).catch(() => {});
  }, []);

  const sortedQueue = useMemo(() => (
    [...queue].sort((a, b) => b.priorityScore - a.priorityScore || b.waitSeconds - a.waitSeconds)
  ), [queue]);

  const selected = sortedQueue.find((item) => item.id === selectedId) ?? sortedQueue[0];
  const stats = useMemo(() => {
    const active = queue.filter((item) => item.status === '处理中').length;
    const completed = queue.filter((item) => item.status === '已完成').length;
    const urgent = queue.filter((item) => item.riskLevel === 'critical').length;
    const avgWait = queue.length ? (queue.reduce((sum, item) => sum + item.waitSeconds, 0) / queue.length).toFixed(1) : '0';
    return { active, completed, urgent, avgWait };
  }, [queue]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5d6b82]">风险调度中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#172033]">护理响应工作台</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5d6b82]">
            系统自动识别风险事件并完成派单，值班人员可以直接查看处置进展和事件详情。
          </p>
        </div>
        <Link href="/emergency" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500">
          <Icon icon="mdi:ambulance" />
          应急流程
        </Link>
      </header>

      <section className="grid gap-2 rounded-2xl border border-[#172033]/8 bg-white/88 p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: '自动派单', value: queue.length, icon: 'mdi:account-arrow-right-outline', tone: 'text-teal-700' },
          { label: '处理中', value: stats.active, icon: 'mdi:run-fast', tone: 'text-orange-600' },
          { label: '紧急事件', value: stats.urgent, icon: 'mdi:alert-circle-outline', tone: 'text-red-600' },
          { label: '已完成', value: stats.completed, icon: 'mdi:check-circle-outline', tone: 'text-emerald-700' },
          { label: '平均响应', value: `${stats.avgWait} 秒`, icon: 'mdi:timer-sand', tone: 'text-teal-700' },
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
                <p className="mt-1 text-xs text-[#5d6b82]">按优先级与秒级响应时长排序，点击行查看调度详情。</p>
              </div>
              <span className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-medium text-[#5d6b82]">{queue.length} 起事件</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[920px] grid-cols-[80px_minmax(270px,1.25fr)_minmax(200px,0.9fr)_110px_120px_120px] bg-[#f8fafc] px-5 py-2 text-xs font-medium text-[#5d6b82]">
              <span>优先级</span>
              <span>事件</span>
              <span>位置 / 对象</span>
              <span className="text-center">等待</span>
              <span className="text-center">状态</span>
              <span className="text-center">操作</span>
            </div>
            {sortedQueue.map((item, index) => {
              const active = selected?.id === item.id;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedId(item.id)}
                  className={`grid min-w-[920px] cursor-pointer grid-cols-[80px_minmax(270px,1.25fr)_minmax(200px,0.9fr)_110px_120px_120px] items-center border-t border-[#172033]/8 px-5 py-3 text-left text-sm transition-colors ${active ? 'bg-teal-50/70' : 'bg-white hover:bg-[#f8fafc]'}`}
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
                  <span className={`justify-self-center text-center ${item.waitSeconds >= 8 ? 'font-semibold text-red-600' : 'text-[#172033]'}`}>{item.waitSeconds} 秒</span>
                  <span className="justify-self-center">
                    <span className={`inline-flex min-w-[72px] justify-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyle(item.status)}`}>{item.status}</span>
                  </span>
                  <span className="justify-self-center">
                    <Link
                      onClick={(event) => event.stopPropagation()}
                      href={`/events/${item.eventId}`}
                      className="inline-flex min-w-[64px] justify-center rounded-lg border border-[#172033]/10 px-3 py-1.5 text-xs text-[#5d6b82] hover:border-teal-500/40 hover:text-teal-700"
                    >
                      查看
                    </Link>
                  </span>
                </motion.div>
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
                  ['响应', `${selected.waitSeconds} 秒`],
                  ['派单状态', etaFor(selected)],
                  ['当前处理人', selected.assignee ?? '系统指派'],
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
                    <p className="mt-0.5 text-xs text-[#5d6b82]/60">{nurse.distance} · {nurse.load} 单</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#172033]/8 bg-[#f8fafc] p-4">
            <h2 className="text-sm font-semibold text-[#172033]">响应节奏</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {dispatchPace.slice(-3).map((item) => (
                <div key={item.time} className="rounded-xl bg-white p-3 text-center">
                  <p className="text-xs text-[#5d6b82]">{item.time}</p>
                  <p className="mt-1 text-lg font-semibold text-[#172033]">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs leading-relaxed text-[#5d6b82]">
              <p>紧急事件 3 秒内完成自动识别和派单。</p>
              <p>高风险事件 8 秒内同步责任护理员和主管。</p>
              <p>所有事件完成后自动进入归档，保留处置记录。</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
