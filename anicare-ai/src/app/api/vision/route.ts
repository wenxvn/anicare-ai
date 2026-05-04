import type { VisionDetectInput } from '@/types';
import { VisionService } from '@/services/vision.service';
import { apiSuccess, apiError, parseBody } from '@/lib/api-response';

export async function POST(req: Request) {
  try {
    const input = await parseBody<VisionDetectInput>(req);
    const result = await VisionService.detect(input);
    return apiSuccess(result, `当前模式: ${VisionService.getMode()}`);
  } catch (err) {
    return apiError(err instanceof Error ? err.message : '视觉检测失败');
  }
}
