'use client';

import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/section-header';
import { Icon } from '@iconify/react';
import { architectureLayers, apiEndpoints } from '@/lib/mock-data';

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <SectionHeader title="技术架构" description="这个系统分五层：前端负责让人看得懂，视觉层负责看懂画面，决策层负责给出建议。" />

      <div className="relative">
        <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-br from-orange-500/10 via-transparent to-emerald-500/10" />
        <div className="relative space-y-3 rounded-[32px] border border-white/5 bg-surface-800/80 p-6">
          {architectureLayers.map((layer, index) => (
            <motion.div key={layer.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className={`rounded-3xl border border-white/5 bg-gradient-to-r p-5 ${layer.accent}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-sm text-warm-100/80">{index + 1}</span>
                <p className="text-base font-semibold text-warm-50">{layer.title}</p>
              </div>
              <p className="mt-1 pl-11 text-xs text-orange-300/70">{layer.technologies}</p>
              <p className="mt-2 pl-11 text-sm text-warm-100/70">{layer.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-warm-50">预留 API 接口</h3>
        <p className="mt-1 text-sm text-warm-100/50">当前使用 mock 数据，后期可无缝替换为 FastAPI 后端</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {apiEndpoints.map((api) => (
            <motion.div key={api.path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/5 bg-surface-800/80 p-4">
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-xs font-mono font-medium ${api.method === 'POST' ? 'bg-orange-500/15 text-orange-300' : 'bg-emerald-500/15 text-emerald-300'}`}>{api.method}</span>
                <span className="font-mono text-sm text-warm-100/80">{api.path}</span>
              </div>
              <p className="mt-2 text-xs text-warm-100/50">{api.description}</p>
              <span className="mt-2 inline-block rounded-full bg-surface-900/80 px-2 py-0.5 text-xs text-warm-100/40">当前：mock 数据</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
