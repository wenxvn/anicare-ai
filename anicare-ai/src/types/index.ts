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

export interface DispatchItem {
  id: string;
  eventId: string;
  type: string;
  risk: string;
  zone: string;
  waitMinutes: number;
  residentName: string;
  priority: number;
  reason: string;
  status: '待指派' | '处理中' | '已完成';
  assignee?: string;
  time: string;
}

export interface BehaviorMetric {
  label: string;
  value: string;
}

export interface ResidentProfile {
  id: string;
  name: string;
  room: string;
  age: number;
  riskTags: string[];
  todayStatus: string;
  avgWakeTime: string;
  avgActiveHours: number;
  frequentZones: string[];
  nightLeaveCount: number;
  weeklyAnomalies: number;
  todayDeviation: number;
  deviationSummary: string;
  weeklyActivityTrend: { day: string; hours: number }[];
  nightLeaveTrend: { day: string; count: number }[];
  riskEventTrend: { day: string; count: number }[];
}

export interface EmergencyStep {
  id: string;
  order: number;
  title: string;
  note: string;
  knowledgeRef: string;
  completed: boolean;
  remark?: string;
}

export interface EmergencyPlan {
  id: string;
  eventType: string;
  icon: string;
  riskLevel: string;
  estimatedMinutes: number;
  steps: EmergencyStep[];
}