import React, { useState, useEffect } from 'react';
import ZeroTracePopup from './components/ZeroTracePopup';
import DSASolver from './components/DSASolver';
import ChatInput from './components/ChatInput';
import MessageList from './components/MessageList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ApiKeyModal from './components/ApiKeyModal';
import FileUpload from './components/FileUpload';
import { useAI } from './hooks/useAI';
import { useLegacyStorage } from './hooks/useStorage';
import './index.css';
import './styles/tokens.css';

// Import the new storage utility
import { storage } from './utils/storage';

function App() {
  const [currentMode, setCurrentMode] = useState('chat');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showZeroTracePopup, setShowZeroTracePopup] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the legacy storage hook for API key management
  const { apiKey, saveApiKey } = useLegacyStorage();

  // Create a simple AI config for the useAI hook
  const aiConfig = { apiKey: apiKey || '' };
  const { sendMessage: aiSendMessage, isLoading: aiIsLoading } = useAI(aiConfig);

  // Check if API key exists on mount
  useEffect(() => {
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, [apiKey]);

  // Handle mode change
  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    // Clear messages when switching modes for better UX
    if (mode !== currentMode) {
      setMessages([]);
    }
  };

  // Handle API key submission
  const handleApiKeySubmit = (apiKey: string) => {
    saveApiKey(apiKey);
    setShowApiKeyModal(false);
  };

  // Toggle ZeroTrace AI popup
  const toggleZeroTracePopup = () => {
    setShowZeroTracePopup(!showZeroTracePopup);
  };

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message using AI hook
      const response = await aiSendMessage([userMessage]);
      
      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant' as const,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  // Render content based on current mode
  const renderMainContent = () => {
    switch (currentMode) {
      case 'dsa-solver':
        return <DSASolver 
          onSolve={async () => ({}) as any}
          onAnalyzeComplexity={async () => ({}) as any}
          onGenerateTestCases={async () => []}
          isLoading={false}
        />;
      case 'competitive':
        return (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-6">Competitive Programming Mode</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1D2333] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Algorithm Practice</h2>
                  <p className="text-[#AAB4CF] mb-4">Practice advanced algorithms and data structures</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Start Practice
                  </button>
                </div>
                <div className="bg-[#1D2333] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Contest Mode</h2>
                  <p className="text-[#AAB4CF] mb-4">Simulate real competitive programming contests</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Join Contest
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'interview':
        return (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-6">Interview Preparation</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1D2333] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Coding Questions</h2>
                  <p className="text-[#AAB4CF] mb-4">Practice common coding interview questions</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Start Practice
                  </button>
                </div>
                <div className="bg-[#1D2333] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">System Design</h2>
                  <p className="text-[#AAB4CF] mb-4">Learn system design concepts and patterns</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'optimization':
        return (
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-6">Code Optimization</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1D2333] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Performance Analysis</h2>
                  <p className="text-[#AAB4CF] mb-4">Analyze and optimize your code performance</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Analyze Code
                  </button>
                </div>
                <div className="bg-[#1D2333] rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Memory Optimization</h2>
                  <p className="text-[#AAB4CF] mb-4">Optimize memory usage and reduce footprint</p>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                    Optimize Memory
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex flex-col">
            <MessageList messages={messages} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121826] to-[#1A1F2F] text-white">
      {/* ZeroTrace AI Popup Overlay */}
      {showZeroTracePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={toggleZeroTracePopup}
              className="absolute -top-4 -right-4 w-8 h-8 bg-[#1D2333] rounded-full flex items-center justify-center text-white hover:bg-[#2A3142] transition-colors z-10"
            >
              ×
            </button>
            <ZeroTracePopup />
          </div>
        </div>
      )}

      {/* Main App Layout */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar 
          currentMode={currentMode} 
          onModeChange={handleModeChange}
          onZeroTraceToggle={toggleZeroTracePopup}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header 
            currentMode={currentMode}
            onZeroTraceToggle={toggleZeroTracePopup}
          />
          
          {/* Welcome Screen or Main Content */}
          {messages.length === 0 && currentMode === 'chat' ? (
            <WelcomeScreen onStartChat={() => setCurrentMode('chat')} />
          ) : (
            renderMainContent()
          )}
        </div>
      </div>

      {/* API Key Modal */}
      {showApiKeyModal && (
        <ApiKeyModal
          onSubmit={handleApiKeySubmit}
          onClose={() => setShowApiKeyModal(false)}
        />
      )}
    </div>
  );
}

export default App;