'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';

const innovations = [
  {
    icon: 'mdi:eye-outline',
    title: '多模态场景感知',
    before: '只能看视频，误报高，不能理解场景',
    after: '结合视觉、烟雾、声音传感器，对画面有场景理解能力',
  },
  {
    icon: 'mdi:robot-outline',
    title: '主动风险检测',
    before: '护理员每 2 小时巡查一次，中间出事发现不了',
    after: '系统持续检测风险，一有异常立即通知',
  },
  {
    icon: 'mdi:brain',
    title: '知识增强决策',
    before: '报警后护理员自己判断要不要处理',
    after: '系统给出风险等级、判断依据和具体处置建议',
  },
  {
    icon: 'mdi:lightning-bolt-outline',
    title: '秒级响应能力',
    before: '平均 30 分钟以上才发现并通知',
    after: '从检测到通知平均不超过 4 分钟',
  },
];

const scenarios = [
  { label: '养老院 / 护理院', icon: 'mdi:home-heart' },
  { label: '康养中心', icon: 'mdi:hospital-building' },
  { label: '社区日间照料中心', icon: 'mdi:account-group-outline' },
  { label: '居家养老监护', icon: 'mdi:home-outline' },
  { label: '医院康复病区', icon: 'mdi:hospital-box-outline' },
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <SectionHeader title="关于项目" description="安养智巡面向养老院、康养中心、护理机构，解决'风险发现太晚、处置依据不足'的真实痛点。" />

      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-6">
          <div className="flex items-center gap-3 text-teal-600">
            <Icon icon="mdi:account-heart-outline" className="text-xl" />
            <p className="text-sm font-semibold">项目背景</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#5c524a]">
            传统监控系统只负责录像，老人摔倒、离床、烟火等风险往往要等下一轮巡房甚至事故发生后才被发现。安养智巡基于多模态感知和知识增强决策，将风险识别从&quot;事后翻监控&quot;升级为&quot;实时主动预警&quot;。
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-6">
          <div className="flex items-center gap-3 text-teal-600">
            <Icon icon="mdi:lightbulb-on-outline" className="text-xl" />
            <p className="text-sm font-semibold">项目价值</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#5c524a]">
            不是给护理员增加一个报警器，而是帮他们筛掉 90% 以上的普通画面，只把真正危险的事件、连同风险等级和处置建议一起推送过去。
          </p>
        </motion.div>
      </div>

      <section>
        <h3 className="text-lg font-semibold text-[#1a1615]">创新点</h3>
        <p className="mt-1 text-sm text-[#5c524a]">不只是技术升级，而是从&ldquo;被动监控&rdquo;到&ldquo;主动预警&rdquo;的范式转变</p>
        <div className="mt-4 space-y-4">
          {innovations.map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                  <Icon icon={item.icon} className="text-xl" />
                </div>
                <p className="text-base font-semibold text-[#1a1615]">{item.title}</p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3">
                  <p className="text-xs text-red-600">传统方案</p>
                  <p className="mt-1 text-sm text-[#5c524a]">{item.before}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3">
                  <p className="text-xs text-emerald-600">安养智巡</p>
                  <p className="mt-1 text-sm text-[#5c524a]">{item.after}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-[#1a1615]">适用场景</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          {scenarios.map((item) => (
            <div key={item.label} className="flex items-center gap-2 rounded-2xl border border-[#1a1615]/8 bg-white px-4 py-3">
              <Icon icon={item.icon} className="text-lg text-teal-600" />
              <span className="text-sm text-[#5c524a]">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
