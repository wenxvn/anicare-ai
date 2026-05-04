import { mockResidentProfiles } from '@/lib/mock-data';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const profile = mockResidentProfiles.find((p) => p.id === params.id);
  if (!profile) return apiError('住户不存在', 404);
  return apiSuccess(profile);
}
