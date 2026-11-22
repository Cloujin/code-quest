import React, { useEffect, useState } from 'react';
import {
  Settings,
  Palette,
  Lock,
  Bot,
  RotateCcw,
  Sparkles,
  Database,
  Unlock,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { THEMES } from '../data/homeworkAndProjects';

export const SettingsView: React.FC = () => {
  const {
    state,
    setTheme,
    toggleExplorerMode,
    replayOnboarding,
    resetProgress,
    backendSynced,
  } = useGame();

  const [health, setHealth] = useState<{ aiProvider?: string; aiConfigured?: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : null))
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-cyan-400" /> Academy Settings &amp; System Status
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Customize your futuristic IDE theme, inspect persistence status, or configure a live AI Mentor API key.
        </p>
      </div>

      {/* Unlockable Themes */}
      <div className="cq-panel rounded-2xl p-5 space-y-4">
        <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" /> Unlockable Interface Themes
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {THEMES.map((t) => {
            const unlocked = state.unlockedThemes.includes(t.id) || state.level >= t.unlockLevel;
            const active = state.activeTheme === t.id;
            return (
              <button
                key={t.id}
                disabled={!unlocked}
                onClick={() => setTheme(t.id)}
                className={`p-3.5 rounded-xl border text-left transition space-y-2 ${
                  active
                    ? 'border-cyan-400 bg-cyan-500/15'
                    : unlocked
                      ? 'border-slate-700 bg-slate-900/70 hover:border-slate-500'
                      : 'border-slate-800 bg-slate-950/60 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="h-8 rounded-lg" style={{ background: t.preview }} />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.name}</span>
                  {!unlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
                </div>
                <div className="text-[10px] font-mono text-slate-400">
                  {active ? 'Active' : unlocked ? 'Unlocked' : `Unlocks at Level ${t.unlockLevel}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* System & AI Mentor Status */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="cq-panel rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Bot className="w-5 h-5 text-cyan-400" /> AI Coding Mentor Backend
          </div>
          <p className="text-xs text-slate-300">
            Active Provider:{' '}
            <strong className="text-cyan-300 uppercase font-mono">
              {health?.aiProvider || 'Smart Offline Mentor'}
            </strong>
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            To enable live OpenAI or Gemini responses, copy <code className="text-cyan-300">.env.example</code> to{' '}
            <code className="text-cyan-300">.env</code> in the project root and set{' '}
            <code className="text-cyan-300">OPENAI_API_KEY</code> or <code className="text-cyan-300">GEMINI_API_KEY</code>.
            API keys remain securely on the backend and are never exposed to the browser.
          </p>
        </div>

        <div className="cq-panel rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Database className="w-5 h-5 text-emerald-400" /> Persistence &amp; Progress
          </div>
          <p className="text-xs text-slate-300">
            Storage Engine:{' '}
            <strong className="text-emerald-300 font-mono">
              {backendSynced ? 'SQLite Database + LocalStorage Sync' : 'LocalStorage (Offline Fallback)'}
            </strong>
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your XP, completed quests, saved code, homework submissions, skill mastery ratings, and portfolio projects are
            saved automatically on every change.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="cq-panel rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={toggleExplorerMode}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
          >
            <Unlock className="w-4 h-4 text-purple-400" />
            Explorer Mode: {state.explorerMode ? 'ON (All Regions Open)' : 'OFF (Skill-Gated)'}
          </button>
          <button
            onClick={replayOnboarding}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" /> Replay Beginner Onboarding
          </button>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all Code Quest progress, XP, and saved code?')) {
              resetProgress();
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-xs font-bold text-rose-300"
        >
          <RotateCcw className="w-4 h-4" /> Reset All Progress
        </button>
      </div>
    </div>
  );
};
