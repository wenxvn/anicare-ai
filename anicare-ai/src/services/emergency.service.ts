import type { EmergencyPlan, EmergencyStep, EmergencyStepStatus, StepRecordInput } from '@/types';
import { mockEmergencyPlans } from '@/lib/mock-data';

function initPlanStatus(plan: EmergencyPlan): EmergencyPlan {
  return {
    ...plan,
    status: 'idle',
    currentStepIndex: 0,
    steps: plan.steps.map((s) => ({
      ...s,
      status: 'pending' as EmergencyStepStatus,
      completedAt: undefined,
      startedAt: undefined,
      remark: undefined,
    })),
  };
}

const _plans: EmergencyPlan[] = mockEmergencyPlans.map(initPlanStatus);

function findPlanAndStep(planId: string, stepId: string) {
  const plan = _plans.find((p) => p.id === planId);
  if (!plan) return { plan: null, step: null, stepIndex: -1 };
  const stepIndex = plan.steps.findIndex((s) => s.id === stepId);
  return { plan, step: stepIndex >= 0 ? plan.steps[stepIndex] : null, stepIndex };
}

export const EmergencyService = {
  getPlans(): EmergencyPlan[] {
    return _plans;
  },

  getPlanById(planId: string): EmergencyPlan | null {
    return _plans.find((p) => p.id === planId) || null;
  },

  executeStep(input: StepRecordInput): { success: boolean; message: string; plan?: EmergencyPlan } {
    const { plan, step, stepIndex } = findPlanAndStep(input.planId, input.stepId);
    if (!plan) return { success: false, message: '应急方案不存在' };
    if (!step) return { success: false, message: '步骤不存在' };

    const now = new Date().toISOString();

    switch (input.action) {
      case 'start':
        if (step.status !== 'pending') return { success: false, message: `步骤 "${step.title}" 已经在执行中或已完成` };
        step.status = 'doing';
        step.startedAt = now;
        plan.status = 'executing';
        if (!plan.startedAt) plan.startedAt = now;
        plan.currentStepIndex = stepIndex;
        break;

      case 'complete':
        if (step.status !== 'doing') return { success: false, message: `步骤 "${step.title}" 尚未开始执行` };
        step.status = 'done';
        step.completedAt = now;
        if (input.remark) step.remark = input.remark;

        if (stepIndex + 1 < plan.steps.length) {
          plan.currentStepIndex = stepIndex + 1;
        } else {
          const allDone = plan.steps.every((s) => s.status === 'done' || s.status === 'skipped');
          if (allDone) {
            plan.status = 'completed';
            plan.completedAt = now;
          }
        }
        break;

      case 'skip':
        if (step.status === 'done') return { success: false, message: `步骤 "${step.title}" 已完成，不可跳过` };
        step.status = 'skipped';
        step.completedAt = now;
        if (input.remark) step.remark = input.remark;

        if (stepIndex + 1 < plan.steps.length) {
          plan.currentStepIndex = stepIndex + 1;
        }
        break;
    }

    return { success: true, message: `步骤 "${step.title}" 状态已更新为 ${step.status}`, plan };
  },

  getProgress(planId: string): { total: number; done: number; percentage: number } | null {
    const plan = _plans.find((p) => p.id === planId);
    if (!plan) return null;

    const total = plan.steps.length;
    const done = plan.steps.filter((s) => s.status === 'done' || s.status === 'skipped').length;
    return { total, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  },

  generateReport(planId: string): string | null {
    const plan = _plans.find((p) => p.id === planId);
    if (!plan) return null;

    const lines: string[] = [];
    lines.push(`应急处置报告 - ${plan.eventType}`);
    lines.push(`状态: ${plan.status === 'completed' ? '已完成' : plan.status === 'executing' ? '执行中' : '未开始'}`);
    lines.push(`开始时间: ${plan.startedAt || '未开始'}`);
    lines.push(`完成时间: ${plan.completedAt || '未完成'}`);
    lines.push('');

    plan.steps.forEach((s) => {
      const statusIcon = s.status === 'done' ? '✓' : s.status === 'skipped' ? '✗' : s.status === 'doing' ? '→' : '○';
      lines.push(`${statusIcon} [${s.order}] ${s.title}`);
      lines.push(`  参考: ${s.knowledgeRef}`);
      if (s.remark) lines.push(`  备注: ${s.remark}`);
    });

    return lines.join('\n');
  },
};
