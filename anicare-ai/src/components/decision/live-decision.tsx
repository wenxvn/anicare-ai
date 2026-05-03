'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { DecisionPayload } from '@/types';

const stages = ['正在读取知识库', '正在分析风险等级', '正在生成处置建议'];

export function LiveDecision({ decision }: { decision: DecisionPayload }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setStep((prev) => Math.min(prev + 1, stages.length)), 700);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-3xl border border-orange-500/15 bg-surface-800/80 p-6">
      <div className="flex items-center gap-3 text-orange-200">
        <Icon icon="mdi:brain" className="text-xl" />
        <p className="text-sm font-semibold">AI 决策过程</p>
      </div>
      <div className="mt-4 space-y-3">
        {stages.map((label, index) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span className={"flex h-6 w-6 items-center justify-center rounded-full border text-xs " + (index <= step ? 'border-orange-400/40 bg-orange-500/10 text-orange-200' : 'border-white/10 text-warm-100/40')}>
              {index < step ? '✓' : index + 1}
            </span>
            <span className={index <= step ? 'text-warm-50' : 'text-warm-100/40'}>{label}</span>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="mt-6 rounded-2xl border border-white/5 bg-surface-900/60 p-4 text-sm leading-relaxed text-warm-100/80"
      >
        <p><span className="text-warm-100/50">风险评分：</span>{decision.riskScore}</p>
        <p className="mt-2"><span className="text-warm-100/50">原因判断：</span>{decision.cause}</p>
        <p className="mt-2"><span className="text-warm-100/50">处置建议：</span>{decision.suggestion}</p>
      </motion.div>
    </div>
  );
}
