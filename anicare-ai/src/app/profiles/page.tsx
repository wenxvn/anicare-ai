'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { fetchJson } from '@/lib/api-client';
import { mockResidentProfiles } from '@/lib/mock-data';
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ResidentProfile } from '@/types';

const extraProfiles: ResidentProfile[] = [
  {
    id: 'res-006',
    name: '赵文秀',
    room: 'C栋206',
    age: 85,
    riskTags: ['食欲下降', '睡眠不足'],
    todayStatus: '连续低活跃，护理员已复核',
    avgWakeTime: '07:20',
    avgActiveHours: 3.8,
    frequentZones: ['房间', '护理站', '花园'],
    nightLeaveCount: 2.8,
    weeklyAnomalies: 6,
    todayDeviation: 74,
    deviationSummary: '赵奶奶近 7 天活动半径明显缩小，夜间醒来次数增加，今天午后未参加常规活动，系统判定需要重点关注。',
    weeklyActivityTrend: [
      { day: '周一', hours: 5.1 }, { day: '周二', hours: 4.8 }, { day: '周三', hours: 4.4 },
      { day: '周四', hours: 4.0 }, { day: '周五', hours: 3.6 }, { day: '周六', hours: 3.9 }, { day: '周日', hours: 3.2 },
    ],
    nightLeaveTrend: [
      { day: '周一', count: 2 }, { day: '周二', count: 3 }, { day: '周三', count: 2 },
      { day: '周四', count: 4 }, { day: '周五', count: 3 }, { day: '周六', count: 2 }, { day: '周日', count: 4 },
    ],
    riskEventTrend: [
      { day: '周一', count: 1 }, { day: '周二', count: 1 }, { day: '周三', count: 0 },
      { day: '周四', count: 2 }, { day: '周五', count: 1 }, { day: '周六', count: 1 }, { day: '周日', count: 2 },
    ],
  },
  {
    id: 'res-007',
    name: '孙丽芳',
    room: 'A栋405',
    age: 76,
    riskTags: ['情绪波动', '社交减少'],
    todayStatus: '情绪低落标记，观察中',
    avgWakeTime: '06:45',
    avgActiveHours: 6.1,
    frequentZones: ['活动室', '花园', '餐厅'],
    nightLeaveCount: 1.1,
    weeklyAnomalies: 3,
    todayDeviation: 58,
    deviationSummary: '孙阿姨今日活动量尚可，但主动交流次数低于平时，且晚餐后独自在房间停留时间变长，需要护理员主动沟通。',
    weeklyActivityTrend: [
      { day: '周一', hours: 6.8 }, { day: '周二', hours: 6.4 }, { day: '周三', hours: 6.9 },
      { day: '周四', hours: 5.9 }, { day: '周五', hours: 5.6 }, { day: '周六', hours: 6.0 }, { day: '周日', hours: 4.7 },
    ],
    nightLeaveTrend: [
      { day: '周一', count: 1 }, { day: '周二', count: 1 }, { day: '周三', count: 2 },
      { day: '周四', count: 1 }, { day: '周五', count: 1 }, { day: '周六', count: 1 }, { day: '周日', count: 2 },
    ],
    riskEventTrend: [
      { day: '周一', count: 0 }, { day: '周二', count: 0 }, { day: '周三', count: 1 },
      { day: '周四', count: 0 }, { day: '周五', count: 1 }, { day: '周六', count: 0 }, { day: '周日', count: 1 },
    ],
  },
  {
    id: 'res-008',
    name: '周志明',
    room: 'C栋108',
    age: 73,
    riskTags: ['常规观察', '康复训练'],
    todayStatus: '状态稳定，常规巡查',
    avgWakeTime: '06:10',
    avgActiveHours: 7.6,
    frequentZones: ['康复区', '活动室', '餐厅'],
    nightLeaveCount: 0.7,
    weeklyAnomalies: 1,
    todayDeviation: 22,
    deviationSummary: '周叔整体活动节律稳定，今日康复训练完成度较好，系统判定为低风险，仅需保持常规巡查。',
    weeklyActivityTrend: [
      { day: '周一', hours: 7.2 }, { day: '周二', hours: 7.8 }, { day: '周三', hours: 7.4 },
      { day: '周四', hours: 7.9 }, { day: '周五', hours: 7.1 }, { day: '周六', hours: 7.5 }, { day: '周日', hours: 7.0 },
    ],
    nightLeaveTrend: [
      { day: '周一', count: 1 }, { day: '周二', count: 0 }, { day: '周三', count: 1 },
      { day: '周四', count: 1 }, { day: '周五', count: 0 }, { day: '周六', count: 1 }, { day: '周日', count: 1 },
    ],
    riskEventTrend: [
      { day: '周一', count: 0 }, { day: '周二', count: 0 }, { day: '周三', count: 0 },
      { day: '周四', count: 0 }, { day: '周五', count: 0 }, { day: '周六', count: 0 }, { day: '周日', count: 1 },
    ],
  },
];

const avatarMap: Record<string, string> = {
  'res-001': '/avatars/elder-1.jpg',
  'res-002': '/avatars/elder-2.jpg',
  'res-003': '/avatars/elder-3.jpg',
  'res-004': '/avatars/elder-4.jpg',
  'res-005': '/avatars/elder-5.jpg',
  'res-006': '/avatars/elder-6.jpg',
  'res-007': '/avatars/elder-7.jpg',
  'res-008': '/avatars/elder-8.jpg',
};

const initialProfiles = [...mockResidentProfiles, ...extraProfiles];

function statusDot(status: string) {
  if (status.includes('待处理') || status.includes('摔倒') || status.includes('复核')) return 'bg-red-500 animate-pulse';
  if (status.includes('已通知') || status.includes('待确认') || status.includes('观察')) return 'bg-orange-500';
  if (status.includes('滞留') || status.includes('低落')) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function deviationTone(value: number) {
  if (value >= 70) return 'bg-red-500';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function ProfileAvatar({ profile, size = 'md' }: { profile: ResidentProfile; size?: 'md' | 'lg' }) {
  const dimension = size === 'lg' ? 'h-20 w-20' : 'h-14 w-14';
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-2xl border border-[#172033]/8 bg-teal-50 ${dimension}`}>
      <Image
        src={avatarMap[profile.id] ?? '/avatars/elder-1.jpg'}
        alt={`${profile.name}头像`}
        fill
        sizes={size === 'lg' ? '80px' : '56px'}
        className="object-cover"
      />
    </div>
  );
}

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<ResidentProfile[]>(initialProfiles);
  const [selected, setSelected] = useState<ResidentProfile | null>(null);

  useEffect(() => {
    fetchJson<ResidentProfile[]>('/api/profiles').then((items) => {
      if (items.length > profiles.length) {
        setProfiles(items);
      }
    }).catch(() => {});
  }, [profiles.length]);

  const stats = useMemo(() => {
    const high = profiles.filter((profile) => profile.todayDeviation >= 70).length;
    const watch = profiles.filter((profile) => profile.todayDeviation >= 40 && profile.todayDeviation < 70).length;
    const avg = profiles.length ? Math.round(profiles.reduce((sum, profile) => sum + profile.todayDeviation, 0) / profiles.length) : 0;
    return { high, watch, avg };
  }, [profiles]);

  return (
    <div className="space-y-8">
      <SectionHeader title="老人行为画像" description="" />

      {!selected ? (
        <>
          <section className="grid gap-3 rounded-2xl border border-[#172033]/8 bg-white/88 p-3 shadow-sm sm:grid-cols-3">
            {[
              { label: '画像档案', value: profiles.length, icon: 'mdi:account-group-outline', tone: 'text-teal-700' },
              { label: '高偏离老人', value: stats.high, icon: 'mdi:alert-circle-outline', tone: 'text-red-600' },
              { label: '平均偏离度', value: `${stats.avg}%`, icon: 'mdi:chart-bell-curve-cumulative', tone: 'text-amber-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-4 py-3">
                <div>
                  <p className="text-xs text-[#5d6b82]">{item.label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#172033]">{item.value}</p>
                </div>
                <Icon icon={item.icon} className={`text-2xl ${item.tone}`} />
              </div>
            ))}
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {profiles.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => setSelected(p)}
                className="card-glow cursor-pointer rounded-3xl border border-[#172033]/8 bg-white p-5 transition-colors hover:border-teal-500/25"
              >
                <div className="flex items-start justify-between gap-4">
                  <ProfileAvatar profile={p} />
                  <div className="flex min-w-0 flex-1 flex-wrap justify-end gap-1">
                    {p.riskTags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600">{tag}</span>
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-base font-semibold text-[#172033]">{p.name}</p>
                <p className="text-xs text-[#5d6b82]/65">{p.room} · {p.age} 岁</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`inline-block h-2 w-2 rounded-full ${statusDot(p.todayStatus)}`} />
                  <span className="min-w-0 truncate text-sm text-[#5d6b82]">{p.todayStatus}</span>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-[#f8fafc] px-2 py-2 text-center">
                    <p className="text-[10px] text-[#5d6b82]/60">偏离</p>
                    <p className="text-sm font-semibold text-[#172033]">{p.todayDeviation}%</p>
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] px-2 py-2 text-center">
                    <p className="text-[10px] text-[#5d6b82]/60">活动</p>
                    <p className="text-sm font-semibold text-[#172033]">{p.avgActiveHours}h</p>
                  </div>
                  <div className="rounded-xl bg-[#f8fafc] px-2 py-2 text-center">
                    <p className="text-[10px] text-[#5d6b82]/60">异常</p>
                    <p className="text-sm font-semibold text-[#172033]">{p.weeklyAnomalies}</p>
                  </div>
                </div>
                <div className="mt-4 text-xs font-medium text-teal-600">
                  点击查看行为画像 →
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <button onClick={() => setSelected(null)} className="mb-6 inline-flex items-center gap-1.5 rounded-2xl border border-[#172033]/10 px-4 py-2 text-sm text-[#5d6b82] transition-colors hover:border-teal-500/40 hover:text-teal-700">
              <Icon icon="mdi:arrow-left" className="text-base" />
              返回老人列表
            </button>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_420px]">
              <div className="space-y-5">
                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <ProfileAvatar profile={selected} size="lg" />
                      <div>
                        <p className="text-2xl font-semibold text-[#172033]">{selected.name}</p>
                        <p className="mt-1 text-sm text-[#5d6b82]">{selected.room} · {selected.age} 岁</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selected.riskTags.map((tag) => (
                            <span key={tag} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-600">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-[220px] rounded-2xl bg-[#f8fafc] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#5d6b82]">今日偏离度</p>
                        <span className="text-2xl font-semibold text-[#172033]">{selected.todayDeviation}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-[#e8edf5]">
                        <div className={`h-2 rounded-full ${deviationTone(selected.todayDeviation)}`} style={{ width: `${selected.todayDeviation}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">日常习惯数据</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {[
                      { label: '平均起床时间', value: selected.avgWakeTime, icon: 'mdi:weather-sunset-up' },
                      { label: '日均活动时长', value: `${selected.avgActiveHours} 小时`, icon: 'mdi:walk' },
                      { label: '常去区域', value: selected.frequentZones.join('、'), icon: 'mdi:map-marker-path' },
                      { label: '周均夜间离床', value: `${selected.nightLeaveCount} 次`, icon: 'mdi:bed' },
                      { label: '近 7 天异常', value: `${selected.weeklyAnomalies} 次`, icon: 'mdi:alert-circle-outline' },
                      { label: '当前状态', value: selected.todayStatus, icon: 'mdi:pulse' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-[#172033]/8 bg-[#f5f7fb] p-3">
                        <div className="flex items-center gap-2">
                          <Icon icon={item.icon} className="text-sm text-teal-600" />
                          <span className="text-xs text-[#5d6b82]/65">{item.label}</span>
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-[#172033]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:clipboard-text-search-outline" className="text-lg text-teal-600" />
                      <p className="text-sm font-semibold text-[#172033]">本周护理关注摘要</p>
                    </div>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">自动生成</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#5d6b82]">{selected.deviationSummary}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { label: '重点巡查', value: selected.frequentZones[0] ?? selected.room },
                      { label: '关注原因', value: selected.riskTags[0] ?? '行为波动' },
                      { label: '建议频次', value: selected.todayDeviation >= 70 ? '每 30 分钟' : selected.todayDeviation >= 40 ? '每 1 小时' : '每 2 小时' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl bg-[#f5f7fb] p-3">
                        <p className="text-xs text-[#5d6b82]/65">{item.label}</p>
                        <p className="mt-1 text-sm font-semibold text-[#172033]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">7 天活动趋势</p>
                  <p className="mt-1 text-xs text-[#5d6b82]">每天的活动时长（小时）</p>
                  <div className="mt-4 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selected.weeklyActivityTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,32,51,0.06)" />
                        <XAxis dataKey="day" stroke="rgba(93,107,130,0.5)" tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(93,107,130,0.5)" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(23,32,51,0.08)' }} />
                        <Area type="monotone" dataKey="hours" stroke="#0d9488" fill="#0d948822" strokeWidth={2} name="活动时长" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#172033]">夜间离床次数趋势</p>
                    <p className="mt-1 text-xs text-[#5d6b82]">每晚离床次数</p>
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selected.nightLeaveTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,32,51,0.06)" />
                          <XAxis dataKey="day" stroke="rgba(93,107,130,0.5)" tickLine={false} axisLine={false} fontSize={12} />
                          <YAxis stroke="rgba(93,107,130,0.5)" tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(23,32,51,0.08)' }} />
                          <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} name="离床次数" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#172033]">风险事件频次</p>
                    <p className="mt-1 text-xs text-[#5d6b82]">每天触发的风险事件数</p>
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selected.riskEventTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(23,32,51,0.06)" />
                          <XAxis dataKey="day" stroke="rgba(93,107,130,0.5)" tickLine={false} axisLine={false} fontSize={12} />
                          <YAxis stroke="rgba(93,107,130,0.5)" tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(23,32,51,0.08)' }} />
                          <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]} name="风险事件" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="card-glow rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-white to-white p-5">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Icon icon="mdi:brain" className="text-xl" />
                    <p className="text-sm font-semibold">行为偏离分析</p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-3xl font-bold text-[#172033]">{selected.todayDeviation}<span className="text-base text-[#5d6b82]/50">%</span></span>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-[#e8edf5]">
                          <div className={`h-2 rounded-full ${deviationTone(selected.todayDeviation)}`} style={{ width: `${selected.todayDeviation}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-[#5d6b82]/65">今日行为偏离度</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#5d6b82]">{selected.deviationSummary}</p>
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">今日状态</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${statusDot(selected.todayStatus)}`} />
                    <span className="text-sm text-[#172033]">{selected.todayStatus}</span>
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">常去区域</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.frequentZones.map((zone) => (
                      <span key={zone} className="rounded-2xl border border-[#172033]/8 bg-[#f5f7fb] px-3 py-1.5 text-xs text-[#5d6b82]">
                        <Icon icon="mdi:map-marker-outline" className="mr-1 inline text-sm text-teal-600" />
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">今日轨迹摘要</p>
                  <div className="mt-4 space-y-3">
                    {[
                      ['06:30', '起床后前往餐厅'],
                      ['09:20', `停留于${selected.frequentZones[0] ?? '活动区'}`],
                      ['14:40', selected.todayStatus],
                      ['17:20', '进入晚间护理观察'],
                    ].map(([time, text]) => (
                      <div key={`${time}-${text}`} className="flex gap-3">
                        <span className="w-12 shrink-0 font-mono text-xs text-[#5d6b82]">{time}</span>
                        <p className="text-sm leading-relaxed text-[#172033]">{text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">风险标签</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.riskTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-5">
                  <p className="text-sm font-semibold text-indigo-900">护理提醒</p>
                  <p className="mt-2 text-sm leading-relaxed text-indigo-900/80">
                    建议交接班时复核 {selected.name} 的夜间离床记录、常去区域和今日偏离度。若偏离度持续高于 70%，应同步风险调度中心生成巡查工单。
                  </p>
                </div>
              </aside>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
