import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Briefcase,
  GraduationCap,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Award,
  Sparkles,
} from 'lucide-react';
import { CAREER_PATHS, getRankForLevel } from '../data/homeworkAndProjects';
import { useGame } from '../context/GameContext';
import { executeCode } from '../engine/executor';
import type { ExecutionResult } from '../types/game';

export const CareerAndCapstone: React.FC = () => {
  const { state, selectCareer, completeCareerMission, submitCapstone } = useGame();
  const [activeCareerId, setActiveCareerId] = useState(state.selectedCareerId || CAREER_PATHS[0].id);
  const career = CAREER_PATHS.find((c) => c.id === activeCareerId) || CAREER_PATHS[0];

  const [careerCode, setCareerCode] = useState(career.starterMission.starterCode);
  const [running, setRunning] = useState(false);
  const [res, setRes] = useState<ExecutionResult | null>(null);

  // Capstone state
  const [capstoneTitle, setCapstoneTitle] = useState('My Capstone Application');
  const [capstoneCode, setCapstoneCode] = useState(
    `# Code Quest Capstone Project\n# Build a complete, tested application of your choice!\n\ndef run_app():\n    tasks = ["Plan architecture", "Write clean code", "Test edge cases"]\n    for idx, t in enumerate(tasks, 1):\n        print(f"{idx}. {t}")\n    return len(tasks)\n\nassert run_app() == 3\nprint("Capstone verified successfully!")\n`
  );
  const [designNotes, setDesignNotes] = useState(state.capstoneDesignNotes || '');
  const [capstoneOut, setCapstoneOut] = useState<string>('');
  const [capstoneTested, setCapstoneTested] = useState(false);

  const switchCareer = (id: string) => {
    const next = CAREER_PATHS.find((c) => c.id === id) || CAREER_PATHS[0];
    setActiveCareerId(id);
    selectCareer(id);
    setCareerCode(next.starterMission.starterCode);
    setRes(null);
  };

  const runCareerMission = async () => {
    setRunning(true);
    const execRes = await executeCode(career.starterMission.language, careerCode, career.starterMission.tests);
    setRunning(false);
    setRes(execRes);
    if (execRes.allTestsPassed) {
      completeCareerMission(career.id, career.starterMission.xpReward);
    }
  };

  const runCapstoneCode = async () => {
    setRunning(true);
    const execRes = await executeCode('python', capstoneCode);
    setRunning(false);
    setCapstoneOut(execRes.ok ? execRes.stdout || 'Executed with zero errors!' : execRes.stderr);
    setCapstoneTested(execRes.ok);
  };

  const handleGraduate = () => {
    submitCapstone(
      {
        id: 'proj-capstone',
        title: capstoneTitle.trim() || 'Capstone Application',
        description: 'Official Code Quest Graduation Capstone Project.',
        language: 'python',
        code: capstoneCode,
        milestones: [
          { id: 'c1', text: 'Designed architecture & documented decisions', done: true },
          { id: 'c2', text: 'Implemented & executed clean code with assertions', done: true },
        ],
        designNotes,
        submitted: true,
        isCapstone: true,
        updatedAt: new Date().toISOString(),
      },
      designNotes
    );
  };

  const skillsArr = Object.values(state.skills);
  const strongest = [...skillsArr].sort((a, b) => b.mastery - a.mastery).slice(0, 3);
  const toImprove = [...skillsArr].sort((a, b) => a.mastery - b.mastery).slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Briefcase className="w-6 h-6 text-cyan-400" /> Career Paths &amp; Capstone Graduation
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Explore 6 developer specializations with playable real-world missions, then build your Capstone Project to graduate!
        </p>
      </div>

      {/* 6 Career Path Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CAREER_PATHS.map((c) => {
          const cleared = state.completedCareerMissions.includes(c.id);
          const selected = c.id === career.id;
          return (
            <button
              key={c.id}
              onClick={() => switchCareer(c.id)}
              className={`text-left p-4 rounded-2xl border transition-all space-y-2 ${
                selected
                  ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                  : 'cq-panel hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.icon}</span>
                {cleared && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Mission Cleared
                  </span>
                )}
              </div>
              <div className="font-display text-sm font-bold text-white">{c.title}</div>
              <p className="text-xs text-slate-400">{c.tagline}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {c.skills.slice(0, 3).map((s) => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {s}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Playable Career Starter Mission */}
      <div className="cq-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase text-purple-300">
              {career.title} Specialization Mission • {career.starterMission.language.toUpperCase()}
            </span>
            <h2 className="font-display text-lg font-bold text-white">{career.starterMission.title}</h2>
            <p className="text-xs text-slate-300 mt-1">{career.starterMission.task}</p>
          </div>
          <button
            onClick={runCareerMission}
            disabled={running}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5"
          >
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Run &amp; Verify (+{career.starterMission.xpReward} XP)
          </button>
        </div>

        <div className="h-56 rounded-xl overflow-hidden border border-slate-800">
          <Editor
            height="100%"
            language={career.starterMission.language}
            theme="vs-dark"
            value={careerCode}
            onChange={(val) => setCareerCode(val ?? '')}
            options={{ fontSize: 13.5, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false } }}
          />
        </div>

        {res && (
          <div className="space-y-2">
            {res.stdout && (
              <pre className="rounded-lg bg-black/60 p-2.5 font-mono text-xs text-emerald-300">{res.stdout}</pre>
            )}
            {!res.ok && <div className="text-xs font-mono text-rose-300">{res.stderr}</div>}
            {res.testResults?.map((t) => (
              <div
                key={t.id}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs ${
                  t.passed ? 'bg-emerald-950/30 border-emerald-500/35 text-emerald-200' : 'bg-rose-950/30 border-rose-500/35 text-rose-200'
                }`}
              >
                {t.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                <span>{t.description}</span>
                {!t.passed && t.error && <span className="font-mono text-rose-300 ml-auto">{t.error}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capstone Graduation Center */}
      <div className="cq-panel cq-glow-border rounded-2xl p-6 space-y-4 border-purple-500/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono uppercase text-amber-300 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Final Milestone
            </span>
            <h2 className="font-display text-xl font-extrabold text-white">Capstone Graduation Project</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Plan, write, test, and document an independent Python application to earn your personalized Developer Graduation Report!
            </p>
          </div>
          {state.capstoneSubmitted && (
            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Graduated!
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Capstone Project Title</label>
            <input
              type="text"
              value={capstoneTitle}
              onChange={(e) => setCapstoneTitle(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Design Decisions &amp; Documentation</label>
            <input
              type="text"
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              placeholder="Explain what your app does, how you structured functions, and how you tested it..."
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="h-56 rounded-xl overflow-hidden border border-slate-800">
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={capstoneCode}
            onChange={(val) => setCapstoneCode(val ?? '')}
            options={{ fontSize: 13.5, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false } }}
          />
        </div>

        {capstoneOut && (
          <pre className="rounded-xl bg-black/60 border border-slate-800 p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap">
            {capstoneOut}
          </pre>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={runCapstoneCode}
            disabled={running}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Test Capstone Code
          </button>
          <button
            onClick={handleGraduate}
            disabled={!capstoneTested || designNotes.trim().length < 10}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-400 hover:to-amber-400 disabled:opacity-45 text-slate-950 font-extrabold text-xs flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" /> Submit Capstone &amp; Generate Graduation Report
          </button>
        </div>

        {/* Personalized Developer Graduation Report */}
        {state.capstoneSubmitted && (
          <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/30 to-cyan-950/30 border border-amber-400/40 p-5 space-y-4 mt-4">
            <div className="flex items-center gap-2 text-amber-300 font-display font-bold text-base">
              <Sparkles className="w-5 h-5" /> Personalized Developer Graduation Report — {state.heroName}
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
                <div className="text-slate-400">Developer Rank</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">{getRankForLevel(state.level)}</div>
                <div className="text-slate-500 mt-1">Level {state.level} • {state.xp} XP</div>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
                <div className="text-emerald-400 font-semibold mb-1">Strongest Skills</div>
                <ul className="space-y-1 text-slate-200">
                  {strongest.map((s) => (
                    <li key={s.skillId}>• {s.name} ({s.mastery}%)</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5">
                <div className="text-amber-300 font-semibold mb-1">Recommended Next Focus</div>
                <ul className="space-y-1 text-slate-200">
                  {toImprove.map((s) => (
                    <li key={s.skillId}>• {s.name} ({s.mastery}%)</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              <strong>Next Roadmap Step:</strong> Continue building independent projects in the{' '}
              <strong className="text-cyan-300">{career.title}</strong> track — try building:{' '}
              <em>{career.capstoneIdea}</em>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
