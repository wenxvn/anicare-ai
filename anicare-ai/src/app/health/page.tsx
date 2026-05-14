'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { mockElderHealthData, type ElderHealthData } from '@/lib/mock-health';

const riskColorMap: Record<string, string> = {
  '低风险': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '中风险': 'text-amber-600 bg-amber-50 border-amber-200',
  '中高风险': 'text-orange-600 bg-orange-50 border-orange-200',
  '高风险': 'text-red-600 bg-red-50 border-red-200',
  '紧急': 'text-red-700 bg-red-100 border-red-300',
  '重点关注': 'text-orange-600 bg-orange-50 border-orange-200',
  '立即处理': 'text-red-700 bg-red-100 border-red-300',
  '需要关注': 'text-amber-600 bg-amber-50 border-amber-200',
  '常规观察': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '正常': 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const emotionIconMap: Record<string, string> = {
  '平稳': 'mdi:emoticon-happy-outline',
  '低落倾向': 'mdi:emoticon-sad-outline',
  '焦虑倾向': 'mdi:emoticon-confused-outline',
  '疲惫': 'mdi:emoticon-neutral-outline',
  '烦躁': 'mdi:emoticon-angry-outline',
  '孤独倾向': 'mdi:emoticon-cry-outline',
  '情绪波动': 'mdi:emoticon-wink-outline',
  '需要关注': 'mdi:alert-circle-outline',
};

function Tag({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className ?? 'border-[#172033]/10 text-[#5d6b82]'}`}>
      {label}
    </span>
  );
}

function ElderRow({ elder, active, onClick }: { elder: ElderHealthData; active: boolean; onClick: () => void }) {
  const urgent = elder.carePriority === '立即处理' || elder.carePriority === '重点关注';
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${active ? 'border-teal-500/35 bg-teal-50/70' : 'border-[#172033]/8 bg-white hover:bg-[#f8fafc]'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-[#172033]">{elder.name}</p>
            {urgent && <span className="h-2 w-2 rounded-full bg-red-500" />}
          </div>
          <p className="mt-1 text-xs text-[#5d6b82]">{elder.room} · {elder.bed} · {elder.careLevel}</p>
        </div>
        <span className="text-xs font-semibold text-[#172033]">{elder.bodyHealthScore}/{elder.mentalHealthScore}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Tag label={elder.carePriority} className={riskColorMap[elder.carePriority]} />
        <Tag label={elder.emotionStatus} className="border-indigo-200 bg-indigo-50 text-indigo-700" />
      </div>
    </button>
  );
}

function Metric({ label, value, icon, tone = 'text-teal-700' }: { label: string; value: string; icon: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#5d6b82]">{label}</p>
        <Icon icon={icon} className={`text-lg ${tone}`} />
      </div>
      <p className="mt-2 text-base font-semibold text-[#172033]">{value}</p>
    </div>
  );
}

function AdviceBlock({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#172033]/8 bg-white p-3">
      <div className="flex items-center gap-2">
        <Icon icon={icon} className="text-base text-teal-700" />
        <p className="text-xs font-semibold text-[#172033]">{title}</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#5d6b82]">{children}</p>
    </div>
  );
}

export default function HealthPage() {
  const [selectedId, setSelectedId] = useState(mockElderHealthData[0].id);
  const selected = mockElderHealthData.find((elder) => elder.id === selectedId) ?? mockElderHealthData[0];

  const overview = useMemo(() => {
    const highRisk = mockElderHealthData.filter((elder) => elder.bodyRiskLevel === '高风险' || elder.mentalRiskLevel === '高风险').length;
    const focus = mockElderHealthData.filter((elder) => elder.carePriority === '重点关注' || elder.carePriority === '立即处理').length;
    const events = mockElderHealthData.reduce((sum, elder) => sum + elder.recentEvents.filter((event) => event.level !== '正常').length, 0);
    const avgBody = Math.round(mockElderHealthData.reduce((sum, elder) => sum + elder.bodyHealthScore, 0) / mockElderHealthData.length);
    return { highRisk, focus, events, avgBody };
  }, []);

  const trendData = selected.trends.dates.map((date, index) => ({
    date,
    body: selected.trends.bodyHealthScores[index],
    mental: selected.trends.mentalHealthScores[index],
    sleep: selected.trends.sleepHours[index],
    wake: selected.trends.wakeUpTimes[index],
    steps: Math.round(selected.trends.steps[index] / 100),
    emotion: selected.trends.emotionScores[index],
  }));

  const careFocus = [
    { label: '巡查频次', value: selected.carePriority === '立即处理' ? '15 分钟' : selected.carePriority === '重点关注' ? '30 分钟' : '2 小时' },
    { label: '重点区域', value: selected.room },
    { label: '交接提醒', value: selected.recentEvents[0]?.type ?? '常规观察' },
  ];

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm text-[#5d6b82]">老人健康档案</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#172033]">健康监护</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5d6b82]">
          以老人档案为中心查看体征、情绪、近期事件和护理建议，便于值班人员快速判断优先级。
        </p>
      </header>

      <section className="grid gap-2 rounded-2xl border border-[#172033]/8 bg-white/88 p-3 shadow-sm sm:grid-cols-4">
        {[
          ['监护人数', `${mockElderHealthData.length}`, 'mdi:account-group-outline', 'text-teal-700'],
          ['高风险老人', `${overview.highRisk}`, 'mdi:alert-circle-outline', 'text-red-600'],
          ['重点关注', `${overview.focus}`, 'mdi:eye-check-outline', 'text-orange-600'],
          ['平均身体分', `${overview.avgBody}`, 'mdi:heart-pulse', 'text-emerald-700'],
        ].map(([label, value, icon, tone]) => (
          <Metric key={label} label={label} value={value} icon={icon} tone={tone} />
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
        <aside className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#172033]">监护列表</h2>
            <span className="rounded-full bg-[#f5f7fb] px-2.5 py-1 text-xs text-[#5d6b82]">{overview.events} 条近期风险</span>
          </div>
          <div className="space-y-2">
            {mockElderHealthData.map((elder) => (
              <ElderRow key={elder.id} elder={elder} active={elder.id === selected.id} onClick={() => setSelectedId(elder.id)} />
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          <motion.section
            key={selected.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-700">
                  <Icon icon="mdi:account-heart-outline" className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#172033]">{selected.name}</h2>
                  <p className="mt-1 text-sm text-[#5d6b82]">{selected.age}岁 · {selected.gender} · {selected.room} {selected.bed} · {selected.careLevel}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag label={selected.bodyRiskLevel} className={riskColorMap[selected.bodyRiskLevel]} />
                <Tag label={selected.mentalRiskLevel} className={riskColorMap[selected.mentalRiskLevel]} />
                <Tag label={selected.carePriority} className={riskColorMap[selected.carePriority]} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="身体健康" value={`${selected.bodyHealthScore} 分`} icon="mdi:heart-pulse" />
              <Metric label="心理健康" value={`${selected.mentalHealthScore} 分`} icon="mdi:brain" tone="text-indigo-700" />
              <Metric label="当前情绪" value={selected.emotionStatus} icon={emotionIconMap[selected.emotionStatus] ?? 'mdi:emoticon-outline'} tone="text-indigo-700" />
              <Metric label="情绪置信度" value={`${Math.round(selected.emotionConfidence * 100)}%`} icon="mdi:bullseye-arrow" tone="text-sky-700" />
            </div>
          </motion.section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#172033]">核心体征</h2>
                <p className="mt-1 text-xs text-[#5d6b82]">保留护理判断最常用的指标，异常项由风险标签提示。</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Metric label="心率" value={`${selected.wearableData.heartRate} bpm`} icon="mdi:heart-pulse" tone="text-red-600" />
              <Metric label="血氧" value={`${selected.wearableData.spo2}%`} icon="mdi:water-percent" tone="text-sky-700" />
              <Metric label="体温" value={`${selected.wearableData.temperature}°C`} icon="mdi:thermometer" tone="text-orange-600" />
              <Metric label="睡眠" value={`${selected.wearableData.sleepHours} 小时`} icon="mdi:sleep" tone="text-indigo-700" />
              <Metric label="步数" value={`${selected.wearableData.steps} 步`} icon="mdi:walk" />
            </div>
          </section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <h2 className="text-base font-semibold text-[#172033]">近 7 天趋势</h2>
            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5d6b82' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5d6b82' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf5', fontSize: 12 }} />
                    <Line type="monotone" dataKey="body" name="身体健康" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="mental" name="心理健康" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5d6b82' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5d6b82' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf5', fontSize: 12 }} />
                    <Area type="monotone" dataKey="sleep" name="睡眠小时" stroke="#6366f1" fill="#6366f122" strokeWidth={2} />
                    <Area type="monotone" dataKey="steps" name="步数/100" stroke="#0d9488" fill="#0d948822" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
              <h2 className="text-base font-semibold text-[#172033]">夜间醒来与离床</h2>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5d6b82' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5d6b82' }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf5', fontSize: 12 }} />
                    <Bar dataKey="wake" name="醒来次数" fill="#0d9488" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
              <h2 className="text-base font-semibold text-[#172033]">情绪评分趋势</h2>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8edf5" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5d6b82' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5d6b82' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e8edf5', fontSize: 12 }} />
                    <Area type="monotone" dataKey="emotion" name="情绪评分" stroke="#6366f1" fill="#6366f122" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
        </main>

        <aside className="space-y-4">
          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:clipboard-pulse-outline" className="text-lg text-teal-700" />
              <h2 className="text-base font-semibold text-[#172033]">护理建议</h2>
            </div>
            <div className="mt-4 space-y-3">
              <AdviceBlock title="身体健康" icon="mdi:heart-pulse">{selected.suggestions.physical}</AdviceBlock>
              <AdviceBlock title="心理健康" icon="mdi:brain">{selected.suggestions.mental}</AdviceBlock>
              <AdviceBlock title="护理员处置" icon="mdi:account-nurse">{selected.suggestions.caregiver}</AdviceBlock>
              <AdviceBlock title="家属沟通" icon="mdi:account-heart-outline">{selected.suggestions.family}</AdviceBlock>
            </div>
          </section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:calendar-clock" className="text-lg text-teal-700" />
              <h2 className="text-base font-semibold text-[#172033]">今日护理安排</h2>
            </div>
            <div className="mt-4 grid gap-3">
              {careFocus.map((item) => (
                <div key={item.label} className="rounded-xl bg-[#f8fafc] p-3">
                  <p className="text-xs text-[#5d6b82]">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-[#172033]">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:alert-octagon-outline" className="text-lg text-red-600" />
              <h2 className="text-base font-semibold text-[#172033]">近期事件</h2>
            </div>
            <div className="mt-4 space-y-3">
              {selected.recentEvents.map((event) => (
                <div key={`${event.time}-${event.type}`} className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#172033]">{event.type}</p>
                    <Tag label={event.level} className={riskColorMap[event.level]} />
                  </div>
                  <p className="mt-1 text-xs text-[#5d6b82]">{event.time}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5d6b82]">{event.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:information-outline" className="text-lg text-indigo-700" />
              <h2 className="text-sm font-semibold text-indigo-900">AI 研判说明</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-indigo-900/80">{selected.emotionAnalysis.aiReasoning}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
