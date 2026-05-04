'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { mockEvents } from '@/lib/mock-data';
import { mockAlerts } from '@/lib/mock-prediction';
import { RISK_LEVEL_LABEL } from '@/types';

const stages = [
  { label: '读取知识库', icon: 'mdi:book-open-page-variant-outline' },
  { label: '分析风险等级', icon: 'mdi:shield-alert-outline' },
  { label: '生成处置建议', icon: 'mdi:clipboard-check-outline' },
];

export default function DecisionPage() {
  const event = mockEvents[0];
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => setStep(2), 1600),
      setTimeout(() => setStep(3), 2400),
      setTimeout(() => setDone(true), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="AI 决策" description="系统结合检测结果和知识库，为护理员生成结构化的风险判断依据和处置建议。" />

      <div className="mx-auto max-w-3xl space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-teal-500/15 bg-white p-6">
          <div className="flex items-center gap-3 text-teal-700">
            <Icon icon="mdi:brain" className="text-xl" />
            <p className="text-sm font-semibold">AI 决策过程</p>
          </div>
          <div className="mt-5 space-y-3">
            {stages.map((stage, index) => (
              <div key={stage.label} className="flex items-center gap-3 text-sm">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${index <= step ? 'border-teal-500/40 bg-teal-500/10 text-teal-700' : 'border-[#1a1615]/10 text-[#5c524a]/40'}`}>
                  {index < step ? '✓' : index + 1}
                </span>
                <Icon icon={stage.icon} className={`text-base ${index <= step ? 'text-teal-600' : 'text-[#5c524a]/30'}`} />
                <span className={index <= step ? 'text-[#1a1615]' : 'text-[#5c524a]/40'}>{stage.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <p className="text-sm font-semibold text-[#1a1615]">知识库引用</p>
            <p className="mt-1 text-xs text-[#5c524a]">系统依据以下知识库条目生成决策：</p>
            <div className="mt-3 space-y-2">
              {event.decision.knowledgeRefs?.map((ref) => (
                <div key={ref} className="flex items-center gap-2 rounded-2xl border border-[#1a1615]/8 bg-[#f8f5f0] px-4 py-2.5">
                  <Icon icon="mdi:book-open-variant" className="text-sm text-teal-600" />
                  <span className="text-sm text-[#5c524a]">{ref}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
          <p className="text-sm text-[#5c524a]">事件摘要</p>
          <p className="mt-2 text-sm leading-relaxed text-[#5c524a]">{event.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <RiskBadge risk={event.risk} />
            <span className="text-xs text-[#5c524a]/50">风险评分：{event.decision.riskScore}/100</span>
          </div>
        </motion.div>

        {done && (
          <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-2 text-teal-600">
                <Icon icon="mdi:magnify-scan" className="text-base" />
                <p className="text-sm font-semibold">判断依据</p>
              </div>
              <div className="mt-3 space-y-2">
                {event.decision.basis?.map((item, i) => (
                  <div key={item} className="flex items-start gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/10 text-xs text-teal-600">{i + 1}</span>
                    <span className="text-[#5c524a]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-glow rounded-3xl border border-teal-500/15 bg-white p-5">
              <div className="flex items-center gap-2 text-teal-600">
                <Icon icon="mdi:clipboard-check-outline" className="text-base" />
                <p className="text-sm font-semibold">处置建议</p>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5c524a]">{event.decision.suggestion}</p>
            </motion.div>
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Icon icon="mdi:message-alert-outline" className="text-lg text-teal-600" />
                <p className="text-sm font-semibold text-[#1a1615]">可解释预警队列</p>
              </div>
              <p className="mt-1 text-xs text-[#5c524a]">每条预警附带触发依据、贡献因子与处置建议，支持状态流转</p>
            </div>
            <Link href="/prediction-center" className="rounded-xl bg-teal-500/10 px-4 py-2 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-500/20">
              查看全部
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {mockAlerts.filter((a) => a.status === 'pending').slice(0, 3).map((alert, i) => {
              const riskColors = alert.riskLevel === 'critical' ? 'bg-red-50 text-red-600 border-red-200' :
                alert.riskLevel === 'high' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                alert.riskLevel === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                'bg-emerald-50 text-emerald-600 border-emerald-200';
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="rounded-2xl border border-[#1a1615]/6 bg-[#faf8f5] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${riskColors}`}>
                      {RISK_LEVEL_LABEL[alert.riskLevel]} · {alert.riskScore}分
                    </span>
                    <span className="text-xs text-[#5c524a]/50">{alert.alertType}</span>
                    <span className="ml-auto text-xs text-[#5c524a]/40">{alert.zone} · {alert.roomName}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#5c524a]">{alert.triggerReason}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] text-[#5c524a]/40">贡献因子：</span>
                    {alert.contributors.slice(0, 3).map((c) => (
                      <span key={c.factor} className="rounded-lg bg-white px-2 py-0.5 text-[10px] text-[#5c524a]">
                        {c.factor} {(c.weight * 100).toFixed(0)}%
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
