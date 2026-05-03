'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(username, password);
      if (ok) {
        router.push('/');
      } else {
        setError('账号或密码错误');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5f0] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
            <Icon icon="mdi:shield-check" className="text-3xl" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-[#1a1615]">安养智巡</h1>
          <p className="mt-1 text-sm text-[#5c524a]">康养机构安全风险预警系统</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#1a1615]/8 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-[#1a1615]">账号</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入账号"
              className="mt-1.5 w-full rounded-2xl border border-[#1a1615]/10 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1615] placeholder:text-[#5c524a]/40 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-[#1a1615]">密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="mt-1.5 w-full rounded-2xl border border-[#1a1615]/10 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1615] placeholder:text-[#5c524a]/40 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </label>
          {error && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
              <Icon icon="mdi:alert-circle-outline" className="text-base" />
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:opacity-60"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-[#5c524a]/50">默认账号 / 密码：123456</p>
      </div>
    </div>
  );
}
