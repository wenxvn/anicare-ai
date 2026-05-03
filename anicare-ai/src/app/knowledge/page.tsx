'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { mockKnowledge } from '@/lib/mock-data';
import { fetchJson } from '@/lib/api-client';
import type { KnowledgeArticle } from '@/types';

const ragSteps = [
  { icon: 'mdi:magnify', label: '用户查询 / 风险事件', description: '系统接收到风险事件或护理员查询' },
  { icon: 'mdi:text-search', label: '语义检索', description: '将查询向量化，在知识库中搜索最相关的条目' },
  { icon: 'mdi:file-document-outline', label: '知识匹配', description: '返回 Top-K 相关知识条目和处置规范' },
  { icon: 'mdi:brain', label: 'LLM 决策生成', description: '结合检测结果和知识库，生成风险评级和处置建议' },
  { icon: 'mdi:clipboard-check-outline', label: '结构化输出', description: '输出风险评分、判断依据、处置建议和知识库引用' },
];

export default function KnowledgePage() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(mockKnowledge);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchJson<KnowledgeArticle[]>('/api/knowledge')
      .then(setArticles)
      .catch(() => setArticles(mockKnowledge));
  }, []);

  const filtered = articles.filter((item) =>
    item.title.includes(query) || item.content.includes(query) || item.tags.some((tag) => tag.includes(query))
  );

  return (
    <div className="space-y-8">
      <SectionHeader title="知识库" description="系统不只是报警，还会调用知识库告诉你为什么危险、建议怎么处理。" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Icon icon="mdi:magnify" className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-100/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入关键词，例如：摔倒、夜间、压疮"
            className="w-full rounded-2xl border border-white/10 bg-surface-800/80 py-3 pl-11 pr-4 text-sm text-warm-50 placeholder:text-warm-100/40 focus:border-orange-500/40 focus:outline-none"
          />
        </div>
        {query && (
          <button onClick={() => setQuery('')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-warm-100/70 hover:border-orange-500/30 hover:text-orange-200">
            清空
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {filtered.map((article) => (
            <motion.div key={article.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-5 transition-colors hover:border-orange-500/20">
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-warm-50">{article.title}</p>
                <span className="shrink-0 text-xs text-warm-100/40">{article.updatedAt}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-warm-100/60">{tag}</span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-warm-100/70">{article.content}</p>
              <div className="mt-3 flex items-center gap-2 text-xs text-warm-100/50">
                <Icon icon="mdi:map-marker-outline" className="text-sm" />
                <span>适用场景：{article.scenario}</span>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
              <Icon icon="mdi:book-search-outline" className="mx-auto text-4xl text-warm-100/30" />
              <p className="mt-3 text-sm text-warm-100/50">暂未检索到相关内容</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
            <div className="flex items-center gap-2 text-orange-300">
              <Icon icon="mdi:brain" className="text-lg" />
              <p className="text-sm font-semibold">AI 如何调用知识库做决策</p>
            </div>
            <div className="mt-5 space-y-0">
              {ragSteps.map((step, i) => (
                <div key={step.label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-xs text-orange-200">{i + 1}</div>
                    {i < ragSteps.length - 1 && <div className="my-1 h-8 w-px bg-orange-500/20" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-warm-50">{step.label}</p>
                    <p className="mt-0.5 text-xs text-warm-100/50">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
