import React from 'react';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  onTrack: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = React.memo(({ tool, onTrack, isFavorite = false, onToggleFavorite }) => {
  // Calculate trust bar width percentage
  const trustPercentage = (tool.trustScore / 5) * 100;

  return (
    <article className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full transform hover:-translate-y-2 overflow-hidden">
      {/* Visual Accents */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${tool.isSponsored ? 'from-amber-400 to-amber-600' : 'from-blue-500 to-emerald-500'} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

      {/* Badges Container */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(tool.id);
          }}
          className={`p-2.5 rounded-full transition-all shadow-md border ${
            isFavorite 
              ? 'bg-red-500 border-red-500 text-white' 
              : 'bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {tool.isSponsored && (
          <span className="bg-amber-500 text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-wider">
            ⭐ Sponsored
          </span>
        )}
      </div>

      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-110 transition-transform bg-slate-50 duration-500">
          <img 
            src={tool.logo} 
            alt={`${tool.name} logo`} 
            className="w-full h-full object-cover" 
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-lg text-[#0B1F3B] dark:text-white truncate group-hover:text-[#3B82F6] transition-colors">{tool.name}</h3>
            {tool.isVerified && (
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="inline-block text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[#3B82F6] dark:text-blue-300 uppercase tracking-widest border border-blue-100 dark:border-blue-800">
              {tool.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-grow leading-relaxed font-medium">
        {tool.description}
      </p>

      {/* Trust & Stats Footer */}
      <div className="space-y-4 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
             <div className="flex justify-between items-center mb-1.5">
               <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Vault Trust Index</span>
               <span className="text-[11px] font-black text-blue-600 dark:text-blue-400">{tool.trustScore}/5.0</span>
             </div>
             <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out" 
                 style={{ width: `${trustPercentage}%` }}
               ></div>
             </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="text-xs font-black">{tool.rating}</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">User Rated</span>
          </div>
        </div>

        <a
          href={`${tool.url}?ref=sgaivault`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack(tool.id)}
          className="w-full flex items-center justify-center bg-[#0B1F3B] dark:bg-[#3B82F6] hover:scale-[1.02] active:scale-95 text-white py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10"
        >
          Try Tool Now
        </a>
      </div>
    </article>
  );
});