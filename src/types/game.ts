export type CodeLanguage = 'python' | 'javascript' | 'html';

export type RegionStatus = 'locked' | 'available' | 'completed' | 'mastered';

export type RankTitle =
  | 'Code Apprentice'
  | 'Junior Developer'
  | 'Software Engineer'
  | 'Senior Developer'
  | 'Full-Stack Architect'
  | 'Master Programmer';

export type ThemeId = 'cyber-neon' | 'emerald-matrix' | 'solar-flare' | 'abyssal-void';

export type NavTab =
  | 'dashboard'
  | 'world-map'
  | 'lesson'
  | 'language-portal'
  | 'homework'
  | 'projects'
  | 'skills'
  | 'careers'
  | 'settings';

export type MentorMode =
  | 'explain'
  | 'hint'
  | 'debug'
  | 'review'
  | 'step-by-step'
  | 'challenge';

export interface LessonTestCase {
  id: string;
  description: string;
  hidden?: boolean;
  /** Python/JS snippet appended after user code, or HTML checks */
  testCode: string;
  mockInputs?: string[];
}

export interface Lesson {
  id: string;
  regionId: string;
  order: number;
  title: string;
  subtitle: string;
  concept: string;
  skillId: string;
  language: CodeLanguage;
  xpReward: number;
  estimatedMinutes: number;
  story: string;
  explanation: string[];
  analogy?: string;
  task: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  conceptLearned: string;
  interactiveWidget?: 'binary-explorer' | 'pixel-mixer' | 'git-sim';
  tests: LessonTestCase[];
}

export interface Region {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  description: string;
  topics: string[];
  accentColor: string;
  /** Normalized map coordinates (0-1000 x 0-560) */
  mapX: number;
  mapY: number;
  requiredRegionId?: string;
}

export interface HomeworkAssignment {
  id: string;
  title: string;
  afterConcept: string;
  requiredLessonId?: string;
  language: CodeLanguage;
  xpReward: number;
  description: string;
  requirements: string[];
  starterCode: string;
  tests: LessonTestCase[];
}

export interface UserProject {
  id: string;
  title: string;
  description: string;
  language: CodeLanguage;
  code: string;
  milestones: Array<{ id: string; text: string; done: boolean }>;
  designNotes?: string;
  submitted: boolean;
  reviewFeedback?: string;
  isCapstone?: boolean;
  updatedAt: string;
}

export interface CareerPath {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  accent: string;
  skills: string[];
  capstoneIdea: string;
  starterMission: {
    title: string;
    language: CodeLanguage;
    task: string;
    starterCode: string;
    tests: LessonTestCase[];
    xpReward: number;
  };
}

export interface SkillProgress {
  skillId: string;
  name: string;
  category: string;
  mastery: number; // 0 - 100
  attempts: number;
  errors: number;
  lastPracticedAt?: string;
  needsReview?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  target: number;
  progress: number;
  xpReward: number;
  claimed: boolean;
}

export interface PlayerState {
  heroName: string;
  avatarClass: 'Cyber Mage' | 'Code Ranger' | 'Data Knight' | 'System Architect';
  onboardingCompleted: boolean;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[];
  lessonAttempts: Record<string, number>;
  savedCode: Record<string, string>;
  completedHomework: string[];
  homeworkCode: Record<string, string>;
  completedCareerMissions: string[];
  selectedCareerId: string | null;
  projects: UserProject[];
  capstoneSubmitted: boolean;
  capstoneDesignNotes: string;
  skills: Record<string, SkillProgress>;
  unlockedAchievements: string[];
  unlockedThemes: ThemeId[];
  activeTheme: ThemeId;
  dailyQuests: DailyQuest[];
  explorerMode: boolean; // Allows previewing locked regions if user toggles it in settings
  totalRuns: number;
  bugsFixed: number;
}

export interface TestRunResult {
  id: string;
  description: string;
  hidden?: boolean;
  passed: boolean;
  error?: string;
}

export interface ExecutionResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  friendlyError?: string;
  errorLine?: number;
  testResults?: TestRunResult[];
  allTestsPassed?: boolean;
  executionMs: number;
}

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: MentorMode;
  provider?: 'openai' | 'gemini' | 'offline';
  timestamp: number;
}
