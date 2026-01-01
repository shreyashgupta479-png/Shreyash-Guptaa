import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AITool, Category, SortOption } from './types';
import { INITIAL_TOOLS, CATEGORIES, CATEGORY_ICONS } from './constants';
import { ToolCard } from './components/ToolCard';
import { PromptGenerator } from './components/PromptGenerator';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  const [tools, setTools] = useState<AITool[]>(INITIAL_TOOLS);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All' | 'Favorites'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('Popularity');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  // Load favorites from local storage
  useEffect(() => {
    const savedFavs = localStorage.getItem('sgaivault_favorites');
    if (savedFavs) {
      try {
        setFavorites(new Set(JSON.parse(savedFavs)));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites to local storage
  useEffect(() => {
    localStorage.setItem('sgaivault_favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Optimized Scroll Handling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dark Mode Persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(24);
  }, [searchQuery, selectedCategory, sortOption]);

  const filteredTools = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return tools
      .filter(tool => {
        const matchesSearch = !query || 
                            tool.name.toLowerCase().includes(query) ||
                            tool.description.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === 'All' 
          ? true 
          : selectedCategory === 'Favorites'
            ? favorites.has(tool.id)
            : tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOption === 'Popularity') return b.clicks - a.clicks;
        if (sortOption === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortOption === 'Highest Rated') return b.rating - a.rating;
        return a.name.localeCompare(b.name);
      });
  }, [tools, searchQuery, selectedCategory, sortOption, favorites]);

  const hotTools = useMemo(() => tools.filter(t => t.isHot).slice(0, 3), [tools]);
  
  const favoritedToolsCount = useMemo(() => favorites.size, [favorites]);

  const handleTrackClick = useCallback((id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, clicks: t.clicks + 1 } : t));
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleDeleteTool = useCallback((id: string) => {
    if (window.confirm('Remove this tool permanently?')) {
      setTools(prev => prev.filter(t => t.id !== id));
      setFavorites(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }, []);

  const handleAddTool = useCallback((tool: AITool) => {
    setTools(prev => [tool, ...prev]);
  }, []);

  const loadMore = () => setVisibleCount(prev => prev + 24);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-200 bg-[#F9FAFB] dark:bg-[#0F172A] pb-20 text-[#0B1F3B] dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="absolute w-full h-full text-[#0B1F3B] dark:text-[#3B82F6]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
              </svg>
              <span className="relative z-10 text-white font-black text-xs">SG</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-[#0B1F3B] dark:text-white hidden sm:block uppercase">
              SGAI <span className="text-[#3B82F6]">VAULT</span>
            </h1>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden lg:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search verified tools..."
                className="w-full bg-slate-100 dark:bg-slate-800/50 border border-transparent rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all dark:text-white shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => {
                setSelectedCategory('Favorites');
                scrollToSection('categories-section');
              }}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="View Favorites"
            >
              <svg className="w-6 h-6 text-red-500" fill={favoritedToolsCount > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favoritedToolsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0F172A]">
                  {favoritedToolsCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#3B82F6] transition-colors"
            >
              Admin Portal
            </button>
            <button className="bg-[#0B1F3B] dark:bg-[#3B82F6] hover:scale-105 active:scale-95 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/10">
              Submit Tool
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[#10B981] text-[10px] font-black uppercase tracking-[0.15em] mb-6 border border-emerald-100 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Verified AI. Smarter Choices.
            </span>
            <h2 className="text-4xl md:text-7xl font-black text-[#0B1F3B] dark:text-white mb-6 leading-[1.1] tracking-tighter">
              Unlock the Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#10B981]">Elite AI Tools</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto font-medium">
              Join 50k+ creators using SGAIVault to discover, compare, and implement from <span className="text-[#3B82F6] font-black">more than 500+</span> verified AI tools in their workflow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollToSection('tools-section')}
                className="w-full sm:w-auto px-8 py-4 bg-[#3B82F6] text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-[#2563EB] transition-all"
              >
                Browse Directory
              </button>
              <button 
                onClick={() => {
                   setSelectedCategory('Favorites');
                   scrollToSection('tools-section');
                }}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800 text-[#0B1F3B] dark:text-white font-black rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                My Saved Vault
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6">
        
        {/* Categories Grid - Optimized with better touch targets */}
        <section id="categories-section" className="mb-20 scroll-mt-24">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`p-6 rounded-3xl transition-all flex flex-col items-center justify-center text-center gap-3 border outline-none focus:ring-2 focus:ring-blue-400 ${
                selectedCategory === 'All'
                  ? 'bg-[#0B1F3B] border-[#0B1F3B] text-white shadow-xl shadow-blue-900/20 scale-105 z-10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-400'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">🌏</span>
              <span className="text-[10px] font-black uppercase tracking-widest">All Tools</span>
            </button>

            <button
              onClick={() => setSelectedCategory('Favorites')}
              className={`p-6 rounded-3xl transition-all flex flex-col items-center justify-center text-center gap-3 border outline-none focus:ring-2 focus:ring-red-400 ${
                selectedCategory === 'Favorites'
                  ? 'bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/20 scale-105 z-10'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-red-400'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">❤️</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`p-6 rounded-3xl transition-all flex flex-col items-center justify-center text-center gap-3 border outline-none focus:ring-2 focus:ring-blue-400 ${
                  selectedCategory === cat
                    ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-xl shadow-blue-500/20 scale-105 z-10'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-[#3B82F6]'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                <span className="text-[10px] font-black uppercase tracking-tighter leading-tight">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Trending Section - Hide when viewing favorites */}
        {selectedCategory !== 'Favorites' && (
          <section id="trending-section" className="mb-20 scroll-mt-24 bg-[#0B1F3B] rounded-[3rem] p-8 md:p-12 text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-3xl font-black tracking-tight mb-2">🔥 Viral Right Now</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">The most clicked tools this hour</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hotTools.map(tool => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    onTrack={handleTrackClick} 
                    isFavorite={favorites.has(tool.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main List */}
        <div id="tools-section" className="scroll-mt-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
             <h2 className="text-2xl font-black text-[#0B1F3B] dark:text-white uppercase tracking-tighter italic">
              {selectedCategory === 'Favorites' ? 'My Saved' : 'Verified'} <span className={selectedCategory === 'Favorites' ? 'text-red-500' : 'text-[#3B82F6]'}>{selectedCategory === 'Favorites' ? 'Vault' : 'Repository'}</span>
            </h2>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="w-full md:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-6 text-xs font-black uppercase tracking-widest text-[#0B1F3B] dark:text-slate-200 outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
              >
                <option value="Popularity">Popularity</option>
                <option value="Highest Rated">High Rated</option>
                <option value="Newest">New Arrival</option>
                <option value="Name">A to Z</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
            {filteredTools.length > 0 ? (
              filteredTools.slice(0, visibleCount).map(tool => (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onTrack={handleTrackClick} 
                  isFavorite={favorites.has(tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-3xl mb-6">
                  {selectedCategory === 'Favorites' ? '❤️' : '🔍'}
                </div>
                <h3 className="text-xl font-black mb-2">
                  {selectedCategory === 'Favorites' ? 'Your vault is empty' : 'No tools found'}
                </h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm">
                  {selectedCategory === 'Favorites' 
                    ? 'Start exploring and heart your favorite AI tools to save them here for quick access.' 
                    : 'Try adjusting your search query or category filters to find what you are looking for.'}
                </p>
                {selectedCategory === 'Favorites' && (
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="mt-6 px-6 py-2 bg-[#3B82F6] text-white font-black text-xs uppercase tracking-widest rounded-xl"
                  >
                    Browse All Tools
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredTools.length && (
            <div className="mt-16 flex justify-center">
              <button 
                onClick={loadMore}
                className="px-12 py-4 bg-white dark:bg-slate-800 text-[#0B1F3B] dark:text-white font-black rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all active:scale-95"
              >
                Load More Tools
              </button>
            </div>
          )}
        </div>

        {/* Prompt Gen Section */}
        <div className="mt-32">
          <PromptGenerator />
        </div>

      </main>

      <footer className="mt-40 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1F3B] pt-20 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg className="w-full h-full text-[#3B82F6]" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
                  </svg>
                </div>
                <h2 className="text-xl font-black tracking-tighter dark:text-white uppercase">SGAIVAULT</h2>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
                The global standard for AI tool discovery with more than 500 AI tools. Verified AI. Smarter Choices. We help you cut through the noise to find tools that actually work.
              </p>
            </div>
            <div>
               <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6">Directory</h4>
               <ul className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                 <li><a href="#tools-section" onClick={(e) => {e.preventDefault(); scrollToSection('tools-section')}} className="hover:text-[#3B82F6] transition-colors">Best Writing Tools</a></li>
                 <li><a href="#tools-section" onClick={(e) => {e.preventDefault(); scrollToSection('tools-section')}} className="hover:text-[#3B82F6] transition-colors">Top Image Gen</a></li>
                 <li><a href="#tools-section" onClick={(e) => {e.preventDefault(); scrollToSection('tools-section')}} className="hover:text-[#3B82F6] transition-colors">Developer Picks</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6">Company</h4>
               <ul className="space-y-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">
                 <li><a href="#" className="hover:text-[#3B82F6] transition-colors">About Us</a></li>
                 <li><a href="#" className="hover:text-[#3B82F6] transition-colors">Advertising</a></li>
                 <li><a href="#" className="hover:text-[#3B82F6] transition-colors">Newsletter</a></li>
               </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black uppercase tracking-[0.2em]">
                © 2024 SGAIVault – Verified AI. Smarter Choices.
              </p>
              <p className="text-[#3B82F6] text-[10px] font-black uppercase tracking-[0.1em]">
                Website Designed and Directed by SHREYASH GUPTA
              </p>
            </div>
            <div className="flex gap-6">
               <span className="text-[#0B1F3B] dark:text-[#3B82F6] text-xs font-black uppercase tracking-widest cursor-pointer hover:underline">Twitter</span>
               <span className="text-[#0B1F3B] dark:text-[#3B82F6] text-xs font-black uppercase tracking-widest cursor-pointer hover:underline">LinkedIn</span>
            </div>
          </div>
        </div>
      </footer>

      {isAdminOpen && (
        <AdminPanel 
          tools={tools}
          onAddTool={handleAddTool}
          onDeleteTool={handleDeleteTool}
          onUpdateTool={() => {}}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
};

export default App;