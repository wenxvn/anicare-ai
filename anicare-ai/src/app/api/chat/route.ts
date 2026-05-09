import { NextResponse } from 'next/server';
import { mockKnowledge } from '@/lib/mock-data';
import { DecisionService } from '@/services/decision.service';
import type { AssistantDecisionReply, DecisionInput, DecisionOutput, RiskLevel } from '@/types';

type ChatRequest = {
  message?: string;
  context?: DecisionInput;
  knowledgeRefs?: string[];
};

function normalizeMessage(message: string) {
  return message.trim();
}

function keywordRisk(message: string): RiskLevel {
  if (/摔倒|跌倒|骨折|未响应/.test(message)) return 'critical';
  if (/烟|火|离床|久卧|压疮/.test(message)) return 'high';
  if (/焦虑|情绪|孤独|徘徊/.test(message)) return 'medium';
  return 'low';
}

function buildDecisionReply(message: string, refs: string[]): AssistantDecisionReply {
  const riskLevel = keywordRisk(message);
  const references = mockKnowledge
    .filter((item) => refs.length === 0 || refs.some((ref) => item.id === ref || item.title.includes(ref) || item.tags.some((tag) => ref.includes(tag))))
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      source: '知识库',
      excerpt: item.content.slice(0, 80),
    }));

  const stepsByRisk: Record<RiskLevel, string[]> = {
    critical: ['立即通知最近护理员到场', '保持老人原地状态', '同步联系值班护士和主管'],
    high: ['优先确认现场安全', '安排护理员现场查看', '记录处置时间和反馈结果'],
    medium: ['先进行口头确认', '必要时引导到安全区域', '持续观察 10 分钟'],
    low: ['继续观察当前状态', '补充记录事件标签', '视情况进入巡查闭环'],
  };

  const cautionsByRisk: Record<RiskLevel, string[]> = {
    critical: ['不要盲目扶起或移动老人', '先确认意识、呼吸和疼痛点'],
    high: ['先排查环境隐患', '不要直接下结论为设备故障'],
    medium: ['避免打断老人正常活动', '记录触发时间和位置'],
    low: ['保留观察记录', '必要时复盘行为趋势'],
  };

  const recommendedByRisk: Record<RiskLevel, string[]> = {
    critical: ['派单给最近值班护理员', '升级到值班主管', '同步应急流程'],
    high: ['通知对应楼层护理员', '更新处置状态为处理中', '必要时查看应急预案'],
    medium: ['安排巡查复核', '补充行为画像', '进入观察队列'],
    low: ['归档为一般观察', '作为趋势样本保留', '不触发升级'],
  };

  return {
    riskJudgement: `当前判断为${riskLevel === 'critical' ? '紧急' : riskLevel === 'high' ? '高风险' : riskLevel === 'medium' ? '中风险' : '低风险'}事件。`,
    riskLevel,
    confidence: riskLevel === 'critical' ? 0.94 : riskLevel === 'high' ? 0.89 : riskLevel === 'medium' ? 0.81 : 0.72,
    summary: `系统根据当前输入识别到${message}，已结合应急知识库给出处置建议。`,
    steps: stepsByRisk[riskLevel],
    cautions: cautionsByRisk[riskLevel],
    references: references.length > 0 ? references : mockKnowledge.slice(0, 2).map((item) => ({
      title: item.title,
      source: '知识库',
      excerpt: item.content.slice(0, 80),
    })),
    toolsUsed: [
      { name: 'rag.search', status: 'completed', result: '检索到 3 条相关知识' },
      { name: 'risk.classifier', status: 'completed', result: `风险等级：${riskLevel}` },
      { name: 'dispatch.helper', status: 'completed', result: '建议派单给最近责任护理员' },
    ],
    recommendedActions: recommendedByRisk[riskLevel],
    suggestedAssignee: riskLevel === 'critical' ? '最近值班护理员' : riskLevel === 'high' ? '对应楼层护理员' : '值班巡查员',
  };
}

function buildAssistantReply(message: string, decision: AssistantDecisionReply) {
  const lines = [
    decision.summary,
    `判断：${decision.riskJudgement}`,
    `建议执行：${decision.recommendedActions.join('；')}`,
  ];
  return lines.join('\n');
}

function buildDecisionOutput(message: string): DecisionOutput {
  const riskLevel = keywordRisk(message);
  const riskScore = riskLevel === 'critical' ? 92 : riskLevel === 'high' ? 81 : riskLevel === 'medium' ? 58 : 32;
  return {
    riskScore,
    riskLevel,
    priority: riskLevel === 'critical' ? 1 : riskLevel === 'high' ? 2 : riskLevel === 'medium' ? 3 : 4,
    suggestions: [
      riskLevel === 'critical' ? '立即派单并升级处理' : '按常规流程处置',
      '同步记录知识库引用和现场反馈',
    ],
    reasoning: [`识别到关键词：${message}`],
    cause: '基于当前输入和规则引擎进行风险研判。',
    knowledgeRefs: mockKnowledge.slice(0, 2).map((item) => item.title),
    modelVersion: 'chat-router-v1',
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequest;
    const message = normalizeMessage(body.message ?? '');
    const context = body.context;

    if (context?.detections || context?.behaviorAnalysis || context?.knowledgeRefs) {
      const result = await DecisionService.evaluate(context as DecisionInput);
      return NextResponse.json(result);
    }

    const decision = buildDecisionReply(message, body.knowledgeRefs ?? []);
    return NextResponse.json({
      reply: buildAssistantReply(message, decision),
      decision,
      model: buildDecisionOutput(message),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '智能助手服务调用失败',
      },
      { status: 500 },
    );
  }
}
