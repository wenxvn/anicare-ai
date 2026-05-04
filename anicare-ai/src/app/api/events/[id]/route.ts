import { mockEvents } from '@/lib/mock-data';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const event = mockEvents.find((e) => e.id === params.id);
  if (!event) return apiError('事件不存在', 404);
  return apiSuccess(event);
}
