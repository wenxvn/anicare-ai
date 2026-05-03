'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const coreCapabilities = [
  { icon: 'mdi:human-fall-down', title: '摔倒与久卧识别', description: '老人摔倒后，不再等到下一轮巡房才被发现。' },
  { icon: 'mdi:fire-alert', title: '烟火与环境隐患识别', description: '烟雾浓度一异常，系统立刻帮你盯住。' },
  { icon: 'mdi:bed-alert', title: '离床未归与异常滞留识别', description: '老人半夜离开床位没回来，不用靠运气发现了。' },
  { icon: 'mdi:brain', title: 'AI 风险评级与处置建议', description: '不只是报警，还会告诉你先处理哪件事。' },
];

const quickEntries = [
  { href: '/detect', title: '体验智能检测', description: '上传一张图，看看系统怎么识别风险。', icon: 'mdi:eye-check-outline' },
  { href: '/events', title: '查看事件管理', description: '快速筛选紧急、高风险、待处理事件。', icon: 'mdi:alert-octagon-outline' },
  { href: '/dashboard', title: '查看数据看板', description: '看看今天系统替护理员筛掉了多少普通画面。', icon: 'mdi:chart-areaspline' },
  { href: '/architecture', title: '了解技术架构', description: '五层架构，从视觉感知到智能决策。', icon: 'mdi:graph-outline' },
];

export default function HomePage() {
  return (
    <div className="relative space-y-20">
      <section className="relative mx-auto grid max-w-6xl gap-10 pt-8 lg:grid-cols-[1.35fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-1.5 text-xs text-orange-200">
            <Icon icon="mdi:shield-check" />
            中国机器人及人工智能大赛 · 人工智能创新赛
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-warm-50 sm:text-5xl">
            别等到下一轮巡房，<br />才发现老人已经摔倒。
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-warm-100/70">
            安养智巡用视觉识别、行为理解和知识库决策，把康养机构里的高风险事件提前拎出来。不是多一个报警器，而是多一个会判断轻重缓急的值班助手。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/detect" className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400">
              <Icon icon="mdi:eye-check-outline" />
              开始风险演示
            </Link>
            <Link href="/architecture" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-6 py-3 text-sm text-warm-100/80 transition-colors hover:border-orange-500/30 hover:text-orange-200">
              <Icon icon="mdi:graph-outline" />
              查看系统能力
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.1 }} className="relative">
          <div className="absolute -inset-8 rounded-[36px] bg-gradient-to-br from-orange-500/20 via-transparent to-emerald-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-white/5">
            <Image src="https://picsum.photos/seed/care-hero-2025/960/720" alt="康养安全场景" width={960} height={720} className="h-full w-full object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs text-warm-50 backdrop-blur">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                模拟实时监控画面
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-semibold text-warm-50">核心能力</h2>
          <p className="mt-2 text-sm text-warm-100/60">系统先帮你把最危险的事挑出来，护理员一看就知道先处理哪件事。</p>
        </motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {coreCapabilities.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.08 }} className="flex items-start gap-4 rounded-3xl border border-white/5 bg-surface-800/70 p-5 transition-colors hover:border-orange-500/20">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-300">
                <Icon icon={item.icon} className="text-2xl" />
              </div>
              <div>
                <p className="text-base font-semibold text-warm-50">{item.title}</p>
                <p className="mt-1 text-sm text-warm-100/60">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-surface-800/80 to-surface-800/80 p-8 text-center">
            <p className="text-xl font-semibold text-warm-50 sm:text-2xl">
              &ldquo;别再假装靠人工巡查就能看住每一个角落。&rdquo;
            </p>
            <p className="mt-3 text-sm text-warm-100/60">别等到事故发生后，才回头翻监控。</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl pb-8">
        <h2 className="text-2xl font-semibold text-warm-50">快速进入</h2>
        <p className="mt-2 text-sm text-warm-100/60">这个网站不是普通监控后台，而是让护理员更快看到危险、更准判断优先级。</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickEntries.map((item, index) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.06 }}>
              <Link href={item.href} className="group flex flex-col rounded-3xl border border-white/5 bg-surface-800/80 p-5 transition-colors hover:border-orange-500/25">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-300 transition-colors group-hover:bg-orange-500/20">
                  <Icon icon={item.icon} className="text-2xl" />
                </div>
                <p className="mt-4 text-base font-semibold text-warm-50">{item.title}</p>
                <p className="mt-2 flex-1 text-sm text-warm-100/60">{item.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-orange-300">
                  <span>进入</span>
                  <Icon icon="mdi:arrow-right" className="text-sm" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
