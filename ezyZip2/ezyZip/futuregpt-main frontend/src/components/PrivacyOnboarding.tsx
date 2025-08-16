import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Download,
  Upload,
  Activity,
  Brain,
  Code,
  Target,
  Zap,
  Crown,
  Trophy,
  Fire,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { gamificationStorage } from '../utils/gamificationStorage';

interface PrivacyOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const PrivacyOnboarding: React.FC<PrivacyOnboardingProps> = ({ isOpen, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to ZeroTrace',
      subtitle: 'Your Privacy-First AI Companion',
      icon: <Shield className="w-16 h-16 text-green-400" />,
      content: (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Why Privacy Matters</h3>
            <p className="text-[#AAB4CF] leading-relaxed">
              In today's digital world, your data is constantly being collected, analyzed, and sold. 
              ZeroTrace is built on the principle that your learning journey should remain completely private.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1D2333] rounded-xl p-4">
              <Eye className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Local Processing</h4>
              <p className="text-xs text-[#AAB4CF]">All data stays on your device</p>
            </div>
            <div className="bg-[#1D2333] rounded-xl p-4">
              <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">PIN Protection</h4>
              <p className="text-xs text-[#AAB4CF]">Military-grade encryption</p>
            </div>
            <div className="bg-[#1D2333] rounded-xl p-4">
              <Activity className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Transparent Logging</h4>
              <p className="text-xs text-[#AAB4CF]">See every outbound request</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'privacy-guarantees',
      title: 'Privacy Guarantees',
      subtitle: 'What We Promise (And What We Don\'t)',
      icon: <CheckCircle className="w-16 h-16 text-green-400" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-green-400 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                What We DO
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Local Data Storage</div>
                    <div className="text-sm text-[#AAB4CF]">All progress, achievements, and settings stored locally</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">PIN Encryption</div>
                    <div className="text-sm text-[#AAB4CF]">AES-256 encryption with your personal PIN</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">No Tracking</div>
                    <div className="text-sm text-[#AAB4CF]">Zero analytics, telemetry, or user tracking</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Transparent Logging</div>
                    <div className="text-sm text-[#AAB4CF]">See every network request in real-time</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-red-400 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                What We DON'T
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Send Data to Servers</div>
                    <div className="text-sm text-[#AAB4CF]">No data leaves your device by default</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Collect Analytics</div>
                    <div className="text-sm text-[#AAB4CF]">No usage statistics or behavior tracking</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Share with Third Parties</div>
                    <div className="text-sm text-[#AAB4CF]">Your data is never sold or shared</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-white font-medium">Require Internet</div>
                    <div className="text-sm text-[#AAB4CF]">Core features work completely offline</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pin-setup',
      title: 'Set Up PIN Protection',
      subtitle: 'Create Your Personal Security Code',
      icon: <Lock className="w-16 h-16 text-blue-400" />,
      content: (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-[#AAB4CF] leading-relaxed">
              Your PIN is used to encrypt all your gamification data locally. 
              Choose a strong PIN that you'll remember - it cannot be recovered if lost.
            </p>
            
            <div className="bg-[#1D2333] rounded-xl p-4 max-w-md mx-auto">
              <div className="text-sm text-[#AAB4CF] mb-2">PIN Requirements:</div>
              <ul className="text-xs text-[#AAB4CF] space-y-1 text-left">
                <li>• Minimum 6 characters</li>
                <li>• Can include letters, numbers, and symbols</li>
                <li>• Used for local encryption only</li>
                <li>• Never transmitted or stored on servers</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Enter PIN</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your PIN (min 6 characters)"
                  className="w-full px-4 py-3 bg-[#2A3142] rounded-lg text-white placeholder-[#AAB4CF] focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAB4CF] hover:text-white"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm PIN</label>
              <div className="relative">
                <input
                  type={showConfirmPin ? 'text' : 'password'}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Confirm your PIN"
                  className="w-full px-4 py-3 bg-[#2A3142] rounded-lg text-white placeholder-[#AAB4CF] focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  maxLength={20}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AAB4CF] hover:text-white"
                >
                  {showConfirmPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'features-overview',
      title: 'Gamification Features',
      subtitle: 'What You\'ll Unlock',
      icon: <Trophy className="w-16 h-16 text-yellow-400" />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-purple-400 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Progress Tracking
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Fire className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Streak Tracking</div>
                    <div className="text-sm text-[#AAB4CF]">Daily problem-solving streaks</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Progress Analytics</div>
                    <div className="text-sm text-[#AAB4CF]">Visual charts and insights</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Performance Stats</div>
                    <div className="text-sm text-[#AAB4CF]">Success rates and time tracking</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-yellow-400 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Achievements & Rewards
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Achievement System</div>
                    <div className="text-sm text-[#AAB4CF]">Unlock badges at milestones</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Experience Points</div>
                    <div className="text-sm text-[#AAB4CF]">Level up as you solve problems</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">AI Insights</div>
                    <div className="text-sm text-[#AAB4CF]">Learn from your solving patterns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'final-setup',
      title: 'Final Setup',
      subtitle: 'Almost Ready to Go!',
      icon: <CheckCircle className="w-16 h-16 text-green-400" />,
      content: (
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Setup Complete!</h3>
            <p className="text-[#AAB4CF] leading-relaxed">
              Your privacy-first gamification system is ready! Here's what happens next:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1D2333] rounded-xl p-4">
              <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Data Encrypted</h4>
              <p className="text-xs text-[#AAB4CF]">All progress protected with your PIN</p>
            </div>
            <div className="bg-[#1D2333] rounded-xl p-4">
              <Activity className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Start Solving</h4>
              <p className="text-xs text-[#AAB4CF]">Begin your DSA journey</p>
            </div>
            <div className="bg-[#1D2333] rounded-xl p-4">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-white font-medium mb-1">Earn Rewards</h4>
              <p className="text-xs text-[#AAB4CF]">Unlock achievements and level up</p>
            </div>
          </div>
          
          <div className="bg-[#1D2333] rounded-xl p-4 max-w-md mx-auto">
            <div className="text-sm text-[#AAB4CF] mb-2">Remember:</div>
            <ul className="text-xs text-[#AAB4CF] space-y-1 text-left">
              <li>• Your PIN is required to access gamification data</li>
              <li>• All data is stored locally and encrypted</li>
              <li>• You can export/import your progress anytime</li>
              <li>• Privacy mode is always visible in the UI</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  // Handle PIN setup
  const handlePINSetup = async () => {
    if (pin.length < 6) {
      setError('PIN must be at least 6 characters long');
      return;
    }
    
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const success = await gamificationStorage.setupPIN(pin);
      if (success) {
        setCurrentStep(currentStep + 1);
      } else {
        setError('Failed to setup PIN. Please try again.');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Navigation
  const nextStep = () => {
    if (currentStep === steps.length - 1) {
      onComplete();
    } else if (currentStep === 2) { // PIN setup step
      handlePINSetup();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1D2333] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[#2A3142] p-6 border-b border-[#374151]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Privacy Setup</h1>
                <p className="text-[#AAB4CF]">Step {currentStep + 1} of {steps.length}</p>
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

        {/* Progress Bar */}
        <div className="bg-[#2A3142] px-6 py-3">
          <div className="w-full bg-[#1D2333] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="text-center mb-8">
            {currentStepData.icon}
            <h2 className="text-3xl font-bold text-white mt-4 mb-2">{currentStepData.title}</h2>
            <p className="text-[#AAB4CF] text-lg">{currentStepData.subtitle}</p>
          </div>
          
          {currentStepData.content}
        </div>

        {/* Navigation */}
        <div className="bg-[#2A3142] p-6 border-t border-[#374151]">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-[#374151] hover:bg-[#4B5563] disabled:bg-[#2A3142] disabled:text-[#6B7280] text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="text-sm text-[#AAB4CF]">
              {currentStep + 1} of {steps.length}
            </div>
            
            <button
              onClick={nextStep}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <span>{currentStep === steps.length - 1 ? 'Complete' : 'Next'}</span>
              {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyOnboarding;
