'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth-context';

const navLinks = [
  { href: '/', label: '首页', icon: 'mdi:home-heart' },
  { href: '/detect', label: '智能检测', icon: 'mdi:eye-check-outline' },
  { href: '/dispatch', label: '风险调度', icon: 'mdi:broadcast' },
  { href: '/prediction-center', label: '风险预测', icon: 'mdi:chart-timeline-variant-shimmer' },
  { href: '/profiles', label: '行为画像', icon: 'mdi:account-details' },
  { href: '/emergency', label: '应急流程', icon: 'mdi:ambulance' },
  { href: '/events', label: '事件管理', icon: 'mdi:alert-octagon-outline' },
  { href: '/dashboard', label: '数据看板', icon: 'mdi:chart-areaspline' },
  { href: '/knowledge', label: '智能助手', icon: 'mdi:robot-outline' },
];

interface TopNavProps {
  onToggleSidebar: () => void;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-center justify-between border-b border-[#1a1615]/8 bg-white/70 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 transition-colors hover:bg-teal-500/20" title="切换侧栏">
          <Icon icon="mdi:menu" className="text-lg" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
            <Icon icon="mdi:shield-check" className="text-base" />
          </div>
          <span className="text-sm font-semibold text-[#1a1615]">安养智巡</span>
        </div>
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-teal-500/10 text-teal-700'
                    : 'text-[#5c524a] hover:bg-[#f8f5f0] hover:text-[#1a1615]'
                )}
              >
                <Icon icon={item.icon} className="text-sm" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-[#5c524a]">
              <Icon icon="mdi:account-circle" className="mr-1 inline text-base text-teal-600" />
              {user.username}
            </span>
            <button onClick={logout} className="rounded-2xl border border-[#1a1615]/10 px-3 py-2 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
              退出
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
