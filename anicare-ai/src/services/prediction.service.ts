import type { PredictionOverview, FusionRiskData, ShortTermForecast, ExplainableAlert, AlertStatus } from '@/types';
import { mockPredictionOverview, mockFusionRisk, mockForecast15min, mockForecast30min, mockAlerts } from '@/lib/mock-prediction';

interface PredictionAPIAdapter {
  getFusionRiskOverview(): Promise<FusionRiskData>;
  getRiskForecast(horizon: '15min' | '30min'): Promise<ShortTermForecast>;
  getAlertExplanations(params?: { status?: AlertStatus; riskLevel?: string }): Promise<ExplainableAlert[]>;
  getPredictionOverview(): Promise<PredictionOverview>;
}

class MockPredictionAdapter implements PredictionAPIAdapter {
  async getFusionRiskOverview(): Promise<FusionRiskData> {
    await new Promise((r) => setTimeout(r, 300));
    return structuredClone(mockFusionRisk);
  }

  async getRiskForecast(horizon: '15min' | '30min'): Promise<ShortTermForecast> {
    await new Promise((r) => setTimeout(r, 300));
    return structuredClone(horizon === '15min' ? mockForecast15min : mockForecast30min);
  }

  async getAlertExplanations(params?: { status?: AlertStatus; riskLevel?: string }): Promise<ExplainableAlert[]> {
    await new Promise((r) => setTimeout(r, 300));
    let alerts = structuredClone(mockAlerts);
    if (params?.status) {
      alerts = alerts.filter((a) => a.status === params.status);
    }
    if (params?.riskLevel) {
      alerts = alerts.filter((a) => a.riskLevel === params.riskLevel);
    }
    return alerts;
  }

  async getPredictionOverview(): Promise<PredictionOverview> {
    await new Promise((r) => setTimeout(r, 400));
    return structuredClone(mockPredictionOverview);
  }
}

class RealPredictionAdapter implements PredictionAPIAdapter {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getFusionRiskOverview(): Promise<FusionRiskData> {
    const res = await fetch(`${this.baseUrl}/prediction/fusion-risk`);
    if (!res.ok) throw new Error(`Prediction API error: ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
  }

  async getRiskForecast(horizon: '15min' | '30min'): Promise<ShortTermForecast> {
    const res = await fetch(`${this.baseUrl}/prediction/forecast?horizon=${horizon}`);
    if (!res.ok) throw new Error(`Prediction API error: ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
  }

  async getAlertExplanations(params?: { status?: AlertStatus; riskLevel?: string }): Promise<ExplainableAlert[]> {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.riskLevel) qs.set('riskLevel', params.riskLevel);
    const res = await fetch(`${this.baseUrl}/prediction/alerts?${qs.toString()}`);
    if (!res.ok) throw new Error(`Prediction API error: ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
  }

  async getPredictionOverview(): Promise<PredictionOverview> {
    const res = await fetch(`${this.baseUrl}/prediction/overview`);
    if (!res.ok) throw new Error(`Prediction API error: ${res.status}`);
    const json = await res.json();
    return json.data ?? json;
  }
}

let _adapter: PredictionAPIAdapter | null = null;

function getAdapter(): PredictionAPIAdapter {
  if (_adapter) return _adapter;
  const mode = process.env.AI_MODE || 'mock';
  if (mode === 'real' && process.env.PREDICTION_ENDPOINT) {
    _adapter = new RealPredictionAdapter(process.env.PREDICTION_ENDPOINT);
  } else {
    _adapter = new MockPredictionAdapter();
  }
  return _adapter;
}

export const PredictionService = {
  getFusionRiskOverview(): Promise<FusionRiskData> {
    return getAdapter().getFusionRiskOverview();
  },
  getRiskForecast(horizon: '15min' | '30min'): Promise<ShortTermForecast> {
    return getAdapter().getRiskForecast(horizon);
  },
  getAlertExplanations(params?: { status?: AlertStatus; riskLevel?: string }): Promise<ExplainableAlert[]> {
    return getAdapter().getAlertExplanations(params);
  },
  getPredictionOverview(): Promise<PredictionOverview> {
    return getAdapter().getPredictionOverview();
  },
  getMode(): string {
    return process.env.AI_MODE || 'mock';
  },
};
