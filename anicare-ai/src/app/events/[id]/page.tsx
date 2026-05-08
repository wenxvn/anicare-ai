'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { RiskBadge } from '@/components/ui/risk-badge';
import { LiveDecision } from '@/components/decision/live-decision';
import { mockEvents } from '@/lib/mock-data';
import { mockElderHealthData } from '@/lib/mock-health';

const eventHealthMap: Record<string, string> = {
  'evt-20250501-001': 'health-001',
  'evt-20250501-002': 'health-003',
  'evt-20250501-004': 'health-004',
  'evt-20250501-005': 'health-002',
  'evt-20250501-006': 'health-006',
  'evt-20250501-007': 'health-007',
  'evt-20250501-008': 'health-005',
};

const eventImageMap: Record<string, string> = {
  '摔倒': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1280&h=720&fit=crop',
  '摔倒未响应': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1280&h=720&fit=crop',
  '离床未归': '/pictures/7.jpg',
  '夜间离床未归': '/pictures/7.jpg',
  '烟火疑似异常': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1280&h=720&fit=crop',
  '长时间滞留': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1280&h=720&fit=crop',
  '久卧未动': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1280&h=720&fit=crop',
  '冲突': 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1280&h=720&fit=crop',
  '无人看护': 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1280&h=720&fit=crop',
  '异常滞留': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1280&h=720&fit=crop',
};

const defaultImage = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1280&h=720&fit=crop';

function getEventImage(type: string): string {
  for (const [key, url] of Object.entries(eventImageMap)) {
    if (type.includes(key)) return url;
  }
  return defaultImage;
}

export default function EventDetailPage() {
  const params = useParams();
  const event = mockEvents.find((item) => item.id === params.id);

  if (!event) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-dashed border-[#1a1615]/10 p-12 text-center">
        <Icon icon="mdi:file-search-outline" className="mx-auto text-4xl text-[#5c524a]/30" />
        <p className="mt-3 text-sm text-[#5c524a]/60">事件不存在或已被归档</p>
        <Link href="/events" className="mt-4 inline-block rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] hover:border-teal-500/40 hover:text-teal-700">返回事件列表</Link>
      </div>
    );
  }

  const healthId = eventHealthMap[event.id];
  const healthData = mockElderHealthData.find((e) => e.id === healthId);

  return (
    <div className="space-y-8">
      <SectionHeader title={event.type} description={`事件编号：${event.id}`} />
      <div className="flex items-center gap-3">
        <RiskBadge risk={event.risk} />
        <Link href="/events" className="mt-2 inline-flex items-center gap-1 rounded-2xl border border-[#1a1615]/10 px-4 py-2 text-sm text-[#5c524a] hover:border-teal-500/40 hover:text-teal-700">
          <Icon icon="mdi:arrow-left" className="text-base" />
          返回列表
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-[#1a1615]/8">
            <div className="relative aspect-video">
              <Image src={getEventImage(event.type)} alt={event.type} fill className="object-cover" />
            </div>
          </div>
          <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <p className="text-sm text-[#5c524a]">识别摘要</p>
            <p className="mt-2 text-sm leading-relaxed text-[#5c524a]">{event.summary}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1a1615]">基本信息</p>
              <RiskBadge risk={event.risk} />
            </div>
            <div className="mt-4 space-y-2.5 text-sm text-[#5c524a]">
              <div className="flex justify-between"><span className="text-[#5c524a]/50">处理状态</span><span>{event.status}</span></div>
              <div className="flex justify-between"><span className="text-[#5c524a]/50">处理人</span><span>{event.handler}</span></div>
              <div className="flex justify-between"><span className="text-[#5c524a]/50">摄像头</span><span>{event.camera}</span></div>
              <div className="flex justify-between"><span className="text-[#5c524a]/50">置信度</span><span>{(event.confidence * 100).toFixed(0)}%</span></div>
            </div>
          </div>
          <LiveDecision decision={event.decision} />
        </div>
      </div>

      {healthData && (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
              <Icon icon="mdi:heart-pulse" className="text-lg" />
            </div>
            <p className="text-sm font-semibold text-[#1a1615]">健康数据分析</p>
            <span className="text-xs text-[#5c524a]/60">本次事件与老人近期健康状态存在关联</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-4 text-center">
              <p className="text-xs text-[#5c524a]/50">身体健康指数</p>
              <p className="mt-1 text-2xl font-semibold text-[#1a1615]">{healthData.bodyHealthScore}</p>
              <p className="mt-1 text-xs text-[#5c524a]/50">{healthData.bodyRiskLevel}</p>
            </div>
            <div className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-4 text-center">
              <p className="text-xs text-[#5c524a]/50">心理健康指数</p>
              <p className="mt-1 text-2xl font-semibold text-[#1a1615]">{healthData.mentalHealthScore}</p>
              <p className="mt-1 text-xs text-[#5c524a]/50">{healthData.mentalRiskLevel}</p>
            </div>
            <div className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-4 text-center">
              <p className="text-xs text-[#5c524a]/50">情绪状态</p>
              <p className="mt-1 text-lg font-semibold text-[#1a1615]">{healthData.emotionStatus}</p>
              <p className="mt-1 text-xs text-[#5c524a]/50">置信度 {(healthData.emotionConfidence * 100).toFixed(0)}%</p>
            </div>
            <div className="card-glow rounded-2xl border border-[#1a1615]/8 bg-white p-4 text-center">
              <p className="text-xs text-[#5c524a]/50">综合护理等级</p>
              <p className="mt-1 text-lg font-semibold text-[#1a1615]">{healthData.carePriority}</p>
            </div>
          </div>

          <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="mdi:lightbulb-on-outline" className="text-lg text-indigo-600" />
              <p className="text-sm font-semibold text-[#1a1615]">AI 决策依据</p>
            </div>
            <p className="rounded-2xl bg-[#f8f5f0] px-4 py-3 text-sm leading-relaxed text-[#5c524a]">{healthData.emotionAnalysis.aiReasoning}</p>
          </div>

          <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon icon="mdi:account-heart-outline" className="text-lg text-teal-600" />
              <p className="text-sm font-semibold text-[#1a1615]">心理健康风险筛查</p>
            </div>
            <p className="mb-3 text-xs text-[#5c524a]/60">心理健康分析结果仅作为护理辅助参考，不能替代专业医学诊断。</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                { label: '抑郁风险提示', value: healthData.mentalRisk.depressionRisk },
                { label: '焦虑倾向筛查', value: healthData.mentalRisk.anxietyRisk },
                { label: '孤独风险', value: healthData.mentalRisk.lonelinessRisk },
                { label: '睡眠异常风险', value: healthData.mentalRisk.sleepRisk },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl bg-[#f8f5f0] px-3 py-2">
                  <span className="text-xs text-[#5c524a]">{item.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    item.value.includes('高') ? 'bg-red-50 text-red-600 border border-red-200' :
                    item.value.includes('中') ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-gradient-to-br from-teal-500/5 to-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:heart-pulse" className="text-lg text-teal-600" />
                <p className="text-sm font-semibold text-[#1a1615]">身体健康建议</p>
              </div>
              <p className="text-sm leading-relaxed text-[#5c524a]">{healthData.suggestions.physical}</p>
            </div>
            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-gradient-to-br from-indigo-500/5 to-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:brain" className="text-lg text-indigo-600" />
                <p className="text-sm font-semibold text-[#1a1615]">精神健康建议</p>
              </div>
              <p className="text-sm leading-relaxed text-[#5c524a]">{healthData.suggestions.mental}</p>
            </div>
            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-gradient-to-br from-amber-500/5 to-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:account-nurse" className="text-lg text-amber-600" />
                <p className="text-sm font-semibold text-[#1a1615]">护理员处置建议</p>
              </div>
              <p className="text-sm leading-relaxed text-[#5c524a]">{healthData.suggestions.caregiver}</p>
            </div>
            <div className="card-glow rounded-3xl border border-[#1a1615]/8 bg-gradient-to-br from-rose-500/5 to-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon icon="mdi:account-heart-outline" className="text-lg text-rose-600" />
                <p className="text-sm font-semibold text-[#1a1615]">家属沟通建议</p>
              </div>
              <p className="text-sm leading-relaxed text-[#5c524a]">{healthData.suggestions.family}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
