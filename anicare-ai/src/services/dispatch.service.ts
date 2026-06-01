import type { DispatchItem, DispatchAssignInput, RiskLevel } from '@/types';
import { mockDispatchQueue } from '@/lib/mock-data';

const RISK_WEIGHT: Record<RiskLevel, number> = {
  critical: 100,
  high: 70,
  medium: 40,
  low: 15,
};

function riskLabelToLevel(label: string): RiskLevel {
  if (label === '紧急') return 'critical';
  if (label === '高风险') return 'high';
  if (label === '中风险') return 'medium';
  return 'low';
}

export function computePriorityScore(item: {
  risk: string;
  riskLevel?: RiskLevel;
  waitSeconds: number;
  confidence: number;
  residentName: string;
}): number {
  const level = item.riskLevel || riskLabelToLevel(item.risk);
  const riskWeight = RISK_WEIGHT[level];

  const waitFactor = Math.min(item.waitSeconds * 2, 20);

  const peopleFactor = item.residentName === '多名老人' ? 15 : 0;

  const confidenceFactor = item.confidence > 0.9 ? 5 : 0;

  return Math.min(100, riskWeight + waitFactor + peopleFactor + confidenceFactor);
}

export function sortByPriority(items: DispatchItem[]): DispatchItem[] {
  return [...items].sort((a, b) => {
    if (a.status === '已完成' && b.status !== '已完成') return 1;
    if (a.status !== '已完成' && b.status === '已完成') return -1;
    return b.priorityScore - a.priorityScore;
  });
}

const _queue: DispatchItem[] = mockDispatchQueue.map((item) => ({
  ...item,
  riskLevel: riskLabelToLevel(item.risk),
  priorityScore: computePriorityScore({
    risk: item.risk,
    riskLevel: riskLabelToLevel(item.risk),
    waitSeconds: item.waitSeconds,
    confidence: 0.9,
    residentName: item.residentName,
  }),
}));

export const DispatchService = {
  getQueue(): DispatchItem[] {
    return sortByPriority(_queue);
  },

  assign(input: DispatchAssignInput): { success: boolean; message: string } {
    const item = _queue.find((d) => d.id === input.dispatchId);
    if (!item) return { success: false, message: '调度项不存在' };

    item.assignee = input.assignee;
    item.status = '处理中';
    return { success: true, message: `已指派 ${input.assignee} 处理 ${item.type}事件` };
  },

  complete(dispatchId: string): { success: boolean; message: string } {
    const item = _queue.find((d) => d.id === dispatchId);
    if (!item) return { success: false, message: '调度项不存在' };

    item.status = '已完成';
    return { success: true, message: `${item.type}事件已完成处理` };
  },

  recalculatePriorities(): void {
    _queue.forEach((item) => {
      item.priorityScore = computePriorityScore({
        risk: item.risk,
        riskLevel: item.riskLevel,
        waitSeconds: item.waitSeconds,
        confidence: 0.9,
        residentName: item.residentName,
      });
    });
  },
};
