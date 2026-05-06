'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { FusionRiskCard } from '@/components/prediction/fusion-risk-card';
import { ShortTermForecastCard } from '@/components/prediction/short-term-forecast';
import { ExplainableAlertList } from '@/components/prediction/explainable-alert';

import { fetchJson } from '@/lib/api-client';
import type { PredictionOverview } from '@/types';
import { mockPredictionOverview } from '@/lib/mock-prediction';

export default function PredictionCenterPage() {
  const [data, setData] = useState<PredictionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fetchJson<PredictionOverview>('/api/prediction');
      setData(result);
    } catch {
      setError(true);
      setData(mockPredictionOverview);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-teal-500"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <p className="text-sm text-[#5c524a]">正在加载预测数据…</p>
      </div>
    );
  }

  const overview = data!;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="多模态风险预测中心"
        description="融合视觉、床压、门磁、毫米波等多源传感数据，实时评估当前风险态势，预判未来 15/30 分钟高风险区域，为值班主管提供可解释的预警与处置建议。"
      />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <Icon icon="mdi:alert-circle-outline" className="text-lg text-amber-600" />
          <p className="text-xs text-amber-700">数据加载异常，已切换为本地缓存数据展示。</p>
          <button onClick={loadData} className="ml-auto rounded-lg bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200">
            重试
          </button>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="融合风险分"
          value={overview.fusionRisk.totalScore}
          icon={<Icon icon="mdi:shield-alert-outline" className="text-xl" />}
          helper="四源传感器融合评分"
        />
        <StatCard
          label="未来高风险区域"
          value={overview.forecast30min.highRiskRooms.length}
          icon={<Icon icon="mdi:map-marker-alert-outline" className="text-xl" />}
          helper="未来 30 分钟内风险上升区域"
        />
        <StatCard
          label="待处理预警"
          value={overview.alerts.filter((a) => a.status === 'pending').length}
          icon={<Icon icon="mdi:bell-badge-outline" className="text-xl" />}
          helper="等待值班主管确认的预警"
        />
        <StatCard
          label="模型推理延迟"
          value={`${overview.modelStatus.inferenceLatencyMs} ms`}
          icon={<Icon icon="mdi:speedometer" className="text-xl" />}
          helper={`模型 ${overview.modelStatus.modelVersion}`}
        />
      </div>

      <FusionRiskCard data={overview.fusionRisk} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ShortTermForecastCard data={overview.forecast15min} />
        <ShortTermForecastCard data={overview.forecast30min} />
      </div>

      <ExplainableAlertList alerts={overview.alerts} />


    </div>
  );
}
