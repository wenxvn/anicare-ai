'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { fetchJson } from '@/lib/api-client';
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ResidentProfile } from '@/types';

const fallbackProfiles: ResidentProfile[] = [
  {
    id: 'res-001', name: '张建国', room: 'A栋-301', age: 78, riskTags: ['摔倒高危', '高血压'],
    todayStatus: '夜间走廊跌倒，待处理', avgWakeTime: '06:30', avgActiveHours: 6.5,
    frequentZones: ['走廊', '活动室', '花园'], nightLeaveCount: 2.1, weeklyAnomalies: 3, todayDeviation: 78,
    deviationSummary: '张大爷通常在 22:00 后不再离开房间，但今天凌晨 03:12 出现在 3 楼走廊，且持续静止超过 12 秒，系统判定为高风险异常活动。',
    weeklyActivityTrend: [{ day: '周一', hours: 7.2 }, { day: '周二', hours: 5.8 }, { day: '周三', hours: 6.4 }, { day: '周四', hours: 6.1 }, { day: '周五', hours: 4.5 }, { day: '周六', hours: 5.0 }, { day: '周日', hours: 3.2 }],
    nightLeaveTrend: [{ day: '周一', count: 1 }, { day: '周二', count: 2 }, { day: '周三', count: 1 }, { day: '周四', count: 3 }, { day: '周五', count: 2 }, { day: '周六', count: 1 }, { day: '周日', count: 4 }],
    riskEventTrend: [{ day: '周一', count: 0 }, { day: '周二', count: 1 }, { day: '周三', count: 0 }, { day: '周四', count: 1 }, { day: '周五', count: 0 }, { day: '周六', count: 0 }, { day: '周日', count: 2 }],
  },
  {
    id: 'res-002', name: '王秀兰', room: 'B栋-302', age: 82, riskTags: ['压疮风险', '骨质疏松'],
    todayStatus: '久卧未动，已通知', avgWakeTime: '07:00', avgActiveHours: 4.2,
    frequentZones: ['床铺', '洗手间'], nightLeaveCount: 1.3, weeklyAnomalies: 2, todayDeviation: 65,
    deviationSummary: '王奶奶今天早上起床后没有像往常一样在 8 点前到走廊散步，且 50 分钟内未检测到翻身动作，系统判定为中风险异常。',
    weeklyActivityTrend: [{ day: '周一', hours: 4.8 }, { day: '周二', hours: 4.1 }, { day: '周三', hours: 3.5 }, { day: '周四', hours: 4.3 }, { day: '周五', hours: 4.0 }, { day: '周六', hours: 3.8 }, { day: '周日', hours: 2.1 }],
    nightLeaveTrend: [{ day: '周一', count: 1 }, { day: '周二', count: 1 }, { day: '周三', count: 2 }, { day: '周四', count: 1 }, { day: '周五', count: 1 }, { day: '周六', count: 0 }, { day: '周日', count: 2 }],
    riskEventTrend: [{ day: '周一', count: 0 }, { day: '周二', count: 0 }, { day: '周三', count: 1 }, { day: '周四', count: 0 }, { day: '周五', count: 0 }, { day: '周六', count: 1 }, { day: '周日', count: 1 }],
  },
  {
    id: 'res-003', name: '陈国华', room: 'B栋-508', age: 75, riskTags: ['夜间离床', '行动不便'],
    todayStatus: '夜间离床未归，待确认', avgWakeTime: '06:00', avgActiveHours: 7.0,
    frequentZones: ['花园', '走廊', '餐厅'], nightLeaveCount: 3.5, weeklyAnomalies: 4, todayDeviation: 82,
    deviationSummary: '陈大爷平时夜间最多起身 1 次且 5 分钟内返回，但今天凌晨 02:16 离床后超过 15 分钟仍未归，且行动轨迹在卫生间方向中断，系统判定为高风险。',
    weeklyActivityTrend: [{ day: '周一', hours: 7.5 }, { day: '周二', hours: 6.8 }, { day: '周三', hours: 7.1 }, { day: '周四', hours: 5.2 }, { day: '周五', hours: 6.9 }, { day: '周六', hours: 7.3 }, { day: '周日', hours: 4.8 }],
    nightLeaveTrend: [{ day: '周一', count: 3 }, { day: '周二', count: 2 }, { day: '周三', count: 4 }, { day: '周四', count: 5 }, { day: '周五', count: 3 }, { day: '周六', count: 3 }, { day: '周日', count: 4 }],
    riskEventTrend: [{ day: '周一', count: 1 }, { day: '周二', count: 0 }, { day: '周三', count: 1 }, { day: '周四', count: 2 }, { day: '周五', count: 0 }, { day: '周六', count: 1 }, { day: '周日', count: 2 }],
  },
  {
    id: 'res-004', name: '李明辉', room: 'A栋-102', age: 80, riskTags: ['认知障碍', '迷路风险'],
    todayStatus: '电梯口滞留，观察中', avgWakeTime: '05:45', avgActiveHours: 8.0,
    frequentZones: ['电梯口', '花园入口', '餐厅'], nightLeaveCount: 1.8, weeklyAnomalies: 5, todayDeviation: 45,
    deviationSummary: '李爷爷下午在电梯口停留超过 10 分钟，结合近期迷路记录，可能是找不到回房间的路，系统判定为中风险。',
    weeklyActivityTrend: [{ day: '周一', hours: 8.2 }, { day: '周二', hours: 7.5 }, { day: '周三', hours: 6.8 }, { day: '周四', hours: 8.1 }, { day: '周五', hours: 7.9 }, { day: '周六', hours: 5.3 }, { day: '周日', hours: 6.0 }],
    nightLeaveTrend: [{ day: '周一', count: 2 }, { day: '周二', count: 1 }, { day: '周三', count: 2 }, { day: '周四', count: 1 }, { day: '周五', count: 2 }, { day: '周六', count: 1 }, { day: '周日', count: 3 }],
    riskEventTrend: [{ day: '周一', count: 1 }, { day: '周二', count: 2 }, { day: '周三', count: 1 }, { day: '周四', count: 0 }, { day: '周五', count: 1 }, { day: '周六', count: 1 }, { day: '周日', count: 1 }],
  },
  {
    id: 'res-005', name: '刘德华', room: 'B栋-205', age: 71, riskTags: ['步态不稳', '膝关节退化'],
    todayStatus: '楼梯口摔倒，护理员已到场', avgWakeTime: '06:15', avgActiveHours: 5.5,
    frequentZones: ['楼梯口', '餐厅', '康复区'], nightLeaveCount: 0.8, weeklyAnomalies: 1, todayDeviation: 92,
    deviationSummary: '刘叔叔平时活动范围集中在 2 层，今天早上 9:15 突然出现在 1 层楼梯口且发生跌倒，结合膝关节退化病史，系统判定为紧急异常。',
    weeklyActivityTrend: [{ day: '周一', hours: 5.8 }, { day: '周二', hours: 5.2 }, { day: '周三', hours: 6.0 }, { day: '周四', hours: 5.5 }, { day: '周五', hours: 4.8 }, { day: '周六', hours: 5.1 }, { day: '周日', hours: 3.5 }],
    nightLeaveTrend: [{ day: '周一', count: 1 }, { day: '周二', count: 0 }, { day: '周三', count: 1 }, { day: '周四', count: 1 }, { day: '周五', count: 0 }, { day: '周六', count: 1 }, { day: '周日', count: 2 }],
    riskEventTrend: [{ day: '周一', count: 0 }, { day: '周二', count: 0 }, { day: '周三', count: 0 }, { day: '周四', count: 0 }, { day: '周五', count: 0 }, { day: '周六', count: 0 }, { day: '周日', count: 1 }],
  },
];

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<ResidentProfile[]>(fallbackProfiles);
  const [selected, setSelected] = useState<ResidentProfile | null>(null);

  useEffect(() => {
    fetchJson<ResidentProfile[]>('/api/profiles').then(setProfiles).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader title="老人行为画像" description="" />

      {!selected ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => setSelected(p)}
              className="card-glow cursor-pointer rounded-3xl border border-[#1a1615]/8 bg-white p-5 transition-colors hover:border-teal-500/25"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                  <Icon icon="mdi:account-circle" className="text-2xl" />
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  {p.riskTags.map((tag) => (
                    <span key={tag} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600">{tag}</span>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-base font-semibold text-[#1a1615]">{p.name}</p>
              <p className="text-xs text-[#5c524a]/50">{p.room} · {p.age} 岁</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  p.todayStatus.includes('待处理') || p.todayStatus.includes('摔倒') ? 'bg-red-500 animate-pulse' :
                  p.todayStatus.includes('已通知') || p.todayStatus.includes('待确认') ? 'bg-orange-500' :
                  p.todayStatus.includes('观察中') ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <span className="text-sm text-[#5c524a]">{p.todayStatus}</span>
              </div>
              <div className="mt-3 text-xs text-teal-600">
                点击查看行为画像 →
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={selected.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
            <button onClick={() => setSelected(null)} className="mb-6 inline-flex items-center gap-1.5 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700">
              <Icon icon="mdi:arrow-left" className="text-base" />
              返回老人列表
            </button>

            <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
              <div className="space-y-5">
                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600">
                      <Icon icon="mdi:account-circle" className="text-3xl" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-[#1a1615]">{selected.name}</p>
                      <p className="text-sm text-[#5c524a]">{selected.room} · {selected.age} 岁</p>
                      <div className="mt-1 flex gap-2">
                        {selected.riskTags.map((tag) => (
                          <span key={tag} className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#1a1615]">日常习惯数据</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: '平均起床时间', value: selected.avgWakeTime, icon: 'mdi:weather-sunset-up' },
                      { label: '日均活动时长', value: `${selected.avgActiveHours} 小时`, icon: 'mdi:walk' },
                      { label: '常去区域', value: selected.frequentZones.join('、'), icon: 'mdi:map-marker-path' },
                      { label: '周均夜间离床', value: `${selected.nightLeaveCount} 次`, icon: 'mdi:bed' },
                      { label: '近 7 天异常', value: `${selected.weeklyAnomalies} 次`, icon: 'mdi:alert-circle-outline' },
                      { label: '今日偏离度', value: `${selected.todayDeviation}%`, icon: 'mdi:trending-up' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-[#1a1615]/8 bg-[#f8f5f0] p-3">
                        <div className="flex items-center gap-2">
                          <Icon icon={item.icon} className="text-sm text-teal-600" />
                          <span className="text-xs text-[#5c524a]/50">{item.label}</span>
                        </div>
                        <p className="mt-1.5 text-sm font-semibold text-[#1a1615]">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#1a1615]">7 天活动趋势</p>
                  <p className="mt-1 text-xs text-[#5c524a]">每天的活动时长（小时）</p>
                  <div className="mt-4 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selected.weeklyActivityTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,21,0.06)" />
                        <XAxis dataKey="day" stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(26,22,21,0.08)' }} />
                        <Area type="monotone" dataKey="hours" stroke="#0d9488" fill="#0d948822" strokeWidth={2} name="活动时长" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid gap-5 xl:grid-cols-2">
                  <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#1a1615]">夜间离床次数趋势</p>
                    <p className="mt-1 text-xs text-[#5c524a]">每晚离床次数</p>
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selected.nightLeaveTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,21,0.06)" />
                          <XAxis dataKey="day" stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} fontSize={12} />
                          <YAxis stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(26,22,21,0.08)' }} />
                          <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} name="离床次数" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                    <p className="text-sm font-semibold text-[#1a1615]">风险事件频次</p>
                    <p className="mt-1 text-xs text-[#5c524a]">每天触发的风险事件数</p>
                    <div className="mt-4 h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selected.riskEventTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,21,0.06)" />
                          <XAxis dataKey="day" stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} fontSize={12} />
                          <YAxis stroke="rgba(92,82,74,0.5)" tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: '#fff', borderRadius: 16, border: '1px solid rgba(26,22,21,0.08)' }} />
                          <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]} name="风险事件" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="card-glow rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-white to-white p-5">
                  <div className="flex items-center gap-2 text-teal-700">
                    <Icon icon="mdi:brain" className="text-xl" />
                    <p className="text-sm font-semibold">行为偏离分析</p>
                  </div>
                  <div className="mt-4">
                    <div className="mb-3 flex items-center gap-3">
                      <span className="text-3xl font-bold text-[#1a1615]">{selected.todayDeviation}<span className="text-base text-[#5c524a]/50">%</span></span>
                      <div className="flex-1">
                        <div className="h-2 rounded-full bg-[#f0ece5]">
                          <div className={`h-2 rounded-full ${selected.todayDeviation >= 70 ? 'bg-red-500' : selected.todayDeviation >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${selected.todayDeviation}%` }} />
                        </div>
                        <p className="mt-1 text-xs text-[#5c524a]/50">今日行为偏离度</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#5c524a]">{selected.deviationSummary}</p>
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#1a1615]">今日状态</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-full ${
                      selected.todayStatus.includes('待处理') || selected.todayStatus.includes('摔倒') ? 'bg-red-500 animate-pulse' :
                      selected.todayStatus.includes('已通知') || selected.todayStatus.includes('待确认') ? 'bg-orange-500' :
                      selected.todayStatus.includes('观察中') ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <span className="text-sm text-[#1a1615]">{selected.todayStatus}</span>
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#1a1615]">常去区域</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.frequentZones.map((zone) => (
                      <span key={zone} className="rounded-2xl border border-[#1a1615]/8 bg-[#f8f5f0] px-3 py-1.5 text-xs text-[#5c524a]">
                        <Icon icon="mdi:map-marker-outline" className="mr-1 inline text-sm text-teal-600" />
                        {zone}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
                  <p className="text-sm font-semibold text-[#1a1615]">风险标签</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.riskTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
