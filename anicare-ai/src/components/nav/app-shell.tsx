'use client';

import { useState } from 'react';
import { TopNav } from '@/components/nav/top-nav';
import { Sidebar } from '@/components/nav/sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-6 pb-10 pt-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
