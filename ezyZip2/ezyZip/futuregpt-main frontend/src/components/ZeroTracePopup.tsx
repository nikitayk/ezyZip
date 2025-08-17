import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  Settings, 
  User, 
  Crown, 
  Lock, 
  Unlock, 
  ChevronDown,
  Send,
  Brain,
  Code,
  Target,
  BookOpen,
  Shield as ShieldIcon,
  Wrench,
  Cog,
  Trophy,
  TrendingUp,
  BarChart3,
  Activity,
  Award,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import GamificationDashboard from './GamificationDashboard';
import PrivacyOnboarding from './PrivacyOnboarding';

// Types
interface Feature {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Enhanced' | 'Secured';
  icon: React.ReactNode;
  enabled: boolean;
}

interface UserProfile {
  name: string;
  initials: string;
  isPro: boolean;
  tagline: string;
}

// i18n Strings
const strings = {
  en: {
    title: "ZeroTrace AI",
    tagline: "Privacy-first, zero footprint.",
    tabs: { 
      overview: "Overview", 
      shield: "Shield", 
      tools: "Tools", 
      settings: "Settings" 
    },
    statuses: { 
      active: "Active", 
      enhanced: "Enhanced", 
      secured: "Secured" 
    },
    privacyToggle: "Privacy Mode",
    modelSelector: "Choose AI Model",
    settings: "Settings",
    send: "Send",
    placeholder: "Ask me anything...",
    noFeatures: "No features yet—enable from Settings.",
    saveError: "We couldn't save your preferences. They'll apply until you close the popup."
  }
};

// Features list (preserving existing capabilities)
const defaultFeatures: Feature[] = [
  {
    id: 'traceCleaner',
    title: 'Trace Cleaner',
    description: 'Wipe browsing traces on close',
    status: 'Secured',
    icon: <ShieldIcon className="w-5 h-5" />,
    enabled: true
  },
  {
    id: 'cookieShield',
    title: 'Cookie Shield',
    description: 'Auto-reject trackers',
    status: 'Active',
    icon: <Shield className="w-5 h-5" />,
    enabled: true
  },
  {
    id: 'aiProxy',
    title: 'AI Proxy',
    description: 'Route via ZeroTrace proxy',
    status: 'Enhanced',
    icon: <Brain className="w-5 h-5" />,
    enabled: false
  },
  {
    id: 'secureNotes',
    title: 'Secure Notes',
    description: 'Ephemeral scratchpad',
    status: 'Secured',
    icon: <BookOpen className="w-5 h-5" />,
    enabled: false
  },
  {
    id: 'sessionGuard',
    title: 'Session Guard',
    description: 'Auto-lock with inactivity',
    status: 'Active',
    icon: <Lock className="w-5 h-5" />,
    enabled: true
  },
  {
    id: 'modelBoost',
    title: 'Model Boost',
    description: 'Smart prompt optimizer',
    status: 'Enhanced',
    icon: <Zap className="w-5 h-5" />,
    enabled: false
  }
];

// AI Models
const aiModels = [
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast & Efficient' },
  { id: 'gpt-4', name: 'GPT-4', description: 'High Quality' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most Advanced' },
  { id: 'claude-4', name: 'Claude-4', description: 'Advanced Reasoning' },
  { id: 'gemini-pro', name: 'Gemini Pro', description: 'Creative Solutions' }
];

// Storage wrapper
const storage = {
  async get(key: string) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key];
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  async set(key: string, value: any) {
    try {
      await chrome.storage.local.set({ [key]: value });
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }
};

// Toggle Switch Component
const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled = false }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1D2333]
        ${checked 
          ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.4)]' 
          : 'bg-gray-600 shadow-inner'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  feature: Feature;
  onToggle: (id: string, enabled: boolean) => void;
}> = ({ feature, onToggle }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Enhanced': return 'text-purple-400';
      case 'Secured': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20';
      case 'Enhanced': return 'bg-purple-500/20';
      case 'Secured': return 'bg-orange-500/20';
      default: return 'bg-gray-500/20';
    }
  };

  return (
    <div className="
      bg-[#1D2333] rounded-2xl p-4 transition-all duration-200 ease-in-out
      hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(168,85,247,0.28)]
      shadow-[0_6px_18px_rgba(0,0,0,0.25)]
    ">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="
            w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20
            flex items-center justify-center text-purple-400
          ">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{feature.title}</h3>
            <p className="text-[#AAB4CF] text-xs">{feature.description}</p>
          </div>
        </div>
        <ToggleSwitch
          checked={feature.enabled}
          onChange={(enabled) => onToggle(feature.id, enabled)}
          label={`Toggle ${feature.title}`}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className={`
          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${getStatusBgColor(feature.status)} ${getStatusColor(feature.status)}
        `}>
          <div className={`
            w-2 h-2 rounded-full mr-2
            ${feature.status === 'Active' ? 'bg-green-400' : 
              feature.status === 'Enhanced' ? 'bg-purple-400' : 'bg-orange-400'}
          `} />
          {feature.status}
        </div>
      </div>

    </div>
  );
};

// Main Popup Component
const ZeroTracePopup: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [features, setFeatures] = useState<Feature[]>(defaultFeatures);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [privacyEnabled, setPrivacyEnabled] = useState(true);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showGamificationDashboard, setShowGamificationDashboard] = useState(false);
  const [showPrivacyOnboarding, setShowPrivacyOnboarding] = useState(false);
  const [gamificationStats, setGamificationStats] = useState({
    level: 1,
    totalPoints: 0,
    currentStreak: 0,
    achievementsUnlocked: 0
  });

  // Load saved state
  useEffect(() => {
    const loadState = async () => {
      const savedModel = await storage.get('zt:model');
      const savedPrivacy = await storage.get('zt:privacy');
      const savedToggles = await storage.get('zt:toggles');
      const savedTab = await storage.get('zt:tab');

      if (savedModel) setSelectedModel(savedModel);
      if (savedPrivacy !== null) setPrivacyEnabled(savedPrivacy);
      if (savedToggles) {
        setFeatures(prev => prev.map(f => ({
          ...f,
          enabled: savedToggles[f.id] ?? f.enabled
        })));
      }
      if (savedTab) setActiveTab(savedTab);
    };

    loadState();
  }, []);

  // Save state changes
  const saveState = async (key: string, value: any) => {
    const success = await storage.set(key, value);
    if (!success) {
      // Show non-blocking error (could be enhanced with toast)
      console.warn(strings.en.saveError);
    }
  };

  // Handle feature toggle
  const handleFeatureToggle = async (id: string, enabled: boolean) => {
    const newFeatures = features.map(f => 
      f.id === id ? { ...f, enabled } : f
    );
    setFeatures(newFeatures);
    
    const toggles = newFeatures.reduce((acc, f) => {
      acc[f.id] = f.enabled;
      return acc;
    }, {} as Record<string, boolean>);
    
    await saveState('zt:toggles', toggles);
  };

  // Handle model change
  const handleModelChange = async (modelId: string) => {
    setSelectedModel(modelId);
    setShowModelDropdown(false);
    await saveState('zt:model', modelId);
  };

  // Handle privacy toggle
  const handlePrivacyToggle = async (enabled: boolean) => {
    setPrivacyEnabled(enabled);
    await saveState('zt:privacy', enabled);
  };

  // Handle tab change
  const handleTabChange = async (tab: string) => {
    setActiveTab(tab);
    await saveState('zt:tab', tab);
  };

  // Handle input submit
  const handleSubmit = () => {
    if (inputValue.trim()) {
      // Here you would integrate with your existing AI backend
      console.log('Sending message:', inputValue);
      setInputValue('');
    }
  };

  const tabs = [
    { id: 'overview', label: strings.en.tabs.overview, icon: <Target className="w-4 h-4" /> },
    { id: 'shield', label: strings.en.tabs.shield, icon: <Shield className="w-4 h-4" /> },
    { id: 'tools', label: strings.en.tabs.tools, icon: <Wrench className="w-4 h-4" /> },
    { id: 'gamification', label: 'Gamification', icon: <Trophy className="w-4 h-4" /> },
    { id: 'settings', label: strings.en.tabs.settings, icon: <Cog className="w-4 h-4" /> }
  ];

  const currentModel = aiModels.find(m => m.id === selectedModel);

  return (
    <div className="
      w-[380px] min-h-[500px] bg-gradient-to-b from-[#121826] to-[#1A1F2F]
      text-white font-['Inter'] overflow-hidden
    ">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-[#1D2333]/80 backdrop-blur-sm border-b border-[#2A3142]">
        <div className="flex items-center justify-between p-4">
          {/* Profile Chip */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">Alex Chen</span>
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                  <Crown className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-400 font-medium">Pro</span>
                </div>
              </div>
              <p className="text-xs text-[#AAB4CF]">{strings.en.tagline}</p>
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="
                  flex items-center space-x-2 px-3 py-2 rounded-lg bg-[#2A3142] 
                  hover:bg-[#374151] transition-colors duration-150
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                "
              >
                <Brain className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium">{currentModel?.name}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showModelDropdown && (
                <div className="
                  absolute top-full right-0 mt-2 w-48 bg-[#1D2333] rounded-lg shadow-lg
                  border border-[#2A3142] z-20
                ">
                  {aiModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className="
                        w-full text-left px-3 py-2 hover:bg-[#2A3142] transition-colors duration-150
                        first:rounded-t-lg last:rounded-b-lg
                      "
                    >
                      <div className="text-sm font-medium">{model.name}</div>
                      <div className="text-xs text-[#AAB4CF]">{model.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center space-x-2">
              <ToggleSwitch
                checked={privacyEnabled}
                onChange={handlePrivacyToggle}
                label={strings.en.privacyToggle}
              />
              {privacyEnabled ? (
                <Unlock className="w-4 h-4 text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 pb-2">
          <div className="flex space-x-6 relative">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center space-x-2 px-2 py-2 text-sm font-medium transition-all duration-250
                  ${activeTab === tab.id 
                    ? 'text-white' 
                    : 'text-[#AAB4CF] hover:text-white'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
            
            {/* Active Tab Underline */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-250 ease-in-out"
                 style={{
                   width: '60px',
                   transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 96}px)`
                 }} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'overview' && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 auto-rows-min">
              {features.map((feature) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  onToggle={handleFeatureToggle}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shield' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="bg-[#1D2333] rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-2">Privacy Shield</h3>
                <p className="text-[#AAB4CF] text-sm mb-4">Advanced privacy protection features</p>
                <div className="space-y-3">
                  {features.filter(f => ['traceCleaner', 'cookieShield', 'sessionGuard'].includes(f.id)).map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      onToggle={handleFeatureToggle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="bg-[#1D2333] rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-2">AI Tools</h3>
                <p className="text-[#AAB4CF] text-sm mb-4">Intelligent AI-powered utilities</p>
                <div className="space-y-3">
                  {features.filter(f => ['aiProxy', 'modelBoost'].includes(f.id)).map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      onToggle={handleFeatureToggle}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gamification' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="bg-[#1D2333] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Gamification Dashboard</h3>
                  <button
                    onClick={() => setShowGamificationDashboard(true)}
                    className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-lg transition-colors"
                  >
                    Open Dashboard
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#2A3142] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{gamificationStats.level}</div>
                    <div className="text-xs text-[#AAB4CF]">Level</div>
                  </div>
                  <div className="bg-[#2A3142] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{gamificationStats.totalPoints}</div>
                    <div className="text-xs text-[#AAB4CF]">Points</div>
                  </div>
                  <div className="bg-[#2A3142] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{gamificationStats.currentStreak}</div>
                    <div className="text-xs text-[#AAB4CF]">Streak</div>
                  </div>
                  <div className="bg-[#2A3142] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{gamificationStats.achievementsUnlocked}</div>
                    <div className="text-xs text-[#AAB4CF]">Achievements</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPrivacyOnboarding(true)}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Setup Privacy & Gamification
                  </button>
                  <p className="text-xs text-[#AAB4CF] text-center">
                    Complete setup to unlock achievements, streaks, and progress tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-4">
            <div className="space-y-4">
              <div className="bg-[#1D2333] rounded-2xl p-4">
                <h3 className="text-white font-semibold mb-2">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">Privacy Mode</h4>
                      <p className="text-[#AAB4CF] text-sm">Enable enhanced privacy protection</p>
                    </div>
                    <ToggleSwitch
                      checked={privacyEnabled}
                      onChange={handlePrivacyToggle}
                      label="Privacy Mode"
                    />
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-2">AI Model</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {aiModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelChange(model.id)}
                          className={`
                            p-3 rounded-lg text-left transition-all duration-150
                            ${selectedModel === model.id
                              ? 'bg-purple-500/20 border border-purple-500/30'
                              : 'bg-[#2A3142] hover:bg-[#374151]'
                            }
                          `}
                        >
                          <div className="text-sm font-medium">{model.name}</div>
                          <div className="text-xs text-[#AAB4CF]">{model.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input Bar */}
      <div className="p-4 border-t border-[#2A3142] bg-[#1D2333]">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={strings.en.placeholder}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            className="
              flex-1 px-4 py-2 bg-[#2A3142] rounded-lg text-white placeholder-[#AAB4CF]
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1D2333]
              transition-all duration-150
            "
          />
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim()}
            className="
              px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600
              rounded-lg text-white font-medium transition-all duration-150
              hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-purple-400
            "
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gamification Dashboard Modal */}
      {showGamificationDashboard && (
        <GamificationDashboard
          isOpen={showGamificationDashboard}
          onClose={() => setShowGamificationDashboard(false)}
        />
      )}

      {/* Privacy Onboarding Modal */}
      {showPrivacyOnboarding && (
        <PrivacyOnboarding
          isOpen={showPrivacyOnboarding}
          onComplete={() => {
            setShowPrivacyOnboarding(false);
            // Refresh gamification stats
            // This would typically load from storage
          }}
          onClose={() => setShowPrivacyOnboarding(false)}
        />
      )}
    </div>
  );
};

export default ZeroTracePopup;
