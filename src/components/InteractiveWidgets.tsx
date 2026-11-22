import React, { useState } from 'react';
import { Terminal, CheckCircle2, RotateCcw } from 'lucide-react';

export const BinaryExplorerWidget: React.FC = () => {
  const [bits, setBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]); // 42 by default!
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const decimal = bits.reduce((sum, b, idx) => sum + b * weights[idx], 0);
  const binaryStr = bits.join('');
  const asciiChar = decimal >= 33 && decimal <= 126 ? String.fromCharCode(decimal) : '—';

  const toggleBit = (index: number) => {
    setBits((prev) => prev.map((b, i) => (i === index ? (b === 1 ? 0 : 1) : b)));
  };

  return (
    <div className="rounded-xl border border-cyan-500/30 bg-slate-950/70 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Interactive 8-Bit (1 Byte) Switchboard
          </h4>
          <p className="text-xs text-slate-400">Click any bit switch to flip between 0 (OFF) and 1 (ON)</p>
        </div>
        <button
          onClick={() => setBits([0, 0, 0, 0, 0, 0, 0, 0])}
          className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {bits.map((bit, i) => (
          <button
            key={i}
            onClick={() => toggleBit(i)}
            className={`flex flex-col items-center py-2 rounded-lg border transition-all ${
              bit === 1
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                : 'bg-slate-900/80 border-slate-700/70 text-slate-500 hover:border-slate-500'
            }`}
          >
            <span className="text-[10px] font-mono opacity-70">{weights[i]}</span>
            <span className="text-base font-mono font-bold mt-0.5">{bit}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
        <span className="text-slate-300">
          Binary: <strong className="text-cyan-300">{binaryStr}</strong>
        </span>
        <span className="text-slate-300">
          Decimal: <strong className="text-emerald-300 text-sm">{decimal}</strong>
        </span>
        <span className="text-slate-300">
          ASCII Char: <strong className="text-purple-300">{asciiChar}</strong>
        </span>
      </div>
    </div>
  );
};

export const PixelMixerWidget: React.FC = () => {
  const [r, setR] = useState(56);
  const [g, setG] = useState(189);
  const [b, setB] = useState(248);

  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;

  return (
    <div className="rounded-xl border border-purple-500/30 bg-slate-950/70 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Interactive RGB Pixel Mixer
          </h4>
          <p className="text-xs text-slate-400">1 Pixel = 3 Bytes (Red, Green, Blue from 0 to 255)</p>
        </div>
        <div
          className="w-12 h-12 rounded-xl border-2 border-white/25 shadow-lg transition-colors"
          style={{ backgroundColor: `rgb(${r}, ${g}, ${b})`, boxShadow: `0 0 20px rgba(${r},${g},${b},0.55)` }}
        />
      </div>

      <div className="space-y-2 text-xs font-mono">
        {[
          { label: 'Red', value: r, set: setR, color: 'accent-rose-500 text-rose-400' },
          { label: 'Green', value: g, set: setG, color: 'accent-emerald-500 text-emerald-400' },
          { label: 'Blue', value: b, set: setB, color: 'accent-sky-500 text-sky-400' },
        ].map((ch) => (
          <div key={ch.label} className="flex items-center gap-3">
            <span className={`w-12 font-semibold ${ch.color.split(' ')[1]}`}>{ch.label}</span>
            <input
              type="range"
              min={0}
              max={255}
              value={ch.value}
              onChange={(e) => ch.set(Number(e.target.value))}
              className={`flex-1 ${ch.color.split(' ')[0]}`}
            />
            <span className="w-8 text-right text-slate-200">{ch.value}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
        <span>rgb({r}, {g}, {b})</span>
        <span>Hex: <strong className="text-cyan-300">{hex}</strong></span>
        <span>Sum: <strong className="text-emerald-300">{r + g + b}</strong></span>
      </div>
    </div>
  );
};

export const GitSimulatorWidget: React.FC = () => {
  const [stage, setStage] = useState<'modified' | 'staged' | 'committed' | 'pushed'>('modified');
  const [logs, setLogs] = useState<string[]>([
    '$ git status',
    'modified: validator.py (unstaged changes)',
  ]);

  const runCmd = (cmd: string) => {
    if (cmd === 'git add .') {
      setStage('staged');
      setLogs((p) => [...p, '$ git add .', 'Changes staged for commit: validator.py']);
    } else if (cmd === 'git commit') {
      if (stage === 'modified') {
        setLogs((p) => [...p, '$ git commit -m "Add validator"', 'Nothing staged yet! Run `git add .` first.']);
        return;
      }
      setStage('committed');
      setLogs((p) => [...p, '$ git commit -m "Add email validator"', '[main 9f3a1c2] Add email validator (1 file changed)']);
    } else if (cmd === 'git push') {
      if (stage !== 'committed' && stage !== 'pushed') {
        setLogs((p) => [...p, '$ git push', 'Commit your staged changes before pushing to GitHub!']);
        return;
      }
      setStage('pushed');
      setLogs((p) => [...p, '$ git push origin main', 'Branch main synced to GitHub remote!']);
    }
  };

  return (
    <div className="rounded-xl border border-indigo-500/30 bg-slate-950/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Terminal className="w-4 h-4" /> Interactive Git Workflow Lab
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 font-mono">
          State: {stage}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => runCmd('git add .')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-indigo-600/40 border border-indigo-400/30 text-slate-100 transition"
        >
          1. git add .
        </button>
        <button
          onClick={() => runCmd('git commit')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-indigo-600/40 border border-indigo-400/30 text-slate-100 transition"
        >
          2. git commit -m "..."
        </button>
        <button
          onClick={() => runCmd('git push')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-emerald-600/40 border border-emerald-400/30 text-slate-100 transition"
        >
          3. git push origin main
        </button>
      </div>

      <div className="bg-black/60 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 max-h-28 overflow-y-auto space-y-1">
        {logs.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? 'text-cyan-400' : 'text-slate-300'}>
            {line}
          </div>
        ))}
      </div>

      {stage === 'pushed' && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4" /> Clean Git workflow completed!
        </div>
      )}
    </div>
  );
};
