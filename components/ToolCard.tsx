import React from 'react';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  onTrack: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = React.memo(({ tool, onTrack, isFavorite = false, onToggleFavorite }) => {
  return (
    <article className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Badges Container */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
        <button 
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(tool.id);
          }}
          className={`p-2 rounded-full transition-all shadow-sm border ${
            isFavorite 
              ? 'bg-red-500 border-red-500 text-white' 
              : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500'
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        {tool.isSponsored && (
          <span className="bg-[#F59E0B] text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            ⭐ Sponsored
          </span>
        )}
        <div className="flex gap-1">
          {tool.isHot && (
            <span className="bg-[#EF4444] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
              🔥 HOT
            </span>
          )}
          {tool.isVerified && (
            <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm" title="Verified by SGAIVault">
              ✔ VERIFIED
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 dark:border-slate-700 shadow-inner group-hover:scale-105 transition-transform bg-slate-50">
          <img 
            src={tool.logo} 
            alt={`${tool.name} logo`} 
            className="w-full h-full object-cover" 
            loading="lazy"
            decoding="async" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-lg text-[#0B1F3B] dark:text-white truncate group-hover:text-[#3B82F6] transition-colors">{tool.name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
             <span className="inline-block text-[9px] font-black px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-[#3B82F6] dark:text-blue-300 uppercase tracking-widest">
              {tool.category}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2" aria-label={`Rating: ${tool.rating} out of 5 stars`}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(tool.rating) ? 'text-[#F59E0B]' : 'text-slate-200 dark:text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-[11px] font-black text-slate-400 ml-1">{tool.rating}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
        {tool.description}
      </p>

      <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Trust Index</span>
          <span className="text-sm font-black text-[#0B1F3B] dark:text-white">{tool.trustScore}/5.0</span>
        </div>
        <a
          href={`${tool.url}?ref=sgaivault`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onTrack(tool.id)}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try Tool
        </a>
      </div>
    </article>
  );
});