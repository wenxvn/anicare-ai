'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { fetchJson } from '@/lib/api-client';
import type { EmergencyPlan, EmergencyStep } from '@/types';

const fallbackPlans: EmergencyPlan[] = [
  {
    id: 'plan-fall', eventType: '老人摔倒', icon: 'mdi:human-fall-down', riskLevel: '紧急', estimatedMinutes: 8,
    steps: [
      { id: 'step-fall-1', order: 1, title: '确认老人意识状态', note: '轻声呼唤老人姓名，观察是否有回应，切勿大声叫喊或摇晃身体。', knowledgeRef: '跌倒应急处理流程 · 第1条', completed: false },
      { id: 'step-fall-2', order: 2, title: '观察是否出血或明显骨折', note: '检查头部、四肢、髋部是否有外伤或异常角度，如有出血先用干净布料按压止血。', knowledgeRef: '跌倒应急处理流程 · 第3条', completed: false },
      { id: 'step-fall-3', order: 3, title: '不要盲目移动老人', note: '除非现场有二次危险（如火灾），否则保持老人原地不动，等待医护到场。', knowledgeRef: '跌倒应急处理流程 · 第3条', completed: false },
      { id: 'step-fall-4', order: 4, title: '通知医护人员到场', note: '对讲机呼叫值班医护，说明老人状态、跌倒位置和疑似原因。', knowledgeRef: '老年人突发疾病观察要点 · 第4条', completed: false },
      { id: 'step-fall-5', order: 5, title: '记录事件并生成护理报告', note: '记录跌倒时间、地点、姿态、周围环境、老人当前状态，系统将自动生成护理报告。', knowledgeRef: '跌倒应急处理流程 · 第5条', completed: false },
    ],
  },
  {
    id: 'plan-leave', eventType: '离床未归', icon: 'mdi:bed-alert', riskLevel: '高风险', estimatedMinutes: 6,
    steps: [
      { id: 'step-leave-1', order: 1, title: '确认老人离床时间', note: '查看系统记录的离床时间点，判断是否超过 10 分钟安全阈值。', knowledgeRef: '夜间离床风险处置规范 · 第1条', completed: false },
      { id: 'step-leave-2', order: 2, title: '优先检查卫生间和走廊', note: '夜间离床最常见目的地是卫生间，先到卫生间和相邻走廊查看。', knowledgeRef: '夜间离床风险处置规范 · 第2条', completed: false },
      { id: 'step-leave-3', order: 3, title: '轻声询问是否需要帮助', note: '找到老人后不要惊吓，轻声询问是否需要搀扶或陪同返回。', knowledgeRef: '夜间离床风险处置规范 · 第3条', completed: false },
      { id: 'step-leave-4', order: 4, title: '如发现跌倒立即启动跌倒流程', note: '如果老人倒在地面，不要搬动，立即切换到跌倒应急流程。', knowledgeRef: '夜间离床风险处置规范 · 第4条', completed: false },
      { id: 'step-leave-5', order: 5, title: '陪同老人返回床位并确认安全', note: '确认老人回到床上，调整被褥和室温，必要时增设夜灯。', knowledgeRef: '夜间离床风险处置规范 · 第5条', completed: false },
    ],
  },
  {
    id: 'plan-smoke', eventType: '烟火异常', icon: 'mdi:fire-alert', riskLevel: '高风险', estimatedMinutes: 10,
    steps: [
      { id: 'step-smoke-1', order: 1, title: '确认烟雾来源位置', note: '查看系统定位的烟雾发生区域，判断是茶水间、厨房还是设备间。', knowledgeRef: '火灾隐患初步处理流程 · 第2条', completed: false },
      { id: 'step-smoke-2', order: 2, title: '判断是否为设备故障', note: '检查附近电器设备是否在运行，是否有焦糊气味或异常发热。', knowledgeRef: '火灾隐患初步处理流程 · 第2条', completed: false },
      { id: 'step-smoke-3', order: 3, title: '如确认明火立即启动消防疏散', note: '拨打 119，按消防预案引导老人撤离，优先协助行动不便者。', knowledgeRef: '火灾隐患初步处理流程 · 第3条', completed: false },
      { id: 'step-smoke-4', order: 4, title: '如为设备异常关闭电源并通风', note: '关闭故障设备电源，打开门窗通风，通知维修人员到场。', knowledgeRef: '火灾隐患初步处理流程 · 第4条', completed: false },
      { id: 'step-smoke-5', order: 5, title: '填写专项报告并上报安全主管', note: '所有烟火事件无论大小，都必须填写专项报告并在当天上报安全主管。', knowledgeRef: '火灾隐患初步处理流程 · 第5条', completed: false },
    ],
  },
  {
    id: 'plan-still', eventType: '长时间静止', icon: 'mdi:sleep', riskLevel: '高风险', estimatedMinutes: 5,
    steps: [
      { id: 'step-still-1', order: 1, title: '查看静止持续时间', note: '确认系统记录的静止开始时间，超过 30 分钟需要重点关注。', knowledgeRef: '老年人突发疾病观察要点 · 第1条', completed: false },
      { id: 'step-still-2', order: 2, title: '现场观察老人呼吸和面色', note: '注意观察胸腔是否有起伏，面色是否正常，有无出汗或嘴唇发紫。', knowledgeRef: '老年人突发疾病观察要点 · 第1条', completed: false },
      { id: 'step-still-3', order: 3, title: '轻声呼唤并观察反应', note: '轻拍床边或肩膀，呼唤老人姓名，观察意识是否清醒。', knowledgeRef: '老年人突发疾病观察要点 · 第2条', completed: false },
      { id: 'step-still-4', order: 4, title: '如无反应立即通知医护', note: '如老人无意识反应或疑似心梗脑卒中，立即拨打 120 并通知值班医护。', knowledgeRef: '老年人突发疾病观察要点 · 第3条', completed: false },
      { id: 'step-still-5', order: 5, title: '协助老人调整体位', note: '确认安全后协助翻身或调整体位，检查被褥和室温。', knowledgeRef: '久卧未动与压疮风险评估', completed: false },
    ],
  },
  {
    id: 'plan-illness', eventType: '疑似突发疾病', icon: 'mdi:heart-pulse', riskLevel: '紧急', estimatedMinutes: 12,
    steps: [
      { id: 'step-ill-1', order: 1, title: '快速评估老人意识状态', note: '观察老人是否清醒，能否正常应答，有无言语不清或意识模糊。', knowledgeRef: '老年人突发疾病观察要点 · 第1条', completed: false },
      { id: 'step-ill-2', order: 2, title: '判断疑似疾病类型', note: '单侧肢体无力、口角歪斜疑似脑卒中；胸痛、出汗、呼吸困难疑似心梗。', knowledgeRef: '老年人突发疾病观察要点 · 第2条', completed: false },
      { id: 'step-ill-3', order: 3, title: '立即拨打 120 并通知值班医护', note: '所有疑似突发疾病事件需在 3 分钟内通知值班医护。', knowledgeRef: '老年人突发疾病观察要点 · 第4条', completed: false },
      { id: 'step-ill-4', order: 4, title: '保持呼吸道通畅', note: '将老人调整为侧卧位或半卧位，松开衣领，避免围观保持空气流通。', knowledgeRef: '老年人突发疾病观察要点 · 第5条', completed: false },
      { id: 'step-ill-5', order: 5, title: '记录关键时间点和症状变化', note: '记录发病时间、初始症状、症状变化过程，供急救人员参考。', knowledgeRef: '老年人突发疾病观察要点 · 第4条', completed: false },
      { id: 'step-ill-6', order: 6, title: '准备交接和家属通知', note: '整理老人病历、用药记录，准备与急救人员交接，同步通知家属。', knowledgeRef: '护理员巡房记录标准 · 第3条', completed: false },
    ],
  },
];

export default function EmergencyPage() {
  const [plans, setPlans] = useState<EmergencyPlan[]>(fallbackPlans);
  const [selectedPlan, setSelectedPlan] = useState<EmergencyPlan | null>(null);
  const [steps, setSteps] = useState<EmergencyStep[]>([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    fetchJson<EmergencyPlan[]>('/api/emergency/plans').then(setPlans).catch(() => {});
  }, []);

  const handleSelectPlan = (plan: EmergencyPlan) => {
    setSelectedPlan(plan);
    setSteps(plan.steps.map((s) => ({ ...s, completed: false, remark: undefined })));
    setShowReport(false);
  };

  const toggleStep = (stepId: string) => {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, completed: !s.completed } : s));
  };

  const addRemark = (stepId: string, remark: string) => {
    setSteps((prev) => prev.map((s) => s.id === stepId ? { ...s, remark } : s));
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const allDone = steps.length > 0 && completedCount === steps.length;
  const nextStep = steps.find((s) => !s.completed);

  return (
    <div className="space-y-8">
      <SectionHeader title="应急流程引导" description="护理员不用临场想步骤，系统一步步带着做。选一个事件类型，按步骤处理，每一步都有知识库撑腰。" />

      {!selectedPlan ? (
        <>
          <p className="text-sm text-[#5c524a]">选择一个事件类型，系统会带您一步步处理。</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => handleSelectPlan(plan)}
                className="card-glow cursor-pointer rounded-3xl border border-[#1a1615]/8 bg-white p-5 transition-colors hover:border-teal-500/25"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                  <Icon icon={plan.icon} className="text-2xl" />
                </div>
                <p className="mt-4 text-base font-semibold text-[#1a1615]">{plan.eventType}</p>
                <div className="mt-2 flex items-center gap-3">
                  <RiskBadge risk={plan.riskLevel} />
                  <span className="text-xs text-[#5c524a]/50">预计 {plan.estimatedMinutes} 分钟</span>
                </div>
                <p className="mt-2 text-xs text-[#5c524a]/50">{plan.steps.length} 个步骤</p>
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
              <button onClick={() => { setSelectedPlan(null); setSteps([]); }} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                <Icon icon="mdi:arrow-left" className="text-base" />
                返回选择
              </button>
              <div className="flex items-center gap-2">
                <Icon icon={selectedPlan.icon} className="text-xl text-teal-600" />
                <span className="text-lg font-semibold text-[#1a1615]">{selectedPlan.eventType}</span>
                <RiskBadge risk={selectedPlan.riskLevel} />
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`card-glow rounded-3xl border bg-white p-5 transition-colors ${step.completed ? 'border-emerald-200' : 'border-[#1a1615]/8'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${step.completed ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-[#1a1615]/10 text-[#5c524a]/50'}`}>
                          {step.completed ? <Icon icon="mdi:check" /> : step.order}
                        </span>
                        <div>
                          <p className={`text-base font-semibold ${step.completed ? 'text-emerald-600' : 'text-[#1a1615]'}`}>{step.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-[#5c524a]">{step.note}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Icon icon="mdi:book-open-variant" className="text-sm text-teal-600" />
                            <span className="text-xs text-teal-600">依据：{step.knowledgeRef}</span>
                          </div>
                          {step.remark && (
                            <div className="mt-2 rounded-2xl bg-[#f8f5f0] px-3 py-2 text-xs text-[#5c524a]">
                              <Icon icon="mdi:note-text-outline" className="mr-1 inline text-sm" />
                              备注：{step.remark}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => toggleStep(step.id)} className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-semibold transition-colors ${step.completed ? 'border border-emerald-200 bg-emerald-50 text-emerald-600' : 'bg-teal-600 text-white hover:bg-teal-500'}`}>
                        <Icon icon={step.completed ? 'mdi:check-circle' : 'mdi:check'} className="text-sm" />
                        {step.completed ? '已完成' : '标记完成'}
                      </button>
                      <button onClick={() => {
                        const remark = prompt('请输入备注：');
                        if (remark) addRemark(step.id, remark);
                      }} className="inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                        <Icon icon="mdi:pencil-outline" className="text-sm" />
                        添加备注
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-5">
                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#1a1615]">处理进度</p>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5c524a]">风险等级</span>
                      <RiskBadge risk={selectedPlan.riskLevel} />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5c524a]">已完成步骤</span>
                      <span className="font-semibold text-[#1a1615]">{completedCount} / {steps.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#5c524a]">预计处理时间</span>
                      <span className="font-semibold text-[#1a1615]">{selectedPlan.estimatedMinutes} 分钟</span>
                    </div>
                    <div>
                      <div className="h-2 rounded-full bg-[#f0ece5]">
                        <div className="h-2 rounded-full bg-teal-500 transition-all" style={{ width: `${steps.length > 0 ? (completedCount / steps.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {nextStep && (
                  <div className="card-glow rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-white to-white p-5">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Icon icon="mdi:lightbulb-on-outline" className="text-xl" />
                      <p className="text-sm font-semibold">下一步建议</p>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#1a1615]">第 {nextStep.order} 步：{nextStep.title}</p>
                    <p className="mt-1 text-sm text-[#5c524a]">{nextStep.note}</p>
                  </div>
                )}

                {allDone && !showReport && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Icon icon="mdi:check-circle" className="text-xl" />
                      <p className="text-sm font-semibold">所有步骤已完成</p>
                    </div>
                    <p className="mt-2 text-sm text-[#5c524a]">处理流程已结束，您可以生成事件处理记录。</p>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => setShowReport(true)} className="inline-flex items-center gap-1.5 rounded-2xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-500">
                        <Icon icon="mdi:file-document-outline" className="text-sm" />
                        生成处理记录
                      </button>
                      <button className="inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
                        <Icon icon="mdi:download" className="text-sm" />
                        导出处理报告
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
                    <div className="mt-4 space-y-2.5 text-sm text-[#5c524a]">
                      <div className="flex justify-between"><span className="text-[#5c524a]/50">事件类型</span><span className="font-medium text-[#1a1615]">{selectedPlan.eventType}</span></div>
                      <div className="flex justify-between"><span className="text-[#5c524a]/50">风险等级</span><RiskBadge risk={selectedPlan.riskLevel} /></div>
                      <div className="flex justify-between"><span className="text-[#5c524a]/50">完成步骤</span><span className="font-medium text-[#1a1615]">{completedCount} 步</span></div>
                      <div className="flex justify-between"><span className="text-[#5c524a]/50">处理时间</span><span className="font-medium text-[#1a1615]">{new Date().toLocaleString('zh-CN')}</span></div>
                    </div>
                    <div className="mt-4 border-t border-[#1a1615]/8 pt-4">
                      <p className="text-xs font-semibold text-[#1a1615]">步骤记录</p>
                      <div className="mt-2 space-y-2">
                        {steps.map((s) => (
                          <div key={s.id} className="flex items-start gap-2 text-xs">
                            <Icon icon="mdi:check-circle" className="mt-0.5 text-sm text-emerald-500" />
                            <span className="text-[#5c524a]">第 {s.order} 步：{s.title}{s.remark ? `（备注：${s.remark}）` : ''}</span>
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
