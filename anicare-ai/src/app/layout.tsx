import type { Metadata } from 'next';
import { AppShell } from '@/components/nav/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: '安养智巡 - 康养机构AI安全风险预警系统',
  description: '面向养老院、康养中心、护理机构的 AI 安全风险识别、预警调度与护理决策平台',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-[#f5f7fb] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
