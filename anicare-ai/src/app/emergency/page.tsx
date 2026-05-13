'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { fetchJson } from '@/lib/api-client';
import type { EmergencyPlan, EmergencyStep, EmergencyStepStatus } from '@/types';
import { RISK_LEVEL_LABEL } from '@/types';

export default function EmergencyPage() {
  const [plans, setPlans] = useState<EmergencyPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<EmergencyPlan | null>(null);
  const [steps, setSteps] = useState<EmergencyStep[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchJson<EmergencyPlan[]>('/api/emergency/plans').then(setPlans).catch(() => {});
  }, []);

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
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, remark } : s));
  };

  const completedCount = steps.filter((s) => s.status === 'done' || s.status === 'skipped').length;
  const allDone = steps.length > 0 && completedCount === steps.length;
  const nextStep = steps.find((s) => s.status === 'pending');
  const currentDoing = steps.find((s) => s.status === 'doing');

  const getStepStatusIcon = (status: EmergencyStepStatus) => {
    switch (status) {
      case 'done': return { icon: 'mdi:check', color: 'border-emerald-500 bg-emerald-50 text-emerald-600' };
      case 'doing': return { icon: 'mdi:play', color: 'border-teal-500 bg-teal-50 text-teal-600' };
      case 'skipped': return { icon: 'mdi:skip-next', color: 'border-gray-400 bg-gray-50 text-gray-500' };
      default: return { icon: '', color: 'border-[#172033]/10 text-[#5d6b82]/50' };
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="应急流程引导" description="" />

      {!selectedPlan ? (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="card-glow rounded-3xl border border-teal-500/20 bg-white p-5">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:playlist-check" className="text-xl text-teal-600" />
                <p className="text-sm font-semibold text-[#172033]">预案匹配说明</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5d6b82]">
                值班系统会根据事件类型、风险等级、老人画像和所在区域自动匹配处置流程。护理员只需要按步骤确认现场情况，系统会记录每一步的开始时间、完成时间和备注。
              </p>
            </div>
            <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
              <p className="text-sm font-semibold text-[#172033]">当前推荐</p>
              <div className="mt-3 space-y-2 text-sm text-[#5d6b82]">
                <div className="flex items-center justify-between"><span>待处理事件</span><span className="font-semibold text-[#172033]">3 起</span></div>
                <div className="flex items-center justify-between"><span>可用预案</span><span className="font-semibold text-[#172033]">{plans.length} 套</span></div>
                <div className="flex items-center justify-between"><span>知识库状态</span><span className="font-semibold text-emerald-700">已更新</span></div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => handleSelectPlan(plan)}
                className="card-glow cursor-pointer rounded-3xl border border-[#172033]/8 bg-white p-5 transition-colors hover:border-teal-500/25"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                  <Icon icon={plan.icon} className="text-2xl" />
                </div>
                <p className="mt-4 text-base font-semibold text-[#172033]">{plan.eventType}</p>
                <div className="mt-2 flex items-center gap-3">
                  <RiskBadge risk={plan.riskLevel} />
                  <span className="text-xs text-[#5d6b82]/50">预计 {plan.estimatedMinutes} 分钟</span>
                </div>
                <p className="mt-2 text-xs text-[#5d6b82]/50">{plan.steps.length} 个步骤</p>
                <div className="mt-3 text-xs text-teal-600">
                  开始处理 →
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selectedPlan.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <div className="mb-6 flex items-center gap-3">
              <button onClick={() => { setSelectedPlan(null); setSteps([]); }} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#172033]/10 px-4 py-2 text-sm text-[#5d6b82] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:arrow-left" className="text-base" />
                返回选择
              </button>
              <div className="flex items-center gap-2">
                <Icon icon={selectedPlan.icon} className="text-xl text-teal-600" />
                <span className="text-lg font-semibold text-[#172033]">{selectedPlan.eventType}</span>
                <RiskBadge risk={selectedPlan.riskLevel} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const statusInfo = getStepStatusIcon(step.status);
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className={`card-glow rounded-3xl border bg-white p-5 transition-colors ${
                        step.status === 'done' ? 'border-emerald-200' :
                        step.status === 'doing' ? 'border-teal-300' :
                        step.status === 'skipped' ? 'border-gray-200 opacity-60' :
                        'border-[#172033]/8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${statusInfo.color}`}>
                            {step.status !== 'pending' ? <Icon icon={statusInfo.icon} className="text-sm" /> : step.order}
                          </span>
                          <div>
                            <p className={`text-base font-semibold ${
                              step.status === 'done' ? 'text-emerald-600' :
                              step.status === 'doing' ? 'text-teal-600' :
                              step.status === 'skipped' ? 'text-gray-400 line-through' :
                              'text-[#172033]'
                            }`}>{step.title}</p>
                            <p className="mt-2 text-sm leading-relaxed text-[#5d6b82]">{step.note}</p>
                            <div className="mt-3 flex items-center gap-2">
                              <Icon icon="mdi:book-open-variant" className="text-sm text-teal-600" />
                              <span className="text-xs text-teal-600">依据：{step.knowledgeRef}</span>
                            </div>
                            {step.remark && (
                              <div className="mt-2 rounded-2xl bg-[#f5f7fb] px-3 py-2 text-xs text-[#5d6b82]">
                                <Icon icon="mdi:note-text-outline" className="mr-1 inline text-sm" />
                                备注：{step.remark}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        {step.status === 'pending' && (
                          <button onClick={() => updateStep(step.id, 'doing')} className="inline-flex items-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-500">
                            <Icon icon="mdi:play" className="text-sm" />
                            开始执行
                          </button>
                        )}
                        {step.status === 'doing' && (
                          <button onClick={() => updateStep(step.id, 'done')} className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500">
                            <Icon icon="mdi:check-circle" className="text-sm" />
                            标记完成
                          </button>
                        )}
                        {(step.status === 'done' || step.status === 'skipped') && (
                          <span className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-semibold ${
                            step.status === 'done' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'
                          }`}>
                            <Icon icon={step.status === 'done' ? 'mdi:check-circle' : 'mdi:skip-next'} className="text-sm" />
                            {step.status === 'done' ? '已完成' : '已跳过'}
                          </span>
                        )}
                        {step.status !== 'done' && step.status !== 'skipped' && (
                          <button onClick={() => updateStep(step.id, 'skipped')} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#172033]/10 px-4 py-2 text-xs text-[#5d6b82] transition-colors hover:border-gray-400">
                            <Icon icon="mdi:skip-next" className="text-sm" />
                            跳过
                          </button>
                        )}
                        <button onClick={() => {
                          const remark = prompt('请输入备注：');
                          if (remark) addRemark(step.id, remark);
                        }} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#172033]/10 px-4 py-2 text-xs text-[#5d6b82] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                          <Icon icon="mdi:pencil-outline" className="text-sm" />
                          添加备注
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-5">
                <div className="card-glow rounded-3xl border border-[#172033]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#172033]">处理进度</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5d6b82]">风险等级</span>
                      <RiskBadge risk={selectedPlan.riskLevel} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5d6b82]">已完成步骤</span>
                      <span className="font-semibold text-[#172033]">{completedCount} / {steps.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5d6b82]">预计处理时间</span>
                      <span className="font-semibold text-[#172033]">{selectedPlan.estimatedMinutes} 分钟</span>
                    </div>
                    <div>
                      <div className="h-2 rounded-full bg-[#e8edf5]">
                        <div className="h-2 rounded-full bg-teal-500 transition-all" style={{ width: `${steps.length > 0 ? (completedCount / steps.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {currentDoing && (
                  <div className="card-glow rounded-3xl border border-teal-300 bg-gradient-to-br from-teal-500/10 via-white to-white p-5">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Icon icon="mdi:play-circle" className="text-xl" />
                      <p className="text-sm font-semibold">当前正在执行</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#172033]">第 {currentDoing.order} 步：{currentDoing.title}</p>
                    <p className="mt-1 text-sm text-[#5d6b82]">{currentDoing.note}</p>
                  </div>
                )}

                {!currentDoing && nextStep && (
                  <div className="card-glow rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-white to-white p-5">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Icon icon="mdi:lightbulb-on-outline" className="text-xl" />
                      <p className="text-sm font-semibold">下一步建议</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#172033]">第 {nextStep.order} 步：{nextStep.title}</p>
                    <p className="mt-1 text-sm text-[#5d6b82]">{nextStep.note}</p>
                  </div>
                )}

                {allDone && !showReport && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Icon icon="mdi:check-circle" className="text-xl" />
                      <p className="text-sm font-semibold">所有步骤已完成</p>
                    </div>
                    <p className="mt-2 text-sm text-[#5d6b82]">处理流程已结束，您可以生成事件处理记录。</p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => setShowReport(true)} className="inline-flex items-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-500">
                        <Icon icon="mdi:file-document-outline" className="text-sm" />
                        生成处理记录
                      </button>
                    </div>
                  </motion.div>
                )}

                {showReport && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-emerald-200 bg-white p-5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Icon icon="mdi:file-document-check" className="text-xl" />
                      <p className="text-sm font-semibold">事件处理记录</p>
                    </div>
                    <div className="mt-4 space-y-2.5 text-sm text-[#5d6b82]">
                      <div className="flex justify-between"><span className="text-[#5d6b82]/50">事件类型</span><span className="font-medium text-[#172033]">{selectedPlan.eventType}</span></div>
                      <div className="flex justify-between"><span className="text-[#5d6b82]/50">风险等级</span><RiskBadge risk={selectedPlan.riskLevel} /></div>
                      <div className="flex justify-between"><span className="text-[#5d6b82]/50">完成步骤</span><span className="font-medium text-[#172033]">{completedCount} 步</span></div>
                      <div className="flex justify-between"><span className="text-[#5d6b82]/50">处理时间</span><span className="font-medium text-[#172033]">{new Date().toLocaleString('zh-CN')}</span></div>
                    </div>
                    <div className="mt-4 border-t border-[#172033]/8 pt-4">
                      <p className="text-xs font-semibold text-[#172033]">步骤记录</p>
                      <div className="mt-2 space-y-2">
                        {steps.map((s) => (
                          <div key={s.id} className="flex items-start gap-2 text-xs">
                            <Icon icon={s.status === 'done' ? 'mdi:check-circle' : 'mdi:skip-next'} className={`mt-0.5 text-sm ${s.status === 'done' ? 'text-emerald-500' : 'text-gray-400'}`} />
                            <span className="text-[#5d6b82]">第 {s.order} 步：{s.title}{s.remark ? `（备注：${s.remark}）` : ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
