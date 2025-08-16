// ZeroTrace Gamification Storage Utility
// Privacy-first design with local encryption and PIN protection

import type { 
  GamificationState, 
  Achievement, 
  ProblemSession, 
  Streak, 
  PrivacySettings,
  OutboundRequest,
  Challenge 
} from '../types/gamification';

// Crypto utilities for PIN hashing and data encryption
class CryptoUtils {
  private static async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async deriveKey(pin: string, salt: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(pin + salt),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async hashPIN(pin: string): Promise<string> {
    return this.hashString(pin);
  }

  static async encryptData(data: any, pin: string): Promise<string> {
    const salt = crypto.randomUUID();
    const key = await this.deriveKey(pin, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );
    
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const encryptedHex = encryptedArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return JSON.stringify({
      encrypted: encryptedHex,
      iv: ivHex,
      salt
    });
  }

  static async decryptData(encryptedData: string, pin: string): Promise<any> {
    try {
      const { encrypted, iv, salt } = JSON.parse(encryptedData);
      const key = await this.deriveKey(pin, salt);
      
      const ivArray = new Uint8Array(iv.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      const encryptedArray = new Uint8Array(encrypted.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivArray },
        key,
        encryptedArray
      );
      
      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedBuffer);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error('Decryption failed - invalid PIN or corrupted data');
    }
  }
}

// Default gamification state
const DEFAULT_GAMIFICATION_STATE: GamificationState = {
  achievements: [
    {
      id: 'first-problem',
      title: 'First Steps',
      description: 'Solve your first DSA problem',
      icon: '🎯',
      category: 'problems',
      progress: 0,
      maxProgress: 1,
      rarity: 'common',
      points: 10
    },
    {
      id: 'streak-3',
      title: 'Getting Hot',
      description: 'Maintain a 3-day solving streak',
      icon: '🔥',
      category: 'streak',
      progress: 0,
      maxProgress: 3,
      rarity: 'common',
      points: 25
    },
    {
      id: 'streak-7',
      title: 'Week Warrior',
      description: 'Maintain a 7-day solving streak',
      icon: '⚡',
      category: 'streak',
      progress: 0,
      maxProgress: 7,
      rarity: 'rare',
      points: 50
    },
    {
      id: 'streak-30',
      title: 'Month Master',
      description: 'Maintain a 30-day solving streak',
      icon: '👑',
      category: 'streak',
      progress: 0,
      maxProgress: 30,
      rarity: 'epic',
      points: 200
    },
    {
      id: 'problems-10',
      title: 'Problem Solver',
      description: 'Solve 10 DSA problems',
      icon: '💪',
      category: 'problems',
      progress: 0,
      maxProgress: 10,
      rarity: 'common',
      points: 30
    },
    {
      id: 'problems-50',
      title: 'Algorithm Expert',
      description: 'Solve 50 DSA problems',
      icon: '🧠',
      category: 'problems',
      progress: 0,
      maxProgress: 50,
      rarity: 'rare',
      points: 100
    },
    {
      id: 'problems-100',
      title: 'DSA Master',
      description: 'Solve 100 DSA problems',
      icon: '🏆',
      category: 'problems',
      progress: 0,
      maxProgress: 100,
      rarity: 'epic',
      points: 300
    },
    {
      id: 'phase-1-solver',
      title: 'Efficient Solver',
      description: 'Solve a problem in Phase 1 of the pipeline',
      icon: '🚀',
      category: 'sessions',
      progress: 0,
      maxProgress: 1,
      rarity: 'rare',
      points: 75
    },
    {
      id: 'all-languages',
      title: 'Polyglot Programmer',
      description: 'Solve problems in 4 different programming languages',
      icon: '🌍',
      category: 'sessions',
      progress: 0,
      maxProgress: 4,
      rarity: 'epic',
      points: 150
    },
    {
      id: 'perfect-score',
      title: 'Perfect Score',
      description: 'Pass all test cases on the first try',
      icon: '⭐',
      category: 'sessions',
      progress: 0,
      maxProgress: 1,
      rarity: 'legendary',
      points: 500
    }
  ],
  streak: {
    currentStreak: 0,
    longestStreak: 0,
    lastSolvedDate: '',
    totalSolved: 0,
    consecutiveDays: 0
  },
  problemSessions: [],
  progressStats: {
    totalProblems: 0,
    problemsByDifficulty: {},
    problemsByLanguage: {},
    averageTimeSpent: 0,
    successRate: 0,
    favoriteTopics: [],
    weeklyActivity: []
  },
  challenges: [],
  privacySettings: {
    pinHash: '',
    lockoutAttempts: 0,
    lastLockoutTime: undefined,
    autoLockTimeout: 30,
    enableAnalytics: true,
    enableProgressSharing: false,
    outboundRequestsLog: []
  },
  totalPoints: 0,
  level: 1,
  experience: 0
};

// Experience calculation constants
const EXPERIENCE_PER_LEVEL = 1000;
const EXPERIENCE_MULTIPLIER = 1.2;

class GamificationStorage {
  private isInitialized = false;
  private currentPIN: string | null = null;
  private lockoutTimeout: NodeJS.Timeout | null = null;

  /**
   * Initialize the gamification storage system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check if gamification data exists
      const existing = await chrome.storage.local.get('zt:gamification');
      if (!existing['zt:gamification']) {
        // Initialize with default state
        await chrome.storage.local.set({ 'zt:gamification': DEFAULT_GAMIFICATION_STATE });
        console.log('Gamification system initialized with defaults');
      }

      // Check if privacy settings exist
      const privacy = await chrome.storage.local.get('zt:privacy-settings');
      if (!privacy['zt:privacy-settings']) {
        // Initialize privacy settings
        await chrome.storage.local.set({ 'zt:privacy-settings': DEFAULT_GAMIFICATION_STATE.privacySettings });
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize gamification storage:', error);
      throw error;
    }
  }

  /**
   * Set up PIN protection
   */
  async setupPIN(pin: string): Promise<boolean> {
    try {
      if (pin.length < 6) {
        throw new Error('PIN must be at least 6 digits');
      }

      const pinHash = await CryptoUtils.hashPIN(pin);
      const privacySettings = await this.getPrivacySettings();
      
      privacySettings.pinHash = pinHash;
      privacySettings.lockoutAttempts = 0;
      privacySettings.lastLockoutTime = undefined;
      
      await chrome.storage.local.set({ 'zt:privacy-settings': privacySettings });
      
      // Encrypt existing data with new PIN
      await this.encryptAllData(pin);
      
      return true;
    } catch (error) {
      console.error('Failed to setup PIN:', error);
      return false;
    }
  }

  /**
   * Verify PIN and unlock access
   */
  async verifyPIN(pin: string): Promise<boolean> {
    try {
      const privacySettings = await this.getPrivacySettings();
      
      // Check lockout status
      if (privacySettings.lockoutAttempts >= 5) {
        const lockoutTime = privacySettings.lastLockoutTime;
        if (lockoutTime && Date.now() - lockoutTime.getTime() < 15 * 60 * 1000) { // 15 minutes
          throw new Error('Account locked. Try again in 15 minutes.');
        } else {
          // Reset lockout after timeout
          privacySettings.lockoutAttempts = 0;
          privacySettings.lastLockoutTime = undefined;
          await chrome.storage.local.set({ 'zt:privacy-settings': privacySettings });
        }
      }

      const pinHash = await CryptoUtils.hashPIN(pin);
      if (pinHash === privacySettings.pinHash) {
        this.currentPIN = pin;
        privacySettings.lockoutAttempts = 0;
        privacySettings.lastLockoutTime = undefined;
        await chrome.storage.local.set({ 'zt:privacy-settings': privacySettings });
        return true;
      } else {
        // Increment lockout attempts
        privacySettings.lockoutAttempts++;
        privacySettings.lastLockoutTime = new Date();
        await chrome.storage.local.set({ 'zt:privacy-settings': privacySettings });
        
        if (privacySettings.lockoutAttempts >= 5) {
          throw new Error('Too many failed attempts. Account locked for 15 minutes.');
        }
        
        return false;
      }
    } catch (error) {
      console.error('PIN verification failed:', error);
      throw error;
    }
  }

  /**
   * Get current gamification state
   */
  async getGamificationState(): Promise<GamificationState> {
    if (!this.currentPIN) {
      throw new Error('PIN not verified. Please verify PIN first.');
    }

    try {
      const result = await chrome.storage.local.get('zt:gamification');
      const encryptedData = result['zt:gamification'];
      
      if (!encryptedData) {
        return DEFAULT_GAMIFICATION_STATE;
      }

      // Decrypt data
      const decryptedData = await CryptoUtils.decryptData(encryptedData, this.currentPIN);
      return { ...DEFAULT_GAMIFICATION_STATE, ...decryptedData };
    } catch (error) {
      console.error('Failed to get gamification state:', error);
      return DEFAULT_GAMIFICATION_STATE;
    }
  }

  /**
   * Update gamification state
   */
  async updateGamificationState(updates: Partial<GamificationState>): Promise<boolean> {
    if (!this.currentPIN) {
      throw new Error('PIN not verified. Please verify PIN first.');
    }

    try {
      const currentState = await this.getGamificationState();
      const newState = { ...currentState, ...updates };
      
      // Encrypt and save
      const encryptedData = await CryptoUtils.encryptData(newState, this.currentPIN);
      await chrome.storage.local.set({ 'zt:gamification': encryptedData });
      
      return true;
    } catch (error) {
      console.error('Failed to update gamification state:', error);
      return false;
    }
  }

  /**
   * Record a new problem solving session
   */
  async recordProblemSession(session: Omit<ProblemSession, 'id'>): Promise<boolean> {
    try {
      const state = await this.getGamificationState();
      
      const newSession: ProblemSession = {
        ...session,
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Update sessions
      state.problemSessions.push(newSession);
      
      // Update streak
      await this.updateStreak(newSession.solvedAt);
      
      // Update progress stats
      await this.updateProgressStats(newSession);
      
      // Check achievements
      await this.checkAchievements(newSession);
      
      // Update experience and level
      await this.updateExperience(newSession);
      
      // Save updated state
      await this.updateGamificationState(state);
      
      return true;
    } catch (error) {
      console.error('Failed to record problem session:', error);
      return false;
    }
  }

  /**
   * Update streak based on new problem session
   */
  private async updateStreak(solvedAt: Date): Promise<void> {
    const state = await this.getGamificationState();
    const today = new Date().toISOString().split('T')[0];
    const solvedDate = solvedAt.toISOString().split('T')[0];
    
    if (solvedDate === today) {
      // Same day - check if already solved today
      const todaySessions = state.problemSessions.filter(s => 
        s.solvedAt.toISOString().split('T')[0] === today
      );
      
      if (todaySessions.length === 1) { // First problem today
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (state.streak.lastSolvedDate === yesterdayStr) {
          // Consecutive day
          state.streak.currentStreak++;
          state.streak.consecutiveDays++;
        } else if (state.streak.lastSolvedDate !== today) {
          // New streak
          state.streak.currentStreak = 1;
          state.streak.consecutiveDays = 1;
        }
        
        state.streak.lastSolvedDate = today;
        state.streak.totalSolved++;
        
        if (state.streak.currentStreak > state.streak.longestStreak) {
          state.streak.longestStreak = state.streak.currentStreak;
        }
      }
    }
  }

  /**
   * Update progress statistics
   */
  private async updateProgressStats(session: ProblemSession): Promise<void> {
    const state = await this.getGamificationState();
    
    // Update difficulty counts
    state.progressStats.problemsByDifficulty[session.difficulty] = 
      (state.progressStats.problemsByDifficulty[session.difficulty] || 0) + 1;
    
    // Update language counts
    state.progressStats.problemsByLanguage[session.language] = 
      (state.progressStats.problemsByLanguage[session.language] || 0) + 1;
    
    // Update total problems
    state.progressStats.totalProblems++;
    
    // Update average time spent
    const totalTime = state.problemSessions.reduce((sum, s) => sum + s.timeSpent, 0);
    state.progressStats.averageTimeSpent = totalTime / state.progressStats.totalProblems;
    
    // Update success rate
    const totalTests = state.problemSessions.reduce((sum, s) => sum + s.testResults.total, 0);
    const passedTests = state.problemSessions.reduce((sum, s) => sum + s.testResults.passed, 0);
    state.progressStats.successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    // Update weekly activity
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    
    let weekEntry = state.progressStats.weeklyActivity.find(w => w.date === weekStartStr);
    if (!weekEntry) {
      weekEntry = { date: weekStartStr, problemsSolved: 0, timeSpent: 0 };
      state.progressStats.weeklyActivity.push(weekEntry);
    }
    
    weekEntry.problemsSolved++;
    weekEntry.timeSpent += session.timeSpent;
    
    // Keep only last 8 weeks
    if (state.progressStats.weeklyActivity.length > 8) {
      state.progressStats.weeklyActivity = state.progressStats.weeklyActivity.slice(-8);
    }
  }

  /**
   * Check and unlock achievements
   */
  private async checkAchievements(session: ProblemSession): Promise<void> {
    const state = await this.getGamificationState();
    
    for (const achievement of state.achievements) {
      if (achievement.unlockedAt) continue; // Already unlocked
      
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first-problem':
          shouldUnlock = state.progressStats.totalProblems >= 1;
          break;
        case 'streak-3':
          shouldUnlock = state.streak.currentStreak >= 3;
          break;
        case 'streak-7':
          shouldUnlock = state.streak.currentStreak >= 7;
          break;
        case 'streak-30':
          shouldUnlock = state.streak.currentStreak >= 30;
          break;
        case 'problems-10':
          shouldUnlock = state.progressStats.totalProblems >= 10;
          break;
        case 'problems-50':
          shouldUnlock = state.progressStats.totalProblems >= 50;
          break;
        case 'problems-100':
          shouldUnlock = state.progressStats.totalProblems >= 100;
          break;
        case 'phase-1-solver':
          shouldUnlock = session.phase === 1;
          break;
        case 'all-languages':
          const uniqueLanguages = new Set(state.problemSessions.map(s => s.language));
          shouldUnlock = uniqueLanguages.size >= 4;
          break;
        case 'perfect-score':
          shouldUnlock = session.testResults.passed === session.testResults.total && session.testResults.total > 0;
          break;
      }
      
      if (shouldUnlock) {
        achievement.unlockedAt = new Date();
        state.totalPoints += achievement.points;
        
        // Emit achievement unlock event
        this.emitAchievementUnlock(achievement);
      }
    }
  }

  /**
   * Update experience and level
   */
  private async updateExperience(session: ProblemSession): Promise<void> {
    const state = await this.getGamificationState();
    
    // Base experience for solving problem
    let experienceGained = 50;
    
    // Bonus for difficulty
    const difficultyBonus = { easy: 10, medium: 25, hard: 50, expert: 100 };
    experienceGained += difficultyBonus[session.difficulty] || 0;
    
    // Bonus for phase (earlier phase = more efficient = more experience)
    const phaseBonus = { 1: 100, 2: 75, 3: 50, 4: 25, 5: 10 };
    experienceGained += phaseBonus[session.phase] || 0;
    
    // Bonus for perfect score
    if (session.testResults.passed === session.testResults.total && session.testResults.total > 0) {
      experienceGained += 50;
    }
    
    state.experience += experienceGained;
    
    // Check for level up
    const currentLevel = state.level;
    const requiredExp = Math.floor(EXPERIENCE_PER_LEVEL * Math.pow(EXPERIENCE_MULTIPLIER, currentLevel - 1));
    
    if (state.experience >= requiredExp) {
      state.level++;
      state.experience -= requiredExp;
      
      // Emit level up event
      this.emitLevelUp(currentLevel + 1);
    }
  }

  /**
   * Get privacy settings
   */
  async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      const result = await chrome.storage.local.get('zt:privacy-settings');
      return result['zt:privacy-settings'] || DEFAULT_GAMIFICATION_STATE.privacySettings;
    } catch (error) {
      console.error('Failed to get privacy settings:', error);
      return DEFAULT_GAMIFICATION_STATE.privacySettings;
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(updates: Partial<PrivacySettings>): Promise<boolean> {
    try {
      const currentSettings = await this.getPrivacySettings();
      const newSettings = { ...currentSettings, ...updates };
      
      await chrome.storage.local.set({ 'zt:privacy-settings': newSettings });
      return true;
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      return false;
    }
  }

  /**
   * Log outbound request (for privacy transparency)
   */
  async logOutboundRequest(request: Omit<OutboundRequest, 'id'>): Promise<void> {
    try {
      const settings = await this.getPrivacySettings();
      
      const newRequest: OutboundRequest = {
        ...request,
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      settings.outboundRequestsLog.push(newRequest);
      
      // Keep only last 100 requests
      if (settings.outboundRequestsLog.length > 100) {
        settings.outboundRequestsLog = settings.outboundRequestsLog.slice(-100);
      }
      
      await this.updatePrivacySettings(settings);
    } catch (error) {
      console.error('Failed to log outbound request:', error);
    }
  }

  /**
   * Export gamification data
   */
  async exportData(): Promise<string> {
    if (!this.currentPIN) {
      throw new Error('PIN not verified. Please verify PIN first.');
    }

    try {
      const state = await this.getGamificationState();
      const settings = await this.getPrivacySettings();
      
      const exportData = {
        gamification: state,
        privacy: settings,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Import gamification data
   */
  async importData(jsonData: string): Promise<boolean> {
    if (!this.currentPIN) {
      throw new Error('PIN not verified. Please verify PIN first.');
    }

    try {
      const importData = JSON.parse(jsonData);
      
      if (importData.gamification && importData.privacy) {
        await this.updateGamificationState(importData.gamification);
        await this.updatePrivacySettings(importData.privacy);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Clear all data
   */
  async clearAllData(): Promise<boolean> {
    try {
      await chrome.storage.local.remove(['zt:gamification', 'zt:privacy-settings']);
      this.currentPIN = null;
      this.isInitialized = false;
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  /**
   * Encrypt all existing data with new PIN
   */
  private async encryptAllData(pin: string): Promise<void> {
    try {
      const result = await chrome.storage.local.get('zt:gamification');
      if (result['zt:gamification']) {
        const encryptedData = await CryptoUtils.encryptData(result['zt:gamification'], pin);
        await chrome.storage.local.set({ 'zt:gamification': encryptedData });
      }
    } catch (error) {
      console.error('Failed to encrypt existing data:', error);
    }
  }

  /**
   * Event emitters for achievement unlocks and level ups
   */
  private emitAchievementUnlock(achievement: Achievement): void {
    // Custom event for achievement unlock
    const event = new CustomEvent('achievementUnlock', { 
      detail: { achievement, unlockedAt: new Date() } 
    });
    window.dispatchEvent(event);
  }

  private emitLevelUp(newLevel: number): void {
    // Custom event for level up
    const event = new CustomEvent('levelUp', { 
      detail: { newLevel, timestamp: new Date() } 
    });
    window.dispatchEvent(event);
  }

  /**
   * Get storage usage information
   */
  async getStorageUsage(): Promise<{ bytesInUse: number; quotaBytes: number } | null> {
    try {
      const bytesInUse = await chrome.storage.local.getBytesInUse();
      const quotaBytes = await chrome.storage.local.getQuotaBytes();
      return { bytesInUse, quotaBytes };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return null;
    }
  }
}

// Create and export singleton instance
export const gamificationStorage = new GamificationStorage();

// Initialize storage when module loads
gamificationStorage.initialize().catch(console.error);

// Export types and utilities
export { CryptoUtils };
export type { GamificationStorage };
