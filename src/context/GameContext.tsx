import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type {
  NavTab,
  PlayerState,
  RegionStatus,
  ThemeId,
  UserProject,
} from '../types/game';
import {
  ACHIEVEMENTS,
  DEFAULT_STARTER_PROJECT,
  INITIAL_SKILLS,
  THEMES,
  getLevelFromXp,
} from '../data/homeworkAndProjects';
import { getLessonsForRegion, LESSONS, REGIONS } from '../data/curriculum';
import { warmupPythonRuntime } from '../engine/executor';

const STORAGE_KEY = 'code_quest_player_state_v1';

export interface ToastNotice {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  tone?: 'cyan' | 'purple' | 'emerald' | 'amber';
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function createDefaultState(): PlayerState {
  return {
    heroName: 'Apprentice',
    avatarClass: 'Cyber Mage',
    onboardingCompleted: false,
    xp: 0,
    level: 1,
    streakDays: 1,
    lastActiveDate: getTodayStr(),
    completedLessons: [],
    lessonAttempts: {},
    savedCode: {},
    completedHomework: [],
    homeworkCode: {},
    completedCareerMissions: [],
    selectedCareerId: null,
    projects: [DEFAULT_STARTER_PROJECT],
    capstoneSubmitted: false,
    capstoneDesignNotes: '',
    skills: structuredClone(INITIAL_SKILLS),
    unlockedAchievements: [],
    unlockedThemes: ['cyber-neon'],
    activeTheme: 'cyber-neon',
    dailyQuests: [
      { id: 'dq-run', title: 'Run code 3 times in the IDE', target: 3, progress: 0, xpReward: 50, claimed: false },
      { id: 'dq-lesson', title: 'Complete 1 coding mission', target: 1, progress: 0, xpReward: 80, claimed: false },
      { id: 'dq-mentor', title: 'Ask ARIA (AI Mentor) for guidance', target: 1, progress: 0, xpReward: 40, claimed: false },
    ],
    explorerMode: false,
    totalRuns: 0,
    bugsFixed: 0,
  };
}

interface GameContextValue {
  state: PlayerState;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  activeLessonId: string;
  openLesson: (lessonId: string) => void;
  toasts: ToastNotice[];
  dismissToast: (id: string) => void;
  pushToast: (toast: Omit<ToastNotice, 'id'>) => void;
  getRegionStatus: (regionId: string) => RegionStatus;
  completeOnboarding: (heroName: string, avatarClass: PlayerState['avatarClass']) => void;
  recordCodeRun: (lessonId: string, skillId: string, hadError: boolean) => void;
  completeLesson: (lessonId: string, code: string) => void;
  saveLessonCode: (lessonId: string, code: string) => void;
  completeHomework: (hwId: string, code: string, xpReward: number) => void;
  saveHomeworkCode: (hwId: string, code: string) => void;
  completeCareerMission: (careerId: string, xpReward: number) => void;
  selectCareer: (careerId: string) => void;
  upsertProject: (project: UserProject) => void;
  submitCapstone: (project: UserProject, designNotes: string) => void;
  recordMentorUsed: () => void;
  recordPortalUsed: () => void;
  claimDailyQuest: (questId: string) => void;
  setTheme: (theme: ThemeId) => void;
  toggleExplorerMode: () => void;
  resetProgress: () => void;
  replayOnboarding: () => void;
  backendSynced: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlayerState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlayerState>;
        return {
          ...createDefaultState(),
          ...parsed,
          skills: { ...structuredClone(INITIAL_SKILLS), ...(parsed.skills || {}) },
        };
      }
    } catch {
      // ignore corrupted storage
    }
    return createDefaultState();
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string>('bv-1-hello-beacon');
  const [toasts, setToasts] = useState<ToastNotice[]>([]);
  const [backendSynced, setBackendSynced] = useState(false);
  const hydratedRef = useRef(false);

  const pushToast = useCallback((toast: Omit<ToastNotice, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4600);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Warm up Python Pyodide Web Worker in the background
  useEffect(() => {
    warmupPythonRuntime();
  }, []);

  // Load persisted SQLite state from backend on first mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/state')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { state?: Partial<PlayerState> | null } | null) => {
        if (cancelled) return;
        setBackendSynced(true);
        if (data?.state) {
          setState((local) => {
            // Pick whichever state has more progress (XP or onboarding completed)
            const remoteXp = data.state?.xp || 0;
            if (remoteXp > local.xp || (data.state?.onboardingCompleted && !local.onboardingCompleted)) {
              return {
                ...createDefaultState(),
                ...data.state,
                skills: { ...structuredClone(INITIAL_SKILLS), ...(data.state?.skills || {}) },
              };
            }
            return local;
          });
        }
        hydratedRef.current = true;
      })
      .catch(() => {
        hydratedRef.current = true;
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply active theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.activeTheme);
  }, [state.activeTheme]);

  // Persist to localStorage and SQLite backend
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
    if (!hydratedRef.current) return;
    const timer = window.setTimeout(() => {
      fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      })
        .then(() => setBackendSynced(true))
        .catch(() => {});
    }, 450);
    return () => window.clearTimeout(timer);
  }, [state]);

  const applyXpAndUnlocks = useCallback(
    (prev: PlayerState, xpGain: number, achievementIds: string[] = []): PlayerState => {
      let bonusXp = 0;
      const newUnlocked = [...prev.unlockedAchievements];
      for (const achId of achievementIds) {
        if (!newUnlocked.includes(achId)) {
          const ach = ACHIEVEMENTS.find((a) => a.id === achId);
          if (ach) {
            newUnlocked.push(achId);
            bonusXp += ach.xpBonus;
            pushToast({
              title: `Achievement Unlocked: ${ach.title}`,
              subtitle: `+${ach.xpBonus} Bonus XP — ${ach.description}`,
              icon: ach.icon,
              tone: 'amber',
            });
          }
        }
      }

      const nextXp = prev.xp + xpGain + bonusXp;
      const nextLevel = getLevelFromXp(nextXp);
      const nextThemes = [...prev.unlockedThemes];

      if (nextLevel > prev.level) {
        pushToast({
          title: `LEVEL UP! You reached Level ${nextLevel}`,
          subtitle: 'New skills & themes unlocked!',
          icon: '✨',
          tone: 'purple',
        });
      }

      for (const t of THEMES) {
        if (nextLevel >= t.unlockLevel && !nextThemes.includes(t.id)) {
          nextThemes.push(t.id);
        }
      }

      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        unlockedAchievements: newUnlocked,
        unlockedThemes: nextThemes,
        lastActiveDate: getTodayStr(),
      };
    },
    [pushToast]
  );

  const getRegionStatus = useCallback(
    (regionId: string): RegionStatus => {
      const region = REGIONS.find((r) => r.id === regionId);
      if (!region) return 'locked';
      const lessons = getLessonsForRegion(regionId);
      const completedCount = lessons.filter((l) => state.completedLessons.includes(l.id)).length;

      if (lessons.length > 0 && completedCount === lessons.length) {
        const avgMastery =
          lessons.reduce((acc, l) => acc + (state.skills[l.skillId]?.mastery || 75), 0) / lessons.length;
        return avgMastery >= 85 ? 'mastered' : 'completed';
      }

      if (!region.requiredRegionId || state.explorerMode) {
        return 'available';
      }

      const reqLessons = getLessonsForRegion(region.requiredRegionId);
      const reqDone = reqLessons.filter((l) => state.completedLessons.includes(l.id)).length;
      if (reqLessons.length > 0 && reqDone === reqLessons.length) {
        return 'available';
      }

      return 'locked';
    },
    [state.completedLessons, state.explorerMode, state.skills]
  );

  const openLesson = useCallback((lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveTab('lesson');
  }, []);

  const completeOnboarding = useCallback(
    (heroName: string, avatarClass: PlayerState['avatarClass']) => {
      setState((prev) => {
        const updated = {
          ...prev,
          heroName: heroName.trim() || 'Apprentice',
          avatarClass,
          onboardingCompleted: true,
        };
        return applyXpAndUnlocks(updated, 50, ['first-spark']);
      });
      setActiveTab('world-map');
    },
    [applyXpAndUnlocks]
  );

  const recordCodeRun = useCallback((lessonId: string, skillId: string, hadError: boolean) => {
    setState((prev) => {
      const skill = prev.skills[skillId] || {
        skillId,
        name: skillId,
        category: 'Core',
        mastery: 0,
        attempts: 0,
        errors: 0,
      };
      const nextErrors = skill.errors + (hadError ? 1 : 0);
      const nextAttempts = skill.attempts + 1;
      const needsReview = nextErrors >= 2 && skill.mastery < 70;

      const updatedQuests = prev.dailyQuests.map((q) =>
        q.id === 'dq-run' ? { ...q, progress: Math.min(q.target, q.progress + 1) } : q
      );

      return {
        ...prev,
        totalRuns: prev.totalRuns + 1,
        lessonAttempts: {
          ...prev.lessonAttempts,
          [lessonId]: (prev.lessonAttempts[lessonId] || 0) + 1,
        },
        dailyQuests: updatedQuests,
        skills: {
          ...prev.skills,
          [skillId]: {
            ...skill,
            attempts: nextAttempts,
            errors: nextErrors,
            needsReview,
            lastPracticedAt: new Date().toISOString(),
          },
        },
      };
    });
  }, []);

  const completeLesson = useCallback(
    (lessonId: string, code: string) => {
      const lesson = LESSONS.find((l) => l.id === lessonId);
      if (!lesson) return;

      setState((prev) => {
        const alreadyDone = prev.completedLessons.includes(lessonId);
        const nextCompleted = alreadyDone ? prev.completedLessons : [...prev.completedLessons, lessonId];
        const prevAttempts = prev.lessonAttempts[lessonId] || 1;
        const hadErrorsBefore = (prev.skills[lesson.skillId]?.errors || 0) > 0;

        const skill = prev.skills[lesson.skillId] || {
          skillId: lesson.skillId,
          name: lesson.concept,
          category: 'Core',
          mastery: 0,
          attempts: 1,
          errors: 0,
        };

        const masteryBoost = prevAttempts <= 2 ? 45 : 30;
        const nextMastery = Math.min(100, Math.max(skill.mastery + masteryBoost, 75));

        const achievementsToCheck: string[] = ['first-quest'];
        if (hadErrorsBefore || prevAttempts > 1) achievementsToCheck.push('bug-squasher');

        const bvDone = getLessonsForRegion('binary-valley').every((l) => nextCompleted.includes(l.id));
        if (bvDone) achievementsToCheck.push('binary-master');

        const lfDone = getLessonsForRegion('logic-forest').every((l) => nextCompleted.includes(l.id));
        if (lfDone) achievementsToCheck.push('logic-master');

        const updatedQuests = prev.dailyQuests.map((q) =>
          q.id === 'dq-lesson' ? { ...q, progress: Math.min(q.target, q.progress + 1) } : q
        );

        const nextState: PlayerState = {
          ...prev,
          completedLessons: nextCompleted,
          savedCode: { ...prev.savedCode, [lessonId]: code },
          bugsFixed: prev.bugsFixed + (hadErrorsBefore ? 1 : 0),
          dailyQuests: updatedQuests,
          skills: {
            ...prev.skills,
            [lesson.skillId]: {
              ...skill,
              mastery: nextMastery,
              needsReview: false,
              lastPracticedAt: new Date().toISOString(),
            },
          },
        };

        const xpToAward = alreadyDone ? 15 : lesson.xpReward;
        pushToast({
          title: alreadyDone ? 'Practice Completed!' : `Mission Complete: ${lesson.title}`,
          subtitle: `+${xpToAward} XP earned`,
          icon: '🎯',
          tone: 'emerald',
        });

        return applyXpAndUnlocks(nextState, xpToAward, achievementsToCheck);
      });
    },
    [applyXpAndUnlocks, pushToast]
  );

  const saveLessonCode = useCallback((lessonId: string, code: string) => {
    setState((prev) => ({
      ...prev,
      savedCode: { ...prev.savedCode, [lessonId]: code },
    }));
  }, []);

  const completeHomework = useCallback(
    (hwId: string, code: string, xpReward: number) => {
      setState((prev) => {
        const alreadyDone = prev.completedHomework.includes(hwId);
        const nextHw = alreadyDone ? prev.completedHomework : [...prev.completedHomework, hwId];
        const xpGain = alreadyDone ? 25 : xpReward;
        pushToast({
          title: 'Homework Verified & Submitted!',
          subtitle: `+${xpGain} XP earned`,
          icon: '📚',
          tone: 'emerald',
        });
        return applyXpAndUnlocks(
          {
            ...prev,
            completedHomework: nextHw,
            homeworkCode: { ...prev.homeworkCode, [hwId]: code },
          },
          xpGain,
          ['homework-hero']
        );
      });
    },
    [applyXpAndUnlocks, pushToast]
  );

  const saveHomeworkCode = useCallback((hwId: string, code: string) => {
    setState((prev) => ({
      ...prev,
      homeworkCode: { ...prev.homeworkCode, [hwId]: code },
    }));
  }, []);

  const completeCareerMission = useCallback(
    (careerId: string, xpReward: number) => {
      setState((prev) => {
        const already = prev.completedCareerMissions.includes(careerId);
        const nextList = already ? prev.completedCareerMissions : [...prev.completedCareerMissions, careerId];
        const xpGain = already ? 25 : xpReward;
        pushToast({
          title: 'Career Mission Cleared!',
          subtitle: `+${xpGain} XP earned`,
          icon: '🚀',
          tone: 'cyan',
        });
        return applyXpAndUnlocks({ ...prev, completedCareerMissions: nextList }, xpGain);
      });
    },
    [applyXpAndUnlocks, pushToast]
  );

  const selectCareer = useCallback((careerId: string) => {
    setState((prev) => ({ ...prev, selectedCareerId: careerId }));
  }, []);

  const upsertProject = useCallback(
    (project: UserProject) => {
      setState((prev) => {
        const exists = prev.projects.some((p) => p.id === project.id);
        const projects = exists
          ? prev.projects.map((p) => (p.id === project.id ? project : p))
          : [project, ...prev.projects];
        const wasSubmitted = prev.projects.find((p) => p.id === project.id)?.submitted;
        if (project.submitted && !wasSubmitted) {
          pushToast({
            title: `Project Published: ${project.title}`,
            subtitle: '+150 XP & Added to Developer Portfolio!',
            icon: '🚀',
            tone: 'emerald',
          });
          return applyXpAndUnlocks({ ...prev, projects }, 150, ['project-builder']);
        }
        return { ...prev, projects };
      });
    },
    [applyXpAndUnlocks, pushToast]
  );

  const submitCapstone = useCallback(
    (project: UserProject, designNotes: string) => {
      setState((prev) => {
        const exists = prev.projects.some((p) => p.id === project.id);
        const projects = exists
          ? prev.projects.map((p) => (p.id === project.id ? project : p))
          : [project, ...prev.projects];
        pushToast({
          title: 'CAPSTONE GRADUATION COMPLETE!',
          subtitle: 'Your Personalized Developer Report is ready!',
          icon: '🎓',
          tone: 'purple',
        });
        return applyXpAndUnlocks(
          {
            ...prev,
            projects,
            capstoneSubmitted: true,
            capstoneDesignNotes: designNotes,
          },
          400,
          ['graduate']
        );
      });
    },
    [applyXpAndUnlocks, pushToast]
  );

  const recordMentorUsed = useCallback(() => {
    setState((prev) => ({
      ...prev,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === 'dq-mentor' ? { ...q, progress: Math.min(q.target, q.progress + 1) } : q
      ),
    }));
  }, []);

  const recordPortalUsed = useCallback(() => {
    setState((prev) => applyXpAndUnlocks(prev, 0, ['polyglot']));
  }, [applyXpAndUnlocks]);

  const claimDailyQuest = useCallback(
    (questId: string) => {
      setState((prev) => {
        const target = prev.dailyQuests.find((q) => q.id === questId);
        if (!target || target.claimed || target.progress < target.target) return prev;
        pushToast({
          title: `Daily Quest Claimed!`,
          subtitle: `+${target.xpReward} XP`,
          icon: '🎁',
          tone: 'cyan',
        });
        return applyXpAndUnlocks(
          {
            ...prev,
            dailyQuests: prev.dailyQuests.map((q) => (q.id === questId ? { ...q, claimed: true } : q)),
          },
          target.xpReward
        );
      });
    },
    [applyXpAndUnlocks, pushToast]
  );

  const setTheme = useCallback((theme: ThemeId) => {
    setState((prev) => ({ ...prev, activeTheme: theme }));
  }, []);

  const toggleExplorerMode = useCallback(() => {
    setState((prev) => ({ ...prev, explorerMode: !prev.explorerMode }));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = createDefaultState();
    setState(fresh);
    localStorage.removeItem(STORAGE_KEY);
    setActiveTab('dashboard');
  }, []);

  const replayOnboarding = useCallback(() => {
    setState((prev) => ({ ...prev, onboardingCompleted: false }));
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        activeLessonId,
        openLesson,
        toasts,
        dismissToast,
        pushToast,
        getRegionStatus,
        completeOnboarding,
        recordCodeRun,
        completeLesson,
        saveLessonCode,
        completeHomework,
        saveHomeworkCode,
        completeCareerMission,
        selectCareer,
        upsertProject,
        submitCapstone,
        recordMentorUsed,
        recordPortalUsed,
        claimDailyQuest,
        setTheme,
        toggleExplorerMode,
        resetProgress,
        replayOnboarding,
        backendSynced,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
