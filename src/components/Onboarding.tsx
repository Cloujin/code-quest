import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  ArrowRight,
  ArrowLeft,
  Cpu,
  BookOpen,
  Terminal,
  Shield,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { executeCode } from '../engine/executor';
import { useGame } from '../context/GameContext';
import type { PlayerState } from '../types/game';

const AVATAR_CLASSES: Array<{
  id: PlayerState['avatarClass'];
  desc: string;
  icon: string;
}> = [
  { id: 'Cyber Mage', desc: 'Masters logic spells & algorithms', icon: '🧙' },
  { id: 'Code Ranger', desc: 'Fast explorer of new languages', icon: '🏹' },
  { id: 'Data Knight', desc: 'Protector of clean, bug-free code', icon: '🛡️' },
  { id: 'System Architect', desc: 'Builder of worlds & applications', icon: '⚡' },
];

export const Onboarding: React.FC = () => {
  const { completeOnboarding } = useGame();
  const [step, setStep] = useState(0);
  const [recipeStep, setRecipeStep] = useState(0);
  const [firstCode, setFirstCode] = useState('print("Hello, Code Quest!")');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ranSuccessfully, setRanSuccessfully] = useState(false);
  const [heroName, setHeroName] = useState('');
  const [avatarClass, setAvatarClass] = useState<PlayerState['avatarClass']>('Cyber Mage');

  const recipeSteps = [
    { instruction: '1. Take two slices of bread', robot: '🤖 Robot picks up bread slices.' },
    { instruction: '2. Spread peanut butter on slice 1', robot: '🤖 Robot spreads peanut butter carefully.' },
    { instruction: '3. Put slices together & serve!', robot: '🥪 Mission complete! Just like a program running top-to-bottom.' },
  ];

  const handleRunFirstCode = async () => {
    setRunning(true);
    setError(null);
    const res = await executeCode('python', firstCode);
    setRunning(false);
    if (res.ok) {
      setOutput(res.stdout.trim() || '(Program ran with no printed text — try using print("...")!)');
      if (res.stdout.trim().length > 0) {
        setRanSuccessfully(true);
      }
    } else {
      setError(res.friendlyError || res.stderr);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 cq-grid-bg relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl cq-panel cq-glow-border rounded-2xl p-6 md:p-10 relative z-10 space-y-6">
        {/* Progress Dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-display font-bold tracking-wider text-sm text-cyan-300">CODE QUEST</span>
              <p className="text-[11px] text-slate-400">Beginner Academy Onboarding</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-8 bg-cyan-400' : i < step ? 'w-2.5 bg-emerald-400' : 'w-2.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <div className="space-y-5 py-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-medium">
              <Cpu className="w-3.5 h-3.5" /> Zero experience required — we start from absolute scratch!
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Welcome to the World of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Programming</span>
            </h1>
            <p className="text-slate-300 leading-relaxed">
              Every video game, smartphone app, website, and AI assistant is built with <strong className="text-white">code</strong>.
              You don’t need to be a math genius or know any technical jargon to start.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {[
                { title: 'What is Code?', text: 'Simple written instructions that tell a computer what to do step by step.' },
                { title: 'Programming Language', text: 'A clear language (like Python) both humans and computers can understand.' },
                { title: 'Your Superpower', text: 'Turn ideas into real games, websites, tools, and software you build yourself!' },
              ].map((card) => (
                <div key={card.title} className="rounded-xl bg-slate-900/80 border border-slate-800 p-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-cyan-300">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: RECIPE ANALOGY */}
        {step === 1 && (
          <div className="space-y-5 py-2">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" /> How a Computer Program Works
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
              A Program is Just Like a Recipe!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Computers are super fast, but they have zero imagination. They follow your instructions{' '}
              <strong className="text-cyan-300">one line at a time, in exact order</strong>. Click through the robot recipe below:
            </p>

            <div className="rounded-xl bg-slate-950/80 border border-cyan-500/25 p-5 space-y-3">
              {recipeSteps.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                    idx === recipeStep
                      ? 'bg-cyan-500/15 border-cyan-400 text-white'
                      : idx < recipeStep
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="font-mono text-xs md:text-sm">{s.instruction}</span>
                  {idx <= recipeStep && <span className="text-xs text-cyan-200">{s.robot}</span>}
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setRecipeStep((prev) => (prev + 1) % recipeSteps.length)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition"
                >
                  Execute Next Step →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: WRITE & RUN YOUR FIRST PYTHON PROGRAM */}
        {step === 2 && (
          <div className="space-y-4 py-1">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" /> Your First Real Program
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Run Your Very First Line of Python!
            </h2>
            <p className="text-sm text-slate-300">
              In Python, <code className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">print("...")</code> tells
              the computer to display a message. Edit the message below (put your own words inside the quotes!) and click{' '}
              <strong className="text-emerald-300">Run Code</strong>!
            </p>

            <div className="rounded-xl border border-slate-700 bg-[#0b1020] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800">
                <span className="text-xs font-mono text-slate-400">first_program.py</span>
                <button
                  onClick={handleRunFirstCode}
                  disabled={running}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs transition"
                >
                  {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  {running ? 'Starting Python...' : 'Run Code'}
                </button>
              </div>
              <textarea
                value={firstCode}
                onChange={(e) => setFirstCode(e.target.value)}
                rows={3}
                spellCheck={false}
                className="w-full bg-transparent p-4 font-mono text-sm text-cyan-200 focus:outline-none resize-none"
              />
            </div>

            {output && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-1.5 animate-slide-in">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" /> Console Output — You just ran real Python code!
                </div>
                <pre className="font-mono text-sm text-white whitespace-pre-wrap">{output}</pre>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-4 text-xs text-rose-200 space-y-1">
                <div className="font-bold text-rose-400">Oops! That’s totally okay — even pros see errors:</div>
                <p>{error}</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: CREATE HERO PROFILE */}
        {step === 3 && (
          <div className="space-y-5 py-1">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Create Your Developer Identity
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Choose Your Hero Name & Class
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Hero Name</label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="e.g. Nova, Alex, ByteRunner..."
                className="w-full rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Starting Class</label>
              <div className="grid grid-cols-2 gap-3">
                {AVATAR_CLASSES.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setAvatarClass(cls.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      avatarClass === cls.id
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_16px_rgba(56,189,248,0.25)]'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-xl mb-1">{cls.icon}</div>
                    <div className="text-sm font-bold text-white">{cls.id}</div>
                    <div className="text-xs text-slate-400">{cls.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/80 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              onClick={() => completeOnboarding('Apprentice', 'Cyber Mage')}
              className="text-xs text-slate-500 hover:text-slate-300 transition"
            >
              Skip intro (already know basics)
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg transition"
            >
              {step === 2 && !ranSuccessfully ? 'Continue Anyway' : 'Next'} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => completeOnboarding(heroName || 'Nova', avatarClass)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg transition"
            >
              Enter Code Quest (+50 XP) <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
