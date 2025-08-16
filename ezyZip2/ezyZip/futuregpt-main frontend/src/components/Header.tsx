import React from 'react';
import {
  Brain,
  Shield,
  Settings,
  User,
  Crown,
  Bell,
  Search
} from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  currentMode: string;
  onZeroTraceToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentMode, onZeroTraceToggle }) => {
  const getModeTitle = (mode: string) => {
    switch (mode) {
      case 'chat': return 'AI Chat';
      case 'dsa-solver': return 'DSA Problem Solver';
      case 'competitive': return 'Competitive Programming';
      case 'interview': return 'Interview Preparation';
      case 'optimization': return 'Code Optimization';
      default: return 'AI Assistant';
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case 'chat': return 'General AI conversation and assistance';
      case 'dsa-solver': return 'Solve algorithmic problems with AI';
      case 'competitive': return 'Advanced competitive programming tools';
      case 'interview': return 'Practice coding interviews';
      case 'optimization': return 'Optimize your code performance';
      default: return 'Choose a mode to get started';
    }
  };

  return (
    <header className="bg-[#1D2333]/80 backdrop-blur-sm border-b border-[#2A3142] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Logo and Mode Info */}
        <div className="flex items-center space-x-6">
          <Logo size="md" showText={true} />

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-white">{getModeTitle(currentMode)}</h1>
            <p className="text-sm text-[#AAB4CF]">{getModeDescription(currentMode)}</p>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#AAB4CF]" />
            <input
              type="text"
              placeholder="Search features, problems, or topics..."
              className="w-full pl-10 pr-4 py-2 bg-[#2A3142] border border-[#374151] rounded-lg text-white placeholder-[#AAB4CF] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-3">
          {/* ZeroTrace AI Toggle */}
          <button
            onClick={onZeroTraceToggle}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">ZeroTrace</span>
          </button>

          {/* Notifications */}
          <button className="p-2 text-[#AAB4CF] hover:text-white hover:bg-[#2A3142] rounded-lg transition-all duration-200 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 text-[#AAB4CF] hover:text-white hover:bg-[#2A3142] rounded-lg transition-all duration-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">Alex Chen</span>
              </button>

              {/* Pro Badge */}
              <div className="absolute -top-2 -right-2">
                <div className="flex items-center space-x-1 px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full">
                  <Crown className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-400 font-medium">Pro</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <button className="p-2 text-[#AAB4CF] hover:text-white hover:bg-[#2A3142] rounded-lg transition-all duration-200">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Title */}
      <div className="md:hidden mt-3">
        <h1 className="text-lg font-bold text-white">{getModeTitle(currentMode)}</h1>
        <p className="text-sm text-[#AAB4CF]">{getModeDescription(currentMode)}</p>
      </div>
    </header>
  );
};

export default Header;