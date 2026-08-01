import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Send, User, Bot, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert } from '@/data/mockAlerts';
import { aiClient, AISummary } from '@/services/aiClient';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'msg-welcome',
  role: 'ai',
  content:
    "I'm online and analyzing live data from the backend. Ask me about the most critical threat, whether to block an IP, server health, or recent activity.",
  timestamp: new Date(),
};

export function AISecurityAnalyst({ contextAlert }: { contextAlert?: Alert }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchSummary = () => {
      aiClient
        .getSummary()
        .then((s) => {
          setSummary(s);
          setSummaryLoading(false);
        })
        .catch(() => setSummaryLoading(false));
    };
    fetchSummary();
    const interval = setInterval(fetchSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    const question = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const answer = await aiClient.ask(question);
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newAiMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: "I couldn't reach the backend analysis endpoint. Is the FastAPI server running?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const riskScore = summary?.risk_score ?? 0;
  const riskLabel = summary?.risk_label ?? '—';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel - Context & Analysis */}
      <div className="lg:col-span-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">AI Analyst</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-md border border-border text-sm text-muted-foreground leading-relaxed">
              <span className="text-foreground font-semibold">Current Focus: </span>
              {summaryLoading
                ? 'Loading live analysis…'
                : contextAlert
                ? contextAlert.title
                : summary?.current_focus}
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" /> Risk Assessment
              </h3>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-destructive rounded-full" style={{ width: `${riskScore}%` }}></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Low</span>
                <span className="text-destructive font-bold">
                  {riskLabel} ({riskScore})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Recommended Actions
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                {(summary?.recommended_actions ?? []).map((action, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-mono">{i + 1}.</span> {action}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {contextAlert && (
          <div className="bg-card border border-border rounded-lg p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Related Alert
            </h3>
            <div className="p-3 border border-border rounded-md bg-muted/20">
              <div className="text-sm font-bold text-foreground">{contextAlert.title}</div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {contextAlert.sourceIP} → {contextAlert.affectedHost}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="lg:col-span-2 bg-card border border-border rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border bg-card flex justify-between items-center">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            Ask the AI Security Analyst
          </h2>
          <span className="text-xs text-muted-foreground flex items-center gap-2">● AI Online</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex gap-3 max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '')}>
              <div
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 border',
                  msg.role === 'user' ? 'bg-muted border-border text-foreground' : 'bg-primary/10 border-primary/30 text-primary'
                )}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={cn(
                  'p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap',
                  msg.role === 'user'
                    ? 'bg-primary/10 text-foreground rounded-tr-none'
                    : 'bg-muted/50 border border-border text-foreground rounded-tl-none'
                )}
              >
                {msg.content}
                <div className={cn('text-[10px] mt-2 font-mono opacity-50', msg.role === 'user' ? 'text-right' : 'text-left')}>
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 border bg-primary/10 border-primary/30 text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border rounded-tl-none flex gap-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card">
          <div className="text-[10px] text-muted-foreground text-center mb-2">
            Analysis is generated from live backend data (rule-based, not an LLM yet).
          </div>
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about threats, alerts, or request an investigation..."
              className="w-full bg-background border border-border rounded-md pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
