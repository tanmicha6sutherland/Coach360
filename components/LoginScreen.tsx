import React, { useState } from 'react';
import { Button } from './Button';

interface LoginScreenProps {
  onJoin: (name: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
       {/* Background decoration: Tech/Abstract Corporate */}
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none"></div>

      {/* Profile Card Container */}
      <div className="bg-white/95 backdrop-blur-sm max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-blue-100 relative z-10">
        
        {/* Banner Image: Dark Blue -> Purple -> Magenta Gradient */}
        <div className="h-40 bg-gradient-to-r from-blue-950 via-purple-800 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-4 right-4 flex gap-3">
             {/* Mock Connect Button */}
             <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold border border-white/30 cursor-default">
                Coach Profile
             </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-20 mb-6">
             {/* Avatar - Big */}
             <img 
               src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400" 
               alt="Coach Cammy"
               className="w-40 h-40 rounded-full border-[6px] border-white shadow-xl object-cover bg-blue-50"
             />
             {/* Social Handles (Non-clickable) */}
             <div className="flex gap-3 mb-2 opacity-60">
                <span className="text-gray-500" title="LinkedIn">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </span>
                <span className="text-gray-500" title="Instagram">
                  <span className="sr-only">@coachcammy</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </span>
                <span className="text-gray-400 text-xs self-center">@coachcammy</span>
             </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Coach Cammy</h1>
            <p className="text-gray-600 text-sm font-medium">Executive Performance Coach | Author of "Lead with Heart"</p>
            <p className="text-gray-500 text-sm mt-4 leading-relaxed">
              This AI-powered simulation helps you practice difficult conversations, refine your leadership style, and build actionable management strategies in a safe environment.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 mb-2 shadow-sm">
            <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-3">Ready to begin?</h2>
            <p className="text-blue-800 text-sm leading-relaxed mb-4">
              I believe every manager has the answer inside them. Enter your name below to start your personalized coaching session.
            </p>
            
            <form onSubmit={handleSubmit} className="mt-4">
              <label htmlFor="name" className="block text-xs font-semibold text-blue-900 mb-1 uppercase">
                What should I call you?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="name"
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none bg-white text-gray-900 placeholder-gray-400"
                  placeholder="Your First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={!name.trim()}
                  className="!py-2 !px-6 text-sm"
                >
                  Start Session
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-6 max-w-md relative z-10 font-medium">
        CoachSim 360 &copy; 2024. AI-Powered Leadership Training.
      </p>
    </div>
  );
};