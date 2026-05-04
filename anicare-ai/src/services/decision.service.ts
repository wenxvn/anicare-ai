import type { DecisionInput, DecisionOutput, RiskLevel } from '@/types';
import { scoreToRiskLevel } from '@/types';

interface LLMAdapter {
  evaluate(input: DecisionInput): Promise<DecisionOutput>;
}

interface RAGAdapter {
  search(query: string, topK?: number): Promise<{ title: string; content: string; score: number }[]>;
}

class RuleBasedDecisionEngine {
  evaluate(input: DecisionInput): DecisionOutput {
    let riskScore = 30;
    const reasoning: string[] = [];
    const suggestions: string[] = [];

    const labels = input.detections.map((d) => d.label.toLowerCase());
    const hasFall = labels.some((l) => l.includes('摔倒') || l.includes('fall'));
    const hasStill = labels.some((l) => l.includes('静止') || l.includes('still'));
    const hasNoResponse = labels.some((l) => l.includes('无人') || l.includes('no_response'));
    const hasSmoke = labels.some((l) => l.includes('烟') || l.includes('smoke'));

    if (hasFall) {
      riskScore += 35;
      reasoning.push('检测到跌倒行为，姿态角度异常');
      suggestions.push('立即通知最近护理员前往现场确认老人状态');
      suggestions.push('保持老人原地状态，避免盲目移动');
    }

    if (hasStill) {
      riskScore += 15;
      reasoning.push('持续静止时间超过安全阈值');
      suggestions.push('确认老人意识状态，必要时联系医护人员');
    }

    if (hasNoResponse) {
      riskScore += 10;
      reasoning.push('周围无人响应，缺乏及时救助');
    }

    if (hasSmoke) {
      riskScore += 30;
      reasoning.push('检测到烟火异常信号');
      suggestions.push('立即排查烟雾来源，确认是否为设备故障');
    }

    if (input.behaviorAnalysis) {
      const dev = input.behaviorAnalysis.deviationScore;
      if (dev > 70) {
        riskScore += 10;
        reasoning.push(`行为偏离度较高(${dev}/100)，需重点关注`);
      }
      if (input.behaviorAnalysis.riskTrend === 'rising') {
        riskScore += 5;
        reasoning.push('近期风险趋势呈上升态势');
      }
    }

    if (input.knowledgeRefs && input.knowledgeRefs.length > 0) {
      suggestions.push(`参考知识库: ${input.knowledgeRefs.join('、')}`);
    }

    riskScore = Math.min(100, Math.max(0, riskScore));
    const riskLevel = scoreToRiskLevel(riskScore);
    const priority = riskLevel === 'critical' ? 1 : riskLevel === 'high' ? 2 : riskLevel === 'medium' ? 3 : 4;

    return {
      riskScore,
      riskLevel,
      priority,
      suggestions: suggestions.length > 0 ? suggestions : ['暂无处置建议，请人工判断'],
      reasoning: reasoning.length > 0 ? reasoning : ['基于规则引擎的常规评估'],
      cause: reasoning.join(' + ') || '常规风险评估',
      knowledgeRefs: input.knowledgeRefs || [],
      modelVersion: 'rule-engine-v1.0',
    };
  }
}

class LLMDecisionAdapter implements LLMAdapter {
  async evaluate(input: DecisionInput): Promise<DecisionOutput> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `请分析以下检测结果并给出风险评估: ${JSON.stringify(input.detections)}`,
        context: input,
      }),
    });

    if (!res.ok) throw new Error(`LLM service error: ${res.status}`);
    return res.json();
  }
}

let _llmAdapter: LLMAdapter | null = null;
let _ragAdapter: RAGAdapter | null = null;
const _ruleEngine = new RuleBasedDecisionEngine();

export const DecisionService = {
  async evaluate(input: DecisionInput): Promise<DecisionOutput> {
    const mode = process.env.AI_MODE || 'mock';

    if (mode === 'real' && _llmAdapter) {
      try {
        return await _llmAdapter.evaluate(input);
      } catch {
        return _ruleEngine.evaluate(input);
      }
    }

    return _ruleEngine.evaluate(input);
  },

  setLLMAdapter(adapter: LLMAdapter) {
    _llmAdapter = adapter;
  },

  setRAGAdapter(adapter: RAGAdapter) {
    _ragAdapter = adapter;
  },

  async searchKnowledge(query: string): Promise<{ title: string; content: string; score: number }[]> {
    if (_ragAdapter) {
      return _ragAdapter.search(query);
    }
    return [];
  },

  getMode(): string {
    return process.env.AI_MODE || 'mock';
  },
};
