'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '@/lib/auth-context';

interface TopNavProps {
  onToggleSidebar: () => void;
}

const statusItems = [
  { label: '系统在线', value: '99.98%', icon: 'mdi:check-decagram-outline', tone: 'text-emerald-600' },
  { label: '摄像头', value: '36/38', icon: 'mdi:cctv', tone: 'text-teal-600' },
  { label: '传感器', value: '124/128', icon: 'mdi:access-point-network', tone: 'text-cyan-600' },
  { label: '待处理', value: '7', icon: 'mdi:bell-alert-outline', tone: 'text-red-600' },
];

function LiveTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }));
    };
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return <span className="font-mono text-xs text-[#5c524a]">{time}</span>;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#1a1615]/8 bg-white/90 px-4 backdrop-blur lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700 transition-colors hover:bg-teal-500/20"
          title="切换侧边栏"
        >
          <Icon icon="mdi:menu" className="text-lg" />
        </button>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-[#1a1615]">安养智巡运行中</span>
        </div>
        <div className="ml-2 hidden items-center gap-2 xl:flex">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 rounded-lg border border-[#1a1615]/8 bg-[#f8f5f0] px-2.5 py-1.5">
              <Icon icon={item.icon} className={`text-sm ${item.tone}`} />
              <span className="text-[11px] text-[#5c524a]">{item.label}</span>
              <span className="text-xs font-semibold text-[#1a1615]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LiveTime />
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#1a1615]/8 bg-white text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700" title="通知">
          <Icon icon="mdi:bell-outline" className="text-base" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-[#5c524a] sm:inline">{user.username}</span>
            <button onClick={logout} className="rounded-lg border border-[#1a1615]/10 px-3 py-1.5 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
              退出
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
