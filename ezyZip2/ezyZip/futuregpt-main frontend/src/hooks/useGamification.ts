// ZeroTrace Gamification Hook
// Integrates gamification with the AI pipeline for automatic progress tracking

import { useState, useEffect, useCallback } from 'react';
import { gamificationStorage } from '../utils/gamificationStorage';
import type { 
  ProblemSession, 
  GamificationState, 
  AchievementUnlockEvent,
  StreakUpdateEvent 
} from '../types/gamification';

interface UseGamificationReturn {
  // State
  gamificationState: GamificationState | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  recordProblemSession: (session: Omit<ProblemSession, 'id'>) => Promise<boolean>;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  updateStreak: (solvedAt: Date) => Promise<boolean>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;
  clearData: () => Promise<boolean>;
  
  // Events
  onAchievementUnlock: (callback: (event: AchievementUnlockEvent) => void) => void;
  onStreakUpdate: (callback: (event: StreakUpdateEvent) => void);
  onLevelUp: (callback: (newLevel: number) => void) => void;
}

export function useGamification(): UseGamificationReturn {
  const [gamificationState, setGamificationState] = useState<GamificationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial gamification state
  useEffect(() => {
    const loadGamificationState = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if PIN is already verified
        const privacySettings = await gamificationStorage.getPrivacySettings();
        if (privacySettings.pinHash) {
          // PIN exists, try to load state
          try {
            const state = await gamificationStorage.getGamificationState();
            setGamificationState(state);
          } catch (pinError) {
            // PIN not verified, show setup prompt
            setError('PIN verification required. Please complete privacy setup.');
          }
        } else {
          // No PIN setup, show setup prompt
          setError('Privacy setup required. Please complete onboarding.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load gamification state');
      } finally {
        setIsLoading(false);
      }
    };

    loadGamificationState();
  }, []);

  // Record a new problem solving session
  const recordProblemSession = useCallback(async (session: Omit<ProblemSession, 'id'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await gamificationStorage.recordProblemSession(session);
      if (success) {
        // Reload state to reflect changes
        const newState = await gamificationStorage.getGamificationState();
        setGamificationState(newState);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to record problem session');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Manually unlock an achievement
  const unlockAchievement = useCallback(async (achievementId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!gamificationState) return false;
      
      const achievement = gamificationState.achievements.find(a => a.id === achievementId);
      if (!achievement) return false;
      
      achievement.unlockedAt = new Date();
      achievement.progress = achievement.maxProgress;
      
      const updatedState = {
        ...gamificationState,
        totalPoints: gamificationState.totalPoints + achievement.points
      };
      
      const success = await gamificationStorage.updateGamificationState(updatedState);
      if (success) {
        setGamificationState(updatedState);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to unlock achievement');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [gamificationState]);

  // Update streak manually
  const updateStreak = useCallback(async (solvedAt: Date): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!gamificationState) return false;
      
      // This would typically be handled automatically by recordProblemSession
      // But we provide this for manual updates if needed
      const today = new Date().toISOString().split('T')[0];
      const solvedDate = solvedAt.toISOString().split('T')[0];
      
      if (solvedDate === today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = gamificationState.streak.currentStreak;
        if (gamificationState.streak.lastSolvedDate === yesterdayStr) {
          newStreak++;
        } else if (gamificationState.streak.lastSolvedDate !== today) {
          newStreak = 1;
        }
        
        const updatedState = {
          ...gamificationState,
          streak: {
            ...gamificationState.streak,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, gamificationState.streak.longestStreak),
            lastSolvedDate: today,
            totalSolved: gamificationState.streak.totalSolved + 1
          }
        };
        
        const success = await gamificationStorage.updateGamificationState(updatedState);
        if (success) {
          setGamificationState(updatedState);
          return true;
        }
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to update streak');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [gamificationState]);

  // Export gamification data
  const exportData = useCallback(async (): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await gamificationStorage.exportData();
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to export data');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Import gamification data
  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await gamificationStorage.importData(jsonData);
      if (success) {
        // Reload state to reflect imported data
        const newState = await gamificationStorage.getGamificationState();
        setGamificationState(newState);
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to import data');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear all gamification data
  const clearData = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await gamificationStorage.clearAllData();
      if (success) {
        setGamificationState(null);
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to clear data');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Event handlers
  const onAchievementUnlock = useCallback((callback: (event: AchievementUnlockEvent) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('achievementUnlock', handler as EventListener);
    return () => window.removeEventListener('achievementUnlock', handler as EventListener);
  }, []);

  const onStreakUpdate = useCallback((callback: (event: StreakUpdateEvent) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('streakUpdate', handler as EventListener);
    return () => window.removeEventListener('streakUpdate', handler as EventListener);
  }, []);

  const onLevelUp = useCallback((callback: (newLevel: number) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail.newLevel);
    window.addEventListener('levelUp', handler as EventListener);
    return () => window.removeEventListener('levelUp', handler as EventListener);
  }, []);

  // Auto-record problem sessions from AI pipeline
  const autoRecordFromPipeline = useCallback(async (pipelineResult: any) => {
    if (!gamificationState || !pipelineResult.success) return;
    
    try {
      // Extract session information from pipeline result
      const session: Omit<ProblemSession, 'id'> = {
        problemId: `problem_${Date.now()}`,
        problemTitle: pipelineResult.problemDescription || 'DSA Problem',
        difficulty: 'medium', // Default, could be enhanced with AI analysis
        language: pipelineResult.language || 'cpp',
        solvedAt: new Date(),
        timeSpent: pipelineResult.totalExecutionTime || 0,
        phase: pipelineResult.finalPhase || 1,
        testResults: {
          passed: pipelineResult.finalSolution?.testResults?.passedTests?.length || 0,
          total: pipelineResult.finalSolution?.testResults?.totalTests || 0,
          successRate: pipelineResult.finalSolution?.testResults?.successRate || 0
        },
        complexity: {
          time: pipelineResult.finalSolution?.timeComplexity || 'O(n)',
          space: pipelineResult.finalSolution?.spaceComplexity || 'O(1)'
        }
      };
      
      await recordProblemSession(session);
    } catch (error) {
      console.warn('Failed to auto-record problem session:', error);
    }
  }, [gamificationState, recordProblemSession]);

  // Expose auto-record function for pipeline integration
  useEffect(() => {
    // Make auto-record function available globally for pipeline integration
    (window as any).zerotraceAutoRecord = autoRecordFromPipeline;
    
    return () => {
      delete (window as any).zerotraceAutoRecord;
    };
  }, [autoRecordFromPipeline]);

  return {
    // State
    gamificationState,
    isLoading,
    error,
    
    // Actions
    recordProblemSession,
    unlockAchievement,
    updateStreak,
    exportData,
    importData,
    clearData,
    
    // Events
    onAchievementUnlock,
    onStreakUpdate,
    onLevelUp
  };
}

// Export for use in other components
export default useGamification;
