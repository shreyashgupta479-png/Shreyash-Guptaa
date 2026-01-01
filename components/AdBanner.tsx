
import React from 'react';

interface AdBannerProps {
  label?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ label = "Sponsored Advertisement" }) => {
  return (
    <div className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-8 flex flex-col items-center justify-center min-h-[120px]">
      <span className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-semibold">{label}</span>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500 rounded flex items-center justify-center text-white font-bold">ADS</div>
        <div>
          <h4 className="font-bold text-slate-700 dark:text-slate-200">Your Brand Here</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">Reach 50,000+ AI enthusiasts daily.</p>
        </div>
        <button className="ml-4 px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-lg text-sm font-medium">
          Advertise
        </button>
      </div>
    </div>
  );
};
