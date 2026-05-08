'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { mockElderHealthData, type ElderHealthData } from '@/lib/mock-health';

const riskColorMap: Record<string, string> = {
  '低风险': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '中风险': 'text-amber-600 bg-amber-50 border-amber-200',
  '中高风险': 'text-orange-600 bg-orange-50 border-orange-200',
  '高风险': 'text-red-600 bg-red-50 border-red-200',
  '紧急': 'text-red-700 bg-red-100 border-red-300',
  '重点关注': 'text-orange-600 bg-orange-50 border-orange-200',
};

const carePriorityColorMap: Record<string, string> = {
  '常规观察': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '需要关注': 'text-amber-600 bg-amber-50 border-amber-200',
  '重点关注': 'text-orange-600 bg-orange-50 border-orange-200',
  '立即处理': 'text-red-700 bg-red-100 border-red-300',
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

const emotionColorMap: Record<string, string> = {
  '平稳': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  '低落倾向': 'text-blue-600 bg-blue-50 border-blue-200',
  '焦虑倾向': 'text-orange-600 bg-orange-50 border-orange-200',
  '疲惫': 'text-gray-600 bg-gray-50 border-gray-200',
  '烦躁': 'text-red-600 bg-red-50 border-red-200',
  '孤独倾向': 'text-purple-600 bg-purple-50 border-purple-200',
  '情绪波动': 'text-amber-600 bg-amber-50 border-amber-200',
  '需要关注': 'text-red-600 bg-red-50 border-red-200',
};

function HealthScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#f3efe8" strokeWidth="6" />
        <circle cx="44" cy="44" r={radius} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 44 44)" />
        <text x="44" y="44" textAnchor="middle" dominantBaseline="central" className="text-lg font-bold" fill="#1a1615">{score}</text>
      </svg>
      <span className="mt-1 text-xs text-[#5c524a]">{label}</span>
    </div>
  );
}

function MiniTag({ label, className }: { label: string; className?: string }) {
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${className ?? 'border-[#1a1615]/10 text-[#5c524a]'}`}>{label}</span>;
}

function ScoreBar({ label, value, max = 100, color = '#0d9488' }: { label: string; value: number; max?: number; color?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#5c524a]">{label}</span>
        <span className="font-medium text-[#1a1615]">{value}{max === 100 ? '' : `/${max}`}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#f3efe8]">
        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function ElderListItem({ elder, selected, onClick }: { elder: ElderHealthData; selected: boolean; onClick: () => void }) {
  const isHighPriority = elder.carePriority === '立即处理' || elder.carePriority === '重点关注';
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      onClick={onClick}
      className={`w-full rounded-2xl border p-3 text-left transition-all ${selected ? 'border-teal-500/40 bg-teal-500/5' : 'border-[#1a1615]/8 bg-white hover:border-teal-500/20'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
            <Icon icon="mdi:account-heart-outline" className="text-base" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1615]">{elder.name}</p>
            <p className="text-[10px] text-[#5c524a]/60">{elder.age}岁 · {elder.gender} · {elder.room} {elder.bed}</p>
          </div>
        </div>
        {isHighPriority && <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <MiniTag label={elder.emotionStatus} className={emotionColorMap[elder.emotionStatus]} />
        <MiniTag label={elder.bodyRiskLevel} className={riskColorMap[elder.bodyRiskLevel]} />
        <MiniTag label={elder.carePriority} className={carePriorityColorMap[elder.carePriority]} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-[#f8f5f0] px-2 py-1 text-center">
          <p className="text-[10px] text-[#5c524a]/50">身体</p>
          <p className="text-sm font-semibold text-[#1a1615]">{elder.bodyHealthScore}</p>
        </div>
        <div className="rounded-lg bg-[#f8f5f0] px-2 py-1 text-center">
          <p className="text-[10px] text-[#5c524a]/50">心理</p>
          <p className="text-sm font-semibold text-[#1a1615]">{elder.mentalHealthScore}</p>
        </div>
      </div>
    </motion.button>
  );
}

export default function HealthPage() {
  const [selectedId, setSelectedId] = useState<string>(mockElderHealthData[0].id);
  const selected = mockElderHealthData.find((e) => e.id === selectedId) ?? mockElderHealthData[0];
  const radarData = [
    { subject: '心率', value: selected.wearableData.heartRate, fullMark: 120 },
    { subject: '血氧', value: selected.wearableData.spo2, fullMark: 100 },
    { subject: '活动', value: Math.min(selected.wearableData.steps / 80, 100), fullMark: 100 },
    { subject: '睡眠', value: (selected.wearableData.sleepHours / 9) * 100, fullMark: 100 },
    { subject: '情绪', value: selected.trends.emotionScores[6], fullMark: 100 },
    { subject: '社交', value: selected.mentalHealthScore, fullMark: 100 },
  ];
  const stressEvents = mockElderHealthData.reduce((s, e) => s + e.recentEvents.filter((ev) => ev.level !== '正常').length, 0);
  const highRiskCount = mockElderHealthData.filter((e) => e.bodyRiskLevel === '高风险' || e.mentalRiskLevel === '高风险').length;
  const focusCount = mockElderHealthData.filter((e) => e.carePriority === '重点关注' || e.carePriority === '立即处理').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1615] sm:text-4xl">健康监护</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5c524a]">
            面向医养结合机构的智慧养老健康监护系统，融合可穿戴传感器数据、行为状态、情绪识别、心理健康风险提示和 AI 健康建议，为护理员提供身体健康与精神健康的综合辅助判断。
          </p>
        </motion.header>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5c524a]">监护老人总数</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1a1615]">{mockElderHealthData.length}</p>
            </div>
            <div className="rounded-2xl bg-teal-500/10 p-2 text-teal-600"><Icon icon="mdi:account-group" className="text-xl" /></div>
          </div>
          <p className="mt-3 text-xs text-[#5c524a]/50">当前系统监护中的老人</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5c524a]">高风险老人</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-red-600">{highRiskCount}</p>
            </div>
            <div className="rounded-2xl bg-red-500/10 p-2 text-red-600"><Icon icon="mdi:alert-circle-outline" className="text-xl" /></div>
          </div>
          <p className="mt-3 text-xs text-[#5c524a]/50">身体或心理高风险需重点关注</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5c524a]">重点关注老人</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-orange-600">{focusCount}</p>
            </div>
            <div className="rounded-2xl bg-orange-500/10 p-2 text-orange-600"><Icon icon="mdi:eye-check-outline" className="text-xl" /></div>
          </div>
          <p className="mt-3 text-xs text-[#5c524a]/50">需要重点关注或立即处理</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#5c524a]">近期风险事件</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-[#1a1615]">{stressEvents}</p>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-2 text-amber-600"><Icon icon="mdi:alert-octagon-outline" className="text-xl" /></div>
          </div>
          <p className="mt-3 text-xs text-[#5c524a]/50">近期内需要关注的健康事件</p>
        </motion.div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          <p className="mb-2 text-sm font-semibold text-[#1a1615]">监护列表</p>
          {mockElderHealthData.map((elder) => (
            <ElderListItem key={elder.id} elder={elder} selected={elder.id === selectedId} onClick={() => setSelectedId(elder.id)} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-5">

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                    <Icon icon="mdi:account-heart-outline" className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#1a1615]">{selected.name}</p>
                    <p className="text-xs text-[#5c524a]">{selected.age}岁 · {selected.gender} · {selected.room} {selected.bed} · {selected.careLevel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MiniTag label={selected.emotionStatus} className={emotionColorMap[selected.emotionStatus]} />
                  <MiniTag label={selected.bodyRiskLevel} className={riskColorMap[selected.bodyRiskLevel]} />
                  <MiniTag label={selected.mentalRiskLevel} className={riskColorMap[selected.mentalRiskLevel]} />
                  <MiniTag label={selected.carePriority} className={carePriorityColorMap[selected.carePriority]} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-around">
                <HealthScoreRing score={selected.bodyHealthScore} label="身体健康" color="#0d9488" />
                <HealthScoreRing score={selected.mentalHealthScore} label="心理健康" color="#6366f1" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-[#1a1615]">{(selected.emotionConfidence * 100).toFixed(0)}%</span>
                  <span className="mt-1 text-xs text-[#5c524a]">情绪置信度</span>
                </div>
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="mdi:heart-pulse" className="text-lg text-teal-600" />
                <p className="text-sm font-semibold text-[#1a1615]">身体健康监护</p>
              </div>
              <p className="mb-4 text-xs text-[#5c524a]/60">系统融合可穿戴传感器数据与环境监控数据，对老人心率、血氧、体温、呼吸频率、活动量、睡眠状态、久卧和离床行为进行综合分析，辅助护理员及时发现潜在身体健康风险。</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: '心率', value: `${selected.wearableData.heartRate} bpm`, icon: 'mdi:heart-pulse', ok: selected.wearableData.heartRate >= 60 && selected.wearableData.heartRate <= 100 },
                  { label: '血氧 SpO₂', value: `${selected.wearableData.spo2}%`, icon: 'mdi:water-percent', ok: selected.wearableData.spo2 >= 95 },
                  { label: '体温', value: `${selected.wearableData.temperature}°C`, icon: 'mdi:thermometer', ok: selected.wearableData.temperature >= 36 && selected.wearableData.temperature <= 37.3 },
                  { label: '呼吸频率', value: `${selected.wearableData.respiratoryRate} 次/分`, icon: 'mdi:lungs', ok: selected.wearableData.respiratoryRate >= 12 && selected.wearableData.respiratoryRate <= 20 },
                  { label: '今日步数', value: `${selected.wearableData.steps} 步`, icon: 'mdi:walk', ok: selected.wearableData.steps >= 2000 },
                  { label: '活动时长', value: `${selected.wearableData.activeMinutes} 分钟`, icon: 'mdi:run', ok: selected.wearableData.activeMinutes >= 30 },
                  { label: '久坐/久卧', value: `${selected.wearableData.sedentaryHours} 小时`, icon: 'mdi:bed-clock', ok: selected.wearableData.sedentaryHours <= 8 },
                  { label: '睡眠时长', value: `${selected.wearableData.sleepHours} 小时`, icon: 'mdi:sleep', ok: selected.wearableData.sleepHours >= 6 },
                  { label: '夜间醒来', value: `${selected.wearableData.wakeUpTimes} 次`, icon: 'mdi:alert-circle-outline', ok: selected.wearableData.wakeUpTimes <= 2 },
                  { label: '夜间离床', value: `${selected.wearableData.bedExitTimes} 次`, icon: 'mdi:bed-outline', ok: selected.wearableData.bedExitTimes <= 2 },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-3 rounded-2xl border p-3 ${item.ok ? 'border-[#1a1615]/8 bg-[#f8f5f0]' : 'border-red-200 bg-red-50'}`}>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.ok ? 'bg-teal-500/10 text-teal-600' : 'bg-red-500/10 text-red-600'}`}>
                      <Icon icon={item.icon} className="text-lg" />
                    </div>
                    <div>
                      <p className="text-[10px] text-[#5c524a]/50">{item.label}</p>
                      <p className={`text-sm font-semibold ${item.ok ? 'text-[#1a1615]' : 'text-red-600'}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-[#f8f5f0] px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">跌倒风险</p>
                  <p className={`text-xs font-semibold ${selected.bodyRiskLevel === '高风险' || selected.bodyRiskLevel === '紧急' ? 'text-red-600' : 'text-[#1a1615]'}`}>{selected.wearableData.steps < 2000 ? '偏高' : '正常'}</p>
                </div>
                <div className="rounded-xl bg-[#f8f5f0] px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">活动量异常</p>
                  <p className={`text-xs font-semibold ${selected.wearableData.steps < 1500 ? 'text-red-600' : selected.wearableData.steps < 3000 ? 'text-amber-600' : 'text-[#1a1615]'}`}>{selected.wearableData.steps < 1500 ? '严重偏低' : selected.wearableData.steps < 3000 ? '偏低' : '正常'}</p>
                </div>
                <div className="rounded-xl bg-[#f8f5f0] px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">睡眠质量</p>
                  <p className={`text-xs font-semibold ${selected.wearableData.sleepHours < 5 ? 'text-red-600' : selected.wearableData.sleepHours < 6 ? 'text-amber-600' : 'text-[#1a1615]'}`}>{selected.wearableData.sleepHours < 5 ? '严重不足' : selected.wearableData.sleepHours < 6 ? '偏低' : '正常'}</p>
                </div>
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="mdi:brain" className="text-lg text-indigo-600" />
                <p className="text-sm font-semibold text-[#1a1615]">情绪状态 AI 判断</p>
              </div>
              <p className="mb-4 text-xs text-[#5c524a]/60">心理健康分析结果仅作为护理辅助参考，不能替代专业医学诊断。</p>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-2">
                  <Icon icon={emotionIconMap[selected.emotionStatus] ?? 'mdi:emoticon-outline'} className="text-xl text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">当前情绪：{selected.emotionStatus}</span>
                </div>
                <span className="text-xs text-[#5c524a]">置信度 {(selected.emotionConfidence * 100).toFixed(0)}%</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: '面部表情特征', value: selected.emotionAnalysis.facialExpression, icon: 'mdi:face-recognition' },
                  { label: '行为状态', value: selected.emotionAnalysis.behaviorPattern, icon: 'mdi:walk' },
                  { label: '生理信号', value: selected.emotionAnalysis.physiologicalSignal, icon: 'mdi:heart-pulse' },
                  { label: '互动数据', value: selected.emotionAnalysis.interactionFrequency, icon: 'mdi:account-multiple' },
                  { label: '历史趋势', value: selected.emotionAnalysis.historicalTrend, icon: 'mdi:chart-line' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-2xl bg-[#f8f5f0] px-4 py-3">
                    <Icon icon={item.icon} className="mt-0.5 shrink-0 text-base text-[#5c524a]/50" />
                    <div>
                      <p className="text-xs font-medium text-[#5c524a]">{item.label}</p>
                      <p className="mt-0.5 text-sm text-[#1a1615]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="mdi:shield-alert-outline" className="text-lg text-amber-600" />
                <p className="text-sm font-semibold text-[#1a1615]">心理健康风险筛查</p>
              </div>
              <p className="mb-4 text-xs text-[#5c524a]/60">心理健康分析结果仅作为护理辅助参考，不能替代专业医学诊断。</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: '抑郁风险提示', value: selected.mentalRisk.depressionRisk, icon: 'mdi:emoticon-sad-outline' },
                  { label: '焦虑倾向筛查', value: selected.mentalRisk.anxietyRisk, icon: 'mdi:emoticon-confused-outline' },
                  { label: '孤独风险', value: selected.mentalRisk.lonelinessRisk, icon: 'mdi:account-off-outline' },
                  { label: '睡眠异常风险', value: selected.mentalRisk.sleepRisk, icon: 'mdi:sleep-off' },
                  { label: '情绪波动风险', value: selected.mentalRisk.emotionFluctuationRisk, icon: 'mdi:swap-vertical' },
                  { label: '互动减少风险', value: selected.mentalRisk.interactionDecreaseRisk, icon: 'mdi:account-arrow-down-outline' },
                  { label: '长期低活动风险', value: selected.mentalRisk.longTermLowActivityRisk, icon: 'mdi:trending-down' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#1a1615]/8 px-4 py-3">
                    <Icon icon={item.icon} className="shrink-0 text-lg text-[#5c524a]/40" />
                    <div className="flex-1">
                      <p className="text-xs text-[#5c524a]">{item.label}</p>
                    </div>
                    <MiniTag label={item.value} className={riskColorMap[item.value] ?? 'border-[#1a1615]/10 text-[#5c524a]'} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 via-white to-white p-5">
              <div className="flex items-center gap-2 mb-1">
                <Icon icon="mdi:lightbulb-on-outline" className="text-lg text-indigo-600" />
                <p className="text-sm font-semibold text-[#1a1615]">AI 决策依据</p>
              </div>
              <p className="mb-4 text-xs text-[#5c524a]/60">基于多模态数据融合与特征权重分析，AI 综合判断当前老人身心状态。</p>
              <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-relaxed text-[#5c524a]">{selected.emotionAnalysis.aiReasoning}</div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div className="rounded-xl bg-white/70 px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">情绪置信度</p>
                  <p className="text-base font-semibold text-[#1a1615]">{(selected.emotionConfidence * 100).toFixed(0)}%</p>
                </div>
                <div className="rounded-xl bg-white/70 px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">身体风险</p>
                  <p className="text-base font-semibold text-[#1a1615]">{selected.bodyRiskLevel}</p>
                </div>
                <div className="rounded-xl bg-white/70 px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">心理风险</p>
                  <p className="text-base font-semibold text-[#1a1615]">{selected.mentalRiskLevel}</p>
                </div>
                <div className="rounded-xl bg-white/70 px-3 py-2 text-center">
                  <p className="text-[10px] text-[#5c524a]/50">护理等级</p>
                  <p className="text-base font-semibold text-[#1a1615]">{selected.carePriority}</p>
                </div>
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/5 via-white to-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon icon="mdi:file-document-outline" className="text-lg text-teal-600" />
                <p className="text-sm font-semibold text-[#1a1615]">AI 健康分析摘要</p>
              </div>
              <p className="rounded-2xl bg-white/70 px-4 py-3 text-sm leading-relaxed text-[#5c524a]">
                AI 综合分析显示，该老人当前身体健康指数为 <span className="font-semibold text-[#1a1615]">{selected.bodyHealthScore}</span>，
                心理健康指数为 <span className="font-semibold text-[#1a1615]">{selected.mentalHealthScore}</span>，
                情绪状态为 <span className="font-semibold text-[#1a1615]">{selected.emotionStatus}</span>（置信度 {(selected.emotionConfidence * 100).toFixed(0)}%）。
                身体健康风险为 <span className="font-semibold text-[#1a1615]">{selected.bodyRiskLevel}</span>，
                心理健康风险为 <span className="font-semibold text-[#1a1615]">{selected.mentalRiskLevel}</span>，
                综合护理等级为 <span className="font-semibold text-[#1a1615]">{selected.carePriority}</span>。
                {selected.carePriority === '立即处理' || selected.carePriority === '重点关注'
                  ? '建议护理员立即进行现场评估并记录老人当前状态，同时通知值班医护。'
                  : selected.carePriority === '需要关注'
                  ? '建议护理员增加巡查频次，关注老人身体和情绪变化。'
                  : '建议保持常规观察，维持当前护理安排。'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: '身体健康建议', icon: 'mdi:heart-pulse', color: 'text-teal-600', bg: 'from-teal-500/5', text: selected.suggestions.physical },
                { title: '精神健康建议', icon: 'mdi:brain', color: 'text-indigo-600', bg: 'from-indigo-500/5', text: selected.suggestions.mental },
                { title: '护理员处置建议', icon: 'mdi:account-nurse', color: 'text-amber-600', bg: 'from-amber-500/5', text: selected.suggestions.caregiver },
                { title: '家属沟通建议', icon: 'mdi:account-heart-outline', color: 'text-rose-600', bg: 'from-rose-500/5', text: selected.suggestions.family },
              ].map((item) => (
                <div key={item.title} className={`card-glow rounded-3xl border border-[#1a1615]/8 bg-gradient-to-br ${item.bg} to-white p-5`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon={item.icon} className={`text-lg ${item.color}`} />
                    <p className="text-sm font-semibold text-[#1a1615]">{item.title}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-[#5c524a]">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:chart-areaspline" className="text-lg text-teal-600" />
                <p className="text-sm font-semibold text-[#1a1615]">近 7 天健康趋势</p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-[#5c524a]">健康指数趋势</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selected.trends.dates.map((d, i) => ({ date: d, body: selected.trends.bodyHealthScores[i], mental: selected.trends.mentalHealthScores[i] }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3efe8" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5c524a' }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="body" name="身体指数" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="mental" name="心理指数" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#5c524a]">心率与血氧趋势</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={selected.trends.dates.map((d, i) => ({ date: d, hr: selected.trends.heartRates[i], spo2: selected.trends.spo2Values[i] }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3efe8" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="hr" name="心率(bpm)" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="spo2" name="血氧(%)" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#5c524a]">睡眠与活动趋势</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={selected.trends.dates.map((d, i) => ({ date: d, sleep: selected.trends.sleepHours[i], steps: selected.trends.steps[i] / 1000 }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3efe8" />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="sleep" name="睡眠(小时)" fill="#6366f180" stroke="#6366f1" strokeWidth={2} />
                      <Area type="monotone" dataKey="steps" name="步数(千)" fill="#0d948880" stroke="#0d9488" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#5c524a]">情绪评分与综合状态</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#f3efe8" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Radar name="当前状态" dataKey="value" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:alert-octagon-outline" className="text-lg text-red-600" />
                <p className="text-sm font-semibold text-[#1a1615]">近期健康风险事件</p>
              </div>
              <div className="space-y-2">
                {selected.recentEvents.map((evt, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-2xl border border-[#1a1615]/8 bg-[#f8f5f0] px-4 py-3">
                    <div className="mt-0.5 shrink-0">
                      <MiniTag label={evt.level} className={riskColorMap[evt.level] ?? 'border-[#1a1615]/10 text-[#5c524a]'} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#1a1615]">{evt.type}</p>
                        <span className="text-xs text-[#5c524a]/50">{evt.time}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#5c524a]">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:chart-bar" className="text-lg text-teal-600" />
                <p className="text-sm font-semibold text-[#1a1615]">全院风险分布概览</p>
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium text-[#5c524a]">身体健康风险分布</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={[
                      { name: '低风险', value: mockElderHealthData.filter((e) => e.bodyRiskLevel === '低风险').length },
                      { name: '中风险', value: mockElderHealthData.filter((e) => e.bodyRiskLevel === '中风险').length },
                      { name: '高风险', value: mockElderHealthData.filter((e) => e.bodyRiskLevel === '高风险').length },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3efe8" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5c524a' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }} />
                      <Bar dataKey="value" name="人数" fill="#0d9488" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium text-[#5c524a]">心理健康风险分布</p>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={[
                      { name: '低风险', value: mockElderHealthData.filter((e) => e.mentalRiskLevel === '低风险').length },
                      { name: '中风险', value: mockElderHealthData.filter((e) => e.mentalRiskLevel === '中风险').length },
                      { name: '高风险', value: mockElderHealthData.filter((e) => e.mentalRiskLevel === '高风险').length },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3efe8" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5c524a' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#5c524a' }} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', fontSize: 12 }} />
                      <Bar dataKey="value" name="人数" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
