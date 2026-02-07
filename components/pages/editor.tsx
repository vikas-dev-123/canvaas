'use client'

import React, { useState }  from 'react';
import { Layout, Palette, Code, Sparkles, Move, Type, Image as ImageIcon, Box, Play, CheckCircle2, Terminal } from 'lucide-react';
 

export const EditorDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'code' | 'ai'>('design');
  const [copy, setCopy] = useState({ headline: "Architecture as Art.", subheadline: "Design with the artistic freedom of a brushstroke, powered by a core that never fails." });
  const [loading, setLoading] = useState(false);

   

  return (
    <section className="py-40 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-[10px] font-black tracking-[0.8em] uppercase text-slate-600 mb-8">The Professional Workstation</h2>
          <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.85]">
            Engineered <br /><span className="text-slate-600">to Create.</span>
          </h3>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            A high-performance visual environment for the modern architect. Where every interaction is synchronized with the core.
          </p>
        </div>

        <div className="relative group perspective-lg">
          {/* Main App Container */}
          <div className="relative rounded-3xl shadow-[0_80px_150px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden bg-[#111] preserve-3d transition-transform duration-1000 group-hover:rotate-x-1">
            
            {/* Professional OS Bar */}
            <div className="bg-[#151515] border-b border-white/5 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/5"></div>
                  <div className="w-3 h-3 rounded-full bg-white/5"></div>
                  <div className="w-3 h-3 rounded-full bg-white/5"></div>
                </div>
                <div className="h-4 w-px bg-white/10"></div>
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                  <Terminal className="w-3 h-3" />
                  CANVAS_PRO_WORKSPACE_v2.0
                </div>
              </div>
              <div className="flex bg-[#0a0a0a] p-1.5 rounded-xl border border-white/5">
                <button onClick={() => setActiveTab('design')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'design' ? 'bg-white text-black' : 'text-slate-500'}`}>VISUAL</button>
                <button onClick={() => setActiveTab('code')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'code' ? 'bg-white text-black' : 'text-slate-500'}`}>CODE</button>
                <button onClick={() => setActiveTab('ai')} className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'ai' ? 'bg-white text-black' : 'text-slate-500'}`}>GEN_AI</button>
              </div>
              <div className="flex gap-4">
                 <button className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                    <Play className="w-3 h-3 fill-current" /> DEPLOY_LIVE
                 </button>
              </div>
            </div>

            <div className="flex h-[800px]">
              {/* Left Toolbar */}
              <div className="w-16 bg-[#111] border-r border-white/5 flex flex-col items-center py-10 gap-10">
                <button className="p-3 text-white bg-white/10 rounded-xl"><Move className="w-5 h-5" /></button>
                <button className="p-3 text-slate-600 hover:text-white transition-colors"><Type className="w-5 h-5" /></button>
                <button className="p-3 text-slate-600 hover:text-white transition-colors"><ImageIcon className="w-5 h-5" /></button>
                <button className="p-3 text-slate-600 hover:text-white transition-colors"><Layout className="w-5 h-5" /></button>
                <div className="flex-1"></div>
                <button className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all" onClick={() => setActiveTab('ai')}><Sparkles className="w-5 h-5" /></button>
              </div>

              {/* Inspector Panel */}
              <div className="w-80 bg-[#151515] border-r border-white/5 p-10 hidden lg:block overflow-y-auto">
                {activeTab === 'design' && (
                  <div className="space-y-12">
                    <section>
                      <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">Node Tree</h4>
                      <div className="space-y-3">
                        <div className="p-4 text-[11px] font-black bg-white/5 text-blue-400 border-l-2 border-blue-600 flex justify-between items-center rounded-r-lg">
                           Section_Hero <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="p-3 text-[11px] font-bold text-slate-500 pl-8 hover:text-slate-300 cursor-pointer transition-colors"> — Box_Container</div>
                        <div className="p-3 text-[11px] font-bold text-slate-500 pl-12 hover:text-slate-300 cursor-pointer transition-colors"> — Text_Headline</div>
                        <div className="p-3 text-[11px] font-bold text-slate-500 pl-8 hover:text-slate-300 cursor-pointer transition-colors"> — Visual_Mesh</div>
                      </div>
                    </section>
                    <section>
                       <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8">Core Integrity</h4>
                       <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-slate-400 tracking-widest">SYSTEM_SYNC</span>
                             <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
                          </div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                             <div className="w-[100%] h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                          </div>
                       </div>
                    </section>
                  </div>
                )}
                {activeTab === 'ai' && (
                  <div className="space-y-10">
                    <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Gemini AI Core</h4>
                    <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-3xl">
                       <p className="text-xs text-blue-200/40 leading-relaxed mb-8 font-medium">&#34;Suggest premium architectural content for a world-class creative studio.&#34;</p>
                       <button 
                        disabled={loading}
                        className="w-full py-5 bg-white text-black text-xs font-black tracking-widest uppercase hover:bg-slate-200 transition-all shadow-2xl disabled:opacity-50"
                      >
                        {loading ? 'Synthesizing...' : 'Generate Context'}
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'code' && (
                  <div className="font-mono text-[10px] text-slate-500 space-y-4 leading-relaxed">
                     <p><span className="text-purple-400">export const</span> <span className="text-blue-400">Hero</span> = () =&gt; &#123;</p>
                     <p className="pl-4">return (</p>
                     <p className="pl-8">&lt;Section integrity=&quot;high&quot;&gt;</p>
                     <p className="pl-12">&lt;Headline&gt;&#123;headline&#125;&lt;/Headline&gt;</p>
                     <p className="pl-8">&lt;/Section&gt;</p>
                     <p className="pl-4">);</p>
                     <p>&#125;</p>
                  </div>
                )}
              </div>

              {/* The Live Stage */}
              <div className="flex-1 bg-[#050505] relative flex items-center justify-center p-20 perspective-lg overflow-hidden">
                {/* Structural Grid */}
                <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
                
                {/* Floating Preview Stage */}
                <div className="relative w-full max-w-2xl bg-white shadow-[0_60px_120px_rgba(0,0,0,1)] p-24 preserve-3d transition-transform duration-1000 animate-in fade-in zoom-in">
                  <div className="absolute top-0 left-0 w-12 h-1 bg-black"></div>
                  <div className="absolute top-0 left-0 w-1 h-12 bg-black"></div>
                  
                  <div className="relative z-10">
                     <div className="w-16 h-2 bg-black mb-16"></div>
                     <h2 className="text-6xl font-black text-black tracking-tighter leading-[0.85] mb-12 translate-z-20">
                       {copy.headline}
                     </h2>
                     <p className="text-xl text-slate-500 leading-relaxed max-w-md mb-16 font-medium">
                       {copy.subheadline}
                     </p>
                     <div className="flex gap-12">
                        <button className="px-12 py-6 bg-black text-white font-black text-xs tracking-[0.2em] uppercase hover:bg-slate-800 transition-all">
                           START_EXPERIENCE
                        </button>
                        <button className="px-12 py-6 text-black font-black text-xs tracking-widest uppercase border border-black hover:bg-slate-50 transition-all">
                           DISCOVER
                        </button>
                     </div>
                  </div>
                  
                  {/* Visual Decoration */}
                  <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-blue-600/10 blur-[100px] animate-pulse"></div>
                </div>

                {/* Technical Meta info */}
                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 pointer-events-none opacity-40">
                   <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-white tracking-widest uppercase">LATENCY: 12ms</div>
                   <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black text-white tracking-widest uppercase">RENDER: Edge_Sync</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Outer Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/5 to-transparent blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        </div>
      </div>
    </section>
  );
};
