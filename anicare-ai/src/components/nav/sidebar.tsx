'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

const links = [
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

interface SidebarProps {
  collapsed: boolean;
  onNavigate: () => void;
}

export function Sidebar({ collapsed, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        'hidden flex-col border-r border-[#1a1615]/8 bg-white/95 backdrop-blur transition-all duration-300 lg:flex',
        collapsed ? 'w-0 overflow-hidden opacity-0' : 'w-60 opacity-100'
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-[#1a1615]/8 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
          <Icon icon="mdi:shield-check" className="text-xl" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1a1615]">安养智巡</p>
          <p className="text-xs text-[#5c524a]">安全风险预警系统</p>
        </div>
      </div>
      <nav className="mt-6 flex-1 space-y-1 px-3">
        {links.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={clsx(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors',
                active
                  ? 'bg-teal-500/10 text-teal-700'
                  : 'text-[#5c524a] hover:bg-[#f8f5f0] hover:text-[#1a1615]'
              )}
            >
              <Icon icon={item.icon} className="shrink-0 text-lg" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
