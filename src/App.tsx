import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Code2,
  Globe2,
  BookCheck,
  FolderCode,
  GitBranch,
  Briefcase,
  Settings,
  Bot,
  Flame,
  Sparkles,
  X,
  Menu,
} from 'lucide-react';
import { GameProvider, useGame } from './context/GameContext';
import type { NavTab } from './types/game';
import { getRankForLevel, getXpProgressInLevel } from './data/homeworkAndProjects';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { WorldMap } from './components/WorldMap';
import { LessonIDE } from './components/LessonIDE';
import { LanguagePortal } from './components/LanguagePortal';
import { HomeworkCenter } from './components/HomeworkCenter';
import { ProjectWorkshop } from './components/ProjectWorkshop';
import { SkillTree } from './components/SkillTree';
import { CareerAndCapstone } from './components/CareerAndCapstone';
import { SettingsView } from './components/SettingsView';
import { AIMentorPanel } from './components/AIMentorPanel';

const NAV_ITEMS: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
  { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'world-map', label: 'World Map', icon: <Compass className="w-4 h-4" /> },
  { id: 'lesson', label: 'Coding IDE', icon: <Code2 className="w-4 h-4" /> },
  { id: 'language-portal', label: 'Language Portal', icon: <Globe2 className="w-4 h-4" /> },
  { id: 'homework', label: 'Homework Center', icon: <BookCheck className="w-4 h-4" /> },
  { id: 'projects', label: 'Project Workshop', icon: <FolderCode className="w-4 h-4" /> },
  { id: 'skills', label: 'Skills & Badges', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'careers', label: 'Careers & Capstone', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

const AppShell: React.FC = () => {
  const { state, activeTab, setActiveTab, toasts, dismissToast } = useGame();
  const [globalMentorOpen, setGlobalMentorOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!state.onboardingCompleted) {
    return <Onboarding />;
  }

  const xpInfo = getXpProgressInLevel(state.xp);
  const rank = getRankForLevel(state.level);

  return (
    <div className="min-h-screen flex bg-[var(--cq-bg)] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-slate-800/90 bg-[#070b17]/95 backdrop-blur-xl">
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="font-display font-extrabold text-sm tracking-wider text-white">CODE QUEST</div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase">Academy v1.0</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/15 border border-cyan-400/40 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.18)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/70 border border-transparent'
                }`}
              >
                <span className={active ? 'text-cyan-400' : 'text-slate-500'}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Hero Mini Profile Card */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{state.heroName}</div>
              <div className="text-[10px] text-purple-300 truncate">{rank}</div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/30 font-mono text-[11px] font-bold text-cyan-300">
              Lv.{state.level}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              style={{ width: `${xpInfo.pct}%` }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 shrink-0 border-b border-slate-800/80 bg-[#070b17]/85 backdrop-blur-md px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-mono text-slate-400 hidden sm:block">
              {NAV_ITEMS.find((i) => i.id === activeTab)?.label}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-orange-300">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> {state.streakDays}d
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {state.xp} XP
            </div>
            {activeTab !== 'lesson' && (
              <button
                onClick={() => setGlobalMentorOpen((o) => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/25 hover:bg-purple-600/40 border border-purple-400/40 text-purple-200 text-xs font-bold transition"
              >
                <Bot className="w-4 h-4" /> ARIA Mentor
              </button>
            )}
          </div>
        </header>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#090f20] p-3 grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                  activeTab === item.id ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 bg-slate-900/60'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Active Page View */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'world-map' && <WorldMap />}
          {activeTab === 'lesson' && <LessonIDE />}
          {activeTab === 'language-portal' && <LanguagePortal />}
          {activeTab === 'homework' && <HomeworkCenter />}
          {activeTab === 'projects' && <ProjectWorkshop />}
          {activeTab === 'skills' && <SkillTree />}
          {activeTab === 'careers' && <CareerAndCapstone />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Slide-over AI Mentor Drawer */}
      {globalMentorOpen && activeTab !== 'lesson' && (
        <div className="fixed inset-y-0 right-0 w-full max-w-sm z-50 shadow-2xl animate-slide-in">
          <AIMentorPanel onClose={() => setGlobalMentorOpen(false)} />
        </div>
      )}

      {/* Achievement / Level-Up Toast Stack */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-xs w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto cq-panel cq-glow-border rounded-xl p-3.5 flex items-start gap-3 animate-slide-in border-cyan-400/50"
          >
            <div className="text-xl shrink-0">{t.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white">{t.title}</div>
              {t.subtitle && <div className="text-[11px] text-slate-300 mt-0.5">{t.subtitle}</div>}
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <AppShell />
    </GameProvider>
  );
}

export default App;
