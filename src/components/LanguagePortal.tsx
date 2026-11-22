import React, { useState } from 'react';
import { Globe2, Play, Sparkles, Loader2, Info } from 'lucide-react';
import { PORTAL_CONCEPTS, PORTAL_LANGUAGES } from '../data/languagePortal';
import { executeCode } from '../engine/executor';
import { useGame } from '../context/GameContext';

export const LanguagePortal: React.FC = () => {
  const { recordPortalUsed } = useGame();
  const [conceptId, setConceptId] = useState(PORTAL_CONCEPTS[0].id);
  const [leftLangId, setLeftLangId] = useState('python');
  const [rightLangId, setRightLangId] = useState('javascript');
  const [runOutput, setRunOutput] = useState<Record<string, string>>({});
  const [runningLang, setRunningLang] = useState<string | null>(null);

  const concept = PORTAL_CONCEPTS.find((c) => c.id === conceptId) || PORTAL_CONCEPTS[0];
  const leftLang = PORTAL_LANGUAGES.find((l) => l.id === leftLangId) || PORTAL_LANGUAGES[0];
  const rightLang = PORTAL_LANGUAGES.find((l) => l.id === rightLangId) || PORTAL_LANGUAGES[1];

  const handleRunSnippet = async (langId: string) => {
    const lang = PORTAL_LANGUAGES.find((l) => l.id === langId);
    if (!lang?.runnable) return;
    recordPortalUsed();
    setRunningLang(langId);
    const code = concept.snippets[langId] || '';
    const res = await executeCode(lang.runnable, code);
    setRunningLang(null);
    setRunOutput((prev) => ({
      ...prev,
      [langId]: res.ok ? res.stdout || '(Executed cleanly)' : res.stderr,
    }));
  };

  const renderPanel = (
    lang: (typeof PORTAL_LANGUAGES)[number],
    onChangeLang: (id: string) => void
  ) => {
    const code = concept.snippets[lang.id] || '';
    return (
      <div className="cq-panel rounded-2xl p-5 space-y-4 flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <select
            value={lang.id}
            onChange={(e) => {
              onChangeLang(e.target.value);
              recordPortalUsed();
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-white focus:border-cyan-400 focus:outline-none"
          >
            {PORTAL_LANGUAGES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          {lang.runnable && (
            <button
              onClick={() => handleRunSnippet(lang.id)}
              disabled={runningLang === lang.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold transition"
            >
              {runningLang === lang.id ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              Run Live
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-2.5">
            <span className="text-slate-500 block">Typing System</span>
            <strong className="text-cyan-300">{lang.typing}</strong>
          </div>
          <div className="rounded-lg bg-slate-950/70 border border-slate-800 p-2.5">
            <span className="text-slate-500 block">Memory Model</span>
            <strong className="text-purple-300">{lang.memoryModel}</strong>
          </div>
        </div>

        <pre className="flex-1 rounded-xl bg-[#070b16] border border-slate-800 p-4 font-mono text-xs text-cyan-100 overflow-x-auto leading-relaxed">
          {code}
        </pre>

        {lang.runnable === 'html' && (
          <iframe
            title="HTML Portal Preview"
            sandbox="allow-scripts"
            srcDoc={code}
            className="w-full h-24 rounded-lg border border-slate-700 bg-slate-950"
          />
        )}

        {runOutput[lang.id] && lang.runnable !== 'html' && (
          <div className="rounded-lg bg-emerald-950/35 border border-emerald-500/30 p-3 font-mono text-xs text-emerald-300">
            <div className="text-[10px] uppercase text-emerald-500 mb-1">Live Output</div>
            <pre className="whitespace-pre-wrap">{runOutput[lang.id]}</pre>
          </div>
        )}

        <p className="text-[11px] text-slate-400">
          <strong className="text-slate-200">Best for:</strong> {lang.bestFor}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-cyan-400" /> The Language Portal
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Learn a concept once, then see how it translates across 11 real-world programming languages!
          </p>
        </div>
      </div>

      {/* Philosophy Banner */}
      <div className="rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 border border-cyan-500/25 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Developer Secret:</strong> No programmer memorizes every language!
          Master core fundamentals (variables, conditions, loops, functions, data structures) in Python first — once you
          understand the <em>ideas</em>, picking up JavaScript, TypeScript, C++, Rust, Go, or Java becomes dramatically faster.
        </p>
      </div>

      {/* Concept Tabs */}
      <div className="flex flex-wrap gap-2">
        {PORTAL_CONCEPTS.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setConceptId(c.id);
              setRunOutput({});
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
              conceptId === c.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_14px_rgba(56,189,248,0.25)]'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* Side-by-Side Comparator */}
      <div className="grid md:grid-cols-2 gap-5">
        {renderPanel(leftLang, setLeftLangId)}
        {renderPanel(rightLang, setRightLangId)}
      </div>

      {/* Key Takeaway */}
      <div className="cq-panel rounded-xl p-4 flex items-start gap-3 border-purple-500/30">
        <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-200 leading-relaxed">
          <strong className="text-purple-300">Key Comparison Takeaway: </strong>
          {concept.keyTakeaway}
        </div>
      </div>
    </div>
  );
};
