import React from 'react';
import { Brain, Code, Trophy, Users, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: 'DSA Solver',
      description: 'Solve algorithmic problems with AI assistance'
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Competitive Programming',
      description: 'Advanced tools for competitive programming'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Interview Prep',
      description: 'Practice coding interviews and system design'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Code Optimization',
      description: 'Analyze and optimize your code performance'
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to ZeroTrace AI</h1>
          <p className="text-xl text-[#AAB4CF] mb-6">
            Your privacy-first AI assistant for competitive programming and DSA problem solving
          </p>
          <button
            onClick={onStartChat}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105"
          >
            Start Chatting
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-[#1D2333] rounded-2xl border border-[#2A3142] hover:border-purple-500/30 transition-all duration-200"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-[#AAB4CF]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;