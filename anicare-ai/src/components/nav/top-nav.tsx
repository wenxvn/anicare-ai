'use client';

import { Icon } from '@iconify/react';
import { useAuth } from '@/lib/auth-context';

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#1a1615]/8 bg-white/70 px-6 backdrop-blur lg:px-10">
      <div className="flex items-center gap-3 text-sm text-[#5c524a]">
        <button onClick={onMenuClick} className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 lg:hidden">
          <Icon icon="mdi:menu" className="text-lg" />
        </button>
        <span className="font-medium text-[#1a1615]">安养智巡</span>
        <span className="hidden text-[#5c524a]/40 sm:inline">·</span>
        <span className="hidden sm:inline">基于多模态感知与知识增强决策的康养机构安全风险预警系统</span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#5c524a]">
              <Icon icon="mdi:account-circle" className="mr-1 inline text-base text-teal-600" />
              {user.username}
            </span>
            <button onClick={logout} className="rounded-2xl border border-[#1a1615]/10 px-3 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
              退出
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
