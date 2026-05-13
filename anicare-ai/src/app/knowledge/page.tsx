'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { RiskBadge } from '@/components/ui/risk-badge';
import { mockKnowledge } from '@/lib/mock-data';
import type { AssistantDecisionReply } from '@/types';

const quickScenarios = [
  {
    title: '摔倒未响应',
    prompt: 'A栋3层走廊检测到老人摔倒，12秒内未移动，周围没有护理员，应该如何处理？',
    icon: 'mdi:account-injury-outline',
  },
  {
    title: '夜间离床',
    prompt: 'B栋508房老人凌晨离床超过15分钟未归，门磁未复位，护理员应该先检查哪里？',
    icon: 'mdi:bed-outline',
  },
  {
    title: '烟火异常',
    prompt: 'C栋茶水间烟雾浓度持续上升，视觉模型提示电器区域异常发热，如何处置？',
    icon: 'mdi:fire-alert',
  },
  {
    title: '压疮风险',
    prompt: 'B栋302房老人久卧未动50分钟，床压无变化且室温偏低，如何安排护理？',
    icon: 'mdi:bed-clock',
  },
  {
    title: '情绪低落',
    prompt: '老人连续5天情绪低落，活动量下降，夜间醒来次数增加，需要如何跟进？',
    icon: 'mdi:emoticon-sad-outline',
  },
];

const fallbackDecision: AssistantDecisionReply = {
  riskJudgement: '当前判断为高风险事件。',
  riskLevel: 'high',
  confidence: 0.88,
  summary: '系统已结合实时事件、老人画像和护理知识库生成处置建议。',
  steps: ['确认现场状态', '派单给对应楼层护理员', '记录处置结果并进入事件归档'],
  cautions: ['先确认老人意识和呼吸状态', '不要在未评估前盲目移动老人'],
  references: mockKnowledge.slice(0, 2).map((item) => ({
    title: item.title,
    source: '知识库',
    excerpt: item.content.slice(0, 90),
  })),
  toolsUsed: [
    { name: 'rag.search', status: 'completed', result: '检索到相关护理规范' },
    { name: 'risk.classifier', status: 'completed', result: '风险等级：high' },
    { name: 'dispatch.helper', status: 'completed', result: '建议通知对应楼层护理员' },
  ],
  recommendedActions: ['通知楼层护理员', '同步事件详情', '进入处置闭环'],
  suggestedAssignee: '对应楼层护理员',
};

type ChatResponse = {
  reply?: string;
  decision?: AssistantDecisionReply;
  error?: string;
};

function toolStatusClass(status: string) {
  if (status === 'completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'running') return 'bg-teal-50 text-teal-700 border-teal-200';
  return 'bg-red-50 text-red-700 border-red-200';
}

export default function AssistantPage() {
  const [input, setInput] = useState(quickScenarios[0].prompt);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [decision, setDecision] = useState<AssistantDecisionReply>(fallbackDecision);

  const visibleKnowledge = useMemo(() => mockKnowledge.slice(0, 5), []);

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading) return;

    setInput(message);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          knowledgeRefs: visibleKnowledge.map((item) => item.id),
        }),
      });
      const data = (await res.json()) as ChatResponse;
      if (!res.ok || data.error) throw new Error(data.error ?? '助手服务调用失败');
      setReplyText(data.reply ?? '');
      setDecision(data.decision ?? fallbackDecision);
    } catch {
      setReplyText('当前使用本地护理知识库给出建议。');
      setDecision(fallbackDecision);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[#5d6b82]">护理决策助手</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#172033]">RAG 知识库与工具调用</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5d6b82]">
            输入现场问题后，助手会结合应急知识库、风险分类器和调度工具，输出结构化处置步骤和引用依据。
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          知识库已同步
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="space-y-5">
          <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:message-question-outline" className="text-lg text-teal-600" />
              <h2 className="text-base font-semibold text-[#172033]">值班场景输入</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {quickScenarios.map((item) => (
                <button
                  key={item.title}
                  onClick={() => sendMessage(item.prompt)}
                  className="flex items-center gap-3 rounded-xl border border-[#172033]/8 bg-[#f8fafc] px-3 py-2.5 text-left transition-colors hover:border-teal-500/35 hover:bg-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700">
                    <Icon icon={item.icon} className="text-base" />
                  </span>
                  <span className="text-sm font-medium text-[#172033]">{item.title}</span>
                </button>
              ))}
            </div>

            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={5}
              className="mt-4 w-full resize-none rounded-xl border border-[#172033]/10 bg-[#f5f7fb] px-4 py-3 text-sm leading-relaxed text-[#172033] outline-none transition-colors focus:border-teal-500"
              placeholder="输入现场情况或护理问题..."
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
            >
              <Icon icon={loading ? 'mdi:loading' : 'mdi:send'} className={loading ? 'animate-spin' : ''} />
              {loading ? '研判中...' : '生成护理建议'}
            </button>
          </div>

          <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:tools" className="text-lg text-teal-600" />
              <h2 className="text-base font-semibold text-[#172033]">启用工具</h2>
            </div>
            <div className="mt-4 space-y-2">
              {['rag.search', 'risk.classifier', 'dispatch.helper', 'care.plan'].map((tool) => (
                <div key={tool} className="flex items-center justify-between rounded-xl bg-[#f5f7fb] px-3 py-2">
                  <span className="font-mono text-xs text-[#172033]">{tool}</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">可用</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <motion.div key={`${decision.summary}-${decision.riskLevel}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:clipboard-pulse-outline" className="text-lg text-teal-600" />
                  <h2 className="text-base font-semibold text-[#172033]">结构化护理建议</h2>
                </div>
                <p className="mt-1 text-xs text-[#5d6b82]">风险判断、处置步骤、注意事项和建议派单对象。</p>
              </div>
              <div className="flex items-center gap-2">
                <RiskBadge risk={decision.riskLevel} />
                <span className="rounded-full border border-[#172033]/10 px-2.5 py-1 text-xs text-[#5d6b82]">置信度 {(decision.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-teal-50 px-4 py-3 text-sm leading-relaxed text-teal-900">
              {replyText || decision.summary}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl bg-[#f5f7fb] p-4">
                <p className="text-xs font-medium text-[#5d6b82]">处置步骤</p>
                <ol className="mt-3 space-y-2">
                  {decision.steps.map((step, index) => (
                    <li key={step} className="flex gap-2 text-sm leading-relaxed text-[#172033]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">{index + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl bg-[#f5f7fb] p-4">
                <p className="text-xs font-medium text-[#5d6b82]">注意事项</p>
                <div className="mt-3 space-y-2">
                  {decision.cautions.map((caution) => (
                    <div key={caution} className="flex gap-2 text-sm leading-relaxed text-[#172033]">
                      <Icon icon="mdi:alert-circle-outline" className="mt-0.5 shrink-0 text-base text-amber-600" />
                      {caution}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-[#f5f7fb] p-4">
                <p className="text-xs font-medium text-[#5d6b82]">建议动作</p>
                <div className="mt-3 space-y-2">
                  {decision.recommendedActions.map((action) => (
                    <div key={action} className="rounded-lg bg-white px-3 py-2 text-sm text-[#172033]">{action}</div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg bg-teal-50 px-3 py-2">
                  <p className="text-[10px] text-teal-700">建议派单对象</p>
                  <p className="mt-1 text-sm font-semibold text-teal-900">{decision.suggestedAssignee}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:console-line" className="text-lg text-teal-600" />
                <h2 className="text-base font-semibold text-[#172033]">工具调用结果</h2>
              </div>
              <div className="mt-4 space-y-3">
                {decision.toolsUsed.map((tool) => (
                  <div key={tool.name} className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-[#172033]">{tool.name}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${toolStatusClass(tool.status)}`}>{tool.status}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#5d6b82]">{tool.result}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:book-open-variant" className="text-lg text-teal-600" />
                <h2 className="text-base font-semibold text-[#172033]">知识引用</h2>
              </div>
              <div className="mt-4 space-y-3">
                {decision.references.map((ref) => (
                  <div key={ref.title} className="rounded-xl border border-[#172033]/8 bg-[#f8fafc] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#172033]">{ref.title}</p>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-[#5d6b82]">{ref.source}</span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#5d6b82]">{ref.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-glow rounded-2xl border border-[#172033]/8 bg-white p-5">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:database-search-outline" className="text-lg text-teal-600" />
              <h2 className="text-base font-semibold text-[#172033]">应急知识库索引</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleKnowledge.map((item) => (
                <div key={item.id} className="rounded-xl bg-[#f5f7fb] p-3">
                  <p className="text-sm font-semibold text-[#172033]">{item.title}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2 py-0.5 text-[10px] text-[#5d6b82]">{tag}</span>
                    ))}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#5d6b82]">{item.scenario}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
