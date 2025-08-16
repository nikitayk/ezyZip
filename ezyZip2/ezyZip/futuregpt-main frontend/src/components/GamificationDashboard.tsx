import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Fire, 
  TrendingUp, 
  Shield, 
  Lock, 
  Unlock, 
  Download, 
  Upload,
  Target,
  Star,
  Zap,
  Crown,
  Brain,
  Code,
  Clock,
  BarChart3,
  Activity,
  Award,
  Users,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import type { 
  GamificationState, 
  Achievement, 
  Streak, 
  ProgressStats,
  PrivacySettings,
  OutboundRequest 
} from '../types/gamification';
import { gamificationStorage } from '../utils/gamificationStorage';

interface GamificationDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ isOpen, onClose }) => {
  const [state, setState] = useState<GamificationState | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [isPINVerified, setIsPINVerified] = useState(false);
  const [showPINModal, setShowPINModal] = useState(false);
  const [pin, setPin] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showOutboundLog, setShowOutboundLog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load gamification state
  useEffect(() => {
    if (isOpen && !isPINVerified) {
      setShowPINModal(true);
    }
  }, [isOpen, isPINVerified]);

  // Handle PIN verification
  const handlePINVerify = async () => {
    if (pin.length < 6) {
      alert('PIN must be at least 6 digits');
      return;
    }

    setLoading(true);
    try {
      const isValid = await gamificationStorage.verifyPIN(pin);
      if (isValid) {
        setIsPINVerified(true);
        setShowPINModal(false);
        await loadGamificationData();
      } else {
        alert('Invalid PIN. Please try again.');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load gamification data
  const loadGamificationData = async () => {
    try {
      const [gamificationState, privacy] = await Promise.all([
        gamificationStorage.getGamificationState(),
        gamificationStorage.getPrivacySettings()
      ]);
      setState(gamificationState);
      setPrivacySettings(privacy);
    } catch (error) {
      console.error('Failed to load gamification data:', error);
    }
  };

  // Handle achievement unlock events
  useEffect(() => {
    const handleAchievementUnlock = (event: CustomEvent) => {
      const { achievement } = event.detail;
      alert(`🎉 Achievement Unlocked: ${achievement.title}! +${achievement.points} points`);
      loadGamificationData();
    };

    const handleLevelUp = (event: CustomEvent) => {
      const { newLevel } = event.detail;
      alert(`🚀 Level Up! You are now level ${newLevel}!`);
      loadGamificationData();
    };

    window.addEventListener('achievementUnlock', handleAchievementUnlock as EventListener);
    window.addEventListener('levelUp', handleLevelUp as EventListener);

    return () => {
      window.removeEventListener('achievementUnlock', handleAchievementUnlock as EventListener);
      window.removeEventListener('levelUp', handleLevelUp as EventListener);
    };
  }, []);

  // Export data
  const handleExportData = async () => {
    try {
      const data = await gamificationStorage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zerotrace-gamification-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data');
    }
  };

  // Import data
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const success = await gamificationStorage.importData(text);
      if (success) {
        alert('Data imported successfully!');
        await loadGamificationData();
      } else {
        alert('Failed to import data');
      }
    } catch (error) {
      alert('Failed to import data');
    }
  };

  // Log outbound request (for privacy transparency)
  const logOutboundRequest = async (request: Omit<OutboundRequest, 'id'>) => {
    await gamificationStorage.logOutboundRequest(request);
    await loadGamificationData();
  };

  if (!isOpen) return null;

  if (showPINModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1D2333] rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Enter Your PIN</h2>
            <p className="text-[#AAB4CF]">Enter your 6+ digit PIN to access your gamification data</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (min 6 digits)"
              className="w-full px-4 py-3 bg-[#2A3142] rounded-lg text-white placeholder-[#AAB4CF] focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={20}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => onClose()}
                className="flex-1 px-4 py-3 bg-[#2A3142] hover:bg-[#374151] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePINVerify}
                disabled={loading || pin.length < 6}
                className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Unlock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!state || !privacySettings) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-[#1D2333] rounded-2xl p-8">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-center">Loading gamification data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'challenges', label: 'Challenges', icon: <Zap className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-4 h-4" /> }
  ];

  const getPrivacyMode = () => {
    const hasAPIKey = localStorage.getItem('zt:apiKey') || sessionStorage.getItem('zt:apiKey');
    return hasAPIKey ? 'user-api' : 'local';
  };

  const privacyMode = getPrivacyMode();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#1D2333] rounded-2xl w-[800px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2A3142] p-6 border-b border-[#374151]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gamification Dashboard</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    privacyMode === 'local' 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {privacyMode === 'local' ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-1 mr-1" />}
                    {privacyMode === 'local' ? 'Local Mode' : 'User-API Mode'}
                  </div>
                  <div className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-medium">
                    Level {state.level}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#374151] hover:bg-[#4B5563] rounded-full flex items-center justify-center text-white transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#2A3142] px-6 border-b border-[#374151]">
          <div className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-[#AAB4CF] hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{state.totalPoints}</div>
                  <div className="text-sm text-[#AAB4CF]">Total Points</div>
                </div>
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{state.progressStats.totalProblems}</div>
                  <div className="text-sm text-[#AAB4CF]">Problems Solved</div>
                </div>
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{state.streak.currentStreak}</div>
                  <div className="text-sm text-[#AAB4CF]">Current Streak</div>
                </div>
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">{state.achievements.filter(a => a.unlockedAt).length}</div>
                  <div className="text-sm text-[#AAB4CF]">Achievements</div>
                </div>
              </div>

              {/* Streak Display */}
              <div className="bg-[#1D2333] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Fire className="w-5 h-5 text-orange-400 mr-2" />
                    Streak Status
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-400">{state.streak.currentStreak} 🔥</div>
                    <div className="text-sm text-[#AAB4CF]">Current Streak</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-white">{state.streak.longestStreak}</div>
                    <div className="text-sm text-[#AAB4CF]">Longest Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{state.streak.totalSolved}</div>
                    <div className="text-sm text-[#AAB4CF]">Total Solved</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{state.streak.consecutiveDays}</div>
                    <div className="text-sm text-[#AAB4CF]">Consecutive Days</div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#1D2333] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-blue-400 mr-2" />
                  Recent Activity
                </h3>
                
                {state.problemSessions.slice(-5).reverse().map((session) => (
                  <div key={session.id} className="flex items-center justify-between py-3 border-b border-[#2A3142] last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Code className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{session.problemTitle}</div>
                        <div className="text-sm text-[#AAB4CF]">{session.language} • {session.difficulty}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">Phase {session.phase}</div>
                      <div className="text-xs text-[#AAB4CF]">{new Date(session.solvedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-[#1D2333] rounded-xl p-4 transition-all duration-200 ${
                      achievement.unlockedAt
                        ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20'
                        : 'opacity-60'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`text-3xl ${achievement.unlockedAt ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white">{achievement.title}</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            achievement.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {achievement.rarity}
                          </div>
                        </div>
                        <p className="text-sm text-[#AAB4CF] mb-3">{achievement.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-[#AAB4CF]">Progress</span>
                            <span className="text-white">{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <div className="w-full bg-[#2A3142] rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        {achievement.unlockedAt && (
                          <div className="mt-3 pt-3 border-t border-[#2A3142]">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#AAB4CF]">Unlocked</span>
                              <span className="text-green-400 font-medium">+{achievement.points} points</span>
                            </div>
                            <div className="text-xs text-[#AAB4CF]">
                              {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Progress Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty Distribution */}
                <div className="bg-[#1D2333] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
                    Problems by Difficulty
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(state.progressStats.problemsByDifficulty).map(([difficulty, count]) => (
                      <div key={difficulty} className="flex items-center justify-between">
                        <span className="text-[#AAB4CF] capitalize">{difficulty}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-[#2A3142] rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / state.progressStats.totalProblems) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Distribution */}
                <div className="bg-[#1D2333] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Code className="w-5 h-5 text-green-400 mr-2" />
                    Problems by Language
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(state.progressStats.problemsByLanguage).map(([language, count]) => (
                      <div key={language} className="flex items-center justify-between">
                        <span className="text-[#AAB4CF] uppercase">{language}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-[#2A3142] rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              style={{ width: `${(count / state.progressStats.totalProblems) * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-medium w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly Activity */}
              <div className="bg-[#1D2333] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                  Weekly Activity
                </h3>
                <div className="grid grid-cols-8 gap-2">
                  {state.progressStats.weeklyActivity.slice(-8).map((week, index) => (
                    <div key={week.date} className="text-center">
                      <div className="text-xs text-[#AAB4CF] mb-1">
                        {new Date(week.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="bg-[#2A3142] rounded-lg p-2">
                        <div className="text-lg font-bold text-white">{week.problemsSolved}</div>
                        <div className="text-xs text-[#AAB4CF]">problems</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {state.progressStats.successRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-[#AAB4CF]">Success Rate</div>
                </div>
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(state.progressStats.averageTimeSpent / 1000 / 60)}m
                  </div>
                  <div className="text-sm text-[#AAB4CF]">Avg Time</div>
                </div>
                <div className="bg-[#1D2333] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {state.experience}
                  </div>
                  <div className="text-sm text-[#AAB4CF]">Experience</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Challenges Coming Soon!</h3>
                <p className="text-[#AAB4CF]">Timed coding challenges and leaderboards will be available in the next update.</p>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              {/* Privacy Mode */}
              <div className="bg-[#1D2333] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-green-400 mr-2" />
                  Privacy Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#2A3142] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        privacyMode === 'local' ? 'bg-green-500/20' : 'bg-blue-500/20'
                      }`}>
                        {privacyMode === 'local' ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {privacyMode === 'local' ? 'Local Mode' : 'User-API Mode'}
                        </div>
                        <div className="text-sm text-[#AAB4CF]">
                          {privacyMode === 'local' 
                            ? 'All processing happens locally with zero outbound requests'
                            : 'Using your API keys for enhanced AI capabilities'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outbound Requests Log */}
              <div className="bg-[#1D2333] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Activity className="w-5 h-5 text-blue-400 mr-2" />
                    Outbound Requests Log
                  </h3>
                  <button
                    onClick={() => setShowOutboundLog(!showOutboundLog)}
                    className="px-3 py-1 bg-[#2A3142] hover:bg-[#374151] rounded-lg text-sm text-white transition-colors"
                  >
                    {showOutboundLog ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {showOutboundLog ? (
                  <div className="space-y-3">
                    {privacySettings.outboundRequestsLog.length === 0 ? (
                      <div className="text-center py-8 text-[#AAB4CF]">
                        <Shield className="w-12 h-12 mx-auto mb-3 text-green-400" />
                        <p>No outbound requests detected!</p>
                        <p className="text-sm">Your data stays completely private.</p>
                      </div>
                    ) : (
                      privacySettings.outboundRequestsLog.slice(-10).reverse().map((request) => (
                        <div key={request.id} className="bg-[#2A3142] rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.userInitiated 
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}>
                                {request.userInitiated ? 'User' : 'System'}
                              </span>
                              <span className="text-white font-medium">{request.method}</span>
                            </div>
                            <span className="text-xs text-[#AAB4CF]">
                              {new Date(request.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-[#AAB4CF] mb-1">{request.url}</div>
                          <div className="text-xs text-[#AAB4CF]">
                            Body Hash: {request.bodyHash.substring(0, 16)}...
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[#AAB4CF]">
                    <p>Click "Show" to view detailed outbound request logs</p>
                  </div>
                )}
              </div>

              {/* Data Management */}
              <div className="bg-[#1D2333] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Settings className="w-5 h-5 text-purple-400 mr-2" />
                  Data Management
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleExportData}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#2A3142] hover:bg-[#374151] rounded-lg text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                  
                  <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-[#2A3142] hover:bg-[#374151] rounded-lg text-white transition-colors cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Import Data</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;
