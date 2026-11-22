import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  BookCheck,
  CheckCircle2,
  XCircle,
  Play,
  Loader2,
  Award,
  RotateCcw,
} from 'lucide-react';
import { HOMEWORK_ASSIGNMENTS } from '../data/homeworkAndProjects';
import { useGame } from '../context/GameContext';
import { executeCode } from '../engine/executor';
import type { ExecutionResult } from '../types/game';

export const HomeworkCenter: React.FC = () => {
  const { state, saveHomeworkCode, completeHomework } = useGame();
  const [selectedId, setSelectedId] = useState(HOMEWORK_ASSIGNMENTS[0].id);
  const hw = HOMEWORK_ASSIGNMENTS.find((h) => h.id === selectedId) || HOMEWORK_ASSIGNMENTS[0];

  const [code, setCode] = useState(state.homeworkCode[hw.id] ?? hw.starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const selectAssignment = (id: string) => {
    const next = HOMEWORK_ASSIGNMENTS.find((h) => h.id === id) || HOMEWORK_ASSIGNMENTS[0];
    setSelectedId(id);
    setCode(state.homeworkCode[next.id] ?? next.starterCode);
    setResult(null);
  };

  const handleSubmit = async () => {
    setRunning(true);
    const res = await executeCode(hw.language, code, hw.tests);
    setRunning(false);
    setResult(res);
    if (res.allTestsPassed) {
      completeHomework(hw.id, code, hw.xpReward);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
          <BookCheck className="w-6 h-6 text-emerald-400" /> Homework Center
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Apply what you learned independently without copying lessons — real skill grows when you build from scratch!
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Assignment List */}
        <div className="lg:col-span-4 space-y-2.5">
          {HOMEWORK_ASSIGNMENTS.map((item) => {
            const done = state.completedHomework.includes(item.id);
            const active = item.id === hw.id;
            return (
              <button
                key={item.id}
                onClick={() => selectAssignment(item.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_16px_rgba(56,189,248,0.2)]'
                    : done
                      ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400'
                      : 'cq-panel hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    {done && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {item.title}
                  </span>
                  <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1 shrink-0">
                    <Award className="w-3 h-3" /> +{item.xpReward}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Topic: <span className="text-cyan-300">{item.afterConcept}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workspace */}
        <div className="lg:col-span-8 cq-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono uppercase text-purple-300">
                Homework • {hw.language.toUpperCase()}
              </span>
              <h2 className="font-display text-xl font-bold text-white">{hw.title}</h2>
              <p className="text-xs text-slate-300 mt-1">{hw.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCode(hw.starterCode);
                  saveHomeworkCode(hw.id, hw.starterCode);
                }}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                onClick={handleSubmit}
                disabled={running}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5"
              >
                {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                Verify & Submit Homework
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2">
              Requirements Checklist
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {hw.requirements.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="h-72 rounded-xl overflow-hidden border border-slate-800">
            <Editor
              height="100%"
              language={hw.language}
              theme="vs-dark"
              value={code}
              onChange={(val) => {
                const next = val ?? '';
                setCode(next);
                saveHomeworkCode(hw.id, next);
              }}
              options={{
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {hw.language === 'html' && (
            <iframe
              title="Homework HTML Preview"
              sandbox="allow-scripts"
              srcDoc={code}
              className="w-full h-40 rounded-xl border border-slate-700 bg-white"
            />
          )}

          {result && (
            <div className="space-y-2">
              {result.stdout && hw.language !== 'html' && (
                <pre className="rounded-xl bg-black/60 border border-slate-800 p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap">
                  {result.stdout}
                </pre>
              )}
              {!result.ok && (
                <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-3 text-xs text-rose-200">
                  <div className="font-mono">{result.stderr}</div>
                  {result.friendlyError && <div className="text-amber-200 mt-1">{result.friendlyError}</div>}
                </div>
              )}
              {result.testResults?.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${
                    t.passed
                      ? 'bg-emerald-950/25 border-emerald-500/35 text-emerald-200'
                      : 'bg-rose-950/25 border-rose-500/35 text-rose-200'
                  }`}
                >
                  {t.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium">{t.description}</div>
                    {!t.passed && t.error && <div className="font-mono text-[11px] text-rose-300">{t.error}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
