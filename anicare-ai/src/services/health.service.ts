import { mockElderHealthData, type ElderHealthData } from '@/lib/mock-health';

export async function getHealthMonitorList(): Promise<ElderHealthData[]> {
  return mockElderHealthData;
}

export async function getElderHealthDetail(id: string): Promise<ElderHealthData | undefined> {
  return mockElderHealthData.find((e) => e.id === id);
}

export async function getWearableSensorData(id: string) {
  const elder = mockElderHealthData.find((e) => e.id === id);
  return elder?.wearableData;
}

export async function getEmotionAnalysis(id: string) {
  const elder = mockElderHealthData.find((e) => e.id === id);
  return elder?.emotionAnalysis;
}

export async function getMentalHealthRisk(id: string) {
  const elder = mockElderHealthData.find((e) => e.id === id);
  return elder?.mentalRisk;
}

export async function getAIHealthSuggestions(id: string) {
  const elder = mockElderHealthData.find((e) => e.id === id);
  return elder?.suggestions;
}

export async function getHealthRiskEvents(id: string) {
  const elder = mockElderHealthData.find((e) => e.id === id);
  return elder?.recentEvents;
}
