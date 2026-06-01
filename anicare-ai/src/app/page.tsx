'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RiskBadge } from '@/components/ui/risk-badge';
import { StatCard } from '@/components/ui/stat-card';
import { mockEvents } from '@/lib/mock-data';

const dutyStats = [
  { label: '今日告警', value: 26, helper: '已自动研判并完成派单', icon: 'mdi:alert-octagon-outline' },
  { label: '处理中高风险', value: 7, helper: '包含 2 起紧急事件', icon: 'mdi:clock-alert-outline' },
  { label: '平均响应', value: '5.9 秒', helper: '从识别到自动派单', icon: 'mdi:timer-check-outline' },
  { label: '设备在线率', value: '97.6%', helper: '摄像头与传感器综合在线', icon: 'mdi:access-point-check' },
];

const activeEvents = [
  { id: 'evt-20250501-001', type: '摔倒未响应', riskLevel: 'critical' as const, zone: 'A栋3层走廊', source: '视觉识别 + 无人响应', status: '处理中', wait: '8 秒' },
  { id: 'evt-20250501-005', type: '久卧未动', riskLevel: 'high' as const, zone: 'B栋302房间', source: '床垫传感器 + 体征', status: '处理中', wait: '6 秒' },
  { id: 'evt-20250501-003', type: '烟火疑似异常', riskLevel: 'high' as const, zone: 'C栋1层茶水间', source: '烟雾浓度 + 视觉', status: '处理中', wait: '4 秒' },
  { id: 'evt-20250501-004', type: '长时间滞留', riskLevel: 'medium' as const, zone: 'A栋1层电梯口', source: '视觉轨迹', status: '已完成', wait: '9 秒' },
];

const deviceGroups = [
  { label: '摄像头', online: 36, total: 38, icon: 'mdi:cctv' },
  { label: '床垫传感器', online: 42, total: 44, icon: 'mdi:bed-outline' },
  { label: '门磁', online: 28, total: 28, icon: 'mdi:door-closed-lock' },
  { label: '毫米波雷达', online: 18, total: 20, icon: 'mdi:radar' },
  { label: '可穿戴设备', online: 36, total: 38, icon: 'mdi:watch-variant' },
];

const quickActions = [
  { href: '/detect', label: '实时监测', icon: 'mdi:monitor-eye' },
  { href: '/dispatch', label: '风险调度', icon: 'mdi:account-arrow-right-outline' },
  { href: '/emergency', label: '应急流程', icon: 'mdi:ambulance' },
  { href: '/events', label: '事件归档', icon: 'mdi:archive-clock-outline' },
];

export default function HomePage() {
  const trend = [
    { time: '08:00', value: 4 },
    { time: '10:00', value: 7 },
    { time: '12:00', value: 5 },
    { time: '14:00', value: 11 },
    { time: '16:00', value: 8 },
    { time: '18:00', value: 12 },
  ];

  return (
    <div className="space-y-6">
      <section className="card-glow relative overflow-hidden rounded-3xl border border-[#172033]/8 bg-white/92 p-5 sm:p-6">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] overflow-hidden lg:block">
          <Image
            src="/pictures/camera-bed-care.jpg"
            alt="养老机构护理场景"
            fill
            priority
            sizes="38vw"
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white/10" />
        </div>
        <div className="relative grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/18 bg-teal-500/8 px-3 py-1.5 text-xs font-medium text-teal-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              机构安全风险运行总览
            </div>
            <h1 className="mt-4 max-w-3xl text-balance text-3xl font-semibold tracking-tight text-[#172033] sm:text-4xl">
              今日风险运行态势
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5d6b82]">
              系统汇总视觉识别、床垫传感器、门磁、毫米波雷达与护理记录，自动识别高风险事件并快速派单。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {quickActions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#172033]/10 bg-white px-3 py-2 text-xs font-medium text-[#5d6b82] shadow-sm transition-colors hover:border-teal-500/40 hover:text-teal-700"
                >
                  <Icon icon={item.icon} className="text-base" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { label: '运行状态', value: '正常', icon: 'mdi:check-decagram-outline', tone: 'text-emerald-700' },
              { label: '重点区域', value: 'A栋 / B栋', icon: 'mdi:map-marker-radius-outline', tone: 'text-teal-700' },
              { label: '监测延迟', value: '142 ms', icon: 'mdi:cpu-64-bit', tone: 'text-sky-700' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#172033]/8 bg-[#f8fafc]/86 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5d6b82]">{item.label}</span>
                  <Icon icon={item.icon} className={`text-lg ${item.tone}`} />
                </div>
                <p className="mt-2 text-lg font-semibold text-[#172033]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dutyStats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper={item.helper}
            icon={<Icon icon={item.icon} className="text-xl" />}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#172033]">当前高风险事件</h2>
              <p className="mt-1 text-xs text-[#5d6b82]">按风险等级和秒级响应时长自动排序</p>
            </div>
            <Link href="/dispatch" className="text-xs font-medium text-teal-700 hover:text-teal-600">
              进入调度
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[#172033]/8">
            <div className="grid min-w-[760px] grid-cols-[1.1fr_1fr_1fr_0.7fr_0.7fr] bg-[#f5f7fb] px-4 py-2 text-xs font-medium text-[#5d6b82]">
              <span>事件</span>
              <span>位置</span>
              <span>识别来源</span>
              <span>状态</span>
              <span>等待</span>
            </div>
            {activeEvents.map((item) => (
              <Link
                key={item.id}
                href={`/events/${item.id}`}
                className="grid min-w-[760px] grid-cols-[1.1fr_1fr_1fr_0.7fr_0.7fr] items-center border-t border-[#172033]/8 px-4 py-3 text-sm transition-colors hover:bg-[#f5f7fb]"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <RiskBadge risk={item.riskLevel} />
                  <span className="truncate font-medium text-[#172033]">{item.type}</span>
                </span>
                <span className="truncate text-[#5d6b82]">{item.zone}</span>
                <span className="truncate text-[#5d6b82]">{item.source}</span>
                <span className="text-[#172033]">{item.status}</span>
                <span className="font-mono text-xs text-red-600">{item.wait}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#172033]">实时监测缩略图</h2>
              <p className="mt-1 text-xs text-[#5d6b82]">重点区域在线巡检</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              LIVE
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {['/pictures/6.jpg', '/pictures/4.jpg', '/pictures/5.jpg', '/pictures/3.jpg'].map((src, index) => (
              <Link key={src} href="/detect" className="group relative overflow-hidden rounded-xl border border-[#172033]/8">
                <Image
                  src={src}
                  alt="监测画面"
                  width={320}
                  height={180}
                  className="aspect-video w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[11px] text-white">
                  CAM-0{index + 1} · {index === 0 ? '紧急' : index === 2 ? '高风险' : '正常'}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_0.9fr]">
        <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5 xl:col-span-1">
          <h2 className="text-base font-semibold text-[#172033]">今日风险趋势</h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,32,51,0.06)" />
                <XAxis dataKey="time" stroke="rgba(93,107,130,0.55)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(93,107,130,0.55)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(23,32,51,0.08)' }} />
                <Area type="monotone" dataKey="value" stroke="#0d9488" fill="#0d948822" strokeWidth={2} name="告警数" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
          <h2 className="text-base font-semibold text-[#172033]">设备在线状态</h2>
          <div className="mt-4 space-y-3">
            {deviceGroups.map((item) => {
              const pct = Math.round((item.online / item.total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#5d6b82]">
                      <Icon icon={item.icon} className="text-teal-600" />
                      {item.label}
                    </span>
                    <span className="font-medium text-[#172033]">{item.online}/{item.total}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-[#e8edf5]">
                    <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
          <h2 className="text-base font-semibold text-[#172033]">近期事件摘要</h2>
          <div className="mt-4 space-y-3">
            {mockEvents.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-[#172033]">{item.type}</p>
                  <RiskBadge risk={item.riskLevel} />
                </div>
                <p className="mt-1 text-xs text-[#5d6b82]">{item.zone} · {item.time}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#5d6b82]">{item.summary}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
