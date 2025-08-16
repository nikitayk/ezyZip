// Gamification System Types for ZeroTrace
// Privacy-first design with local-only storage

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'problems' | 'sessions' | 'special';
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastSolvedDate: string; // ISO date string
  totalSolved: number;
  consecutiveDays: number;
}

export interface ProblemSession {
  id: string;
  problemId: string;
  problemTitle: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  language: string;
  solvedAt: Date;
  timeSpent: number; // milliseconds
  phase: number; // which pipeline phase succeeded
  testResults: {
    passed: number;
    total: number;
    successRate: number;
  };
  complexity: {
    time: string;
    space: string;
  };
}

export interface ProgressStats {
  totalProblems: number;
  problemsByDifficulty: Record<string, number>;
  problemsByLanguage: Record<string, number>;
  averageTimeSpent: number;
  successRate: number;
  favoriteTopics: string[];
  weeklyActivity: Array<{
    date: string;
    problemsSolved: number;
    timeSpent: number;
  }>;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number; // minutes
  problemCount: number;
  startTime?: Date;
  endTime?: Date;
  status: 'upcoming' | 'active' | 'completed' | 'failed';
  participants: ChallengeParticipant[];
  leaderboard: ChallengeLeaderboardEntry[];
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  problemsSolved: number;
  timeSpent: number;
  score: number;
  rank: number;
}

export interface ChallengeLeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  problemsSolved: number;
  timeSpent: number;
  completedAt?: Date;
}

export interface PrivacySettings {
  pinHash: string; // SHA-256 hash of user PIN
  lockoutAttempts: number;
  lastLockoutTime?: Date;
  autoLockTimeout: number; // minutes
  enableAnalytics: boolean;
  enableProgressSharing: boolean;
  outboundRequestsLog: OutboundRequest[];
}

export interface OutboundRequest {
  id: string;
  timestamp: Date;
  method: string;
  url: string;
  bodyHash: string; // SHA-256 hash of request body
  userInitiated: boolean;
  purpose: string;
}

export interface GamificationState {
  achievements: Achievement[];
  streak: Streak;
  problemSessions: ProblemSession[];
  progressStats: ProgressStats;
  challenges: Challenge[];
  privacySettings: PrivacySettings;
  totalPoints: number;
  level: number;
  experience: number;
}

export interface AchievementUnlockEvent {
  achievement: Achievement;
  unlockedAt: Date;
  pointsEarned: number;
  newLevel?: number;
}

export interface StreakUpdateEvent {
  oldStreak: number;
  newStreak: number;
  longestStreak: number;
  achievementUnlocked?: Achievement;
}

export interface PrivacyMode {
  type: 'local' | 'user-api';
  description: string;
  icon: string;
  color: string;
  guarantees: string[];
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export interface OnboardingFlow {
  steps: OnboardingStep[];
  currentStep: number;
  completed: boolean;
  privacyGuarantees: string[];
}
