'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { TopNav } from '@/components/nav/top-nav';
import { Sidebar } from '@/components/nav/sidebar';

const publicPaths = ['/login'];

function AppContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname);

  useEffect(() => {
    if (!user && !isPublic) {
      router.replace('/login');
    }
  }, [user, isPublic, router]);

  if (isPublic) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
