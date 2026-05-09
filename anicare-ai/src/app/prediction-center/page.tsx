'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { StatCard } from '@/components/ui/stat-card';
import { RiskBadge } from '@/components/ui/risk-badge';
import { FusionRiskCard } from '@/components/prediction/fusion-risk-card';
import { ShortTermForecastCard } from '@/components/prediction/short-term-forecast';
import { ExplainableAlertList } from '@/components/prediction/explainable-alert';
import { fetchJson } from '@/lib/api-client';
import type { AgentRuntimeStatus, PredictionExplanationFactor, PredictionOverview, VisionPipelineStep } from '@/types';
import {
  mockAgentRuntime,
  mockExplanationFactors,
  mockPredictionOverview,
  mockVisionPipeline,
} from '@/lib/mock-prediction';

const pipelineIcons: Record<string, string> = {
  目标检测: 'mdi:select-search',
  人体姿态: 'mdi:human-handsup',
  目标分割: 'mdi:vector-square',
  轨迹分析: 'mdi:map-marker-path',
  异常判别: 'mdi:brain',
  风险融合: 'mdi:merge',
};

const agentIcons: Record<string, string> = {
  'agent-perception': 'mdi:radar',
  'agent-risk': 'mdi:shield-alert-outline',
  'agent-dispatch': 'mdi:account-arrow-right-outline',
  'agent-care': 'mdi:clipboard-pulse-outline',
};

function statusLabel(status: string) {
  if (status === 'running') return '运行中';
  if (status === 'handoff') return '等待确认';
  if (status === 'completed') return '已完成';
  if (status === 'warning') return '需关注';
  return '空闲';
}

function statusClass(status: string) {
  if (status === 'running') return 'bg-teal-50 text-teal-700 border-teal-200';
  if (status === 'handoff') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === 'warning') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-[#f8f5f0] text-[#5c524a] border-[#1a1615]/10';
}

function VisionPipeline({ steps }: { steps: VisionPipelineStep[] }) {
  return (
    <section className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:camera-metering-matrix" className="text-lg text-teal-600" />
            <h2 className="text-base font-semibold text-[#1a1615]">多模型视觉流水线</h2>
          </div>
          <p className="mt-1 text-xs text-[#5c524a]">检测、姿态、分割、轨迹和风险融合连续运行，输出可解释处置依据。</p>
        </div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">6 个模型节点在线</span>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-xl border border-[#1a1615]/8 bg-[#faf8f5] p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700">
                <Icon icon={pipelineIcons[step.stage] ?? 'mdi:chip'} className="text-lg" />
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClass(step.status)}`}>{statusLabel(step.status)}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1a1615]">{step.stage}</p>
            <p className="mt-1 text-xs text-[#5c524a]">{step.modelName}</p>
            <div className="mt-3 space-y-2 text-xs">
              <div>
                <p className="text-[#5c524a]/60">输入</p>
                <p className="mt-0.5 line-clamp-1 text-[#1a1615]">{step.input}</p>
              </div>
              <div>
                <p className="text-[#5c524a]/60">输出</p>
                <p className="mt-0.5 line-clamp-2 text-[#1a1615]">{step.output}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#1a1615]/8 pt-2 text-xs">
              <span className="font-mono text-teal-700">{(step.confidence * 100).toFixed(0)}%</span>
              <span className="font-mono text-[#5c524a]">{step.latencyMs} ms</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AgentWorkflow({ agents }: { agents: AgentRuntimeStatus[] }) {
  return (
    <section className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon icon="mdi:account-cog-outline" className="text-lg text-teal-600" />
            <h2 className="text-base font-semibold text-[#1a1615]">后台智能体工作流</h2>
          </div>
          <p className="mt-1 text-xs text-[#5c524a]">感知、研判、调度和护理建议智能体协同完成事件闭环。</p>
        </div>
        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">Agent Runtime 正常</span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-xl border border-[#1a1615]/8 bg-[#faf8f5] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700">
                <Icon icon={agentIcons[agent.id] ?? 'mdi:robot-outline'} className="text-xl" />
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusClass(agent.status)}`}>{statusLabel(agent.status)}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1a1615]">{agent.name}</p>
            <p className="mt-1 min-h-10 text-xs leading-relaxed text-[#5c524a]">{agent.role}</p>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-[10px] text-[#5c524a]/60">调用工具</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {agent.toolsUsed.map((tool) => (
                    <span key={tool} className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[10px] text-teal-700">{tool}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-white px-3 py-2">
                <p className="text-[10px] text-[#5c524a]/60">输出结论</p>
                <p className="mt-1 text-xs leading-relaxed text-[#1a1615]">{agent.conclusion}</p>
              </div>
              <div className="rounded-lg bg-teal-50 px-3 py-2">
                <p className="text-[10px] text-teal-700">下一步</p>
                <p className="mt-1 text-xs leading-relaxed text-teal-900">{agent.nextAction}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ExplanationFactors({ factors }: { factors: PredictionExplanationFactor[] }) {
  return (
    <section className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-5">
      <div className="flex items-center gap-2">
        <Icon icon="mdi:chart-box-outline" className="text-lg text-teal-600" />
        <h2 className="text-base font-semibold text-[#1a1615]">预测升高因子</h2>
      </div>
      <p className="mt-1 text-xs text-[#5c524a]">用于解释未来 30 分钟风险为什么上升。</p>
      <div className="mt-4 space-y-3">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1a1615]">{factor.label}</span>
              <span className="text-[#5c524a]">{factor.value} · {(factor.weight * 100).toFixed(0)}%</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-[#f0ece5]">
              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${factor.weight * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PredictionCenterPage() {
  const [data, setData] = useState<PredictionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchJson<PredictionOverview>('/api/prediction');
      setData({ ...mockPredictionOverview, ...result });
    } catch {
      setError(true);
      setData(mockPredictionOverview);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const overview = data ?? mockPredictionOverview;
  const pipeline = overview.visionPipeline ?? mockVisionPipeline;
  const agents = overview.agentRuntime ?? mockAgentRuntime;
  const factors = overview.explanationFactors ?? mockExplanationFactors;

  const activeAgentCount = useMemo(() => agents.filter((agent) => agent.status === 'running' || agent.status === 'handoff').length, [agents]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-teal-500"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <p className="text-sm text-[#5c524a]">正在加载 AI 研判数据...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5c524a]">AI 研判中心</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#1a1615]">多模型视觉与智能体协同</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5c524a]">
            系统持续融合视频、床压、门磁、毫米波和老人画像数据，由多模型视觉流水线与后台智能体协同输出风险预测、处置建议和调度动作。
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          研判服务运行中
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <Icon icon="mdi:alert-circle-outline" className="text-lg text-amber-600" />
          <p className="text-xs text-amber-700">在线数据暂不可用，当前显示最近一次研判缓存。</p>
          <button onClick={loadData} className="ml-auto rounded-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200">
            重试
          </button>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="融合风险分" value={overview.fusionRisk.totalScore} icon={<Icon icon="mdi:shield-alert-outline" className="text-xl" />} helper="多源数据融合评分" />
        <StatCard label="视觉模型节点" value={pipeline.length} icon={<Icon icon="mdi:camera-metering-matrix" className="text-xl" />} helper="检测、姿态、分割与轨迹分析" />
        <StatCard label="活跃智能体" value={activeAgentCount} icon={<Icon icon="mdi:robot-outline" className="text-xl" />} helper="正在研判或等待主管确认" />
        <StatCard label="推理延迟" value={`${overview.modelStatus.inferenceLatencyMs} ms`} icon={<Icon icon="mdi:speedometer" className="text-xl" />} helper={`模型 ${overview.modelStatus.modelVersion}`} />
      </div>

      <VisionPipeline steps={pipeline} />
      <AgentWorkflow agents={agents} />

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <FusionRiskCard data={overview.fusionRisk} />
        <div className="space-y-5">
          <ExplanationFactors factors={factors} />
          <section className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#1a1615]">当前风险等级</h2>
                <p className="mt-1 text-xs text-[#5c524a]">用于值班主管快速确认优先级</p>
              </div>
              <RiskBadge risk={overview.fusionRisk.riskLevel} />
            </div>
            <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-900">
              {overview.fusionRisk.summary}
            </div>
          </section>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ShortTermForecastCard data={overview.forecast15min} />
        <ShortTermForecastCard data={overview.forecast30min} />
      </div>

      <ExplainableAlertList alerts={overview.alerts} />
    </div>
  );
}
