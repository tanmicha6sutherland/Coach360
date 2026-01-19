import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onReplyTo: (text: string) => void;
  onClarify: (text: string) => void;
  disableHover?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onReplyTo, onClarify, disableHover }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8 group relative items-end gap-2`}>
      
      {/* Coach Avatar (Only show for coach) */}
      {!isUser && (
        <img 
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
          alt="Coach"
          className="w-8 h-8 rounded-full object-cover border border-blue-100 shadow-sm mb-1"
        />
      )}

      <div 
        className={`
          relative max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed
          ${isUser 
            ? 'bg-gradient-to-br from-blue-900 via-purple-800 to-pink-600 text-white rounded-br-none shadow-md' 
            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none ml-1'
          }
        `}
      >
        {/* Content */}
        <div className="whitespace-pre-wrap">{message.text}</div>

        {/* Hover Actions - Only for Coach messages, if not disabled */}
        {!isUser && !disableHover && (
          // We use top-full with pt-2 to create a continuous hoverable area (bridge) from the bubble to the buttons
          <div className="absolute top-full left-0 pt-2 hidden group-hover:flex items-center gap-2 z-10 w-max">
            <button
              onClick={() => onClarify(message.text)}
              className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 shadow-sm transition-all whitespace-nowrap"
            >
              What do you mean by this?
            </button>
            <button
              onClick={() => onReplyTo(message.text)}
              className="bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 shadow-sm transition-all whitespace-nowrap"
            >
              Reply to this
            </button>
          </div>
        )}
      </div>
    </div>
  );
};