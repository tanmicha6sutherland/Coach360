import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { ChatInterface } from './components/ChatInterface';
import { initializeChat } from './services/geminiService';

const App: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  // Simple way to force re-render/reset
  const [sessionKey, setSessionKey] = useState(0);

  const handleJoin = (name: string) => {
    initializeChat(name);
    setUserName(name);
  };

  const handleReset = () => {
    setUserName(null);
    setSessionKey(prev => prev + 1);
  };

  if (!userName) {
    return <LoginScreen key={sessionKey} onJoin={handleJoin} />;
  }

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden font-sans text-gray-900">
      <ChatInterface key={sessionKey} userName={userName} onReset={handleReset} />
    </div>
  );
};

export default App;
