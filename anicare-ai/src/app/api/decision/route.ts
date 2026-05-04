import type { DecisionInput } from '@/types';
import { DecisionService } from '@/services/decision.service';
import { apiSuccess, apiError, parseBody } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const input = await parseBody<DecisionInput>(req);
    const result = await DecisionService.evaluate(input);
    return apiSuccess(result, `当前模式: ${DecisionService.getMode()}`);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : '决策评估失败');
  }
}
