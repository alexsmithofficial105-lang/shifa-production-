import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Film, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-6 text-center animate-fadeIn">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#3b82f6] mx-auto">
          <Film className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#3b82f6] font-bold">
            Scene Not Found (404)
          </span>
          <h1 className="text-3xl font-bold text-white font-brand">
            Frame Out of Focus
          </h1>
          <p className="text-sm text-neutral-400">
            The page you are looking for has been moved or does not exist in our production slate.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigateTo('home')}
            className="px-6 py-3 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
