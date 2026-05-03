'use client';

import { SectionHeader } from '@/components/ui/section-header';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

const innovations = [
  {
    icon: 'mdi:eye-check-outline',
    title: '从单一目标检测升级为复杂行为理解',
    before: '传统监控只能识别"有人摔倒"',
    after: '安养智巡能理解"老人在走廊转弯处跌倒，12 秒未动，周围无人响应"',
  },
  {
    icon: 'mdi:brain',
    title: '从简单报警升级为知识增强型 AI 决策',
    before: '传统系统只会弹一个红色报警框',
    after: '安养智巡会告诉你为什么危险、依据什么规范、建议怎么处理',
  },
  {
    icon: 'mdi:chart-timeline-variant-shimmer',
    title: '从监控回放升级为主动风险预警',
    before: '出了事才去翻监控录像',
    after: '系统实时分析画面，把高风险事件主动推到你面前',
  },
  {
    icon: 'mdi:web',
    title: '构建完整 Web 闭环平台',
    before: '检测、报警、处置分散在不同系统',
    after: '从检测到决策到处置到复盘，一个平台全搞定',
  },
];

const scenarios = [
  { icon: 'mdi:home-heart', label: '养老院' },
  { icon: 'mdi:spa', label: '康养中心' },
  { icon: 'mdi:hospital-box', label: '护理院' },
  { icon: 'mdi:account-group', label: '社区日间照料中心' },
  { icon: 'mdi:hospital-building', label: '医院康复区' },
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <SectionHeader title="关于项目" description="安养智巡不是又一个监控后台，而是一个让康养空间更安全的 AI 值班助手。" />

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-6">
          <div className="flex items-center gap-3 text-orange-300">
            <Icon icon="mdi:account-heart-outline" className="text-xl" />
            <p className="text-sm font-semibold">项目背景</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-warm-100/70">
            中国正在快速进入老龄化社会。养老院、康养中心面临护理人手不足、夜间巡查压力大、传统监控无法主动预警等现实问题。一个护理员晚上要照看 30 多位老人，靠人工巡查根本看不过来。
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-6">
          <div className="flex items-center gap-3 text-orange-300">
            <Icon icon="mdi:lightbulb-on-outline" className="text-xl" />
            <p className="text-sm font-semibold">项目价值</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-warm-100/70">
            减少漏检：系统 24 小时不眨眼，不会因为疲劳错过异常。缩短响应时间：从发现到通知平均 4.2 分钟，比人工回放快 6 倍。辅助判断：护理员一看就知道先处理哪件事，不用自己判断轻重缓急。
          </p>
        </motion.div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-warm-50">创新点</h3>
        <p className="mt-1 text-sm text-warm-100/50">不只是技术升级，而是从"被动监控"到"主动预警"的范式转变</p>
        <div className="mt-4 space-y-4">
          {innovations.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-3xl border border-white/5 bg-surface-800/80 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-300">
                  <Icon icon={item.icon} className="text-xl" />
                </div>
                <p className="text-base font-semibold text-warm-50">{item.title}</p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-red-500/5 border border-red-500/10 p-3">
                  <p className="text-xs text-red-300/70">传统方案</p>
                  <p className="mt-1 text-sm text-warm-100/60">{item.before}</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/10 p-3">
                  <p className="text-xs text-emerald-300/70">安养智巡</p>
                  <p className="mt-1 text-sm text-warm-100/80">{item.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-warm-50">适用场景</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {scenarios.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-white/5 bg-surface-800/80 px-4 py-3">
              <Icon icon={item.icon} className="text-lg text-orange-300" />
              <span className="text-sm text-warm-100/80">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
