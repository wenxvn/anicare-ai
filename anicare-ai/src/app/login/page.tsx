'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] p-4">
      <div className="pointer-events-none absolute inset-0 hairline-grid opacity-60" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#172033]/10 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-slate-900 lg:block">
          <Image
            src="/pictures/camera-corridor-wheelchair.jpg"
            alt="康养机构走廊监护场景"
            fill
            priority
            sizes="55vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/35 to-teal-900/55" />
          <div className="absolute left-8 top-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            机构安全风险实时守护
          </div>
          <div className="absolute inset-x-8 bottom-8">
            <p className="text-sm font-medium text-teal-100">安养智巡</p>
            <h2 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
              让风险识别、派单处置和护理记录形成闭环
            </h2>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ['36/38', '摄像头在线'],
                ['7', '待处理事件'],
                ['4.2m', '平均响应'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/12 bg-white/10 p-3 backdrop-blur">
                  <p className="text-lg font-semibold text-white">{value}</p>
                  <p className="mt-1 text-[11px] text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-sky-500 text-white shadow-lg shadow-teal-500/20">
                <Icon icon="mdi:shield-check" className="text-3xl" />
              </div>
              <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#172033]">安养智巡</h1>
              <p className="mt-1 text-sm text-[#5d6b82]">康养机构AI安全风险预警系统</p>
            </div>
            <form onSubmit={handleSubmit} className="rounded-3xl border border-[#172033]/8 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-[#172033]">账号</span>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入账号"
              className="mt-1.5 w-full rounded-2xl border border-[#172033]/10 bg-[#f5f7fb] px-4 py-2.5 text-sm text-[#172033] placeholder:text-[#5d6b82]/40 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-medium text-[#172033]">密码</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="mt-1.5 w-full rounded-2xl border border-[#172033]/10 bg-[#f5f7fb] px-4 py-2.5 text-sm text-[#172033] placeholder:text-[#5d6b82]/40 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
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
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-600/18 transition-all hover:from-teal-500 hover:to-sky-500 disabled:opacity-60"
          >
            {loading ? '登录中...' : '登录'}
          </button>
            </form>
            <p className="mt-4 text-center text-xs text-[#5d6b82]/50">默认账号 / 密码：123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
