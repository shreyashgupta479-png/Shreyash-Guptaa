import React, { useState, useCallback } from 'react';
import { AITool, Analytics } from '../types';
import { CATEGORIES } from '../constants';

interface AdminPanelProps {
  tools: AITool[];
  onAddTool: (tool: AITool) => void;
  onUpdateTool: (tool: AITool) => void;
  onDeleteTool: (id: string) => void;
  onClose: () => void;
}

const sanitize = (str: string) => str.replace(/<[^>]*>?/gm, '').trim();

export const AdminPanel: React.FC<AdminPanelProps> = ({ tools, onAddTool, onUpdateTool, onDeleteTool, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'manage' | 'analytics' | 'ads' | 'sponsored'>('manage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newTool, setNewTool] = useState<Partial<AITool>>({
    name: '',
    url: '',
    description: '',
    category: CATEGORIES[0],
    isFeatured: false,
    isHot: false,
    isVerified: true,
    isSponsored: false,
    trustScore: 4.5,
    rating: 4.5,
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'shreyash@123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode. Access denied.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.name || !newTool.url || !newTool.description) {
      alert('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const tool: AITool = {
        ...newTool as AITool,
        id: `tool-${Date.now()}`,
        name: sanitize(newTool.name!),
        description: sanitize(newTool.description!),
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0],
        logo: `https://picsum.photos/seed/${newTool.name!.toLowerCase().replace(/\s/g, '')}/200/200`
      };
      
      onAddTool(tool);
      setNewTool({ 
        name: '', url: '', description: '', category: CATEGORIES[0], 
        isFeatured: false, isHot: false, isVerified: true, isSponsored: false,
        trustScore: 4.5, rating: 4.5 
      });
      alert('Tool published successfully!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const analytics: Analytics = {
    totalClicks: tools.reduce((acc, t) => acc + t.clicks, 0),
    trendingTools: [...tools].sort((a, b) => b.clicks - a.clicks).slice(0, 5).map(t => t.name),
    categoryDistribution: tools.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mb-4 shadow-xl shadow-blue-500/20">🔒</div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">Admin Authentication</h2>
            <p className="text-slate-500 text-sm mt-2">Enter passcode to access management console.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode..."
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white transition-all text-center text-xl tracking-widest"
            />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button 
              type="submit"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Unlock Console
            </button>
            <button type="button" onClick={onClose} className="w-full py-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600">Close</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-0 md:p-8">
      <div className="bg-white dark:bg-slate-900 w-full max-w-7xl h-full md:h-[90vh] rounded-none md:rounded-3xl overflow-hidden shadow-2xl flex border border-slate-200 dark:border-slate-800">
        
        {/* Sidebar */}
        <aside className="w-20 md:w-64 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 hidden md:block">
            <h2 className="text-xl font-black text-blue-600">SGAIVault Admin</h2>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'manage', label: 'Manage Tools', icon: '🛠️' },
              { id: 'analytics', label: 'Analytics', icon: '📊' },
              { id: 'ads', label: 'Ad Slots', icon: '📢' },
              { id: 'sponsored', label: 'Sponsored', icon: '⭐' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button onClick={onClose} className="w-full px-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-300 transition-all flex items-center justify-center gap-2">
              <span className="hidden md:inline">Exit Panel</span> 🚪
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar">
          <header className="px-8 py-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white capitalize">{activeTab} Dashboard</h1>
              <p className="text-sm text-slate-500">Real-time system data and moderation</p>
            </div>
          </header>

          <div className="p-8">
            {activeTab === 'manage' && (
              <div className="space-y-8">
                <section className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-lg font-bold mb-6 dark:text-white">Quick Add AI Tool</h3>
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400">Tool Name</label>
                      <input 
                        type="text" 
                        required
                        value={newTool.name} 
                        onChange={e => setNewTool({...newTool, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" 
                        placeholder="e.g. ChatGPT"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400">Website URL</label>
                      <input 
                        type="url" 
                        required
                        value={newTool.url} 
                        onChange={e => setNewTool({...newTool, url: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white" 
                        placeholder="https://..."
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400">Tool Description</label>
                      <textarea 
                        required
                        value={newTool.description} 
                        onChange={e => setNewTool({...newTool, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none h-28 dark:text-white" 
                        placeholder="Write a compelling summary..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase text-slate-400">Category</label>
                      <select 
                        value={newTool.category} 
                        onChange={e => setNewTool({...newTool, category: e.target.value as any})}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white cursor-pointer"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 pt-6">
                      {['isFeatured', 'isHot', 'isVerified', 'isSponsored'].map(key => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={(newTool as any)[key]} 
                            onChange={e => setNewTool({...newTool, [key]: e.target.checked})} 
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors capitalize">
                            {key.replace('is', '')}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="md:col-span-2 pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSubmitting ? 'Publishing...' : 'Publish Tool Listing'}
                      </button>
                    </div>
                  </form>
                </section>

                <section>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold dark:text-white">Directory Listings</h3>
                    <span className="text-xs font-bold text-slate-400">Total: {tools.length}</span>
                  </div>
                  <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4">Tool Name</th>
                          <th className="px-6 py-4">Clicks</th>
                          <th className="px-6 py-4">Rating</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {tools.slice(0, 15).map(tool => (
                          <tr key={tool.id} className="text-sm dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={tool.logo} className="w-8 h-8 rounded-lg" alt="" loading="lazy" />
                                <span className="font-bold">{tool.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono">{tool.clicks.toLocaleString()}</td>
                            <td className="px-6 py-4 text-yellow-500 font-bold">★ {tool.rating}</td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1">
                                    {tool.isHot && <span title="Hot" className="text-red-500">🔥</span>}
                                    {tool.isVerified && <span title="Verified" className="text-emerald-500">✔</span>}
                                    {tool.isSponsored && <span title="Sponsored" className="text-amber-500">⭐</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4 flex gap-4">
                              <button onClick={() => alert('Update logic here')} className="text-blue-500 font-bold uppercase text-[10px]">Edit</button>
                              <button onClick={() => onDeleteTool(tool.id)} className="text-red-500 font-bold uppercase text-[10px]">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Clicks', val: analytics.totalClicks.toLocaleString(), color: 'text-blue-600', icon: '🖱️' },
                  { label: 'Avg CTR', val: '12.4%', color: 'text-emerald-500', icon: '📈' },
                  { label: 'Revenue Est.', val: `$${(analytics.totalClicks * 0.42).toFixed(2)}`, color: 'text-amber-500', icon: '💰' },
                  { label: 'Active Tools', val: tools.length, color: 'text-indigo-500', icon: '🛠️' }
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between h-32">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      {stat.icon} {stat.label}
                    </span>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.val}</p>
                  </div>
                ))}

                <div className="md:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h4 className="font-bold mb-6 flex items-center gap-2">🚀 Trending Velocity</h4>
                  <div className="space-y-4">
                    {analytics.trendingTools.map((name, i) => (
                      <div key={name} className="flex items-center gap-4">
                        <span className="text-xs font-black text-slate-300 w-6">0{i+1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-bold dark:text-slate-200">{name}</span>
                            <span className="text-xs font-black text-emerald-500">↑ {Math.floor(Math.random() * 20) + 10}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${95 - i * 15}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0B1F3B] text-white p-8 rounded-3xl flex flex-col justify-center items-center text-center">
                   <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4">✨</div>
                   <h4 className="font-black text-lg mb-2">Pro Insights</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">Engagement is highest in "Chatbots" this week. Optimize your ad placements there.</p>
                </div>
              </div>
            )}

            {activeTab === 'ads' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 1, title: 'Header Banner', size: '728x90', current: 'Google AdSense' },
                  { id: 2, title: 'Sidebar Square', size: '300x250', current: 'Direct Sale' }
                ].map(slot => (
                  <div key={slot.id} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <h4 className="font-black text-lg mb-4">Slot {slot.id}: {slot.title}</h4>
                    <p className="text-sm text-slate-500 mb-6">Live Status: <span className="text-emerald-500 font-bold">{slot.current}</span></p>
                    <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center border border-slate-300 dark:border-slate-600">
                       <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Preview {slot.size}</span>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[10px] uppercase hover:bg-slate-100 transition-all">Edit Slot</button>
                      <button className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase hover:bg-blue-700 transition-all shadow-lg active:scale-95">Update Integration</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'sponsored' && (
              <div className="space-y-6">
                 <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-8 rounded-3xl">
                   <h4 className="font-black text-amber-900 dark:text-amber-400 text-xl mb-2">Priority Engine</h4>
                   <p className="text-sm text-amber-700 dark:text-amber-300/60 leading-relaxed">Tools with 'Sponsored' status are pushed to the top of the 'All' and Category specific views. Currently running {tools.filter(t => t.isSponsored).length} campaigns.</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {tools.filter(t => t.isSponsored).map(tool => (
                     <div key={tool.id} className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between shadow-sm">
                       <span className="font-bold text-sm truncate mr-4">{tool.name}</span>
                       <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-amber-600 uppercase">Active</span>
                         <button className="text-red-500 font-black text-[10px] hover:underline">Stop</button>
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
