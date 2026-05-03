'use client';

import { Icon } from '@iconify/react';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/5 bg-surface-900/70 px-6 backdrop-blur lg:px-10">
      <div className="flex items-center gap-3 text-sm text-warm-100/70">
        <button onClick={onMenuClick} className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300 lg:hidden">
          <Icon icon="mdi:menu" className="text-lg" />
        </button>
        <span className="font-medium text-warm-50">安养智巡</span>
        <span className="hidden text-warm-100/40 sm:inline">·</span>
        <span className="hidden sm:inline">基于多模态感知与知识增强决策的康养机构安全风险预警系统</span>
      </div>
      <div className="flex items-center gap-4 text-warm-100/60">
        <button className="rounded-2xl border border-white/5 bg-surface-800 px-3 py-2 text-xs text-warm-100/70 transition-colors hover:border-orange-500/30 hover:text-orange-200">
          模拟登录
        </button>
      </div>
    </header>
  );
}
