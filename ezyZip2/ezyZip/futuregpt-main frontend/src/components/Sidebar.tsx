import React from 'react';
import { 
  MessageSquare, 
  Code, 
  Trophy, 
  Users, 
  Zap, 
  Settings,
  Shield,
  Brain,
  Crown
} from 'lucide-react';

interface SidebarProps {
  currentMode: string;
  onModeChange: (mode: string) => void;
  onZeroTraceToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, onZeroTraceToggle }) => {
  const modes = [
    { id: 'chat', label: 'Chat', icon: MessageSquare, description: 'General AI chat' },
    { id: 'dsa-solver', label: 'DSA Solver', icon: Code, description: 'Algorithm problem solving' },
    { id: 'competitive', label: 'Competitive', icon: Trophy, description: 'Competitive programming' },
    { id: 'interview', label: 'Interview', icon: Users, description: 'Interview preparation' },
    { id: 'optimization', label: 'Optimization', icon: Zap, description: 'Code optimization' },
  ];

  return (
    <div className="w-64 bg-[#1D2333] border-r border-[#2A3142] flex flex-col">
      {/* ZeroTrace AI Header */}
      <div className="p-4 border-b border-[#2A3142]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ZeroTrace AI</h1>
            <p className="text-xs text-[#AAB4CF]">Privacy-first AI</p>
          </div>
        </div>
        
        {/* ZeroTrace Toggle Button */}
        <button
          onClick={onZeroTraceToggle}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>Open ZeroTrace</span>
        </button>
      </div>

      {/* Mode Navigation */}
      <div className="flex-1 p-4">
        <h2 className="text-sm font-semibold text-[#AAB4CF] uppercase tracking-wider mb-4">
          AI Modes
        </h2>
        <nav className="space-y-2">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`
                w-full text-left p-3 rounded-xl transition-all duration-200 group
                ${currentMode === mode.id
                  ? 'bg-purple-500/20 border border-purple-500/30 text-white'
                  : 'text-[#AAB4CF] hover:bg-[#2A3142] hover:text-white'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-lg transition-colors duration-200
                  ${currentMode === mode.id
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-[#2A3142] text-[#AAB4CF] group-hover:bg-[#374151] group-hover:text-white'
                  }
                `}>
                  <mode.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{mode.label}</div>
                  <div className="text-xs opacity-75">{mode.description}</div>
                </div>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Pro Badge */}
      <div className="p-4 border-t border-[#2A3142]">
        <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-2">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-white">Pro Plan</span>
          </div>
          <p className="text-xs text-[#AAB4CF] mb-3">
            Access to all AI models and advanced features
          </p>
          <button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs px-3 py-2 rounded-lg transition-colors">
            Manage Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;