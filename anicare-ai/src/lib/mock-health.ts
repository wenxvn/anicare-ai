export interface WearableData {
  heartRate: number;
  spo2: number;
  temperature: number;
  respiratoryRate: number;
  steps: number;
  activeMinutes: number;
  sedentaryHours: number;
  sleepHours: number;
  wakeUpTimes: number;
  bedExitTimes: number;
}

export interface EmotionAnalysis {
  facialExpression: string;
  behaviorPattern: string;
  physiologicalSignal: string;
  interactionFrequency: string;
  historicalTrend: string;
  aiReasoning: string;
}

export interface MentalRisk {
  depressionRisk: string;
  anxietyRisk: string;
  lonelinessRisk: string;
  sleepRisk: string;
  emotionFluctuationRisk: string;
  interactionDecreaseRisk: string;
  longTermLowActivityRisk: string;
}

export interface HealthSuggestions {
  physical: string;
  mental: string;
  caregiver: string;
  family: string;
}

export interface HealthEvent {
  time: string;
  type: string;
  level: string;
  description: string;
}

export interface HealthTrends {
  dates: string[];
  bodyHealthScores: number[];
  mentalHealthScores: number[];
  heartRates: number[];
  spo2Values: number[];
  temperatures: number[];
  respiratoryRates: number[];
  sleepHours: number[];
  wakeUpTimes: number[];
  steps: number[];
  emotionScores: number[];
}

export interface ElderHealthData {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  bed: string;
  careLevel: string;
  bodyHealthScore: number;
  mentalHealthScore: number;
  emotionStatus: string;
  emotionConfidence: number;
  bodyRiskLevel: string;
  mentalRiskLevel: string;
  carePriority: string;
  wearableData: WearableData;
  emotionAnalysis: EmotionAnalysis;
  mentalRisk: MentalRisk;
  suggestions: HealthSuggestions;
  recentEvents: HealthEvent[];
  trends: HealthTrends;
}

export const mockElderHealthData: ElderHealthData[] = [
  {
    id: 'health-001',
    name: '张建国',
    age: 78,
    gender: '男',
    room: 'A栋-301',
    bed: '1号床',
    careLevel: '二级护理',
    bodyHealthScore: 58,
    mentalHealthScore: 45,
    emotionStatus: '低落倾向',
    emotionConfidence: 0.82,
    bodyRiskLevel: '中风险',
    mentalRiskLevel: '高风险',
    carePriority: '重点关注',
    wearableData: {
      heartRate: 78,
      spo2: 95,
      temperature: 36.5,
      respiratoryRate: 18,
      steps: 2180,
      activeMinutes: 45,
      sedentaryHours: 8.5,
      sleepHours: 5.2,
      wakeUpTimes: 4,
      bedExitTimes: 2,
    },
    emotionAnalysis: {
      facialExpression: '表情活跃度偏低，嘴角下垂频率增加，眼神回避镜头',
      behaviorPattern: '近7天活动量较平均水平下降28%，久坐时间增加，主动走动减少',
      physiologicalSignal: '夜间心率波动增大，睡眠深度不足，醒来次数增加',
      interactionFrequency: '与护理员交流频率明显下降，本周主动对话仅3次',
      historicalTrend: '连续5天出现低落情绪标记，情绪评分呈持续下降趋势',
      aiReasoning: 'AI综合分析显示，该老人近7天活动量较平均水平下降28%，夜间醒来次数增加，表情活跃度降低，护理互动频率减少。系统判断当前存在低落倾向，心理健康风险为中等偏高，建议护理员主动问候并持续观察。',
    },
    mentalRisk: {
      depressionRisk: '中高风险',
      anxietyRisk: '中风险',
      lonelinessRisk: '中风险',
      sleepRisk: '高风险',
      emotionFluctuationRisk: '中风险',
      interactionDecreaseRisk: '高风险',
      longTermLowActivityRisk: '中风险',
    },
    suggestions: {
      physical: '老人今日步数仅2180步，低于近7日平均水平。建议护理员安排10至15分钟轻度室内活动，并观察活动后的心率变化。同时关注睡眠质量，必要时调整晚间护理安排。',
      mental: '系统检测到老人近期低落情绪次数增加，建议护理员主动问候，关注其食欲、兴趣和交流意愿。如低落状态持续超过3天，建议联系心理咨询师介入评估。',
      caregiver: '建议护理员30分钟内完成一次巡查，记录老人精神状态，并复核睡眠与活动数据。重点关注老人是否出现食欲减退、社交回避等表现。',
      family: '建议家属在晚间进行电话或视频问候，增加情感陪伴，缓解老人孤独感。如有条件，建议本周安排一次线下探望。',
    },
    recentEvents: [
      { time: '2025-05-01 03:12', type: '夜间离床未归', level: '高风险', description: '老人凌晨离开床位前往走廊，持续静止超过12秒，可能存在跌倒风险。' },
      { time: '2025-04-30 22:45', type: '睡眠质量下降', level: '中风险', description: '夜间醒来3次，深度睡眠时间不足2小时。' },
      { time: '2025-04-30 14:20', type: '活动量持续下降', level: '中风险', description: '连续3天活动量低于平均水平，今日步数较上周均值下降35%。' },
      { time: '2025-04-29 16:00', type: '情绪低落标记', level: '低风险', description: '护理员巡房记录老人表情平淡、不愿交流。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [68, 65, 62, 60, 59, 57, 58],
      mentalHealthScores: [62, 58, 55, 52, 48, 46, 45],
      heartRates: [72, 74, 76, 75, 78, 79, 78],
      spo2Values: [97, 96, 96, 95, 95, 95, 95],
      temperatures: [36.4, 36.5, 36.4, 36.6, 36.5, 36.5, 36.5],
      respiratoryRates: [16, 17, 16, 18, 17, 18, 18],
      sleepHours: [7.0, 6.8, 6.2, 6.0, 5.5, 5.0, 5.2],
      wakeUpTimes: [1, 2, 2, 3, 3, 4, 4],
      steps: [4200, 3800, 3500, 3200, 2800, 2400, 2180],
      emotionScores: [75, 70, 65, 60, 55, 50, 45],
    },
  },
  {
    id: 'health-002',
    name: '王秀兰',
    age: 82,
    gender: '女',
    room: 'B栋-302',
    bed: '2号床',
    careLevel: '三级护理',
    bodyHealthScore: 52,
    mentalHealthScore: 60,
    emotionStatus: '焦虑倾向',
    emotionConfidence: 0.76,
    bodyRiskLevel: '高风险',
    mentalRiskLevel: '中风险',
    carePriority: '重点关注',
    wearableData: {
      heartRate: 82,
      spo2: 93,
      temperature: 36.8,
      respiratoryRate: 20,
      steps: 1200,
      activeMinutes: 30,
      sedentaryHours: 10.2,
      sleepHours: 4.8,
      wakeUpTimes: 5,
      bedExitTimes: 3,
    },
    emotionAnalysis: {
      facialExpression: '眉头紧锁频率增加，眨眼频率偏高，面部肌肉紧张',
      behaviorPattern: '久卧时间明显增加，活动范围局限于床铺和洗手间，很少前往公共区域',
      physiologicalSignal: '心率偏快，体温略高，呼吸频率偏快，睡眠质量明显下降',
      interactionFrequency: '与护理员交流时表现出不安和反复询问，家属探视频率正常',
      historicalTrend: '近一周焦虑评分持续上升，睡眠质量连续下降',
      aiReasoning: 'AI综合分析显示，该老人近期久卧时间增加、活动量下降，同时心率偏快、呼吸频率加快，面部表情呈现紧张特征。结合睡眠质量持续下降和反复询问行为，系统判断当前存在焦虑倾向，建议护理员保持耐心沟通并观察睡眠改善情况。',
    },
    mentalRisk: {
      depressionRisk: '中风险',
      anxietyRisk: '高风险',
      lonelinessRisk: '低风险',
      sleepRisk: '高风险',
      emotionFluctuationRisk: '中风险',
      interactionDecreaseRisk: '低风险',
      longTermLowActivityRisk: '高风险',
    },
    suggestions: {
      physical: '老人血氧偏低（93%），建议护理员关注呼吸状态，保持室内通风。今日活动量极低，建议在身体允许的情况下安排床边轻度活动。体温略高，需监测是否持续升高。',
      mental: '系统检测到老人近期焦虑倾向加重，建议护理员使用平和、稳定的语气沟通，避免给老人带来不确定感。可播放轻柔音乐帮助老人放松。',
      caregiver: '建议护理员每2小时巡查一次，记录老人情绪状态和呼吸情况。重点关注睡眠质量和久卧风险，必要时协助翻身。',
      family: '建议家属保持规律的探视频率，探望时避免讨论令老人焦虑的话题。可带来老人熟悉的物品增加安全感。',
    },
    recentEvents: [
      { time: '2025-05-01 08:42', type: '久卧未动', level: '高风险', description: '床位连续50分钟未检测到翻身动作，存在压疮和低体温风险。' },
      { time: '2025-04-30 23:15', type: '焦虑情绪标记', level: '中风险', description: '老人反复按呼叫铃，表情紧张不安，护理员安抚后有所缓解。' },
      { time: '2025-04-30 15:30', type: '血氧偏低', level: '中风险', description: '持续监测血氧低于94%，建议关注呼吸状态。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [60, 58, 56, 55, 53, 52, 52],
      mentalHealthScores: [70, 68, 65, 63, 62, 61, 60],
      heartRates: [76, 78, 79, 80, 81, 82, 82],
      spo2Values: [96, 95, 95, 94, 94, 93, 93],
      temperatures: [36.5, 36.5, 36.6, 36.6, 36.7, 36.8, 36.8],
      respiratoryRates: [17, 18, 18, 19, 19, 20, 20],
      sleepHours: [6.5, 6.2, 5.8, 5.5, 5.2, 5.0, 4.8],
      wakeUpTimes: [2, 2, 3, 3, 4, 4, 5],
      steps: [2800, 2500, 2200, 2000, 1800, 1500, 1200],
      emotionScores: [72, 68, 65, 62, 60, 58, 55],
    },
  },
  {
    id: 'health-003',
    name: '陈国华',
    age: 75,
    gender: '男',
    room: 'B栋-508',
    bed: '1号床',
    careLevel: '二级护理',
    bodyHealthScore: 65,
    mentalHealthScore: 55,
    emotionStatus: '孤独倾向',
    emotionConfidence: 0.79,
    bodyRiskLevel: '中风险',
    mentalRiskLevel: '高风险',
    carePriority: '重点关注',
    wearableData: {
      heartRate: 70,
      spo2: 96,
      temperature: 36.3,
      respiratoryRate: 16,
      steps: 3500,
      activeMinutes: 60,
      sedentaryHours: 7.0,
      sleepHours: 6.5,
      wakeUpTimes: 3,
      bedExitTimes: 4,
    },
    emotionAnalysis: {
      facialExpression: '表情较为平淡，微笑频率低，但眼神追踪正常',
      behaviorPattern: '夜间离床频繁（平均3.5次/晚），白天活动范围大但多为独自行走',
      physiologicalSignal: '心率和血氧正常，但夜间活动量偏高影响睡眠质量',
      interactionFrequency: '与护理员交流频率下降，家属探视间隔较长，主动社交行为减少',
      historicalTrend: '近两周孤独风险评分持续升高，夜间离床次数呈上升趋势',
      aiReasoning: 'AI综合分析显示，该老人白天活动量正常但多为独自活动，夜间离床频率持续升高，社交互动明显减少。结合家属探视间隔较长和表情活跃度下降，系统判断当前存在孤独倾向，建议增加社交互动和家属联系。',
    },
    mentalRisk: {
      depressionRisk: '中风险',
      anxietyRisk: '低风险',
      lonelinessRisk: '高风险',
      sleepRisk: '中风险',
      emotionFluctuationRisk: '低风险',
      interactionDecreaseRisk: '高风险',
      longTermLowActivityRisk: '低风险',
    },
    suggestions: {
      physical: '老人身体指标基本正常，但夜间离床频繁存在安全隐患。建议在床边增设夜灯，走廊增设扶手，降低夜间跌倒风险。',
      mental: '系统检测到老人孤独风险较高，建议护理员鼓励其参加集体活动，安排与同楼层老人一起用餐。可考虑引入志愿者陪伴项目。',
      caregiver: '建议护理员夜间加强巡查频次，关注老人离床后的行为轨迹。白天引导老人参加集体活动，增加社交机会。',
      family: '建议家属增加探视频率，每周至少探望一次。如无法到场，建议每天进行一次电话或视频通话，保持情感联系。',
    },
    recentEvents: [
      { time: '2025-05-01 02:16', type: '夜间离床未归', level: '高风险', description: '凌晨离床超过15分钟未归，行动轨迹在卫生间方向中断。' },
      { time: '2025-04-30 03:05', type: '夜间离床频繁', level: '中风险', description: '当夜离床4次，总时长超过40分钟。' },
      { time: '2025-04-29 19:30', type: '孤独风险升高', level: '中风险', description: '晚餐后独自在房间停留3小时未与任何人交流。' },
      { time: '2025-04-28 10:00', type: '互动频率下降', level: '低风险', description: '本周主动与护理员对话次数较上周减少60%。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [68, 67, 66, 66, 65, 65, 65],
      mentalHealthScores: [65, 62, 60, 58, 56, 55, 55],
      heartRates: [71, 70, 70, 72, 70, 71, 70],
      spo2Values: [97, 96, 96, 96, 96, 96, 96],
      temperatures: [36.3, 36.4, 36.3, 36.3, 36.4, 36.3, 36.3],
      respiratoryRates: [16, 16, 17, 16, 16, 16, 16],
      sleepHours: [7.0, 6.8, 6.5, 6.2, 6.0, 6.3, 6.5],
      wakeUpTimes: [2, 2, 3, 3, 3, 4, 3],
      steps: [4000, 3800, 3600, 3500, 3400, 3300, 3500],
      emotionScores: [70, 68, 65, 62, 60, 58, 58],
    },
  },
  {
    id: 'health-004',
    name: '李明辉',
    age: 80,
    gender: '男',
    room: 'A栋-102',
    bed: '1号床',
    careLevel: '一级护理',
    bodyHealthScore: 72,
    mentalHealthScore: 68,
    emotionStatus: '疲惫',
    emotionConfidence: 0.71,
    bodyRiskLevel: '低风险',
    mentalRiskLevel: '中风险',
    carePriority: '需要关注',
    wearableData: {
      heartRate: 68,
      spo2: 97,
      temperature: 36.4,
      respiratoryRate: 15,
      steps: 4800,
      activeMinutes: 90,
      sedentaryHours: 6.0,
      sleepHours: 7.5,
      wakeUpTimes: 2,
      bedExitTimes: 1,
    },
    emotionAnalysis: {
      facialExpression: '眼睑下垂频率增加，打哈欠次数增多，面部疲惫特征明显',
      behaviorPattern: '白天活动量正常但效率下降，下午出现长时间静坐，动作迟缓',
      physiologicalSignal: '心率偏低，呼吸平稳，睡眠时长足够但深度睡眠比例下降',
      interactionFrequency: '交流时反应速度变慢，但仍保持基本社交意愿',
      historicalTrend: '疲惫程度近一周持续偏高，可能与近期活动安排过密有关',
      aiReasoning: 'AI综合分析显示，该老人虽然睡眠时长达标但深度睡眠比例下降，白天表现出明显的疲惫特征。心率偏低、动作迟缓、反应速度下降均提示身体疲劳。系统建议适当减少白天活动强度，保证午休时间。',
    },
    mentalRisk: {
      depressionRisk: '低风险',
      anxietyRisk: '低风险',
      lonelinessRisk: '中风险',
      sleepRisk: '中风险',
      emotionFluctuationRisk: '低风险',
      interactionDecreaseRisk: '中风险',
      longTermLowActivityRisk: '低风险',
    },
    suggestions: {
      physical: '老人身体指标总体正常，但深度睡眠比例偏低。建议控制晚间液体摄入，减少夜间如厕次数。白天活动量正常，但需注意劳逸结合。',
      mental: '系统检测到老人近期疲惫程度偏高，建议适当减少白天集体活动参与时间，保证午休质量。可安排较为安静的活动如阅读、下棋等。',
      caregiver: '建议护理员观察老人午后精神状态，确保午休环境安静。近期可适当减少对老人的活动安排，给予充分休息时间。',
      family: '老人近期整体状态稳定，家属可保持正常联系频率。如有条件，可带来老人喜欢的书籍或棋类帮助其放松。',
    },
    recentEvents: [
      { time: '2025-05-01 16:30', type: '长时间滞留', level: '中风险', description: '老人在电梯口停留超过10分钟，结合近期迷路记录需关注。' },
      { time: '2025-04-30 14:00', type: '疲惫状态标记', level: '低风险', description: '下午活动中出现明显困倦，打哈欠频繁。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [75, 74, 73, 73, 72, 72, 72],
      mentalHealthScores: [74, 72, 70, 69, 68, 68, 68],
      heartRates: [70, 69, 68, 68, 67, 68, 68],
      spo2Values: [97, 97, 97, 97, 97, 97, 97],
      temperatures: [36.4, 36.4, 36.5, 36.4, 36.4, 36.4, 36.4],
      respiratoryRates: [15, 15, 16, 15, 15, 15, 15],
      sleepHours: [7.8, 7.5, 7.2, 7.5, 7.0, 7.5, 7.5],
      wakeUpTimes: [1, 1, 2, 2, 2, 2, 2],
      steps: [5200, 5000, 4800, 4900, 4500, 4600, 4800],
      emotionScores: [78, 75, 72, 70, 68, 68, 68],
    },
  },
  {
    id: 'health-005',
    name: '刘德华',
    age: 71,
    gender: '男',
    room: 'B栋-205',
    bed: '2号床',
    careLevel: '一级护理',
    bodyHealthScore: 75,
    mentalHealthScore: 78,
    emotionStatus: '平稳',
    emotionConfidence: 0.88,
    bodyRiskLevel: '低风险',
    mentalRiskLevel: '低风险',
    carePriority: '常规观察',
    wearableData: {
      heartRate: 72,
      spo2: 98,
      temperature: 36.5,
      respiratoryRate: 16,
      steps: 5800,
      activeMinutes: 105,
      sedentaryHours: 5.5,
      sleepHours: 7.2,
      wakeUpTimes: 1,
      bedExitTimes: 1,
    },
    emotionAnalysis: {
      facialExpression: '表情自然，微笑频率正常，眼神交流活跃',
      behaviorPattern: '活动量充足，社交活动参与积极，生活作息规律',
      physiologicalSignal: '各项生理指标正常，睡眠质量良好',
      interactionFrequency: '与护理员和同楼层老人交流频繁，社交状态良好',
      historicalTrend: '情绪状态稳定，近期无异常波动',
      aiReasoning: 'AI综合分析显示，该老人各项身体指标正常，活动量充足，社交活跃，情绪平稳。近期除一次楼梯口摔倒事件（已处理）外，整体健康状态良好。建议继续保持当前活动和社交频率。',
    },
    mentalRisk: {
      depressionRisk: '低风险',
      anxietyRisk: '低风险',
      lonelinessRisk: '低风险',
      sleepRisk: '低风险',
      emotionFluctuationRisk: '低风险',
      interactionDecreaseRisk: '低风险',
      longTermLowActivityRisk: '低风险',
    },
    suggestions: {
      physical: '老人身体状态良好。近期楼梯口摔倒事件后，建议短期内避免独自上下楼梯，待医护确认膝关节状态后再恢复楼梯活动。',
      mental: '老人心理状态稳定，情绪平稳。建议继续保持当前的社交活动和生活节奏，维持良好的心理健康状态。',
      caregiver: '建议护理员在近期关注老人膝关节恢复情况，活动中注意防跌倒。常规巡房即可。',
      family: '老人近期状态良好，家属可保持正常联系。建议关注老人楼梯口摔倒事件后的恢复情况。',
    },
    recentEvents: [
      { time: '2025-05-01 09:15', type: '摔倒', level: '紧急', description: '老人在楼梯口失去平衡摔倒，护理员2分钟内赶到，初步判断无骨折。' },
      { time: '2025-04-28 10:30', type: '康复训练完成', level: '正常', description: '完成30分钟膝关节康复训练，状态良好。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [78, 77, 76, 76, 75, 75, 75],
      mentalHealthScores: [80, 79, 78, 78, 78, 78, 78],
      heartRates: [72, 71, 72, 73, 72, 72, 72],
      spo2Values: [98, 98, 97, 98, 98, 98, 98],
      temperatures: [36.5, 36.4, 36.5, 36.5, 36.5, 36.5, 36.5],
      respiratoryRates: [16, 16, 16, 16, 16, 16, 16],
      sleepHours: [7.5, 7.2, 7.0, 7.3, 7.2, 7.2, 7.2],
      wakeUpTimes: [1, 1, 1, 1, 1, 1, 1],
      steps: [6000, 5800, 5500, 5800, 5600, 5500, 5800],
      emotionScores: [82, 80, 78, 78, 78, 78, 78],
    },
  },
  {
    id: 'health-006',
    name: '赵文秀',
    age: 85,
    gender: '女',
    room: 'C栋-206',
    bed: '1号床',
    careLevel: '三级护理',
    bodyHealthScore: 48,
    mentalHealthScore: 42,
    emotionStatus: '需要关注',
    emotionConfidence: 0.85,
    bodyRiskLevel: '高风险',
    mentalRiskLevel: '高风险',
    carePriority: '立即处理',
    wearableData: {
      heartRate: 88,
      spo2: 92,
      temperature: 37.1,
      respiratoryRate: 22,
      steps: 800,
      activeMinutes: 20,
      sedentaryHours: 11.5,
      sleepHours: 4.0,
      wakeUpTimes: 6,
      bedExitTimes: 4,
    },
    emotionAnalysis: {
      facialExpression: '表情痛苦，眉头紧锁，嘴角下垂明显，面部肌肉紧张',
      behaviorPattern: '活动量极低，几乎全天卧床，仅在护理员协助下短时间坐起',
      physiologicalSignal: '心率偏快，血氧偏低，体温略高，呼吸频率偏快，多项指标异常',
      interactionFrequency: '交流意愿明显下降，回应简短且声音微弱',
      historicalTrend: '身体和心理状态近一周持续恶化，多项指标呈下降趋势',
      aiReasoning: 'AI综合分析显示，该老人多项身体指标异常（血氧偏低、体温偏高、心率偏快），活动量极低，睡眠质量严重下降，同时情绪状态明显恶化。系统判断当前身体和心理健康风险均为高风险，建议立即安排医护评估。',
    },
    mentalRisk: {
      depressionRisk: '高风险',
      anxietyRisk: '中风险',
      lonelinessRisk: '高风险',
      sleepRisk: '高风险',
      emotionFluctuationRisk: '中风险',
      interactionDecreaseRisk: '高风险',
      longTermLowActivityRisk: '高风险',
    },
    suggestions: {
      physical: '老人血氧偏低（92%）、体温偏高（37.1°C）、呼吸频率偏快，建议立即安排医护检查。当前活动量极低，久卧时间过长，存在压疮风险。需密切监测生命体征变化。',
      mental: '系统检测到老人情绪状态持续恶化，交流意愿明显下降。建议医护人员评估是否存在身体不适导致的情绪变化，同时安排专人陪伴，提供情感支持。',
      caregiver: '建议护理员立即安排医护评估，重点检查呼吸系统和体温变化。增加翻身频次至每1.5小时一次，防止压疮。记录老人精神状态变化并及时上报。',
      family: '建议家属尽快来院探望，老人当前身体和精神状态均需关注。如老人有特殊饮食或药物需求，请及时与护理团队沟通。',
    },
    recentEvents: [
      { time: '2025-05-01 10:00', type: '血氧偏低', level: '高风险', description: '持续监测血氧低于93%，呼吸频率偏快，建议医护检查。' },
      { time: '2025-05-01 06:30', type: '睡眠质量严重下降', level: '高风险', description: '当夜醒来6次，总睡眠时间仅4小时。' },
      { time: '2025-04-30 20:00', type: '情绪状态恶化', level: '高风险', description: '老人拒绝进食晚餐，对护理员询问仅以摇头回应。' },
      { time: '2025-04-30 12:00', type: '活动量持续下降', level: '中风险', description: '今日步数不足800步，全天几乎未离开床位。' },
      { time: '2025-04-29 15:00', type: '体温偏高', level: '中风险', description: '体温持续高于37°C，建议监测是否持续升高。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [62, 58, 55, 52, 50, 49, 48],
      mentalHealthScores: [58, 55, 52, 48, 45, 43, 42],
      heartRates: [78, 80, 82, 84, 86, 87, 88],
      spo2Values: [96, 95, 95, 94, 93, 93, 92],
      temperatures: [36.6, 36.7, 36.8, 36.9, 37.0, 37.0, 37.1],
      respiratoryRates: [18, 19, 19, 20, 21, 21, 22],
      sleepHours: [6.5, 6.0, 5.5, 5.0, 4.5, 4.2, 4.0],
      wakeUpTimes: [2, 3, 3, 4, 5, 5, 6],
      steps: [2500, 2000, 1800, 1500, 1200, 1000, 800],
      emotionScores: [65, 60, 55, 50, 48, 45, 42],
    },
  },
  {
    id: 'health-007',
    name: '孙丽芳',
    age: 76,
    gender: '女',
    room: 'A栋-405',
    bed: '2号床',
    careLevel: '二级护理',
    bodyHealthScore: 68,
    mentalHealthScore: 72,
    emotionStatus: '情绪波动',
    emotionConfidence: 0.74,
    bodyRiskLevel: '低风险',
    mentalRiskLevel: '中风险',
    carePriority: '需要关注',
    wearableData: {
      heartRate: 76,
      spo2: 96,
      temperature: 36.6,
      respiratoryRate: 17,
      steps: 3200,
      activeMinutes: 55,
      sedentaryHours: 7.5,
      sleepHours: 6.0,
      wakeUpTimes: 3,
      bedExitTimes: 2,
    },
    emotionAnalysis: {
      facialExpression: '表情变化较大，时而微笑时而沮丧，情绪表达幅度偏高',
      behaviorPattern: '活动量波动较大，部分时段活跃但随后长时间静坐',
      physiologicalSignal: '心率波动范围较大（62-90bpm），与情绪变化相关',
      interactionFrequency: '与护理员交流时情绪起伏明显，有时热情有时冷漠',
      historicalTrend: '情绪波动频率近两周增加，可能与家属探视不规律有关',
      aiReasoning: 'AI综合分析显示，该老人近期情绪波动频率增加，心率变异性增大，与护理员交流时情绪起伏明显。结合家属探视不规律的情况，系统建议关注情绪稳定性，保持规律的生活安排和社交互动。',
    },
    mentalRisk: {
      depressionRisk: '中风险',
      anxietyRisk: '中风险',
      lonelinessRisk: '中风险',
      sleepRisk: '中风险',
      emotionFluctuationRisk: '高风险',
      interactionDecreaseRisk: '中风险',
      longTermLowActivityRisk: '低风险',
    },
    suggestions: {
      physical: '老人身体指标基本正常，但心率波动范围较大。建议保持规律的作息和活动安排，避免情绪剧烈波动对身体造成影响。',
      mental: '系统检测到老人近期情绪波动频率增加，建议护理员在交流时保持耐心和一致性。可引导老人参与规律性的集体活动，帮助稳定情绪。',
      caregiver: '建议护理员记录老人情绪波动的时间和诱因，寻找规律。在老人情绪低落时给予适当关注，在情绪高涨时引导其参与活动。',
      family: '建议家属保持规律的探视频率，避免突然取消或延迟探望。规律的家属联系有助于老人情绪稳定。',
    },
    recentEvents: [
      { time: '2025-05-01 11:00', type: '情绪波动标记', level: '中风险', description: '上午活动时情绪高涨，午餐后突然沉默不愿交流。' },
      { time: '2025-04-30 09:00', type: '心率波动异常', level: '低风险', description: '心率在30分钟内从65bpm升至90bpm，与情绪变化相关。' },
      { time: '2025-04-29 16:00', type: '情绪低落标记', level: '低风险', description: '下午取消参加集体活动，独自在房间休息。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [70, 69, 68, 68, 68, 68, 68],
      mentalHealthScores: [78, 75, 74, 73, 72, 72, 72],
      heartRates: [74, 76, 72, 78, 74, 76, 76],
      spo2Values: [97, 96, 96, 96, 96, 96, 96],
      temperatures: [36.5, 36.6, 36.5, 36.6, 36.6, 36.6, 36.6],
      respiratoryRates: [17, 17, 16, 17, 17, 17, 17],
      sleepHours: [6.5, 6.2, 6.0, 6.5, 6.0, 6.2, 6.0],
      wakeUpTimes: [2, 2, 2, 3, 2, 3, 3],
      steps: [3500, 3200, 3000, 3400, 3000, 3200, 3200],
      emotionScores: [78, 72, 75, 68, 72, 70, 68],
    },
  },
  {
    id: 'health-008',
    name: '周志明',
    age: 73,
    gender: '男',
    room: 'C栋-108',
    bed: '1号床',
    careLevel: '一级护理',
    bodyHealthScore: 80,
    mentalHealthScore: 82,
    emotionStatus: '平稳',
    emotionConfidence: 0.91,
    bodyRiskLevel: '低风险',
    mentalRiskLevel: '低风险',
    carePriority: '常规观察',
    wearableData: {
      heartRate: 68,
      spo2: 98,
      temperature: 36.4,
      respiratoryRate: 15,
      steps: 6500,
      activeMinutes: 120,
      sedentaryHours: 4.5,
      sleepHours: 7.8,
      wakeUpTimes: 1,
      bedExitTimes: 1,
    },
    emotionAnalysis: {
      facialExpression: '表情自然开朗，微笑频率高，眼神交流活跃',
      behaviorPattern: '活动量充足且稳定，积极参与康复训练和集体活动',
      physiologicalSignal: '各项生理指标均在正常范围，睡眠质量良好',
      interactionFrequency: '社交活跃，经常与同楼层老人聊天，对护理员态度友善',
      historicalTrend: '情绪状态长期稳定，是楼层中心理健康状态最好的老人之一',
      aiReasoning: 'AI综合分析显示，该老人身体和心理各项指标均处于良好状态。活动量充足、社交活跃、睡眠质量好、情绪稳定。系统判断为低风险，建议保持当前良好的生活习惯。',
    },
    mentalRisk: {
      depressionRisk: '低风险',
      anxietyRisk: '低风险',
      lonelinessRisk: '低风险',
      sleepRisk: '低风险',
      emotionFluctuationRisk: '低风险',
      interactionDecreaseRisk: '低风险',
      longTermLowActivityRisk: '低风险',
    },
    suggestions: {
      physical: '老人身体状态优秀，各项指标正常。建议继续保持规律的活动和锻炼习惯，定期进行常规体检。',
      mental: '老人心理状态良好，情绪稳定。建议继续保持当前的社交活动和积极的生活态度。',
      caregiver: '老人当前状态良好，常规巡房即可。可鼓励老人参与更多集体活动，发挥其在楼层中的积极作用。',
      family: '老人近期状态良好，家属可保持正常联系频率。老人的生活满意度较高。',
    },
    recentEvents: [
      { time: '2025-04-28 08:00', type: '康复训练完成', level: '正常', description: '完成45分钟综合康复训练，状态良好。' },
      { time: '2025-04-25 14:00', type: '常规体检', level: '正常', description: '季度常规体检，各项指标正常。' },
    ],
    trends: {
      dates: ['04-25', '04-26', '04-27', '04-28', '04-29', '04-30', '05-01'],
      bodyHealthScores: [80, 80, 79, 80, 80, 80, 80],
      mentalHealthScores: [82, 82, 81, 82, 82, 82, 82],
      heartRates: [68, 69, 68, 68, 67, 68, 68],
      spo2Values: [98, 98, 98, 98, 98, 98, 98],
      temperatures: [36.4, 36.4, 36.3, 36.4, 36.4, 36.4, 36.4],
      respiratoryRates: [15, 15, 15, 15, 15, 15, 15],
      sleepHours: [7.5, 7.8, 7.6, 7.8, 7.5, 7.8, 7.8],
      wakeUpTimes: [1, 1, 1, 1, 1, 1, 1],
      steps: [6200, 6500, 6000, 6500, 6200, 6400, 6500],
      emotionScores: [82, 82, 80, 82, 82, 82, 82],
    },
  },
];
