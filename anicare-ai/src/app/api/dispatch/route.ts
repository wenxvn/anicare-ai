import type { DispatchAssignInput } from '@/types';
import { DispatchService } from '@/services/dispatch.service';
import { apiSuccess, apiError, parseBody } from '@/lib/api-response';

export async function GET() {
  const queue = DispatchService.getQueue();
  return apiSuccess(queue);
}

export async function POST(req: Request) {
  try {
    const input = await parseBody<DispatchAssignInput>(req);
    const result = DispatchService.assign(input);
    if (!result.success) return apiError(result.message, 404);
    return apiSuccess(result, result.message);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : '调度操作失败');
  }
}
