
import React, { useState } from 'react';
import { generatePrompt } from '../services/geminiService';

export const PromptGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Chat');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    const prompt = await generatePrompt(topic, type);
    setResult(prompt);
    setLoading(false);
  };

  return (
    <section className="bg-[#0B1F3B] rounded-[3rem] p-8 md:p-12 mb-12 text-white shadow-2xl border border-[#3B82F6]/20 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#3B82F6] p-3 rounded-2xl shadow-xl shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">Prompt Engine</h2>
            {/* Updated label to accurately reflect the Gemini 3 model version */}
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Powered by Gemini 3</p>
          </div>
        </div>
        
        <p className="text-slate-300 mb-10 font-medium leading-relaxed max-w-xl">Don't know what to ask? Our AI-driven generator crafts high-conversion prompts for any verified tool in the directory.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="What's the goal? (e.g. futuristic logo design)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:bg-white/10 focus:border-[#3B82F6]/50 transition-all placeholder:text-white/30 text-white font-medium"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:bg-white/10 text-white cursor-pointer font-black uppercase text-xs tracking-widest"
          >
            <option className="bg-[#0B1F3B]" value="Chat">Chatbot</option>
            <option className="bg-[#0B1F3B]" value="Image">Image Gen</option>
            <option className="bg-[#0B1F3B]" value="Code">Coding</option>
            <option className="bg-[#0B1F3B]" value="Video">Video AI</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 active:scale-95"
          >
            {loading ? 'Thinking...' : 'Generate'}
          </button>
        </div>

        {result && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 relative animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.3em]">Optimized Prompt</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert('Prompt locked into clipboard! 📋');
                }}
                className="text-xs font-black text-slate-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-widest"
              >
                Copy 📄
              </button>
            </div>
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium text-slate-200">{result}</p>
          </div>
        )}
      </div>
    </section>
  );
};
