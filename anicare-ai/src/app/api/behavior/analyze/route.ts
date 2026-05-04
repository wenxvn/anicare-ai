import type { BehaviorAnalyzeInput } from '@/types';
import { BehaviorService } from '@/services/behavior.service';
import { apiSuccess, apiError, parseBody } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const input = await parseBody<BehaviorAnalyzeInput>(req);
    const result = BehaviorService.analyze(input);
    return apiSuccess(result);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : '行为分析失败');
  }
}
