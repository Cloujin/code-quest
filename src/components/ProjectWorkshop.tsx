import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  FolderCode,
  Plus,
  Play,
  CheckCircle2,
  Rocket,
  Loader2,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { CodeLanguage, UserProject } from '../types/game';
import { executeCode } from '../engine/executor';

export const ProjectWorkshop: React.FC = () => {
  const { state, upsertProject } = useGame();
  const [selectedId, setSelectedId] = useState<string>(state.projects[0]?.id || '');
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLang, setNewLang] = useState<CodeLanguage>('python');
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string>('');
  const [reviewing, setReviewing] = useState(false);

  const project = state.projects.find((p) => p.id === selectedId) || state.projects[0];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const starter =
      newLang === 'python'
        ? `# ${newTitle.trim()}\nprint("Starting ${newTitle.trim()}...")\n`
        : newLang === 'javascript'
          ? `// ${newTitle.trim()}\nconsole.log("Starting ${newTitle.trim()}...");\n`
          : `<!DOCTYPE html>\n<html>\n<body style="background:#0f172a;color:#38bdf8;font-family:sans-serif;padding:24px">\n  <h1>${newTitle.trim()}</h1>\n  <p>${newDesc.trim() || 'My custom web project!'}</p>\n</body>\n</html>`;

    const created: UserProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Personal coding project built in Code Quest Workshop.',
      language: newLang,
      code: starter,
      milestones: [
        { id: 'm1', text: 'Plan the core features & write starter code', done: true },
        { id: 'm2', text: 'Run and verify output with zero errors', done: false },
        { id: 'm3', text: 'Submit for code review & publish to portfolio', done: false },
      ],
      submitted: false,
      updatedAt: new Date().toISOString(),
    };
    upsertProject(created);
    setSelectedId(created.id);
    setNewTitle('');
    setNewDesc('');
    setCreating(false);
    setOutput('');
  };

  const handleRun = async () => {
    if (!project) return;
    setRunning(true);
    const res = await executeCode(project.language, project.code);
    setRunning(false);
    setOutput(res.ok ? res.stdout || '(Ran cleanly with no console output)' : `${res.stderr}\n${res.friendlyError || ''}`);
  };

  const handleSubmitAndReview = async () => {
    if (!project) return;
    setReviewing(true);
    let feedback = 'Great initiative building your own project! Keep refining edge cases and adding modular functions.';
    try {
      const res = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'review',
          message: `Please review my personal project "${project.title}".`,
          code: project.code,
          language: project.language,
          lessonTitle: project.title,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: string };
        if (data.reply) feedback = data.reply;
      }
    } catch {
      // keep fallback feedback
    }
    setReviewing(false);
    upsertProject({
      ...project,
      submitted: true,
      reviewFeedback: feedback,
      updatedAt: new Date().toISOString(),
    });
  };

  const toggleMilestone = (mId: string) => {
    if (!project) return;
    upsertProject({
      ...project,
      milestones: project.milestones.map((m) => (m.id === mId ? { ...m, done: !m.done } : m)),
      updatedAt: new Date().toISOString(),
    });
  };

  const portfolioProjects = state.projects.filter((p) => p.submitted);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
            <FolderCode className="w-6 h-6 text-purple-400" /> Project Workshop &amp; Portfolio
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Build your own Python, JavaScript, or HTML/CSS projects, track milestones, get code reviews, and grow your portfolio!
          </p>
        </div>

        <button
          onClick={() => setCreating((c) => !c)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-lg"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="cq-panel rounded-2xl p-5 grid md:grid-cols-12 gap-3 border-cyan-400/40">
          <input
            type="text"
            required
            placeholder="Project Title (e.g. Space Quiz Game)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="md:col-span-4 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Short description..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="md:col-span-4 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
          <select
            value={newLang}
            onChange={(e) => setNewLang(e.target.value as CodeLanguage)}
            className="md:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML / CSS</option>
          </select>
          <button
            type="submit"
            className="md:col-span-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2"
          >
            Create
          </button>
        </form>
      )}

      <div className="grid lg:grid-cols-12 gap-5">
        {/* Project List */}
        <div className="lg:col-span-4 space-y-2.5">
          {state.projects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedId(p.id);
                setOutput('');
              }}
              className={`w-full text-left p-4 rounded-xl border transition ${
                project?.id === p.id
                  ? 'bg-purple-500/15 border-purple-400'
                  : 'cq-panel hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-white truncate">{p.title}</span>
                {p.submitted && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    Published
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
              <div className="text-[10px] font-mono uppercase text-cyan-400 mt-2">{p.language}</div>
            </button>
          ))}
        </div>

        {/* Project Editor */}
        {project && (
          <div className="lg:col-span-8 cq-panel rounded-2xl p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-white">{project.title}</h2>
                <p className="text-xs text-slate-400">{project.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={running}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-200 text-xs font-bold flex items-center gap-1.5"
                >
                  {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  Run Project
                </button>
                <button
                  onClick={handleSubmitAndReview}
                  disabled={reviewing}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white text-xs font-extrabold flex items-center gap-1.5"
                >
                  {reviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
                  Submit &amp; Get AI Review
                </button>
              </div>
            </div>

            {/* Milestones */}
            <div className="flex flex-wrap gap-2">
              {project.milestones.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition ${
                    m.done
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {m.done ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                  {m.text}
                </button>
              ))}
            </div>

            <div className="h-72 rounded-xl overflow-hidden border border-slate-800">
              <Editor
                height="100%"
                language={project.language}
                theme="vs-dark"
                value={project.code}
                onChange={(val) =>
                  upsertProject({ ...project, code: val ?? '', updatedAt: new Date().toISOString() })
                }
                options={{
                  fontSize: 13.5,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>

            {project.language === 'html' ? (
              <iframe
                title="Project HTML Preview"
                sandbox="allow-scripts"
                srcDoc={project.code}
                className="w-full h-44 rounded-xl border border-slate-700 bg-white"
              />
            ) : (
              output && (
                <pre className="rounded-xl bg-black/60 border border-slate-800 p-3 font-mono text-xs text-emerald-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {output}
                </pre>
              )
            )}

            {project.reviewFeedback && (
              <div className="rounded-xl bg-purple-950/30 border border-purple-500/35 p-4 space-y-1.5">
                <div className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> ARIA Code Review Feedback
                </div>
                <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{project.reviewFeedback}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Developer Portfolio Showcase */}
      <div className="cq-panel rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Published Developer Portfolio ({portfolioProjects.length})
          </h2>
        </div>
        {portfolioProjects.length === 0 ? (
          <p className="text-xs text-slate-400">
            No projects published yet. Edit a project above and click <strong>Submit &amp; Get AI Review</strong> to showcase it here!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {portfolioProjects.map((p) => (
              <div key={p.id} className="rounded-xl bg-slate-950/70 border border-emerald-500/30 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{p.title}</span>
                  <span className="text-[10px] font-mono uppercase text-cyan-300">{p.language}</span>
                </div>
                <p className="text-xs text-slate-400">{p.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
