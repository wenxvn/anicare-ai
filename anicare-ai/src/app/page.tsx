'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

const coreCapabilities = [
  { icon: 'mdi:human-fall-down', title: '摔倒与久卧识别', description: '老人摔倒后，不再等到下一轮巡房才被发现。' },
  { icon: 'mdi:fire-alert', title: '烟火与环境隐患识别', description: '烟雾浓度一异常，系统立刻帮你盯住。' },
  { icon: 'mdi:bed-alert', title: '离床未归与异常滞留识别', description: '老人半夜离开床位没回来，不用靠运气发现了。' },
  { icon: 'mdi:merge', title: '多模态融合风险预测', description: '视觉、床压、门磁、毫米波四源融合，提前预判未来风险走势。' },
  { icon: 'mdi:account-details', title: '老人行为画像分析', description: '记住每位老人的日常习惯，偏离越大风险越高。' },
  { icon: 'mdi:broadcast', title: '智能风险调度', description: '多个事件同时发生时，自动排出最危险的优先级。' },
  { icon: 'mdi:ambulance', title: '应急流程引导', description: '护理员按步骤处理，每一步都有知识库撑腰。' },
  { icon: 'mdi:robot-outline', title: '智能助手问答', description: '护理安全方面的问题随时问，结合知识库给出专业建议。' },
];

const quickEntries = [
  { href: '/detect', title: '实时监测', description: '查看各区域摄像头的实时监控画面与风险分析。', icon: 'mdi:eye-check-outline' },
  { href: '/prediction-center', title: '风险预测中心', description: '多模态融合评分，提前预判未来 30 分钟高风险区域。', icon: 'mdi:chart-timeline-variant-shimmer' },
  { href: '/dispatch', title: '风险调度中心', description: '自动排序优先级，护理员一看就知道先处理哪件事。', icon: 'mdi:broadcast' },
  { href: '/profiles', title: '行为画像', description: '每位老人的日常习惯和今日行为偏离度。', icon: 'mdi:account-details' },
  { href: '/emergency', title: '应急流程', description: '选择事件类型，系统一步步带着做。', icon: 'mdi:ambulance' },
  { href: '/events', title: '事件管理', description: '快速筛选紧急、高风险、待处理事件。', icon: 'mdi:alert-octagon-outline' },
  { href: '/dashboard', title: '数据看板', description: '看看今天系统替护理员筛掉了多少普通画面。', icon: 'mdi:chart-areaspline' },
  { href: '/knowledge', title: '智能助手', description: '有任何护理安全方面的问题，随时向助手提问。', icon: 'mdi:robot-outline' },
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative mx-auto grid max-w-6xl gap-10 pt-8 lg:grid-cols-[1.35fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-[#1a1615] sm:text-5xl">
            别等到下一轮巡房，<br />才发现老人已经摔倒。
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#5c524a]">
            安养智巡用视觉识别、行为理解和知识库决策，把康养机构里的高风险事件提前拎出来。不是多一个报警器，而是多一个会判断轻重缓急的值班助手。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/detect" className="inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-500">
              <Icon icon="mdi:eye-check-outline" />
              开始风险演示
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.1 }} className="relative">
          <div className="absolute -inset-8 rounded-[36px] bg-gradient-to-br from-teal-500/15 via-transparent to-emerald-500/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[28px] border border-[#1a1615]/8">
            <Image src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=960&h=720&fit=crop" alt="康养安全场景" width={960} height={720} className="h-full w-full object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs text-[#1a1615] backdrop-blur">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                模拟实时监控画面
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-semibold text-[#1a1615]">核心能力</h2>
        </motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coreCapabilities.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + index * 0.08 }} className="card-glow flex items-start gap-4 rounded-3xl border border-[#1a1615]/8 bg-white p-5 transition-colors hover:border-teal-500/25">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                <Icon icon={item.icon} className="text-2xl" />
              </div>
              <div>
                <p className="text-base font-semibold text-[#1a1615]">{item.title}</p>
                <p className="mt-1 text-sm text-[#5c524a]">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-white to-white p-8 text-center">
            <p className="text-xl font-semibold text-[#1a1615] sm:text-2xl">
              &ldquo;别再假装靠人工巡查就能看住每一个角落。&rdquo;
            </p>
            <p className="mt-3 text-sm text-[#5c524a]">别等到事故发生后，才回头翻监控。</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl pb-8">
        <h2 className="text-2xl font-semibold text-[#1a1615]">快速进入</h2>
        <p className="mt-2 text-sm text-[#5c524a]">这个网站不是普通监控后台，而是让护理员更快看到危险、更准判断优先级。</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickEntries.map((item, index) => (
            <motion.div key={item.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + index * 0.06 }}>
              <Link href={item.href} className="card-glow group flex flex-col rounded-3xl border border-[#1a1615]/8 bg-white p-5 transition-colors hover:border-teal-500/25">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 transition-colors group-hover:bg-teal-500/20">
                  <Icon icon={item.icon} className="text-2xl" />
                </div>
                <p className="mt-4 text-base font-semibold text-[#1a1615]">{item.title}</p>
                <p className="mt-2 flex-1 text-sm text-[#5c524a]">{item.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-teal-600">
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
