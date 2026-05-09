# 安养智巡网站内容与流程说明

> 本文档用于帮助另一个 AI 或开发者快速理解当前网站具体有哪些页面、页面上展示什么、使用了哪些技术栈、数据和接口如何组织、典型网页流程是什么。  
> 这不是比赛提交版技术报告，而是项目交接和代码理解文档。

## 1. 项目定位

项目名称：**安养智巡**

项目类型：面向疗养院、养老院、康养中心的安全风险预警与护理响应后台系统。

目标用户：

- 疗养院值班主管
- 护理员
- 院区管理人员
- 后续可扩展到医护人员、家属沟通人员和系统管理员

当前设计原则：

- 网站不是比赛介绍页，也不是答辩演示页。
- 网站被设定为“真实已投入使用的疗养院管理系统”。
- AI 能力不直接做成“模型流水线展示页”，而是隐藏在业务页面中。
- 用户看到的是“系统判断了什么、为什么、下一步怎么处理”，而不是“模型内部怎么运行”。

## 2. 项目目录概览

项目根目录：

```text
D:\wenxvn\CARIC
```

前端项目目录：

```text
D:\wenxvn\CARIC\anicare-ai
```

关键文件：

```text
D:\wenxvn\CARIC\start.bat
D:\wenxvn\CARIC\anicare-ai\.env.local
D:\wenxvn\CARIC\anicare-ai\src\app
D:\wenxvn\CARIC\anicare-ai\src\components
D:\wenxvn\CARIC\anicare-ai\src\lib
D:\wenxvn\CARIC\anicare-ai\src\services
D:\wenxvn\CARIC\anicare-ai\src\types
D:\wenxvn\CARIC\anicare-ai\vision_service
```

## 3. 技术栈

### 3.1 前端技术栈

| 技术 | 作用 |
| --- | --- |
| Next.js 14 | Web 应用框架，使用 App Router |
| React 18 | 页面和组件开发 |
| TypeScript | 类型定义和接口约束 |
| Tailwind CSS | 样式系统 |
| Recharts | 趋势图、柱状图、雷达图等图表 |
| Framer Motion | 页面过渡和卡片动效 |
| Iconify React | 图标 |
| clsx | 条件 className 拼接 |

### 3.2 本地视觉服务技术栈

| 技术 | 作用 |
| --- | --- |
| Python | 本地模型服务 |
| FastAPI | 提供 `/detect` 和 `/health` 接口 |
| Uvicorn | 运行 FastAPI 服务 |
| Ultralytics YOLO | 目标检测与姿态估计 |
| OpenCV | 图片读取 |
| NumPy | 图像数组处理 |
| PyTorch | YOLO 推理基础框架 |

### 3.3 模型

当前使用：

```text
yolo11n.pt
yolo11n-pose.pt
```

用途：

- `yolo11n.pt`：检测人员、床位、椅子、沙发、长椅、桌面等目标。
- `yolo11n-pose.pt`：输出人体关键点，用于前端绘制人体骨架。

## 4. 启动流程

推荐启动方式：

```text
D:\wenxvn\CARIC\start.bat
```

启动脚本做的事情：

1. 定位项目目录 `anicare-ai`。
2. 检查 Node.js 是否存在。
3. 尝试激活 Conda 环境 `CARIC`。
4. 如果没有 `node_modules`，执行 `npm install --legacy-peer-deps`。
5. 清理前端端口 `3000`。
6. 清理视觉服务端口 `8001`。
7. 检查 Python 视觉服务依赖。
8. 启动 `AniCare Vision` 窗口：

```text
python -m uvicorn vision_service.main:app --host 127.0.0.1 --port 8001
```

9. 等待视觉服务就绪。
10. 启动 `AniCare Dev` 窗口：

```text
npx next dev -p 3000
```

11. 自动打开浏览器：

```text
http://localhost:3000
```

## 5. 环境变量

文件：

```text
D:\wenxvn\CARIC\anicare-ai\.env.local
```

当前内容：

```text
AI_MODE=real
YOLO_ENDPOINT=http://127.0.0.1:8001
```

含义：

- `AI_MODE=real`：前端 `/api/vision` 使用真实 YOLO 服务。
- `YOLO_ENDPOINT`：Next.js API 转发到本地视觉服务地址。

如果设置为 mock，则视觉检测会使用模拟数据，但当前建议保持 `real`。

## 6. 全局布局

### 6.1 根布局

文件：

```text
src/app/layout.tsx
```

功能：

- 设置 HTML 语言为 `zh-CN`。
- 引入全局样式 `globals.css`。
- 使用 `AppShell` 包裹所有页面。
- 网站标题为：

```text
安养智巡 - 康养机构安全风险预警系统
```

### 6.2 应用外壳

文件：

```text
src/components/nav/app-shell.tsx
```

功能：

- 负责整体后台布局。
- 包含侧边栏 `Sidebar`。
- 包含顶部栏 `TopNav`。
- 页面内容显示在右侧主内容区域。

### 6.3 侧边栏导航

文件：

```text
src/components/nav/sidebar.tsx
```

当前主导航：

| 路由 | 名称 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 康养中心值班总览 |
| `/detect` | 实时监测 | 四路监控画面 + YOLO 检测 + 姿态估计 |
| `/health` | 健康监护 | 身体健康、心理状态、可穿戴数据 |
| `/dispatch` | 风险调度 | 护理响应看板 |
| `/profiles` | 行为画像 | 老人个体风险档案 |
| `/emergency` | 应急流程 | SOP 处置流程 |
| `/events` | 事件管理 | 风险事件闭环管理 |
| `/dashboard` | 数据看板 | 管理驾驶舱 |
| `/knowledge` | 智能助手 | 护理决策助手 |

注意：`/prediction-center` 已经不在主导航中。该页面现在会跳转到 `/dashboard`。

### 6.4 顶部栏

文件：

```text
src/components/nav/top-nav.tsx
```

顶部栏展示：

- 侧边栏折叠按钮
- “安养智巡运行中”
- 系统在线率
- 摄像头在线数
- 传感器在线数
- 待处理数量
- 当前时间
- 通知按钮
- 当前用户和退出按钮

## 7. 页面说明

## 7.1 首页 `/`

文件：

```text
src/app/page.tsx
```

页面标题：

```text
今日风险运行态势
```

页面定位：值班主管首页，不是宣传页。

页面内容：

1. **顶部快捷入口**
   - 实时监测
   - 风险调度
   - 应急流程
   - 事件归档

2. **关键指标卡片**
   - 今日告警
   - 待处理高风险
   - 平均响应
   - 设备在线率

3. **当前高风险事件列表**
   - 事件类型
   - 位置
   - 识别来源
   - 状态
   - 等待时间

4. **实时监测缩略图**
   - 展示四张监控缩略图
   - 点击可进入 `/detect`

5. **今日风险趋势**
   - 使用 Recharts 面积图展示告警数变化

6. **设备在线状态**
   - 摄像头
   - 床垫传感器
   - 门磁
   - 毫米波雷达
   - 可穿戴设备

7. **模型运行状态**
   - 模型版本
   - 推理延迟
   - 今日识别次数
   - 高置信告警比例

主要数据来源：

```text
src/lib/mock-data.ts
src/lib/mock-prediction.ts
```

## 7.2 实时监测 `/detect`

文件：

```text
src/app/detect/page.tsx
```

页面标题：

```text
视频墙与真实视觉分析
```

页面定位：疗养院监控值班中心。

### 7.2.1 初始四路画面

初始画面来自：

| 区域 | 初始图片 |
| --- | --- |
| A栋 3层走廊 | `/1/1.jpg` |
| C栋 1层茶水间 | `/1/2.jpg` |
| B栋 302房床位区 | `/1/3.jpg` |
| A栋 1层电梯口 | `/1/4.jpg` |

页面右上角会叠加当前时间，让静态图片更像实时监控画面。

### 7.2.2 分析后画面

点击“分析全部画面”后，系统会对以下图片调用模型：

| 区域 | 分析图片 |
| --- | --- |
| A栋 3层走廊 | `/1/5.jpg` |
| C栋 1层茶水间 | `/1/6.jpg` |
| B栋 302房床位区 | `/1/7.jpg` |
| A栋 1层电梯口 | `/1/8.jpg` |

前端随后将画面切换到对应分析图，并叠加：

- YOLO 检测框
- 检测标签和置信度
- 姿态关键点
- 人体骨架连线

### 7.2.3 主要交互

按钮：

- `重新分析当前画面`
- `分析全部画面`

交互流程：

```text
用户点击分析全部画面
  -> 前端遍历四个 CameraFeed
  -> 调用 /api/vision
  -> /api/vision 转发到 http://127.0.0.1:8001/detect
  -> Python YOLO 服务返回 detections、poses、riskSignals
  -> 前端更新对应画面
  -> 页面叠加检测框和人体骨架
  -> 下方 AI 识别详情同步更新
```

### 7.2.4 右侧事件队列

当前右侧“实时事件队列”以安全状态为主：

- 四路均显示“安全”
- 状态为“持续监测”
- 显示“实时更新”

这样符合真实疗养院场景：多数时间是安全巡检状态，不是每个画面都高风险。

### 7.2.5 AI 识别详情

下方详情区域包含：

1. 模型检测目标
   - 人员
   - 床位
   - 椅子
   - 沙发
   - 长椅
   - 桌面

2. 姿态估计
   - 人体姿态编号
   - 姿态置信度
   - 有效关键点数量，例如 `有效关键点 13/17`

3. 规则信号
   - 检测到人员
   - 床位有人
   - 姿态异常
   - 未检测到高风险目标

4. 建议动作
   - 根据风险信号给出护理建议

### 7.2.6 姿态骨架绘制

前端使用 COCO 17 点人体关键点结构，绘制关键连接：

```text
肩-肘-腕
肩-髋
髋-膝-踝
鼻-眼-耳
```

代码中关键变量：

```text
poseEdges
PoseOverlay
```

过滤规则：

```text
confidence < 0.25 的关键点不绘制
```

## 7.3 健康监护 `/health`

文件：

```text
src/app/health/page.tsx
```

页面标题：

```text
健康监护
```

页面定位：身体健康 + 心理健康 + 护理建议综合辅助判断。

页面内容：

1. 顶部统计
   - 监护老人总数
   - 高风险老人
   - 重点关注老人
   - 风险事件数量

2. 左侧老人列表
   - 姓名
   - 年龄
   - 性别
   - 房间床位
   - 情绪状态
   - 身体风险
   - 护理优先级

3. 选中老人详情
   - 身体健康评分
   - 心理健康评分
   - 可穿戴设备数据
   - 心率、血氧、体温、呼吸、步数、睡眠等
   - 情绪识别
   - 社交互动
   - 睡眠质量
   - 活动趋势
   - 近期事件
   - AI 综合护理建议

数据来源：

```text
src/lib/mock-health.ts
```

注意：页面文案明确心理健康分析只作为护理辅助参考，不能替代专业医学诊断。

## 7.4 风险调度 `/dispatch`

文件：

```text
src/app/dispatch/page.tsx
```

页面标题：

```text
护理响应闭环
```

页面定位：值班主管派单和护理员响应看板。

页面内容：

1. 顶部统计和建议
   - 当前最高优先级事件
   - 建议立即指派护理员
   - 可跳转应急流程

2. 四列看板
   - 待派单
   - 已派单
   - 处理中
   - 已完成

3. 每个事件卡片包含
   - 事件类型
   - 风险等级
   - 区域
   - 等待时间
   - 护理员
   - 预计到场时间
   - 处置进度
   - 查看事件详情按钮

4. 右侧护理员状态
   - 当班护理员
   - 所属楼层
   - 当前负载
   - 可用状态

数据主要在页面内 mock，也可后续接 `/api/dispatch`。

## 7.5 行为画像 `/profiles`

文件：

```text
src/app/profiles/page.tsx
```

页面标题：

```text
老人行为画像
```

页面定位：老人个体风险档案。

页面内容：

### 7.5.1 老人列表

每个老人卡片展示：

- 姓名
- 房间
- 年龄
- 风险标签
- 今日状态
- 点击查看行为画像

### 7.5.2 老人详情

点击老人后进入详情视图，包含：

1. 基本信息
   - 姓名
   - 房间
   - 年龄
   - 风险标签

2. 日常习惯数据
   - 平均起床时间
   - 日均活动时长
   - 常去区域
   - 周均夜间离床
   - 近 7 天异常
   - 今日偏离度

3. 本周护理关注摘要
   - 自动生成
   - 基于风险标签、活动趋势、夜间离床记录和历史事件
   - 给出重点巡查区域和建议频次

4. 图表
   - 7 天活动趋势
   - 夜间离床次数趋势
   - 风险事件频次

5. 行为偏离分析
   - 今日行为偏离度
   - 偏离原因说明

数据来源：

```text
/api/profiles
src/app/profiles/page.tsx 中 fallbackProfiles
```

## 7.6 应急流程 `/emergency`

文件：

```text
src/app/emergency/page.tsx
```

页面标题：

```text
应急流程引导
```

页面定位：护理 SOP 执行系统。

### 7.6.1 初始状态

页面顶部包含：

1. 预案匹配说明
   - 根据事件类型、风险等级、老人画像和所在区域自动匹配处置流程。

2. 当前推荐
   - 待处理事件
   - 可用预案
   - 知识库状态

3. 预案卡片列表
   - 事件类型
   - 风险等级
   - 预计处理时间
   - 步骤数量
   - 开始处理按钮

### 7.6.2 选择预案后

进入步骤执行视图：

- 每个步骤显示序号、标题、说明、知识依据。
- 步骤状态包括：
  - pending
  - doing
  - done
  - skipped

可执行操作：

- 开始执行
- 标记完成
- 跳过
- 添加备注
- 生成处理记录

右侧面板：

- 风险等级
- 已完成步骤
- 预计处理时间
- 当前正在执行
- 下一步建议
- 事件处理记录

数据来源：

```text
/api/emergency/plans
src/services/emergency.service.ts
src/lib/mock-data.ts
```

## 7.7 事件管理 `/events`

文件：

```text
src/app/events/page.tsx
```

页面标题：

```text
事件管理
```

页面定位：风险事件闭环列表。

页面内容：

1. 顶部统计
   - 事件总数
   - 待跟进
   - 高风险
   - 已归档

2. 筛选条件
   - 状态：全部、待处理、已通知、观察中、已处理
   - 等级：全部、紧急、高风险、中风险、低风险

3. 事件卡片
   - 事件类型
   - 事件 ID
   - 状态
   - 风险等级
   - 摘要
   - 研判依据
   - 建议动作
   - 闭环状态
   - 区域
   - 时间
   - 处理人
   - 置信度
   - 查看详情按钮

数据来源：

```text
src/lib/mock-data.ts 中 mockEvents
```

## 7.8 事件详情 `/events/[id]`

文件：

```text
src/app/events/[id]/page.tsx
```

页面定位：单个事件的处置闭环详情。

页面内容：

1. 返回事件列表
2. 事件标题和基本信息
3. 风险等级
4. 当前状态
5. 闭环时间线
   - AI识别
   - 风险研判
   - 派单通知
   - 护理员到场
   - 处置记录
   - 归档

6. 事件检测结果
   - 检测标签
   - 置信度
   - 检测类别

7. 风险研判
   - 风险分
   - 风险等级
   - 研判原因
   - 处置建议
   - 依据

8. 操作按钮
   - 派单
   - 标记到场
   - 完成归档

数据来源：

```text
/api/events/[id]
src/lib/mock-data.ts
```

## 7.9 数据看板 `/dashboard`

文件：

```text
src/app/dashboard/page.tsx
```

页面标题：

```text
数据看板
```

页面定位：管理驾驶舱。

页面内容：

1. 顶部指标
   - 今日事件总数
   - 待处理高危事件
   - 已处理率
   - 平均响应时长

2. 高风险事件趋势
   - 一周趋势面积图

3. 风险类型分布
   - 柱状图
   - 类型包括摔倒、离床未归、烟火异常、久卧未动、异常滞留

4. 区域风险热度排名
   - 展示风险区域热度分数

5. 今日安全巡检概况
   - 视觉监测
   - 床垫传感器
   - 门磁
   - 毫米波雷达
   - 显示在线状态、评分和详情

6. 下一轮重点巡查建议
   - 根据预测数据给出优先巡查区域
   - 显示房间、原因、预测分和触发时间

数据来源：

```text
/api/dashboard
/api/prediction
src/lib/mock-prediction.ts
```

注意：原来的“AI研判中心 / 多模型视觉与智能体协同”已从导航中移除，数据看板承担业务化展示。

## 7.10 智能助手 `/knowledge`

文件：

```text
src/app/knowledge/page.tsx
```

页面标题：

```text
护理决策助手
```

页面定位：RAG + 工具调用风格的护理辅助决策页面。

页面内容：

1. 左侧问题输入
   - 输入现场情况或护理问题

2. 快捷问题
   - 摔倒未响应
   - 夜间离床
   - 烟火异常
   - 压疮风险
   - 情绪低落

3. 生成护理建议按钮

4. 右侧结构化护理建议
   - 风险判断
   - 风险等级
   - 置信度
   - 摘要
   - 处置步骤
   - 注意事项
   - 引用知识条目
   - 工具调用结果
   - 建议派单对象
   - 推荐动作

接口：

```text
/api/chat
```

返回结构类型：

```text
AssistantDecisionReply
```

## 7.11 登录页 `/login`

文件：

```text
src/app/login/page.tsx
```

页面内容：

- 系统名称：安养智巡
- 登录表单
- 用于模拟真实后台入口

认证相关：

```text
src/lib/auth-context.tsx
```

当前认证逻辑偏前端模拟。

## 7.12 `/prediction-center`

文件：

```text
src/app/prediction-center/page.tsx
```

当前状态：

```text
访问后自动 redirect('/dashboard')
```

原因：

- 该页面原本是“AI研判中心 / 多模型视觉与智能体协同”。
- 用户判断该页面太像答辩 PPT，不适合疗养院管理人员。
- 因此从主导航移除，并改为跳转数据看板。

## 8. API 路由说明

API 文件位于：

```text
src/app/api
```

| API | 作用 |
| --- | --- |
| `/api/vision` | 转发视觉检测请求到 Python YOLO 服务 |
| `/api/events` | 返回事件列表 |
| `/api/events/[id]` | 返回单个事件详情 |
| `/api/dispatch` | 风险调度数据 |
| `/api/emergency/plans` | 应急预案数据 |
| `/api/profiles` | 老人行为画像 |
| `/api/profiles/[id]` | 单个老人画像 |
| `/api/dashboard` | 数据看板统计 |
| `/api/prediction` | 重点巡查/融合风险数据 |
| `/api/chat` | 护理决策助手 |
| `/api/decision` | 风险决策输出 |
| `/api/behavior/analyze` | 行为分析输出 |
| `/api/knowledge` | 护理知识库内容 |

## 9. 本地视觉服务说明

目录：

```text
vision_service
```

关键文件：

```text
vision_service/main.py
vision_service/requirements.txt
vision_service/README.md
```

### 9.1 启动命令

```powershell
cd D:\wenxvn\CARIC\anicare-ai
python -m uvicorn vision_service.main:app --host 127.0.0.1 --port 8001
```

### 9.2 接口

#### GET `/health`

返回：

```json
{
  "status": "ok",
  "modelVersion": "yolo11n.pt+yolo11n-pose.pt"
}
```

#### POST `/detect`

请求：

```json
{
  "imageUrl": "/1/5.jpg",
  "cameraId": "CAM-A3-01",
  "zone": "A栋 3层走廊"
}
```

返回：

```json
{
  "detections": [],
  "poses": [],
  "riskSignals": [],
  "processingTimeMs": 531,
  "modelVersion": "yolo11n.pt+yolo11n-pose.pt",
  "imageSize": {
    "width": 1024,
    "height": 683
  }
}
```

### 9.3 检测类别

当前只保留以下 COCO 类别：

```text
person
bed
chair
couch
bench
dining table
```

中文映射：

| 英文类别 | 中文标签 | category |
| --- | --- | --- |
| person | 人员 | person |
| bed | 床位 | bed |
| chair | 椅子 | furniture |
| couch | 沙发 | furniture |
| bench | 长椅 | furniture |
| dining table | 桌面 | furniture |

### 9.4 风险规则

当前规则：

- 检测到人员 -> `person_detected`
- 人员框与床位重叠 -> `lying_on_bed`
- 人体框横向比例明显异常且置信度足够高 -> `fall_suspected`
- 姿态框横向比例明显异常且置信度足够高 -> `pose_abnormal`
- 没有信号 -> `no_high_risk_target`

注意：

- 烟火异常没有使用 COCO 模型伪造。
- 久卧、滞留、无人响应需要时序帧或传感器数据，单张图片不能严格证明。

## 10. 数据类型说明

核心类型文件：

```text
src/types/index.ts
```

关键类型：

### 10.1 `DetectionResult`

```ts
interface DetectionResult {
  label: string;
  confidence: number;
  bbox?: BoundingBox;
  category?: string;
  source?: string;
}
```

### 10.2 `VisionDetectOutput`

```ts
interface VisionDetectOutput {
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
```

### 10.3 `ResidentProfile`

老人行为画像类型，包含：

- 姓名
- 房间
- 年龄
- 风险标签
- 今日状态
- 起床时间
- 活动时长
- 常去区域
- 夜间离床次数
- 异常次数
- 偏离度
- 趋势数据

### 10.4 `EmergencyPlan`

应急预案类型，包含：

- 事件类型
- 风险等级
- 预计处理时间
- 当前状态
- 步骤列表

### 10.5 `AssistantDecisionReply`

护理助手结构化回答类型，包含：

- 风险判断
- 风险等级
- 置信度
- 摘要
- 步骤
- 注意事项
- 引用知识
- 工具调用
- 推荐动作
- 建议派单对象

## 11. 数据来源说明

主要 mock 数据文件：

| 文件 | 内容 |
| --- | --- |
| `src/lib/mock-data.ts` | 事件、知识库、应急流程、架构等 |
| `src/lib/mock-health.ts` | 健康监护页面老人健康数据 |
| `src/lib/mock-prediction.ts` | 数据看板、巡查建议、融合风险数据 |

服务层文件：

| 文件 | 作用 |
| --- | --- |
| `src/services/vision.service.ts` | 视觉服务适配器，支持 mock 和 real |
| `src/services/health.service.ts` | 健康监护数据服务 |
| `src/services/dispatch.service.ts` | 调度服务 |
| `src/services/emergency.service.ts` | 应急流程服务 |
| `src/services/prediction.service.ts` | 风险预测/巡查建议服务 |
| `src/services/decision.service.ts` | 决策服务 |
| `src/services/behavior.service.ts` | 行为分析服务 |

## 12. 主要网页流程

## 12.1 日常值班流程

```text
打开首页
  -> 查看今日风险运行态势
  -> 查看当前高风险事件
  -> 进入实时监测
  -> 点击分析全部画面
  -> 查看检测框和人体骨架
  -> 如果发现异常，进入风险调度或事件管理
  -> 派单护理员
  -> 应急流程按步骤处置
  -> 事件详情完成归档
  -> 数据看板查看统计与复盘
```

## 12.2 实时检测流程

```text
/detect 页面加载
  -> 显示 /1/1.jpg 到 /1/4.jpg
  -> 右上角显示实时更新时间
  -> 点击分析全部画面
  -> 前端对四个 feed 调用 /api/vision
  -> 每个 feed 使用 analyzedImageUrl，即 /1/5.jpg 到 /1/8.jpg
  -> Next API 调用 Python /detect
  -> YOLO 返回 detections 和 poses
  -> 前端切换到分析后图片
  -> 画检测框、标签、关键点和骨架
  -> 下方 AI 识别详情更新
```

## 12.3 事件闭环流程

```text
/events 查看事件列表
  -> 按状态或风险等级筛选
  -> 点击查看详情
  -> /events/[id] 展示闭环时间线
  -> 点击派单
  -> 标记护理员到场
  -> 完成归档
```

## 12.4 应急流程执行

```text
/emergency
  -> 选择事件类型
  -> 系统加载对应 SOP
  -> 护理员逐步点击开始执行/标记完成
  -> 可添加备注
  -> 全部步骤完成后生成处理记录
```

## 12.5 护理助手流程

```text
/knowledge
  -> 选择快捷问题或输入现场情况
  -> 点击生成护理建议
  -> /api/chat 返回结构化建议
  -> 页面展示风险判断、处置步骤、引用知识、工具调用、派单建议
```

## 13. 前端风格说明

整体风格：

- 克制、专业、偏医疗/康养后台
- 白色和浅灰背景
- 青绿色主色
- 红、橙、黄、绿表示风险等级
- 卡片圆角适中
- 不做营销式大 hero
- 不做比赛介绍页

页面设计注意点：

- 首页是运营总览。
- 实时监测像值班监控台。
- 数据看板像管理驾驶舱。
- 应急流程像 SOP 执行工具。
- 行为画像像老人档案。
- 护理助手像结构化决策支持工具。

## 14. 当前特殊设计决策

### 14.1 为什么移除 AI 研判中心

原本有一个 `/prediction-center` 页面，展示多模型视觉流水线和智能体协同。但该页面更像答辩 PPT，不符合疗养院管理人员的实际使用习惯。

当前处理：

- 侧边栏不再显示该入口。
- `/prediction-center` 自动跳转 `/dashboard`。
- 大模型/智能体能力改为嵌入业务页面。

### 14.2 大模型和智能体现在如何体现

不直接展示“智能体工作流”，而是业务化体现：

| 页面 | AI 能力体现 |
| --- | --- |
| 行为画像 | 本周护理关注摘要 |
| 应急流程 | 自动匹配处置预案 |
| 事件管理 | 研判依据与建议动作 |
| 数据看板 | 下一轮重点巡查建议 |
| 智能助手 | RAG 风格结构化护理建议 |

### 14.3 为什么实时事件队列显示安全

用户希望实时监控页面更贴近真实疗养院日常状态。真实场景中，大多数画面应该是安全巡检状态，而不是每个画面都高风险。因此右侧队列统一显示安全，同时模型识别结果在画面和详情面板中体现。

## 15. 图片素材说明

当前实时监测核心图片位于：

```text
public/1
```

用途：

| 文件 | 用途 |
| --- | --- |
| `1.jpg` | A栋3层走廊初始实时画面 |
| `2.jpg` | C栋1层茶水间初始实时画面 |
| `3.jpg` | B栋302房床位区初始实时画面 |
| `4.jpg` | A栋1层电梯口初始实时画面 |
| `5.jpg` | A栋3层走廊分析后检测画面 |
| `6.jpg` | C栋1层茶水间分析后检测画面 |
| `7.jpg` | B栋302房床位区分析后检测画面 |
| `8.jpg` | A栋1层电梯口分析后检测画面 |

还有早期下载的 Pexels 素材位于：

```text
public/pictures
```

但当前 `/detect` 页面主要使用 `public/1` 下的 8 张图。

## 16. 构建与验证

前端构建：

```powershell
cd D:\wenxvn\CARIC\anicare-ai
npm.cmd run build
```

Python 语法检查：

```powershell
cd D:\wenxvn\CARIC\anicare-ai
python -m py_compile vision_service\main.py
```

视觉服务健康检查：

```powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:8001/health' -Method Get
```

视觉检测测试：

```powershell
$body = @{ imageUrl = '/1/5.jpg'; cameraId = 'CAM-A3-01'; zone = 'A栋 3层走廊' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://127.0.0.1:8001/detect' -Method Post -ContentType 'application/json' -Body $body
```

## 17. 后续可改进点

1. 接入真实摄像头视频流，而不是静态图片。
2. 支持 RTSP/WebRTC 视频源。
3. 将 YOLO 推理从图片扩展到连续帧。
4. 增加多帧跟踪，判断久卧、滞留、无人响应。
5. 接入真实床垫、门磁、毫米波、可穿戴设备。
6. 接入真实数据库。
7. 护理助手接入真实大模型 API。
8. 建立向量知识库，实现真正 RAG。
9. 增加用户权限和操作审计。
10. 增加护理员移动端接单页面。
11. 替换带水印素材，避免正式报告中的版权风险。
12. 给每个页面补充更稳定的截图状态。

## 18. 给后续 AI 的理解建议

如果另一个 AI 要继续修改这个项目，建议先理解以下核心点：

1. **这是业务后台，不是比赛宣传页。**
2. **疗养院管理人员不需要看模型流水线。**
3. **AI 能力要变成业务动作，例如建议巡查、自动匹配预案、生成护理摘要。**
4. **实时监测页是当前最重要的技术展示页面，因为它已经接入真实 YOLO 检测和姿态估计。**
5. **`/prediction-center` 不应该重新放回主导航，除非用户明确要求。**
6. **修改中文页面时不要因为终端乱码就认为网页乱码，浏览器显示是正常的。**
7. **不要把 `*.pt` 模型权重提交进仓库。**
8. **不要把所有画面都做成高风险，真实系统中安全状态应该是多数。**

## 19. 快速索引

| 想改什么 | 优先看哪个文件 |
| --- | --- |
| 导航菜单 | `src/components/nav/sidebar.tsx` |
| 顶部状态栏 | `src/components/nav/top-nav.tsx` |
| 首页 | `src/app/page.tsx` |
| 实时检测 | `src/app/detect/page.tsx` |
| 视觉服务 | `vision_service/main.py` |
| 健康监护 | `src/app/health/page.tsx` |
| 风险调度 | `src/app/dispatch/page.tsx` |
| 行为画像 | `src/app/profiles/page.tsx` |
| 应急流程 | `src/app/emergency/page.tsx` |
| 事件管理 | `src/app/events/page.tsx` |
| 事件详情 | `src/app/events/[id]/page.tsx` |
| 数据看板 | `src/app/dashboard/page.tsx` |
| 智能助手 | `src/app/knowledge/page.tsx` |
| 类型定义 | `src/types/index.ts` |
| Mock 数据 | `src/lib/mock-data.ts`、`src/lib/mock-health.ts`、`src/lib/mock-prediction.ts` |
| API 客户端 | `src/lib/api-client.ts` |
| API 响应格式 | `src/lib/api-response.ts` |

