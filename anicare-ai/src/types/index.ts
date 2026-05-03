export interface DetectionResult {
  label: string;
  confidence: number;
  bbox?: { x: number; y: number; w: number; h: number };
}

export interface DecisionPayload {
  riskScore: number;
  cause: string;
  suggestion: string;
  basis?: string[];
  knowledgeRefs?: string[];
}

export interface EventItem {
  id: string;
  type: string;
  risk: string;
  zone: string;
  camera: string;
  time: string;
  status: string;
  handler: string;
  confidence: number;
  summary: string;
  decision: DecisionPayload;
  detections?: DetectionResult[];
}

export interface DashboardStats {
  todayEvents: number;
  retainedCritical: number;
  handledRate: number;
  avgResponseMinutes: number;
  riskTypeDistribution: { name: string; value: number }[];
  weeklyCriticalTrend: { day: string; value: number }[];
  zoneHotspots: { zone: string; score: number }[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  tags: string[];
  content: string;
  updatedAt: string;
  scenario: string;
}