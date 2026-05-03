'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { mockEvents } from '@/lib/mock-data';

const stages = [
  { label: '正在读取知识库...', icon: 'mdi:book-open-page-variant-outline' },
  { label: '正在分析风险等级...', icon: 'mdi:scale-balance' },
  { label: '正在生成处置建议...', icon: 'mdi:lightbulb-on-outline' },
];

export default function DecisionPage() {
  const [step, setStep] = useState(-1);
  const [done, setDone] = useState(false);
  const event = mockEvents[0];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    stages.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), 800 * (i + 1)));
    });
    timers.push(setTimeout(() => setDone(true), 800 * (stages.length + 1)));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="AI 决策" description="系统不只告诉你发生了什么，还告诉你为什么危险、建议怎么处理。" />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-orange-500/15 bg-surface-800/80 p-6">
            <div className="flex items-center gap-3 text-orange-200">
              <Icon icon="mdi:brain" className="text-xl" />
              <p className="text-sm font-semibold">AI 决策过程</p>
            </div>
            <div className="mt-5 space-y-3">
              {stages.map((stage, index) => (
                <div key={stage.label} className="flex items-center gap-3 text-sm">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${index <= step ? 'border-orange-400/40 bg-orange-500/10 text-orange-200' : 'border-white/10 text-warm-100/40'}`}>
                    {index < step ? '✓' : index + 1}
                  </span>
                  <Icon icon={stage.icon} className={`text-base ${index <= step ? 'text-orange-300' : 'text-warm-100/30'}`} />
                  <span className={index <= step ? 'text-warm-50' : 'text-warm-100/40'}>{stage.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {done && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
              <p className="text-sm font-semibold text-warm-50">知识库引用</p>
              <p className="mt-1 text-xs text-warm-100/50">系统依据以下知识库条目生成决策：</p>
              <div className="mt-3 space-y-2">
                {event.decision.knowledgeRefs?.map((ref) => (
                  <div key={ref} className="flex items-center gap-2 rounded-2xl border border-white/5 bg-surface-900/60 px-4 py-2.5">
                    <Icon icon="mdi:book-open-variant" className="text-sm text-orange-300" />
                    <span className="text-sm text-warm-100/80">{ref}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
            <p className="text-sm text-warm-100/50">事件摘要</p>
            <p className="mt-2 text-sm leading-relaxed text-warm-100/80">{event.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <RiskBadge risk={event.risk} />
              <span className="text-xs text-warm-100/50">风险评分：{event.decision.riskScore}/100</span>
            </div>
          </motion.div>

          {done && (
            <>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
                <div className="flex items-center gap-2 text-orange-300">
                  <Icon icon="mdi:magnify-scan" className="text-base" />
                  <p className="text-sm font-semibold">判断依据</p>
                </div>
                <div className="mt-3 space-y-2">
                  {event.decision.basis?.map((item, i) => (
                    <div key={item} className="flex items-start gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-xs text-orange-300">{i + 1}</span>
                      <span className="text-warm-100/80">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl border border-orange-500/15 bg-surface-800/80 p-5">
                <div className="flex items-center gap-2 text-orange-300">
                  <Icon icon="mdi:clipboard-check-outline" className="text-base" />
                  <p className="text-sm font-semibold">处置建议</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-warm-100/80">{event.decision.suggestion}</p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
