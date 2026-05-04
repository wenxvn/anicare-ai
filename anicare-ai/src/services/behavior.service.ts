import type { BehaviorAnalysis, BehaviorAnalyzeInput, DetectionResult } from '@/types';
import { mockResidentProfiles } from '@/lib/mock-data';

function detectAnomalyLabels(detections: DetectionResult[]): string[] {
  const labels: string[] = [];
  const categories = detections.map((d) => d.category || d.label);

  if (categories.some((c) => c.includes('fall') || c.includes('摔倒'))) labels.push('跌倒行为');
  if (categories.some((c) => c.includes('still') || c.includes('静止'))) labels.push('长时间静止');
  if (categories.some((c) => c.includes('no_response') || c.includes('无人'))) labels.push('无人响应');

  return labels;
}

function computeDeviationScore(input: BehaviorAnalyzeInput): number {
  let score = 20;

  const hour = input.timeOfDay ? parseInt(input.timeOfDay.split(':')[0], 10) : 12;
  if (hour >= 22 || hour <= 5) score += 25;

  if (input.nightLeaveCount && input.nightLeaveCount > 2) score += 15;
  if (input.weeklyAnomalies && input.weeklyAnomalies > 3) score += 20;

  const hasFall = input.currentDetections?.some((d) => (d.category || d.label).includes('fall') || d.label.includes('摔倒'));
  if (hasFall) score += 30;

  const hasStill = input.currentDetections?.some((d) => (d.category || d.label).includes('still') || d.label.includes('静止'));
  if (hasStill) score += 10;

  return Math.min(100, Math.max(0, score));
}

function determineTrend(deviationScore: number, weeklyAnomalies?: number): 'rising' | 'stable' | 'declining' {
  if (deviationScore > 70 || (weeklyAnomalies && weeklyAnomalies > 4)) return 'rising';
  if (deviationScore < 30) return 'declining';
  return 'stable';
}

class MockBehaviorEngine {
  analyze(input: BehaviorAnalyzeInput): BehaviorAnalysis {
    const deviationScore = input.residentId
      ? this.getResidentDeviation(input.residentId)
      : computeDeviationScore(input);

    const behaviorLabels = input.currentDetections
      ? detectAnomalyLabels(input.currentDetections)
      : ['正常活动'];

    const riskTrend = determineTrend(deviationScore, input.weeklyAnomalies);

    const details = [
      { label: '偏离度评分', value: `${deviationScore}/100` },
      { label: '风险趋势', value: riskTrend === 'rising' ? '↑ 上升' : riskTrend === 'declining' ? '↓ 下降' : '→ 稳定' },
      { label: '异常行为', value: behaviorLabels.join('、') || '无' },
    ];

    if (input.nightLeaveCount !== undefined) {
      details.push({ label: '夜间离床次数', value: `${input.nightLeaveCount}次/天` });
    }
    if (input.weeklyAnomalies !== undefined) {
      details.push({ label: '本周异常次数', value: `${input.weeklyAnomalies}次` });
    }

    return {
      deviationScore,
      behaviorLabels,
      riskTrend,
      summary: `行为偏离度${deviationScore}分，${riskTrend === 'rising' ? '风险呈上升趋势，需要关注' : riskTrend === 'declining' ? '风险呈下降趋势' : '风险保持稳定'}`,
      details,
    };
  }

  private getResidentDeviation(residentId: string): number {
    const resident = mockResidentProfiles.find((r) => r.id === residentId);
    return resident?.todayDeviation ?? 50;
  }
}

export const BehaviorService = {
  analyze(input: BehaviorAnalyzeInput): BehaviorAnalysis {
    const engine = new MockBehaviorEngine();
    return engine.analyze(input);
  },
};
