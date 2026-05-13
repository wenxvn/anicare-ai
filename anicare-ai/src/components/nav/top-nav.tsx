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
  { label: '传感器', value: '124/128', icon: 'mdi:access-point-network', tone: 'text-sky-600' },
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

  return <span className="font-mono text-xs text-[#5d6b82]">{time}</span>;
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#172033]/10 bg-white/82 px-4 shadow-sm shadow-slate-900/3 backdrop-blur-xl lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="hidden h-9 w-9 items-center justify-center rounded-xl border border-teal-500/15 bg-teal-500/10 text-teal-700 transition-colors hover:bg-teal-500/20 lg:flex"
          title="切换侧边栏"
        >
          <Icon icon="mdi:menu" className="text-lg" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-sky-500 text-white">
            <Icon icon="mdi:shield-check" className="text-base" />
          </div>
          <span className="text-sm font-semibold text-[#172033]">安养智巡</span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-[#172033]">安养智巡运行中</span>
        </div>
        <div className="ml-2 hidden items-center gap-2 xl:flex">
          {statusItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 rounded-xl border border-[#172033]/8 bg-white/70 px-2.5 py-1.5 shadow-sm">
              <Icon icon={item.icon} className={`text-sm ${item.tone}`} />
              <span className="text-[11px] text-[#5d6b82]">{item.label}</span>
              <span className="text-xs font-semibold text-[#172033]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <LiveTime />
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#172033]/8 bg-white text-[#5d6b82] shadow-sm transition-colors hover:border-teal-500/40 hover:text-teal-700" title="通知">
          <Icon icon="mdi:bell-outline" className="text-base" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        {user ? (
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-[#5d6b82] sm:inline">{user.username}</span>
            <button onClick={logout} className="rounded-xl border border-[#172033]/10 bg-white px-3 py-1.5 text-xs text-[#5d6b82] shadow-sm transition-colors hover:border-teal-500/40 hover:text-teal-700">
              退出
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
