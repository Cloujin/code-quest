import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  Bug,
  SearchCheck,
  ListOrdered,
  Flame,
  X,
  Loader2,
} from 'lucide-react';
import type { MentorMessage, MentorMode } from '../types/game';
import { useGame } from '../context/GameContext';

interface AIMentorPanelProps {
  lessonTitle?: string;
  lessonConcept?: string;
  lessonTask?: string;
  code?: string;
  language?: string;
  error?: string;
  hints?: string[];
  attemptCount?: number;
  onClose?: () => void;
  compact?: boolean;
}

const MODES: Array<{ id: MentorMode; label: string; icon: React.ReactNode; starterPrompt: string }> = [
  { id: 'explain', label: 'Explain', icon: <Sparkles className="w-3.5 h-3.5" />, starterPrompt: 'Can you explain this concept simply?' },
  { id: 'hint', label: 'Hint', icon: <Lightbulb className="w-3.5 h-3.5" />, starterPrompt: 'Give me a small hint without spoiling the answer.' },
  { id: 'debug', label: 'Debug', icon: <Bug className="w-3.5 h-3.5" />, starterPrompt: 'Help me debug my current code and error.' },
  { id: 'review', label: 'Review', icon: <SearchCheck className="w-3.5 h-3.5" />, starterPrompt: 'Can you review my code and suggest improvements?' },
  { id: 'step-by-step', label: 'Step-by-Step', icon: <ListOrdered className="w-3.5 h-3.5" />, starterPrompt: 'Walk me through this mission step by step.' },
  { id: 'challenge', label: 'Challenge', icon: <Flame className="w-3.5 h-3.5" />, starterPrompt: 'Give me a fun extra challenge for this topic!' },
];

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({
  lessonTitle,
  lessonConcept,
  lessonTask,
  code,
  language = 'python',
  error,
  hints,
  attemptCount = 0,
  onClose,
}) => {
  const { recordMentorUsed } = useGame();
  const [mode, setMode] = useState<MentorMode>('explain');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerLabel, setProviderLabel] = useState<'openai' | 'gemini' | 'offline'>('offline');
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I’m **ARIA**, your personal AI Coding Mentor. Pick a mode above (like **Hint** or **Debug**) or ask me anything — I’ll guide you step by step without spoiling the joy of solving it yourself!',
      timestamp: Date.now(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textOverride?: string, modeOverride?: MentorMode) => {
    const chosenMode = modeOverride || mode;
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;

    const userMsg: MentorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      mode: chosenMode,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!textOverride) setInput('');
    setLoading(true);
    recordMentorUsed();

    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: chosenMode,
          message: text,
          code,
          language,
          error,
          lessonTitle,
          lessonConcept,
          lessonTask,
          hints,
          attemptCount,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error('Mentor API unavailable');
      const data = (await res.json()) as {
        reply: string;
        provider: 'openai' | 'gemini' | 'offline';
      };
      setProviderLabel(data.provider);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          mode: chosenMode,
          provider: data.provider,
          timestamp: Date.now(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content:
            'I couldn’t reach the Code Quest backend server right now. Make sure the API server is running (`npm run dev`), or check the **Hints** section on the left panel!',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a1020] border-l border-cyan-500/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">ARIA — AI Mentor</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase font-mono">
                {providerLabel === 'offline' ? 'Smart Offline' : providerLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Teaching-first Socratic tutor</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mode Selector Pills */}
      <div className="px-3 py-2.5 border-b border-slate-800/80 flex flex-wrap gap-1.5 bg-slate-900/40">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMode(m.id);
              sendMessage(m.starterPrompt, m.id);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
              mode === m.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            {m.icon}
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[92%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-cyan-600/25 border border-cyan-400/30 text-cyan-50'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-cyan-300 px-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> ARIA is analyzing your code...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950/70 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask ARIA about code, errors, or concepts..."
          className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
