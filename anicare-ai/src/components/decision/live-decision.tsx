'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { DecisionPayload } from '@/types';

const stages = ['读取检测结果', '检索知识库', '生成风险评级', '生成处置建议'];

interface LiveDecisionProps {
  decision: DecisionPayload;
}

export function LiveDecision({ decision }: LiveDecisionProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = stages.map((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * 600));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="card-glow rounded-3xl border border-teal-500/15 bg-white p-6">
      <div className="flex items-center gap-3 text-teal-700">
        <Icon icon="mdi:brain" className="text-xl" />
        <p className="text-sm font-semibold">AI 决策过程</p>
      </div>
      <div className="mt-4 space-y-3">
        {stages.map((label, index) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span className={"flex h-6 w-6 items-center justify-center rounded-full border text-xs " + (index <= step ? 'border-teal-500/40 bg-teal-500/10 text-teal-700' : 'border-[#172033]/10 text-[#5d6b82]/40')}>
              {index < step ? '✓' : index + 1}
            </span>
            <span className={index <= step ? 'text-[#172033]' : 'text-[#5d6b82]/40'}>{label}</span>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        className="mt-6 rounded-2xl border border-[#172033]/8 bg-[#f5f7fb] p-4 text-sm leading-relaxed text-[#5d6b82]"
      >
        <p><span className="text-[#5d6b82]/50">风险评分：</span>{decision.riskScore}</p>
        <p className="mt-2"><span className="text-[#5d6b82]/50">原因判断：</span>{decision.cause}</p>
        <p className="mt-2"><span className="text-[#5d6b82]/50">处置建议：</span>{decision.suggestion}</p>
      </motion.div>
    </div>
  );
}
