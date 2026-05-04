import type { StepRecordInput } from '@/types';
import { EmergencyService } from '@/services/emergency.service';
import { apiSuccess, apiError, parseBody } from '@/lib/api-response';

export async function GET() {
  const plans = EmergencyService.getPlans();
  return apiSuccess(plans);
}

export async function POST(req: Request) {
  try {
    const input = await parseBody<StepRecordInput>(req);
    const result = EmergencyService.executeStep(input);
    if (!result.success) return apiError(result.message, 400);
    return apiSuccess(result, result.message);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : '应急操作失败');
  }
}
