import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  Bot,
  ArrowLeft,
  ArrowRight,
  Terminal,
  AlertTriangle,
  Sparkles,
  Loader2,
  Eye,
  Lock,
  BookOpen,
} from 'lucide-react';
import { getLessonById, LESSONS, REGIONS } from '../data/curriculum';
import { useGame } from '../context/GameContext';
import { executeCode, subscribePythonStatus } from '../engine/executor';
import type { ExecutionResult } from '../types/game';
import { AIMentorPanel } from './AIMentorPanel';
import { BinaryExplorerWidget, GitSimulatorWidget, PixelMixerWidget } from './InteractiveWidgets';

export const LessonIDE: React.FC = () => {
  const {
    state,
    activeLessonId,
    openLesson,
    setActiveTab,
    recordCodeRun,
    completeLesson,
    saveLessonCode,
  } = useGame();

  const lesson = getLessonById(activeLessonId) || LESSONS[0];
  const region = REGIONS.find((r) => r.id === lesson.regionId);
  const currentIndex = LESSONS.findIndex((l) => l.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  const [code, setCode] = useState<string>(state.savedCode[lesson.id] ?? lesson.starterCode);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showMentor, setShowMentor] = useState(false);
  const [pyStatus, setPyStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [htmlPreviewCode, setHtmlPreviewCode] = useState<string>(lesson.language === 'html' ? code : '');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    return subscribePythonStatus(setPyStatus);
  }, []);

  // Reset local IDE state when switching lessons
  useEffect(() => {
    const initial = state.savedCode[lesson.id] ?? lesson.starterCode;
    setCode(initial);
    setResult(null);
    setRevealedHints(0);
    if (lesson.language === 'html') {
      setHtmlPreviewCode(initial);
    }
  }, [lesson.id]);

  // Highlight error line in Monaco Editor when stderr has an errorLine
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;

    if (result && !result.ok && result.errorLine) {
      monaco.editor.setModelMarkers(model, 'codequest', [
        {
          startLineNumber: result.errorLine,
          startColumn: 1,
          endLineNumber: result.errorLine,
          endColumn: model.getLineMaxColumn(result.errorLine) || 1,
          message: result.friendlyError || result.stderr,
          severity: monaco.MarkerSeverity.Error,
        },
      ]);
    } else {
      monaco.editor.setModelMarkers(model, 'codequest', []);
    }
  }, [result]);

  const handleCodeChange = (val: string | undefined) => {
    const next = val ?? '';
    setCode(next);
    saveLessonCode(lesson.id, next);
  };

  const handleRun = async (runTests: boolean) => {
    setRunning(true);
    if (lesson.language === 'html') {
      setHtmlPreviewCode(code);
    }
    const execRes = await executeCode(lesson.language, code, runTests ? lesson.tests : []);
    setRunning(false);
    setResult(execRes);
    recordCodeRun(lesson.id, lesson.skillId, !execRes.ok);

    if (runTests) {
      fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          language: lesson.language,
          code,
          passed: Boolean(execRes.allTestsPassed),
          errorMessage: execRes.stderr || undefined,
        }),
      }).catch(() => {});

      if (execRes.allTestsPassed) {
        completeLesson(lesson.id, code);
      }
    }
  };

  const isCompleted = state.completedLessons.includes(lesson.id);

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] gap-3">
      {/* Top Mission Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 cq-panel rounded-xl px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setActiveTab('world-map')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Map
          </button>
          <span className="text-slate-700">|</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-cyan-400">{region?.name}</span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h1 className="font-display text-sm md:text-base font-bold text-white truncate">
              {lesson.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lesson.language === 'python' && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  pyStatus === 'ready'
                    ? 'bg-emerald-400'
                    : pyStatus === 'loading'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-slate-500'
                }`}
              />
              Python Sandbox: {pyStatus === 'ready' ? 'Ready' : pyStatus === 'loading' ? 'Loading...' : 'Standby'}
            </span>
          )}

          <button
            onClick={() => setShowMentor((s) => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
              showMentor
                ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-purple-400'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-400" />
            {showMentor ? 'Hide ARIA Mentor' : 'Ask ARIA Mentor'}
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        {/* LEFT: Lesson Guide, Story, Widgets, Hints */}
        <div
          className={`${
            showMentor ? 'lg:col-span-4' : 'lg:col-span-5'
          } cq-panel rounded-2xl p-5 overflow-y-auto space-y-4`}
        >
          {/* Story */}
          <div className="rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 p-3.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Mission Briefing
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{lesson.story}</p>
          </div>

          {/* Concept Explanation */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Learn: {lesson.concept}
            </h2>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              {lesson.explanation.map((line, i) => (
                <li key={i} className="pl-3 border-l-2 border-cyan-500/40 whitespace-pre-wrap">
                  {line}
                </li>
              ))}
            </ul>
            {lesson.analogy && (
              <div className="rounded-lg bg-purple-950/30 border border-purple-500/25 p-3 text-xs text-purple-200">
                <strong className="text-purple-300">Analogy: </strong>
                {lesson.analogy}
              </div>
            )}
          </div>

          {/* Optional Interactive Learning Widget */}
          {lesson.interactiveWidget === 'binary-explorer' && <BinaryExplorerWidget />}
          {lesson.interactiveWidget === 'pixel-mixer' && <PixelMixerWidget />}
          {lesson.interactiveWidget === 'git-sim' && <GitSimulatorWidget />}

          {/* Coding Task */}
          <div className="rounded-xl bg-slate-950/80 border border-emerald-500/30 p-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Your Coding Task
              </span>
              <span className="text-[11px] font-mono text-amber-300">+{lesson.xpReward} XP</span>
            </div>
            <p className="text-xs text-slate-100 leading-relaxed whitespace-pre-wrap">{lesson.task}</p>
          </div>

          {/* Progressive Hints */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Hints ({revealedHints}/{lesson.hints.length})
              </span>
              {revealedHints < lesson.hints.length && (
                <button
                  onClick={() => setRevealedHints((h) => Math.min(lesson.hints.length, h + 1))}
                  className="text-xs text-amber-300 hover:text-amber-200 underline"
                >
                  Reveal Next Hint
                </button>
              )}
            </div>
            {revealedHints === 0 ? (
              <p className="text-[11px] text-slate-500">
                Try solving the mission first! Reveal a hint if you get stuck.
              </p>
            ) : (
              <div className="space-y-2">
                {lesson.hints.slice(0, revealedHints).map((hint, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg bg-amber-950/30 border border-amber-500/30 p-2.5 text-xs text-amber-100"
                  >
                    <strong className="text-amber-400">Hint {idx + 1}:</strong> {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Victory Banner */}
          {result?.allTestsPassed && (
            <div className="rounded-xl bg-emerald-950/45 border border-emerald-400/50 p-4 space-y-2.5 animate-slide-in">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Mission Accomplished!
              </div>
              <p className="text-xs text-emerald-100 leading-relaxed">
                <strong>Concept Mastered:</strong> {lesson.conceptLearned}
              </p>
              {nextLesson && (
                <button
                  onClick={() => openLesson(nextLesson.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                >
                  Next Mission: {nextLesson.title} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* CENTER: Monaco Code Editor + Console / Preview */}
        <div
          className={`${
            showMentor ? 'lg:col-span-5' : 'lg:col-span-7'
          } flex flex-col gap-3 min-h-0`}
        >
          {/* Editor Card */}
          <div className="flex-1 cq-panel rounded-2xl overflow-hidden flex flex-col min-h-[280px]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800">
              <span className="text-xs font-mono text-slate-400">
                main.{lesson.language === 'python' ? 'py' : lesson.language === 'javascript' ? 'js' : 'html'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCodeChange(lesson.starterCode)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Reset to starter code"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                <button
                  onClick={() => handleRun(false)}
                  disabled={running}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-200 font-semibold text-xs transition"
                >
                  {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Run Code
                </button>
                <button
                  onClick={() => handleRun(true)}
                  disabled={running}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow transition"
                >
                  {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Submit & Test
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                language={lesson.language}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                onMount={(editor, monaco) => {
                  editorRef.current = editor;
                  monacoRef.current = monaco;
                }}
                options={{
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 14, bottom: 14 },
                  tabSize: 4,
                  insertSpaces: true,
                  automaticLayout: true,
                  lineNumbers: 'on',
                  roundedSelection: true,
                }}
              />
            </div>
          </div>

          {/* Output Console + Test Results + HTML Preview */}
          <div className="h-56 cq-panel rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                {lesson.language === 'html' ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-cyan-400" /> Live Preview & Tests
                  </>
                ) : (
                  <>
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Output Console & Test Results
                  </>
                )}
              </span>
              {result && (
                <span className="text-[11px] font-mono text-slate-500">{result.executionMs}ms</span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
              {!result && lesson.language !== 'html' && (
                <p className="text-slate-500 font-mono">
                  Click &quot;Run Code&quot; to test your output, or &quot;Submit &amp; Test&quot; to verify your mission!
                </p>
              )}

              {lesson.language === 'html' && (
                <iframe
                  title="Live HTML Preview"
                  sandbox="allow-scripts"
                  srcDoc={htmlPreviewCode}
                  className="w-full h-32 rounded-lg border border-slate-700 bg-white"
                />
              )}

              {result && result.stdout && lesson.language !== 'html' && (
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">Console Output</div>
                  <pre className="font-mono text-emerald-300 bg-black/50 rounded-lg p-2.5 whitespace-pre-wrap">
                    {result.stdout}
                  </pre>
                </div>
              )}

              {result && !result.ok && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/35 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      {result.errorLine ? `Error on Line ${result.errorLine}` : 'Execution Error'}
                    </span>
                    <button
                      onClick={() => setShowMentor(true)}
                      className="text-[11px] px-2 py-0.5 rounded bg-purple-500/25 text-purple-200 border border-purple-400/40 hover:bg-purple-500/35"
                    >
                      Ask ARIA to Debug
                    </button>
                  </div>
                  <pre className="font-mono text-[11px] text-rose-200 whitespace-pre-wrap">{result.stderr}</pre>
                  {result.friendlyError && (
                    <p className="text-xs text-amber-200 bg-amber-950/30 border border-amber-500/25 rounded-lg p-2">
                      <strong>Plain-English Tip:</strong> {result.friendlyError}
                    </p>
                  )}
                </div>
              )}

              {result?.testResults && result.testResults.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Automated Tests</div>
                  {result.testResults.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-start justify-between gap-2 p-2 rounded-lg border ${
                        t.passed
                          ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/25 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {t.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-medium flex items-center gap-1.5">
                            {t.hidden && <Lock className="w-3 h-3 text-slate-400" />}
                            {t.description}
                          </div>
                          {!t.passed && t.error && (
                            <div className="text-[11px] font-mono text-rose-300 mt-0.5">{t.error}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT (Optional Docked): AI Coding Mentor */}
        {showMentor && (
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-cyan-500/20 min-h-[340px]">
            <AIMentorPanel
              lessonTitle={lesson.title}
              lessonConcept={lesson.concept}
              lessonTask={lesson.task}
              code={code}
              language={lesson.language}
              error={result?.stderr}
              hints={lesson.hints}
              attemptCount={state.lessonAttempts[lesson.id] || 0}
              onClose={() => setShowMentor(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
