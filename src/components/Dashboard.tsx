import React from 'react';
import {
  Compass,
  Play,
  Flame,
  Trophy,
  BookCheck,
  Globe2,
  FolderCode,
  Gift,
  Sparkles,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { LESSONS, REGIONS } from '../data/curriculum';
import { getRankForLevel, getXpProgressInLevel } from '../data/homeworkAndProjects';

export const Dashboard: React.FC = () => {
  const { state, openLesson, setActiveTab, claimDailyQuest } = useGame();
  const xpInfo = getXpProgressInLevel(state.xp);
  const rank = getRankForLevel(state.level);

  const nextLesson = LESSONS.find((l) => !state.completedLessons.includes(l.id)) || LESSONS[0];
  const nextRegion = REGIONS.find((r) => r.id === nextLesson.regionId);
  const completionPct = Math.round((state.completedLessons.length / LESSONS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="cq-panel cq-glow-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" /> {rank} • {state.avatarClass}
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-cyan-400">{state.heroName}</span>!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Your next mission awaits in <strong className="text-purple-300">{nextRegion?.name}</strong>:{' '}
              <strong className="text-white">{nextLesson.title}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openLesson(nextLesson.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg transition"
            >
              <Play className="w-4 h-4 fill-current" /> Continue Quest
            </button>
            <button
              onClick={() => setActiveTab('world-map')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              <Compass className="w-4 h-4 text-cyan-400" /> Open World Map
            </button>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-300 font-bold">Level {state.level}</span>
            <span className="text-slate-400">
              {xpInfo.current} / {xpInfo.needed} XP to Level {state.level + 1} (Total: {state.xp} XP)
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${xpInfo.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Campaign Progress',
            value: `${state.completedLessons.length}/${LESSONS.length}`,
            sub: `${completionPct}% of core quests`,
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          },
          {
            label: 'Learning Streak',
            value: `${state.streakDays} Day${state.streakDays === 1 ? '' : 's'}`,
            sub: `${state.totalRuns} total code runs`,
            icon: <Flame className="w-5 h-5 text-orange-400" />,
          },
          {
            label: 'Homework & Projects',
            value: `${state.completedHomework.length + state.projects.filter((p) => p.submitted).length}`,
            sub: `${state.completedHomework.length} homework • ${state.projects.filter((p) => p.submitted).length} published`,
            icon: <BookCheck className="w-5 h-5 text-cyan-400" />,
          },
          {
            label: 'Achievements',
            value: `${state.unlockedAchievements.length}`,
            sub: `${state.bugsFixed} bugs squashed`,
            icon: <Trophy className="w-5 h-5 text-amber-400" />,
          },
        ].map((stat) => (
          <div key={stat.label} className="cq-panel rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{stat.label}</span>
              {stat.icon}
            </div>
            <div className="font-display text-2xl font-extrabold text-white">{stat.value}</div>
            <div className="text-[11px] text-slate-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Daily Quests + Quick Launchers */}
      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 cq-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" /> Daily Quests
            </h2>
            <span className="text-xs text-slate-400">Earn bonus XP for genuine practice</span>
          </div>
          <div className="space-y-3">
            {state.dailyQuests.map((q) => {
              const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
              const ready = q.progress >= q.target && !q.claimed;
              return (
                <div
                  key={q.id}
                  className="rounded-xl bg-slate-950/70 border border-slate-800 p-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-100">{q.title}</span>
                      <span className="font-mono text-cyan-300">
                        {q.progress}/{q.target}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <button
                    disabled={!ready}
                    onClick={() => claimDailyQuest(q.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition ${
                      q.claimed
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                        : ready
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 animate-pulse'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {q.claimed ? 'Claimed ✓' : `+${q.xpReward} XP`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 cq-panel rounded-2xl p-5 space-y-3">
          <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" /> Academy Portals
          </h2>
          {[
            {
              tab: 'language-portal' as const,
              title: 'Language Portal',
              desc: 'Compare Python, JS, TS, C, C++, Java, C#, SQL, Rust & Go side by side',
              icon: <Globe2 className="w-5 h-5 text-cyan-400" />,
            },
            {
              tab: 'homework' as const,
              title: 'Homework Center',
              desc: 'Test your real understanding with independent coding assignments',
              icon: <BookCheck className="w-5 h-5 text-emerald-400" />,
            },
            {
              tab: 'projects' as const,
              title: 'Project Workshop',
              desc: 'Build custom apps & grow your published Developer Portfolio',
              icon: <FolderCode className="w-5 h-5 text-purple-400" />,
            },
          ].map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className="w-full text-left p-3.5 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">{item.icon}</div>
              <div>
                <div className="text-sm font-bold text-white">{item.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
