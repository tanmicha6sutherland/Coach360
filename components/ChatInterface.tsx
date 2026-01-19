import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { sendMessageToGemini, generateCoachingSummary } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { Button } from './Button';

interface ChatInterfaceProps {
  userName: string;
  onReset: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userName, onReset }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial greeting
  useEffect(() => {
    const initialGreeting = async () => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      try {
        const text = await sendMessageToGemini("Hello, I am ready to start my coaching session.");
        addMessage('model', text);
      } catch (e) {
        addMessage('model', "Hi there! I'm really looking forward to our session. What's on your mind regarding your team today?");
      } finally {
        setIsTyping(false);
      }
    };
    initialGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isSessionEnded]);

  const addMessage = (role: 'user' | 'model', text: string) => {
    // Check for session end tag in model messages
    let cleanText = text;
    let ended = false;

    if (role === 'model' && text.includes('[SESSION_END]')) {
      cleanText = text.replace('[SESSION_END]', '').trim();
      ended = true;
    }

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role,
      text: cleanText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    if (ended) {
      setIsSessionEnded(true);
    }
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    if (!overrideText) setInputText('');
    
    addMessage('user', textToSend);
    setIsTyping(true);

    try {
      const response = await sendMessageToGemini(textToSend);
      addMessage('model', response);
    } catch (error) {
      console.error(error);
      addMessage('model', "I apologize, I lost my train of thought. Could you say that again?");
    } finally {
      setIsTyping(false);
    }
  };

  const handleReplyTo = (text: string) => {
    const quote = `> "${text}"\n\n`;
    setInputText(prev => prev + quote);
    inputRef.current?.focus();
  };

  const handleClarify = (contextText: string) => {
    const query = `What do you mean by: "${contextText}"? Could you elaborate?`;
    handleSendMessage(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSummary = async () => {
    setIsGeneratingSummary(true);
    const summary = await generateCoachingSummary(messages);
    
    if (summary.startsWith('[RESUME_SESSION]')) {
      const resumeMessage = summary.replace('[RESUME_SESSION]', '').trim();
      addMessage('model', resumeMessage);
      setIsSessionEnded(false);
    } else {
      addMessage('model', `**SESSION SUMMARY & ANALYSIS**\n\n${summary}`);
    }
    
    setIsGeneratingSummary(false);
  };

  const handleCopy = () => {
    const textLog = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n\n');
    navigator.clipboard.writeText(textLog).then(() => {
      window.print();
    });
  };

  const getEmbedCode = () => {
    const url = window.location.href;
    // Standard iframe for embedding. 
    return `<iframe src="${url}" width="100%" height="800" style="border:0;" allow="microphone; clipboard-write; autoplay"></iframe>`;
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Background Image Layer - Tech Corporate */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop)' }}
      />
      {/* White Overlay to keep text readable */}
      <div className="absolute inset-0 z-0 bg-white/95 backdrop-blur-[2px]" /> 
      
      {/* Content Container */}
      <div className="flex flex-col h-full z-10 relative">
        
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-blue-100 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
              alt="Coach Cammy" 
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
            />
            <div>
              <h2 className="font-bold text-gray-800">Coach Cammy</h2>
              <p className="text-xs text-gray-500">Mentoring {userName} • @coachcammy</p>
            </div>
          </div>
          {isSessionEnded && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium border border-green-200">
              Session Complete
            </span>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
          <div className="max-w-3xl mx-auto flex flex-col pb-8">
              <div className="text-center text-xs text-blue-400 mb-6 uppercase tracking-wider font-semibold">
                Session Started
              </div>
              
              {messages.map((msg, index) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  onReplyTo={handleReplyTo}
                  onClarify={handleClarify}
                  disableHover={index === 0 && msg.role === 'model'}
                />
              ))}

              {isTyping && (
                <div className="flex justify-start animate-pulse mb-8 ml-10">
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-5 py-4 shadow-sm">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Session End Controls */}
              {isSessionEnded && (
                <div className="bg-white/95 backdrop-blur p-6 rounded-xl shadow-lg border border-blue-100 text-center animate-fade-in-up mt-4 mx-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Conversation Ended</h3>
                  <p className="text-sm text-gray-500 mb-6">How would you like to proceed?</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={handleSummary} isLoading={isGeneratingSummary} variant="primary">
                      Generate Summary
                    </Button>
                    <Button onClick={handleCopy} variant="secondary">
                      Copy & Print
                    </Button>
                    <Button onClick={onReset} variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                      Exit & Reset
                    </Button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        {!isSessionEnded && (
          <div className="bg-white/95 backdrop-blur border-t border-blue-100 p-4 shadow-lg z-20">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your response here..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[60px] max-h-[150px] shadow-inner text-gray-900 placeholder-gray-500"
                  rows={2}
                />
                <div className="absolute right-2 bottom-2">
                  <Button 
                    onClick={() => handleSendMessage()} 
                    disabled={!inputText.trim() || isTyping}
                    className="rounded-full !px-4 !py-1.5 text-sm"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Embed Code & Troubleshooting */}
        <div className="bg-gray-100/90 border-t border-gray-200 py-3 px-6">
          <div className="max-w-3xl mx-auto space-y-2">
            
            {/* Embed Code Dropdown */}
            <details className="text-xs text-gray-500 cursor-pointer group/embed">
              <summary className="hover:text-blue-600 transition-colors font-medium">Show Articulate Rise 360 Embed Code</summary>
              <div className="mt-2 bg-gray-200 p-3 rounded-md border border-gray-300 relative">
                <code className="break-all block font-mono text-[10px] text-gray-700">{getEmbedCode()}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(getEmbedCode())}
                  className="absolute top-2 right-2 bg-white text-gray-600 px-2 py-1 rounded text-[10px] shadow-sm hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                >
                  Copy Code
                </button>
              </div>
            </details>

            {/* Troubleshooting Dropdown */}
            <details className="text-xs text-gray-500 cursor-pointer group/troubleshoot">
              <summary className="hover:text-red-600 transition-colors font-medium text-red-500">Troubleshooting: White Screen / Not Loading</summary>
              <div className="mt-2 bg-red-50 p-4 rounded-md border border-red-200 text-gray-700 space-y-2">
                <p className="font-bold text-red-800">Deployment Steps (Must do!):</p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li><strong>Environment Variable Name:</strong> Ensure your environment variable is named <code>API_KEY</code>.</li>
                  <li><strong>Build Command:</strong> Ensure Netlify is running <code>npm run build</code> and the publish directory is <code>dist</code>. (This happens automatically with the provided package.json).</li>
                  <li><strong>Trigger Re-deploy:</strong> After changing environment variables, you must go to "Deploys" and "Trigger Deploy" -> "Deploy Site" for changes to take effect.</li>
                </ul>
              </div>
            </details>

          </div>
        </div>
      </div>
    </div>
  );
};
