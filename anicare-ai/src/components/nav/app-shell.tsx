'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Icon } from '@iconify/react';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/nav/top-nav';
import { Sidebar } from '@/components/nav/sidebar';

const publicPaths = ['/login'];
const mobileLinks = [
  { href: '/', label: '首页', icon: 'mdi:home-heart' },
  { href: '/detect', label: '监测', icon: 'mdi:eye-check-outline' },
  { href: '/dispatch', label: '调度', icon: 'mdi:broadcast' },
  { href: '/dashboard', label: '看板', icon: 'mdi:chart-areaspline' },
  { href: '/knowledge', label: '助手', icon: 'mdi:robot-outline' },
];

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-3xl border border-[#172033]/10 bg-white/92 p-1.5 shadow-2xl shadow-slate-900/12 backdrop-blur-xl lg:hidden">
      {mobileLinks.map((item) => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-medium transition-colors',
              active ? 'bg-teal-500/10 text-teal-800' : 'text-[#5d6b82] hover:bg-[#f5f7fb] hover:text-[#172033]',
            )}
          >
            <Icon icon={item.icon} className="text-lg" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (ready && !user && !isPublic) {
      router.replace('/login');
    }
  }, [user, ready, isPublic, router]);

  if (isPublic) {
    return <>{children}</>;
  }

  if (!ready || !user) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 hairline-grid opacity-50" />
      <Sidebar collapsed={sidebarCollapsed} onNavigate={() => {}} />
      <div className="relative flex flex-1 flex-col min-w-0">
        <TopNav onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} />
        <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 xl:px-10">{children}</main>
        <MobileNav pathname={pathname} />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
