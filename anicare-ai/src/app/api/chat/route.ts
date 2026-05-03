import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: '请输入问题' }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI 服务未配置，请设置 OPENAI_API_KEY' }, { status: 500 });
  }

  const systemPrompt = `你是"安养智巡"康养机构安全风险预警系统的智能助手。你的职责是回答护理员关于老人安全风险、应急处置、护理规范等方面的问题。

知识库包含以下内容：
1. 跌倒应急处理流程：发现老人摔倒后，立即前往现场确认状态；判断意识是否清醒，切勿盲目搬动；如有外伤或疑似骨折，保持原地不动并联系医护人员。
2. 夜间离床风险处置规范：系统检测到老人离床超过 10 分钟未归时自动预警；护理员应优先检查卫生间和走廊。
3. 火灾隐患初步处理流程：系统检测到烟雾浓度异常时立即触发预警；确认烟雾来源位置，判断是否为设备故障。
4. 护理员巡房记录标准：白班每 2 小时巡房一次，夜班每 1.5 小时巡房一次。
5. 老年人突发疾病观察要点：注意观察面色、呼吸频率、肢体动作是否异常。

请用简洁明了的语言回答。`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: 'AI 服务请求失败: ' + err }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? 'AI 未返回内容';
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: 'AI 服务连接失败' }, { status: 500 });
  }
}
