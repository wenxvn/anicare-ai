import { PredictionService } from '@/services/prediction.service';
import { apiSuccess, apiError } from '@/lib/api-response';
import type { AlertStatus } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'overview';

    switch (type) {
      case 'fusion-risk': {
        const data = await PredictionService.getFusionRiskOverview();
        return apiSuccess(data, `当前模式: ${PredictionService.getMode()}`);
      }
      case 'forecast': {
        const horizon = (searchParams.get('horizon') || '15min') as '15min' | '30min';
        const data = await PredictionService.getRiskForecast(horizon);
        return apiSuccess(data, `当前模式: ${PredictionService.getMode()}`);
      }
      case 'alerts': {
        const status = searchParams.get('status') as AlertStatus | null;
        const riskLevel = searchParams.get('riskLevel');
        const data = await PredictionService.getAlertExplanations({
          status: status || undefined,
          riskLevel: riskLevel || undefined,
        });
        return apiSuccess(data, `当前模式: ${PredictionService.getMode()}`);
      }
      default: {
        const data = await PredictionService.getPredictionOverview();
        return apiSuccess(data, `当前模式: ${PredictionService.getMode()}`);
      }
    }
  } catch (err) {
    return apiError(err instanceof Error ? err.message : '预测数据获取失败');
  }
}
