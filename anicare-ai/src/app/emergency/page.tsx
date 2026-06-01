'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
import { fetchJson } from '@/lib/api-client';
import { mockEmergencyPlans } from '@/lib/mock-data';
import type { EmergencyPlan, EmergencyStep, EmergencyStepStatus } from '@/types';

const fieldInfo = [
  { label: '事件位置', value: 'A栋3层走廊' },
  { label: '最近护理员', value: '张晓梅 · 2 分钟' },
  { label: '值班医护', value: '李医生 · 已待命' },
  { label: '对讲频道', value: 'A-3 夜间巡护' },
];

const supplies = [
  '一次性手套',
  '血压计与血氧仪',
  '便携式急救包',
  '轮椅或转运床',
  '事件记录终端',
];

const communicationLog = [
  { time: '03:12', text: '系统生成紧急事件' },
  { time: '03:13', text: '通知 A栋3层护理员' },
  { time: '03:14', text: '值班医护收到同步提醒' },
  { time: '03:15', text: '等待现场状态回传' },
];

const planVisuals: Record<string, {
  avatar: string;
  scene: string;
  resident: string;
  location: string;
  nurse: string;
  icon: string;
}> = {
  'plan-fall': {
    avatar: '/avatars/elder-1.jpg',
    scene: '/pictures/camera-walker-corridor.jpg',
    resident: '张建国',
    location: 'A栋3层走廊',
    nurse: '张晓梅',
    icon: 'mdi:alert-octagon-outline',
  },
  'plan-leave': {
    avatar: '/avatars/elder-4.jpg',
    scene: '/pictures/camera-bed-lying.jpg',
    resident: '陈国华',
    location: 'B栋508房间',
    nurse: '陈小燕',
    icon: 'mdi:bed-outline',
  },
  'plan-smoke': {
    avatar: '/avatars/elder-6.jpg',
    scene: '/pictures/camera-bed-care.jpg',
    resident: '公共区域',
    location: 'C栋1层茶水间',
    nurse: '李建国',
    icon: 'mdi:fire-alert',
  },
  'plan-still': {
    avatar: '/avatars/elder-3.jpg',
    scene: '/pictures/camera-bed-lying.jpg',
    resident: '王秀兰',
    location: 'B栋302房间',
    nurse: '赵文强',
    icon: 'mdi:sleep',
  },
  'plan-illness': {
    avatar: '/avatars/elder-7.jpg',
    scene: '/pictures/camera-corridor-wheelchair.jpg',
    resident: '刘德华',
    location: 'B栋1层楼梯口',
    nurse: '李医生',
    icon: 'mdi:heart-pulse',
  },
};

const activeCases = [
  { planId: 'plan-fall', event: '老人摔倒', resident: '张建国', location: 'A栋3层走廊', source: '视觉识别 + 姿态异常', status: '处理中', response: '8 秒', avatar: '/avatars/elder-1.jpg' },
  { planId: 'plan-leave', event: '离床未归', resident: '陈国华', location: 'B栋508房间', source: '门磁 + 床垫传感器', status: '处理中', response: '7 秒', avatar: '/avatars/elder-4.jpg' },
  { planId: 'plan-illness', event: '疑似突发疾病', resident: '刘德华', location: 'B栋1层楼梯口', source: '视觉识别 + 健康档案', status: '已完成', response: '5 秒', avatar: '/avatars/elder-7.jpg' },
];

const responders = [
  { name: '张晓梅', role: 'A栋3层护理员', status: '已接收', avatar: '/avatars/elder-2.jpg' },
  { name: '李医生', role: '值班医护', status: '已待命', avatar: '/avatars/elder-5.jpg' },
  { name: '赵文强', role: 'B栋责任护理员', status: '处理中', avatar: '/avatars/elder-8.jpg' },
];

const recommendationReasons = [
  '视觉识别到跌倒姿态并持续静止',
  'A栋3层走廊周围未识别到护理人员',
  '已同步最近护理员和当班医护',
];

function getPlanVisual(plan: EmergencyPlan) {
  return planVisuals[plan.id] ?? {
    avatar: '/avatars/elder-1.jpg',
    scene: '/pictures/camera-bed-care.jpg',
    resident: '老人',
    location: '机构公共区域',
    nurse: '责任护理员',
    icon: plan.icon,
  };
}

export default function EmergencyPage() {
  const [plans, setPlans] = useState<EmergencyPlan[]>(mockEmergencyPlans);
  const [selectedPlan, setSelectedPlan] = useState<EmergencyPlan | null>(null);
  const [steps, setSteps] = useState<EmergencyStep[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchJson<EmergencyPlan[]>('/api/emergency/plans').then((items) => {
      if (items.length) setPlans(items);
    }).catch(() => {});
  }, []);

  const recommendedPlan = plans[0] ?? mockEmergencyPlans[0];
  const recommendedVisual = getPlanVisual(recommendedPlan);

  const handleSelectPlan = (plan: EmergencyPlan) => {
    setSelectedPlan(plan);
    setSteps(plan.steps.map((s) => ({ ...s, status: 'pending' as EmergencyStepStatus })));
    setShowReport(false);
  };

  const updateStep = (stepId: string, newStatus: EmergencyStepStatus) => {
    setSteps((prev) => prev.map((s) => {
      if (s.id !== stepId) return s;
      return {
        ...s,
        status: newStatus,
        ...(newStatus === 'doing' ? { startedAt: new Date().toISOString() } : {}),
        ...(newStatus === 'done' || newStatus === 'skipped' ? { completedAt: new Date().toISOString() } : {}),
      };
    }));
  };

  const addRemark = (stepId: string, remark: string) => {
    setSteps((prev) => prev.map((s) => (s.id === stepId ? { ...s, remark } : s)));
  };

  const completedCount = steps.filter((s) => s.status === 'done' || s.status === 'skipped').length;
  const allDone = steps.length > 0 && completedCount === steps.length;
  const nextStep = steps.find((s) => s.status === 'pending');
  const currentDoing = steps.find((s) => s.status === 'doing');
  const selectedVisual = selectedPlan ? getPlanVisual(selectedPlan) : null;
  const progress = useMemo(() => (steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0), [completedCount, steps.length]);

  const getStepStatusIcon = (status: EmergencyStepStatus) => {
    switch (status) {
      case 'done': return { icon: 'mdi:check', color: 'border-emerald-500 bg-emerald-50 text-emerald-600' };
      case 'doing': return { icon: 'mdi:play', color: 'border-teal-500 bg-teal-50 text-teal-600' };
      case 'skipped': return { icon: 'mdi:skip-next', color: 'border-gray-400 bg-gray-50 text-gray-500' };
      default: return { icon: '', color: 'border-[#172033]/10 text-[#5d6b82]/50' };
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 h-1 w-10 rounded-full bg-teal-500" />
          <h1 className="text-3xl font-bold tracking-tight text-[#172033] sm:text-4xl">应急流程引导</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5d6b82]">
            系统按事件类型自动匹配预案，护理员按步骤处理现场，主管可查看人员、物资和通讯记录。
          </p>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#172033]/8 bg-white text-center shadow-sm">
          {[
            ['处理中', '3 起'],
            ['可用预案', `${plans.length} 套`],
            ['平均响应', '6 秒'],
          ].map(([label, value]) => (
            <div key={label} className="min-w-24 border-l border-[#172033]/8 px-4 py-3 first:border-l-0">
              <p className="text-[11px] text-[#5d6b82]">{label}</p>
              <p className="mt-1 text-sm font-semibold text-[#172033]">{value}</p>
            </div>
          ))}
        </div>
      </header>

      {!selectedPlan ? (
        <>
          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-glow overflow-hidden rounded-3xl border border-[#172033]/8 bg-white"
            >
              <div className="grid h-full min-h-[420px] lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)]">
                <div className="flex h-full flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-[#172033]/8 bg-[#f5f7fb]">
                        <Image src={recommendedVisual.avatar} alt={recommendedVisual.resident} fill priority sizes="80px" className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm text-[#5d6b82]">当前优先事件</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-semibold text-[#172033]">{recommendedPlan.eventType}</h2>
                          <RiskBadge risk={recommendedPlan.riskLevel} />
                        </div>
                        <p className="mt-1 text-sm text-[#5d6b82]">{recommendedVisual.resident} · {recommendedVisual.location}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[
                        ['处置时长', `${recommendedPlan.estimatedMinutes} 分钟`],
                        ['步骤数量', `${recommendedPlan.steps.length} 步`],
                        ['指派人员', recommendedVisual.nurse],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-[#172033]/8 bg-[#f8fafc] p-3">
                          <p className="text-xs text-[#5d6b82]">{label}</p>
                          <p className="mt-1 text-base font-semibold text-[#172033]">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {responders.map((person) => (
                        <div key={person.name} className="flex items-center gap-3 rounded-2xl border border-[#172033]/8 bg-white px-3 py-2.5">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f5f7fb]">
                            <Image src={person.avatar} alt={person.name} fill priority sizes="40px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#172033]">{person.name}</p>
                            <p className="truncate text-xs text-[#5d6b82]">{person.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#172033]/8 bg-[#f8fafc] p-4">
                      <div className="flex items-center gap-2">
                        <Icon icon="mdi:clipboard-check-outline" className="text-lg text-teal-700" />
                        <p className="text-sm font-semibold text-[#172033]">推荐依据</p>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {recommendationReasons.map((reason) => (
                          <div key={reason} className="flex items-start gap-2 text-xs leading-relaxed text-[#5d6b82]">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                            <span>{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(recommendedPlan)}
                    className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500"
                  >
                    <Icon icon="mdi:play-circle-outline" className="text-lg" />
                    开始推荐预案
                  </button>
                </div>

                <div className="relative min-h-[420px] border-t border-[#172033]/8 lg:border-l lg:border-t-0">
                  <Image src={recommendedVisual.scene} alt={recommendedVisual.location} fill priority sizes="42vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/70 via-[#172033]/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/90 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-[#5d6b82]">现场画面</p>
                        <p className="mt-1 text-sm font-semibold text-[#172033]">{recommendedVisual.location}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <aside className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#172033]">待处理事件</h2>
                <span className="rounded-full bg-[#f5f7fb] px-2.5 py-1 text-xs text-[#5d6b82]">{activeCases.length} 起</span>
              </div>
              <div className="mt-4 space-y-3">
                {activeCases.map((item) => {
                  const plan = plans.find((p) => p.id === item.planId) ?? recommendedPlan;
                  return (
                    <button
                      key={item.planId}
                      onClick={() => handleSelectPlan(plan)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-[#172033]/8 bg-[#f8fafc] p-3 text-left transition-colors hover:border-teal-500/35 hover:bg-white"
                    >
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white">
                        <Image src={item.avatar} alt={item.resident} fill priority sizes="48px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-[#172033]">{item.event}</p>
                          <span className="shrink-0 text-xs font-semibold text-teal-700">{item.response}</span>
                        </div>
                        <p className="mt-1 truncate text-xs text-[#5d6b82]">{item.resident} · {item.location}</p>
                        <p className="mt-1 truncate text-xs text-[#8a96a8]">{item.source}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-2xl border border-teal-500/20 bg-teal-50/60 p-4">
                <div className="flex items-center gap-2 text-teal-700">
                  <Icon icon="mdi:book-check-outline" className="text-lg" />
                  <p className="text-sm font-semibold">知识库状态</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#5d6b82]">跌倒、离床、烟火和突发疾病预案已同步到值班端。</p>
              </div>
            </aside>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {plans.map((plan, index) => {
              const visual = getPlanVisual(plan);
              return (
                <motion.button
                  key={plan.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectPlan(plan)}
                  className="group card-glow min-h-[260px] overflow-hidden rounded-3xl border border-[#172033]/8 bg-white text-left transition-colors hover:border-teal-500/35"
                >
                  <div className="relative h-28">
                    <Image src={visual.scene} alt={visual.location} fill priority sizes="20vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/65 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-white bg-white">
                        <Image src={visual.avatar} alt={visual.resident} fill priority sizes="48px" className="object-cover" />
                      </div>
                      <div className="rounded-xl bg-white/90 px-2.5 py-1.5 backdrop-blur">
                        <p className="text-xs font-semibold text-[#172033]">{visual.resident}</p>
                        <p className="text-[11px] text-[#5d6b82]">{visual.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-base font-semibold text-[#172033]">{plan.eventType}</p>
                        <p className="mt-1 text-xs text-[#5d6b82]">{plan.steps.length} 个步骤 · 预计 {plan.estimatedMinutes} 分钟</p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <Icon icon={visual.icon} className="text-xl" />
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <RiskBadge risk={plan.riskLevel} />
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700">
                        开始处理
                        <Icon icon="mdi:arrow-right" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </section>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selectedPlan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => { setSelectedPlan(null); setSteps([]); }} className="inline-flex items-center gap-1.5 rounded-xl border border-[#172033]/10 bg-white px-4 py-2 text-sm text-[#5d6b82] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:arrow-left" className="text-base" />
                返回选择
              </button>
              <div className="flex items-center gap-2 rounded-2xl border border-[#172033]/8 bg-white px-4 py-2 shadow-sm">
                <span className="text-sm text-[#5d6b82]">处置进度</span>
                <span className="text-sm font-semibold text-[#172033]">{completedCount} / {steps.length}</span>
                <span className="h-4 w-px bg-[#172033]/10" />
                <span className="text-sm font-semibold text-teal-700">{progress}%</span>
              </div>
            </div>

            <section className="card-glow mb-5 overflow-hidden rounded-3xl border border-[#172033]/8 bg-white">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-[#172033]/8 bg-[#f5f7fb]">
                    {selectedVisual && <Image src={selectedVisual.avatar} alt={selectedVisual.resident} fill priority sizes="80px" className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold text-[#172033]">{selectedPlan.eventType}</h2>
                      <RiskBadge risk={selectedPlan.riskLevel} />
                    </div>
                    <p className="mt-1 text-sm text-[#5d6b82]">{selectedVisual?.resident} · {selectedVisual?.location} · {selectedVisual?.nurse}</p>
                    <div className="mt-3 h-2 max-w-xl rounded-full bg-[#e8edf5]">
                      <div className="h-2 rounded-full bg-teal-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
                <div className="relative min-h-[180px] border-t border-[#172033]/8 lg:border-l lg:border-t-0">
                  {selectedVisual && <Image src={selectedVisual.scene} alt={selectedVisual.location} fill priority sizes="360px" className="object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172033]/55 to-transparent" />
                  <p className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-[#172033] backdrop-blur">现场画面 · LIVE</p>
                </div>
              </div>
            </section>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.8fr)]">
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const statusInfo = getStepStatusIcon(step.status);
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`card-glow rounded-2xl border bg-white p-4 transition-colors ${
                        step.status === 'done' ? 'border-emerald-200' :
                        step.status === 'doing' ? 'border-teal-300' :
                        step.status === 'skipped' ? 'border-gray-200 opacity-60' :
                        'border-[#172033]/8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${statusInfo.color}`}>
                            {step.status !== 'pending' ? <Icon icon={statusInfo.icon} className="text-sm" /> : step.order}
                          </span>
                          <div>
                            <p className={`text-base font-semibold ${
                              step.status === 'done' ? 'text-emerald-600' :
                              step.status === 'doing' ? 'text-teal-600' :
                              step.status === 'skipped' ? 'text-gray-400 line-through' :
                              'text-[#172033]'
                            }`}>{step.title}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#5d6b82]">{step.note}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <Icon icon="mdi:book-open-variant" className="text-sm text-teal-600" />
                              <span className="text-xs text-teal-600">依据：{step.knowledgeRef}</span>
                            </div>
                            {step.remark && (
                              <div className="mt-2 rounded-xl bg-[#f5f7fb] px-3 py-2 text-xs text-[#5d6b82]">
                                <Icon icon="mdi:note-text-outline" className="mr-1 inline text-sm" />
                                备注：{step.remark}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {step.status === 'pending' && (
                          <button onClick={() => updateStep(step.id, 'doing')} className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-500">
                            <Icon icon="mdi:play" className="text-sm" />
                            开始执行
                          </button>
                        )}
                        {step.status === 'doing' && (
                          <button onClick={() => updateStep(step.id, 'done')} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500">
                            <Icon icon="mdi:check-circle" className="text-sm" />
                            标记完成
                          </button>
                        )}
                        {(step.status === 'done' || step.status === 'skipped') && (
                          <span className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold ${
                            step.status === 'done' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'
                          }`}>
                            <Icon icon={step.status === 'done' ? 'mdi:check-circle' : 'mdi:skip-next'} className="text-sm" />
                            {step.status === 'done' ? '已完成' : '已跳过'}
                          </span>
                        )}
                        {step.status !== 'done' && step.status !== 'skipped' && (
                          <button onClick={() => updateStep(step.id, 'skipped')} className="inline-flex items-center gap-1.5 rounded-xl border border-[#172033]/10 px-4 py-2 text-xs text-[#5d6b82] transition-colors hover:border-gray-400">
                            <Icon icon="mdi:skip-next" className="text-sm" />
                            跳过
                          </button>
                        )}
                        <button onClick={() => {
                          const remark = prompt('请输入备注：');
                          if (remark) addRemark(step.id, remark);
                        }} className="inline-flex items-center gap-1.5 rounded-xl border border-[#172033]/10 px-4 py-2 text-xs text-[#5d6b82] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                          <Icon icon="mdi:pencil-outline" className="text-sm" />
                          添加备注
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <aside className="space-y-4">
                {(currentDoing || nextStep) && (
                  <div className="card-glow rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-50 via-white to-white p-5">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Icon icon={currentDoing ? 'mdi:play-circle' : 'mdi:lightbulb-on-outline'} className="text-xl" />
                      <p className="text-sm font-semibold">{currentDoing ? '当前正在执行' : '下一步建议'}</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#172033]">
                      第 {(currentDoing ?? nextStep)?.order} 步：{(currentDoing ?? nextStep)?.title}
                    </p>
                    <p className="mt-1 text-sm text-[#5d6b82]">{(currentDoing ?? nextStep)?.note}</p>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#172033]">现场信息</p>
                    <div className="mt-4 grid gap-3">
                      {fieldInfo.map((item) => (
                        <div key={item.label} className="flex justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5 text-sm">
                          <span className="text-[#5d6b82]">{item.label}</span>
                          <span className="text-right font-medium text-[#172033]">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#172033]">处置人员</p>
                    <div className="mt-4 space-y-2">
                      {responders.map((person) => (
                        <div key={person.name} className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-white">
                              <Image src={person.avatar} alt={person.name} fill priority sizes="36px" className="object-cover" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#172033]">{person.name}</p>
                              <p className="truncate text-xs text-[#5d6b82]">{person.role}</p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-teal-700">{person.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#172033]">携带物资</p>
                    <div className="mt-4 grid gap-2">
                      {supplies.map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-xl bg-[#f8fafc] px-3 py-2 text-sm text-[#172033]">
                          <Icon icon="mdi:check-circle-outline" className="text-base text-teal-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#172033]">通讯记录</p>
                    <div className="mt-4 space-y-3">
                      {communicationLog.map((item) => (
                        <div key={`${item.time}-${item.text}`} className="flex gap-3 text-sm">
                          <span className="w-12 shrink-0 font-mono text-xs text-[#5d6b82]">{item.time}</span>
                          <span className="text-[#172033]">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {allDone && !showReport && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Icon icon="mdi:check-circle" className="text-xl" />
                      <p className="text-sm font-semibold">所有步骤已完成</p>
                    </div>
                    <p className="mt-2 text-sm text-[#5d6b82]">处置流程已结束，可生成事件处置记录。</p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => setShowReport(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-500">
                        <Icon icon="mdi:file-document-outline" className="text-sm" />
                        生成处置记录
                      </button>
                    </div>
                  </motion.div>
                )}

                {showReport && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-2xl border border-emerald-200 bg-white p-5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Icon icon="mdi:file-document-check" className="text-xl" />
                      <p className="text-sm font-semibold">事件处置记录</p>
                    </div>
                    <div className="mt-4 space-y-2.5 text-sm text-[#5d6b82]">
                      <div className="flex justify-between"><span className="text-[#5d6b82]/60">事件类型</span><span className="font-medium text-[#172033]">{selectedPlan.eventType}</span></div>
                      <div className="flex justify-between"><span className="text-[#5d6b82]/60">风险等级</span><RiskBadge risk={selectedPlan.riskLevel} /></div>
                      <div className="flex justify-between"><span className="text-[#5d6b82]/60">完成步骤</span><span className="font-medium text-[#172033]">{completedCount} 步</span></div>
                      <div className="flex justify-between"><span className="text-[#5d6b82]/60">处理时间</span><span className="font-medium text-[#172033]">{new Date().toLocaleString('zh-CN')}</span></div>
                    </div>
                  </motion.div>
                )}
              </aside>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
