'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

const links = [
  { href: '/', label: '首页', icon: 'mdi:home-heart' },
  { href: '/detect', label: '智能检测', icon: 'mdi:eye-check-outline' },
  { href: '/decision', label: 'AI 决策', icon: 'mdi:brain' },
  { href: '/events', label: '事件管理', icon: 'mdi:alert-octagon-outline' },
  { href: '/dashboard', label: '数据看板', icon: 'mdi:chart-areaspline' },
  { href: '/knowledge', label: '知识库', icon: 'mdi:book-open-page-variant-outline' },
  { href: '/architecture', label: '技术架构', icon: 'mdi:graph-outline' },
  { href: '/about', label: '关于项目', icon: 'mdi:information-outline' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-surface-800/95 backdrop-blur transition-transform duration-300 lg:static lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
              <Icon icon="mdi:shield-check" className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-warm-50">安养智巡</p>
              <p className="text-xs text-warm-100/50">安全风险预警系统</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-warm-100/50 hover:text-warm-100 lg:hidden">
            <Icon icon="mdi:close" className="text-xl" />
          </button>
        </div>
        <nav className="mt-6 space-y-1 px-3">
          {links.map((item) => {
            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={onClose} className={clsx('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors', active ? 'bg-orange-500/10 text-orange-200' : 'text-warm-100/70 hover:bg-white/5 hover:text-warm-100')}>
                <Icon icon={item.icon} className="text-lg" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
