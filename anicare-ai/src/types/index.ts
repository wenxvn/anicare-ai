export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export const RISK_LEVEL_LABEL: Record<RiskLevel, string> = {
  low: '低风险',
  medium: '中风险',
  high: '高风险',
  critical: '紧急',
};

export const RISK_LEVEL_SCORE: Record<RiskLevel, [number, number]> = {
  low: [0, 40],
  medium: [40, 65],
  high: [65, 85],
  critical: [85, 100],
};

export function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

export function riskLevelToChinese(level: RiskLevel): string {
  return RISK_LEVEL_LABEL[level];
}

export interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DetectionResult {
  label: string;
  confidence: number;
  bbox?: BoundingBox;
  category?: string;
  source?: string;
}

export interface VisionDetectInput {
  imageUrl?: string;
  imageBase64?: string;
  videoUrl?: string;
  cameraId?: string;
  zone?: string;
}

export interface VisionDetectOutput {
  detections: DetectionResult[];
  processingTimeMs: number;
  modelVersion: string;
  poses?: {
    label: string;
    confidence: number;
    keypoints: { x: number; y: number; confidence: number }[];
    bbox?: BoundingBox;
  }[];
  riskSignals?: {
    code: string;
    label: string;
    severity: RiskLevel;
    confidence: number;
    reason: string;
  }[];
  imageSize?: {
    width: number;
    height: number;
  };
  rawModelOutput?: unknown;
}

export interface DecisionInput {
  detections: DetectionResult[];
  eventContext?: {
    zone?: string;
    camera?: string;
    residentId?: string;
    timestamp?: string;
  };
  behaviorAnalysis?: BehaviorAnalysis;
  knowledgeRefs?: string[];
}

export interface DecisionOutput {
  riskScore: number;
  riskLevel: RiskLevel;
  priority: number;
  suggestions: string[];
  reasoning: string[];
  cause: string;
  knowledgeRefs: string[];
  modelVersion: string;
  rawModelOutput?: unknown;
}

export interface BehaviorAnalysis {
  deviationScore: number;
  behaviorLabels: string[];
  riskTrend: 'rising' | 'stable' | 'declining';
  summary: string;
  details: {
    label: string;
    value: string;
  }[];
}

export interface BehaviorAnalyzeInput {
  residentId?: string;
  currentDetections?: DetectionResult[];
  zone?: string;
  timeOfDay?: string;
  recentActivityHours?: number;
  nightLeaveCount?: number;
  weeklyAnomalies?: number;
}

export interface DispatchItem {
  id: string;
  eventId: string;
  type: string;
  risk: string;
  riskLevel: RiskLevel;
  zone: string;
  waitSeconds: number;
  residentName: string;
  priority: number;
  priorityScore: number;
  reason: string;
  status: '处理中' | '已完成';
  assignee?: string;
  time: string;
}

export interface DispatchAssignInput {
  dispatchId: string;
  assignee: string;
}

export interface EventItem {
  id: string;
  type: string;
  risk: string;
  riskLevel: RiskLevel;
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

export interface DecisionPayload {
  riskScore: number;
  riskLevel: RiskLevel;
  cause: string;
  suggestion: string;
  basis?: string[];
  knowledgeRefs?: string[];
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

export type EmergencyStepStatus = 'pending' | 'doing' | 'done' | 'skipped';

export interface EmergencyStep {
  id: string;
  order: number;
  title: string;
  note: string;
  knowledgeRef: string;
  status: EmergencyStepStatus;
  completedAt?: string;
  startedAt?: string;
  remark?: string;
}

export interface EmergencyPlan {
  id: string;
  eventType: string;
  icon: string;
  riskLevel: RiskLevel;
  estimatedMinutes: number;
  status: EmergencyPlanStatus;
  startedAt?: string;
  completedAt?: string;
  currentStepIndex: number;
  steps: EmergencyStep[];
}

export type EmergencyPlanStatus = 'idle' | 'executing' | 'completed' | 'paused';

export interface StepRecordInput {
  planId: string;
  stepId: string;
  action: 'start' | 'complete' | 'skip';
  remark?: string;
}

export type ModalityType = 'vision' | 'bed_pressure' | 'door_sensor' | 'mmwave';

export interface ModalityStatus {
  type: ModalityType;
  label: string;
  online: boolean;
  score: number;
  lastUpdate: string;
  detail: string;
}

export interface FusionRiskData {
  totalScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  modalities: ModalityStatus[];
  trend: 'rising' | 'stable' | 'declining';
  summary: string;
  updatedAt: string;
}

export interface ForecastTimePoint {
  time: string;
  score: number;
}

export interface ForecastRoom {
  roomId: string;
  roomName: string;
  zone: string;
  currentScore: number;
  predictedScore: number;
  window: '15min' | '30min';
  triggerTime: string;
  patrolPriority: '紧急' | '高' | '中' | '低';
  reasons: string[];
}

export interface ShortTermForecast {
  horizon: '15min' | '30min';
  trendData: ForecastTimePoint[];
  highRiskRooms: ForecastRoom[];
  summary: string;
  generatedAt: string;
}

export interface AlertContributor {
  factor: string;
  weight: number;
  description: string;
}

export type AlertStatus = 'pending' | 'dispatched' | 'resolved';

export interface ExplainableAlert {
  id: string;
  alertType: string;
  riskLevel: RiskLevel;
  riskScore: number;
  zone: string;
  roomName: string;
  triggerReason: string;
  contributors: AlertContributor[];
  suggestion: string;
  confidence: number;
  status: AlertStatus;
  createdAt: string;
}

export interface ModelRunStatus {
  modelVersion: string;
  inferenceLatencyMs: number;
  dataFreshness: string;
  lastRunAt: string;
  status: 'running' | 'idle' | 'error';
  accuracy: number;
}

export interface VisionPipelineStep {
  id: string;
  stage: string;
  modelName: string;
  input: string;
  output: string;
  confidence: number;
  latencyMs: number;
  status: 'running' | 'completed' | 'warning';
  detail: string;
}

export interface AgentRuntimeStatus {
  id: string;
  name: string;
  role: string;
  status: 'running' | 'idle' | 'handoff' | 'completed';
  dataSources: string[];
  toolsUsed: string[];
  conclusion: string;
  nextAction: string;
  updatedAt: string;
}

export interface PredictionExplanationFactor {
  label: string;
  value: string;
  weight: number;
  trend: 'up' | 'down' | 'stable';
}

export interface PredictionOverview {
  fusionRisk: FusionRiskData;
  forecast15min: ShortTermForecast;
  forecast30min: ShortTermForecast;
  alerts: ExplainableAlert[];
  modelStatus: ModelRunStatus;
  visionPipeline?: VisionPipelineStep[];
  agentRuntime?: AgentRuntimeStatus[];
  explanationFactors?: PredictionExplanationFactor[];
}

export interface AssistantReference {
  title: string;
  source: string;
  excerpt: string;
}

export interface AssistantToolCall {
  name: string;
  status: 'completed' | 'running' | 'failed';
  result: string;
}

export interface AssistantDecisionReply {
  riskJudgement: string;
  riskLevel: RiskLevel;
  confidence: number;
  summary: string;
  steps: string[];
  cautions: string[];
  references: AssistantReference[];
  toolsUsed: AssistantToolCall[];
  recommendedActions: string[];
  suggestedAssignee: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}
