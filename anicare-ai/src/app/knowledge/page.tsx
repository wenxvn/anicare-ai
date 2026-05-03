'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { SectionHeader } from '@/components/ui/section-header';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const quickQuestions = [
  '老人摔倒了怎么处理？',
  '夜间离床超过10分钟该怎么办？',
  '检测到烟雾异常应该怎么处置？',
  '如何预防老人压疮？',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好，我是安养智巡智能助手。我可以回答关于老人安全风险处置、应急流程、护理规范等方面的问题。请问有什么可以帮助您的？',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.error || '抱歉，暂时无法回答您的问题。' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: '网络连接失败，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="智能助手" description="有任何护理安全方面的问题，都可以向我提问。我会结合知识库为您给出专业的处置建议。" />

      <div className="card-glow mx-auto flex h-[calc(100vh-280px)] max-w-3xl flex-col rounded-3xl border border-[#1a1615]/8 bg-white">
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-[#f8f5f0] text-teal-600'}`}>
                    <Icon icon={msg.role === 'user' ? 'mdi:account' : 'mdi:robot-outline'} className="text-sm" />
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-teal-600 text-white' : 'bg-[#f8f5f0] text-[#1a1615]'}`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8f5f0] text-teal-600">
                    <Icon icon="mdi:robot-outline" className="text-sm" />
                  </div>
                  <div className="rounded-2xl bg-[#f8f5f0] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {messages.length === 1 && (
          <div className="px-5 pb-3">
            <p className="mb-2 text-xs text-[#5c524a]/50">快速提问</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="rounded-2xl border border-[#1a1615]/8 px-3 py-1.5 text-xs text-[#5c524a] transition-colors hover:border-teal-500/40 hover:text-teal-700"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="border-t border-[#1a1615]/8 p-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              disabled={loading}
              className="flex-1 rounded-2xl border border-[#1a1615]/10 bg-[#f8f5f0] px-4 py-2.5 text-sm text-[#1a1615] placeholder:text-[#5c524a]/40 focus:border-teal-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-600 text-white transition-colors hover:bg-teal-500 disabled:opacity-40"
            >
              <Icon icon="mdi:send" className="text-lg" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
