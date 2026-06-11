import React, { useState, useEffect, useMemo } from 'react';
import { Search, Settings, Plus, Tv, X, AlignLeft, Sparkles, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import VideoPlayer from './components/VideoPlayer';
import { defaultChannels, CATEGORIES, Channel } from './data/channels';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Admin form state
  const [newChanName, setNewChanName] = useState('');
  const [newChanUrl, setNewChanUrl] = useState('');
  const [newChanCat, setNewChanCat] = useState(CATEGORIES[1]);

  // Admin Auth state
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('stream_channels');
    if (saved) {
      try {
        setChannels(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('stream_channels', JSON.stringify(channels));
  }, [channels]);

  const filteredChannels = useMemo(() => {
    return channels.filter(ch => {
      const matchName = ch.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCat === 'All' || ch.cat === activeCat;
      return matchName && matchCat;
    });
  }, [channels, searchQuery, activeCat]);

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChanName || !newChanUrl) return;
    const newChan: Channel = {
      id: Date.now().toString(),
      name: newChanName,
      url: newChanUrl,
      cat: newChanCat,
      logo: `https://placehold.co/100x100/111827/00ffff?text=${newChanName.slice(0,3)}`
    };
    setChannels([newChan, ...channels]);
    setShowAdminPanel(false);
    setNewChanName('');
    setNewChanUrl('');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'admin' && adminPass === 'admin') {
      setIsAdminAuth(true);
      setLoginError('');
    } else {
      setLoginError('Invalid ID or Password');
    }
  };

  const handleLogout = () => {
    setIsAdminAuth(false);
    setAdminId('');
    setAdminPass('');
  };

  const handleRemoveChannel = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setChannels(prev => prev.filter(c => c.id !== id));
    if (activeChannel?.id === id) setActiveChannel(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* Header */}
      <header className="h-16 shrink-0 border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 text-cyan-400 hover:bg-cyan-900/30 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <AlignLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Tv className="w-4 h-4 text-cyan-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent hidden sm:block">
              CodeCloudBD Stream
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-xs font-semibold text-rose-400 tracking-wider">LIVE</span>
          </div>
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 transition-all group"
          >
            <Settings className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
        
        {/* Player Section */}
        <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8 flex flex-col gap-6 scrollbar-hide">
          <div className="w-full max-w-5xl mx-auto space-y-6">
            <VideoPlayer 
              url={activeChannel?.url} 
              poster={activeChannel?.logo} 
            />
            
            <AnimatePresence mode="popLayout">
              {activeChannel && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900/50 border border-cyan-900/40 rounded-xl p-4 lg:p-5 flex items-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur"
                >
                  <img 
                    src={activeChannel.logo} 
                    alt={activeChannel.name} 
                    className="w-16 h-16 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0 shadow-lg"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/111827/00ffff?text=TV`; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">{activeChannel.name}</h2>
                    <p className="text-sm text-cyan-400 font-medium uppercase tracking-wider">{activeChannel.cat}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    Optimal Stream
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 right-0 z-50 w-80 sm:w-96 bg-slate-950/95 lg:bg-slate-900/40 backdrop-blur-2xl border-l border-cyan-900/30 flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header Mobile Close */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="font-bold text-cyan-400">Channels</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 border-b border-cyan-900/30 shrink-0">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase hidden lg:block">Available Channels</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500/50" />
                <input 
                  type="text" 
                  placeholder="Search channels..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/50 border border-cyan-900/40 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/60 transition-all shadow-inner"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`
                      snap-start shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border
                      ${activeCat === cat 
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 relative">
              <AnimatePresence>
                {filteredChannels.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-2"
                  >
                    <Search className="w-8 h-8 opacity-50" />
                    <p className="text-sm">No channels found</p>
                  </motion.div>
                ) : (
                  filteredChannels.map((ch, i) => (
                    <motion.button 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      key={ch.id}
                      onClick={() => { setActiveChannel(ch); setIsSidebarOpen(false); }}
                      className={`
                        w-full flex items-center gap-4 p-3 rounded-xl border text-left transition-all duration-200 group
                        ${activeChannel?.id === ch.id 
                          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                          : 'bg-slate-900/30 border-slate-800/50 hover:bg-slate-800 hover:border-slate-700'}
                      `}
                    >
                      <img 
                        src={ch.logo} 
                        alt={ch.name} 
                        className={`w-12 h-12 rounded-lg object-cover bg-slate-950 border transition-all ${activeChannel?.id === ch.id ? 'border-cyan-500/50' : 'border-slate-800 group-hover:border-slate-600'}`}
                        onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/111827/00ffff?text=TV`; }}
                      />
                      <div className="flex-1 min-w-0 pr-2">
                        <h4 className={`text-sm font-semibold truncate ${activeChannel?.id === ch.id ? 'text-cyan-300' : 'text-slate-200'}`}>{ch.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">{ch.cat}</span>
                        </div>
                      </div>
                      
                      {activeChannel?.id === ch.id ? (
                        <div className="shrink-0 flex gap-1 items-center px-2">
                          <motion.div animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 bg-cyan-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [12, 6, 12] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-cyan-400 rounded-full"></motion.div>
                          <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-cyan-400 rounded-full"></motion.div>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => handleRemoveChannel(e, ch.id)}
                          className="shrink-0 p-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove custom channel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </motion.button>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* Sidebar Backdrop Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {showAdminPanel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowAdminPanel(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-cyan-900/50 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/50">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Admin Control Panel
                </h2>
                <button onClick={() => setShowAdminPanel(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {!isAdminAuth ? (
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    {loginError && (
                      <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg text-center font-semibold mb-4">
                        {loginError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Admin ID</label>
                      <input 
                        type="text" 
                        required
                        value={adminId}
                        onChange={e => setAdminId(e.target.value)}
                        placeholder="Enter ID"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Password</label>
                      <input 
                        type="password" 
                        required
                        value={adminPass}
                        onChange={e => setAdminPass(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                      />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setShowAdminPanel(false)} className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm border border-slate-700 hover:bg-slate-800 transition-colors">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                        Login
                      </button>
                    </div>
                  </form>
                ) : (
                <form onSubmit={handleAddChannel} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Channel Name</label>
                    <input 
                      type="text" 
                      required
                      value={newChanName}
                      onChange={e => setNewChanName(e.target.value)}
                      placeholder="e.g. Neo Sports"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">M3U8 Stream URL</label>
                    <input 
                      type="url" 
                      required
                      value={newChanUrl}
                      onChange={e => setNewChanUrl(e.target.value)}
                      placeholder="https://example.com/stream.m3u8"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">Category</label>
                    <select 
                      value={newChanCat}
                      onChange={e => setNewChanCat(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 appearance-none"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => { setShowAdminPanel(false); handleLogout(); }} className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm border border-slate-700 hover:bg-slate-800 transition-colors">
                      Logout
                    </button>
                    <button type="submit" className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Channel
                    </button>
                  </div>
                </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
