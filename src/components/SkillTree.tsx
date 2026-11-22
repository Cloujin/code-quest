import React from 'react';
import { GitBranch, Trophy, AlertCircle, Sparkles, Lock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../data/homeworkAndProjects';
import { LESSONS } from '../data/curriculum';

export const SkillTree: React.FC = () => {
  const { state, openLesson } = useGame();
  const skills = Object.values(state.skills);
  const weakSkills = skills.filter((s) => s.needsReview || (s.errors >= 2 && s.mastery < 75));

  const findPracticeLesson = (skillId: string) => {
    const match = LESSONS.find((l) => l.skillId === skillId);
    if (match) openLesson(match.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5">
          <GitBranch className="w-6 h-6 text-cyan-400" /> Skill Tree &amp; Achievements
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Adaptive mastery ratings track your real coding performance and highlight topics ready for spaced repetition.
        </p>
      </div>

      {/* Adaptive Learning Recommendations */}
      {weakSkills.length > 0 && (
        <div className="rounded-2xl bg-amber-950/25 border border-amber-500/40 p-4 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <AlertCircle className="w-4 h-4" /> Adaptive Tutor: Recommended Review
          </div>
          <p className="text-xs text-amber-100/80">
            You hit a few tricky errors in these concepts — revisiting them now strengthens long-term memory!
          </p>
          <div className="flex flex-wrap gap-2">
            {weakSkills.map((s) => (
              <button
                key={s.skillId}
                onClick={() => findPracticeLesson(s.skillId)}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-semibold transition"
              >
                Practice {s.name} ({s.mastery}% mastery) →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skill Mastery Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const mastered = skill.mastery >= 80;
          return (
            <div
              key={skill.skillId}
              className={`cq-panel rounded-2xl p-4 space-y-3 border transition ${
                mastered ? 'border-emerald-500/40' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400">{skill.category}</span>
                  <h3 className="text-sm font-bold text-white">{skill.name}</h3>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                    mastered
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : skill.mastery > 0
                        ? 'bg-cyan-500/15 text-cyan-300'
                        : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {skill.mastery}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-900 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    mastered
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                      : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                  }`}
                  style={{ width: `${skill.mastery}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Runs: {skill.attempts}</span>
                <button
                  onClick={() => findPracticeLesson(skill.skillId)}
                  className="text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Train
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="space-y-3 pt-2">
        <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Achievements ({state.unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = state.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-2xl p-4 border flex items-start gap-3 transition ${
                  unlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-purple-500/10 border-amber-400/40'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="text-2xl shrink-0">{unlocked ? ach.icon : <Lock className="w-5 h-5 text-slate-600 mt-1" />}</div>
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-white">{ach.title}</div>
                  <p className="text-xs text-slate-400">{ach.description}</p>
                  <div className="text-[11px] font-mono text-amber-300 pt-1">+{ach.xpBonus} XP Bonus</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
