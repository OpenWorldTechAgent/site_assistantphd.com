"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Moon, Zap, User, Upload, MessageSquare, ShieldCheck, Lock,
  Clock, Heart, Brain, Sparkles, Server, Cpu, Globe, Database, Layers,
  Wand2, UserCircle, Coins, TrendingUp, CpuIcon, ArrowRightLeft, 
  Check, Box, Maximize2, Share2, Users2, RefreshCw, Eye, Mic, 
  ChevronRight, Mail, Bell, DollarSign, ArrowUpRight, Sparkle, X, 
  Loader2, Camera, AlertTriangle, Map, BarChart3, Rocket, Shield
} from 'lucide-react';

// --- Gemini API Configuration ---
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
const GEMINI_MODEL = "gemini-2.5-flash";

const SET_A = ["Design", "Master", "Build", "Earn", "Navigate", "Architect", "Optimize", "Secure", "Scale"];
const SET_B = [
  "Art", "Music", "Stories", "Education", "Technology", "Skills", 
  "Tools", "Apps", "Systems", "Wealth", "Equity", "Rewards",
  "Expeditions", "Cultures", "Cities", "Presence", "Identity", "Fame",
  "Vitality", "Focus", "Energy", "Freedom", "Privacy", "Sovereignty",
  "Business", "Success", "Growth"
];

// --- Advanced Slot Machine Rolling Component ---
const RollingSlot = ({ items, currentIndex, activeColor }) => {
  const [displayItems, setDisplayItems] = React.useState({
    current: items[currentIndex],
    prev: null,
    key: currentIndex
  });

  React.useEffect(() => {
    if (items[currentIndex] !== displayItems.current) {
      setDisplayItems({
        prev: displayItems.current,
        current: items[currentIndex],
        key: currentIndex
      });
    }
  }, [currentIndex, items]);

  return (
    <div className="inline-grid h-[1.2em] overflow-hidden align-bottom px-2 relative">
      {displayItems.prev && (
        <div
          key={`prev-${displayItems.key}`}
          style={{ gridArea: "1 / 1" }}
          className={`h-[1.2em] leading-[1.2em] flex items-center justify-center md:justify-start whitespace-nowrap ${activeColor} animate-slide-off`}
        >
          {displayItems.prev}
        </div>
      )}
      <div
        key={`curr-${displayItems.key}`}
        style={{ gridArea: "1 / 1" }}
        className={`h-[1.2em] leading-[1.2em] flex items-center justify-center md:justify-start whitespace-nowrap ${activeColor} animate-slide-up`}
      >
        {displayItems.current}
      </div>
    </div>
  );
};

const App = () => {
  const [activeView, setActiveView] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollToWaitlist = () => {
    setActiveView('home');
    setTimeout(() => {
      const element = document.getElementById('waitlist');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const [globalIndex, setGlobalIndex] = useState(0);
  const indexA = Math.floor(globalIndex / 3) % SET_A.length;
  const indexB = globalIndex % SET_B.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalIndex((prev) => {
        console.log("Updating globalIndex to:", prev + 1);
        return prev + 1;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Operator online. The Possibility Engine is synced. How shall we architect your life today?' }]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsTyping(true);

    const url = `https://generativelanguage.googleapis.com/v1alpha/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    try {
      const contents = [...messages, { role: 'user', content: userMsg }].map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: "You are the Assistant-PHD Operator, the central intelligence of the Assistant-PHD platform. Your tone is futuristic, efficient, slightly mysterious, but deeply helpful. Assistant-PHD is a private AI ecosystem for health, wealth, work, and home. PHD stands for different things based on the user: Personal Homework Dashboard (for teens/students), Professional Help & Development (for career growth), and Productivity, Habits, & Discipline (for general optimization). You explain the platform's 'SRE for Life' philosophy—applying Site Reliability Engineering principles like observability and automation to personal life. You are here to help users architect their future and achieve real-world results."
            }]
          },
          contents: contents
        })
      });
      const data = await response.json();
      if (data.error) {
        console.error("Gemini API Error:", data.error);
        setMessages(prev => [...prev, { role: 'assistant', content: `API Error: ${data.error.message}` }]);
      } else {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "System sync error: No content received.";
        setMessages(prev => [...prev, { role: 'assistant', content: text }]);
      }
    } catch (e) { 
      console.error("Fetch Error:", e);
      setMessages(prev => [...prev, { role: 'assistant', content: `Network error: ${e.message}` }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden scroll-smooth">
      <style>{`
        .slot-mask {
          mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>

      {/* Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-slate-950/80 border-r border-white/5 backdrop-blur-xl z-50 shadow-2xl overflow-y-auto custom-scrollbar">
        <div 
          onClick={() => setActiveView('home')}
          className="p-8 flex items-center gap-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors group"
        >
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
            <Brain size={24} className="text-white" />
          </div>
          <div className="hidden md:block">
            <span className="font-black text-lg block leading-none uppercase tracking-tighter italic">Assistant, PHD</span>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-1">Autonomous</span>
          </div>
        </div>
        
        <nav className="p-6 space-y-8">
          <div>
            <span className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Your</span>
            <div className="space-y-2">
              {[
                { id: 'insights', label: 'Insights', icon: <BarChart3 size={20} /> },
                { id: 'vision', label: 'Vision', icon: <Eye size={20} /> },
                { id: 'economy', label: 'Economy', icon: <Coins size={20} /> },
                { id: 'vault', label: 'Vault Data', icon: <Lock size={20} /> },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => scrollToWaitlist()}
                  className="w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left font-bold text-slate-500 hover:text-white hover:bg-white/5"
                >
                  {item.icon}
                  <span className="hidden md:block text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="px-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 block">Platform</span>
            <div className="space-y-2">
              {[
                { id: 'platform-vision', label: 'Vision & Plans', icon: <Rocket size={20} />, active: true },
                { id: 'status', label: 'Status & Health', icon: <Shield size={20} />, active: false },
                { id: 'integrations', label: 'Integrations', icon: <Zap size={20} />, active: false },
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => item.active ? setActiveView(item.id) : scrollToWaitlist()}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left font-bold ${
                    activeView === item.id ? 'text-white bg-white/5 shadow-inner' : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="hidden md:block text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="ml-20 md:ml-64 relative">
        {/* Market Ticker */}
        <div className="sticky top-0 z-40 bg-slate-950/50 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between font-mono">
           <div className="flex gap-10">
              <div className="flex items-center gap-2"><span className="text-indigo-400 font-black text-[10px]">$PHD</span> <span className="text-[10px]">$4.12</span> <span className="text-emerald-400 text-[9px] font-bold">+2.4%</span></div>
              <div className="flex items-center gap-2"><span className="text-purple-400 font-black text-[10px]">$AST</span> <span className="text-[10px]">$1.05</span> <span className="text-emerald-400 text-[9px] font-bold">+0.8%</span></div>
              <div className="flex items-center gap-2"><span className="text-pink-400 font-black text-[10px]">$ASS</span> <span className="text-[10px]">$0.62</span> <span className="text-emerald-400 text-[9px] font-bold">+18.4%</span></div>
           </div>
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 hidden sm:block">Status: Optimal</span>
        </div>

        <div className="relative min-h-screen">
          <AnimatePresence mode="wait">
            {activeView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hero Section: The Possibility Engine */}
                <section className="px-6 md:px-12 py-16 md:py-32 flex flex-col items-center md:items-start text-center md:text-left relative min-h-[75vh] justify-center">
                  <div className="flex items-center gap-2 mb-10 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl w-fit relative z-10">
                    <Sparkles size={16} className="text-indigo-400" />
                    <p className="font-black text-[10px] uppercase tracking-[0.4em]">One Platform. Infinite Possibilities.</p>
                  </div>

                  <h1 className="text-5xl md:text-8xl lg:text-[8.5rem] font-black tracking-tighter leading-[1] uppercase mb-12 relative z-10 select-none">
                    What will you <br />
                    {/* Top Carousel (Slow) */}
                    <RollingSlot items={SET_A} currentIndex={indexA} activeColor="text-indigo-500" />
                    <br />
                    {/* Brighter Connecting Text */}
                    <span className="text-slate-100 text-3xl md:text-5xl lg:text-6xl block my-6 font-mono italic normal-case tracking-tight opacity-100">
                      with your personal Assistant, PhD?
                    </span>
                    {/* Bottom Carousel (Fast) */}
                    <RollingSlot items={SET_B} currentIndex={indexB} activeColor="text-purple-400" />
                  </h1>

                  <p className="text-lg md:text-2xl text-slate-400 max-w-5xl leading-relaxed mb-16 relative z-10 font-medium italic">
                    Distilling your realtime data and telemetry into actionable insights and real-world results.
                    <span className="text-indigo-400 block mt-2">Private AI for your health, wealth, work and home.</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto relative z-10">
                     <a href="#waitlist" className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-105 text-center">
                        Join Genesis Waitlist
                   </a>
                   <button onClick={() => setIsChatOpen(true)} className="bg-white/5 hover:bg-white/10 text-white px-12 py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.4em] backdrop-blur-md border border-white/10 flex items-center justify-center gap-3">
                      Talk to Operator <Mic size={16} />
                   </button>
                </div>
              </section>

              {/* Waitlist Section */}
              <section id="waitlist" className="px-6 md:px-12 py-32 mb-20">
                 <div className="bg-indigo-600 rounded-[80px] p-12 md:p-32 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60" />
                    <div className="relative z-10 max-w-4xl mx-auto">
                       <h2 className="text-6xl md:text-9xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.8] italic">Own Your <br /> Future.</h2>
                       {!isSubmitted ? (
                          <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="flex flex-col md:flex-row gap-4 p-4 bg-white/10 backdrop-blur-3xl rounded-[48px] border border-white/20 shadow-2xl max-w-3xl mx-auto">
                             <input 
                               type="email" 
                               required
                               placeholder="Enter your email address"
                               value={waitlistEmail}
                               onChange={(e) => setWaitlistEmail(e.target.value)}
                               className="flex-1 bg-transparent border-none py-6 px-10 text-white placeholder:text-indigo-300 font-bold text-xl outline-none focus:ring-0"
                             />
                             <button type="submit" className="bg-white text-indigo-700 px-16 py-6 rounded-[40px] font-black text-sm uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 active:scale-95">Join the Waitlist <ChevronRight size={20} /></button>
                          </form>
                       ) : (
                          <div className="bg-white/10 p-12 rounded-[48px] border border-white/20 backdrop-blur-2xl text-center">
                             <ShieldCheck size={80} className="text-emerald-400 mx-auto mb-6" />
                             <h4 className="text-4xl font-black text-white mb-4 uppercase italic">Identity Indexed.</h4>
                             <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm italic">Genesis node activation pending. Welcome to the frontier.</p>
                          </div>
                       )}
                    </div>
                 </div>
              </section>
            </motion.div>
          )}

          {activeView === 'platform-vision' && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-12 md:p-24 max-w-6xl"
            >
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12 italic">Platform Vision.</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
                <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] backdrop-blur-xl">
                  <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 italic tracking-tight">Life Performance Engineering</h3>
                  <p className="text-slate-400 leading-relaxed font-medium italic">
                    Assistant, PHD applies high-performance engineering principles to your daily habits. By measuring what actually matters and automating the mundane, we help you achieve peak consistency. It’s about building a "fail-safe" routine where your health, wealth, and work goals are architected for success.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] backdrop-blur-xl">
                  <div className="bg-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase mb-4 italic tracking-tight">Private Sovereignty</h3>
                  <p className="text-slate-400 leading-relaxed font-medium italic">
                    Your data is your most valuable asset. Assistant-PHD ensures total sovereignty through local-first intelligence and end-to-end encrypted sync. No third parties, no tracking, just your mind, amplified.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-sm font-black uppercase tracking-[0.4em] text-indigo-400 mb-8">The Three Tracks</h4>
                {[
                  { title: "Personal Homework Dashboard", target: "Students & Teens", desc: "A command center for academic excellence. Streamlined assignments, AI study partners, and career pathing." },
                  { title: "Professional Help & Development", target: "Career Growth", desc: "The executive assistant for the modern professional. SRE-style observability for projects, networking, and skill acquisition." },
                  { title: "Productivity, Habits, & Discipline", target: "The Optimization Track", desc: "Refining the human algorithm. Mastering the daily loops that lead to long-term wealth, health, and success." }
                ].map((track, i) => (
                  <div key={i} className="flex gap-8 p-8 border-b border-white/5 items-center group hover:bg-white/5 transition-all rounded-3xl">
                    <span className="text-4xl font-black text-slate-800 transition-colors">0{i+1}</span>
                    <div>
                      <h5 className="font-black uppercase text-xl italic tracking-tight">{track.title}</h5>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2 block">{track.target}</span>
                      <p className="text-slate-500 font-medium italic">{track.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView !== 'home' && activeView !== 'platform-vision' && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6"
            >
              <Loader2 size={48} className="text-indigo-500 animate-spin mb-6" />
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">{activeView} System Initializing</h2>
              <p className="text-slate-500 font-medium italic mb-10">The Possibility Engine is architecting this module. <br /> Check back as the roadmap unfolds.</p>
              
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Want early access?</span>
                <a 
                  href="#waitlist" 
                  onClick={() => setActiveView('home')}
                  className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-[32px] font-black text-[10px] uppercase tracking-[0.4em] backdrop-blur-md border border-white/10 transition-all hover:scale-105"
                >
                  Join the Wishlist
                </a>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- Floating Operator Assistant --- */}
      <div className={`fixed bottom-10 right-10 z-[100] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] ${isChatOpen ? 'w-[380px] md:w-[500px]' : 'w-20'}`}>
        {isChatOpen ? (
          <div className="bg-slate-950 border border-white/10 rounded-[56px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden h-[700px] backdrop-blur-3xl">
            <div className="bg-indigo-600 p-10 flex justify-between items-center text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-2xl"><CpuIcon size={24} /></div>
                <div>
                  <span className="font-black block text-xl tracking-tighter italic uppercase leading-none">Assistant-PHD</span>
                  <span className="text-[10px] text-indigo-200 font-black uppercase tracking-[0.2em] mt-1 block">✨ Operator Online</span>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 rounded-full p-2 transition-all"><X size={24} /></button>
            </div>
            <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-slate-900/50 flex flex-col">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-5 rounded-[32px] text-sm font-medium leading-relaxed ${
                     msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none italic'
                   }`}>
                     <div className="whitespace-pre-wrap">{msg.content}</div>
                   </div>
                </div>
              ))}
              {isTyping && <div className="flex gap-1 p-4"><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"/><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-100"/><div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-200"/></div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-10 bg-slate-950 border-t border-white/5">
              <div className="relative group flex gap-3">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={isTyping} placeholder="Speak with the operator..." className="flex-1 bg-white/5 border border-white/10 rounded-[32px] py-5 px-8 text-white outline-none font-mono focus:border-indigo-500/50" />
                <button type="submit" disabled={isTyping || !chatInput.trim()} className="bg-indigo-600 text-white p-5 rounded-[24px] shadow-2xl transition-transform"><Zap size={24} /></button>
              </div>
            </form>
          </div>
        ) : (
          <button onClick={() => setIsChatOpen(true)} className="group relative bg-slate-950 hover:bg-indigo-600 text-white p-7 rounded-[35px] shadow-2xl border border-white/5 transition-all overflow-hidden">
             <MessageSquare size={32} className="relative z-10 text-indigo-400" />
             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
