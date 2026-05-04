import { mockEvents } from '@/lib/mock-data';
import { apiSuccess } from '@/lib/api-response';

export async function GET() {
  return apiSuccess(mockEvents);
}
