
import React from 'react';
import { Zap, Anchor, Box, Cpu, Globe2, MousePointer2 } from 'lucide-react';

export const Features: React.FC = () => {
  const manifesto = [
    {
      title: "Hardened Core",
      description: "Our Phase I architecture isn't just code; it's a foundation designed for zero failure. Every site is globally redundant by default.",
      icon: <Anchor className="w-5 h-5" />,
      tag: "INFRASTRUCTURE"
    },
    {
      title: "Visual Synthesis",
      description: "The fluidity of a brushstroke with the precision of a blueprint. We built the engine to respond to your creative intent perfectly.",
      icon: <Box className="w-5 h-5" />,
      tag: "INTERFACE"
    },
    {
      title: "Pure Velocity",
      description: "We optimized performance at the binary level. Edge-caching, adaptive delivery, and zero-bloat sites for a faster web.",
      icon: <Zap className="w-5 h-5" />,
      tag: "SPEED"
    }
  ];

  return (
    <section className="py-40 perspective-lg overflow-hidden bg-white dark:bg-black transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-32">
          <h2 className="text-[10px] font-black tracking-[0.5em] uppercase text-slate-400 mb-8">Structural Integrity</h2>
          <p className="text-5xl md:text-[7rem] font-black text-[#1a1a1a] dark:text-white max-w-5xl tracking-[-0.04em] leading-[0.85]">
            Architected to <span className="text-slate-200 dark:text-white/20">Scale.</span> <br />Designed to <span className="text-slate-200 dark:text-white/20">Flow.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 preserve-3d">
          {manifesto.map((v, i) => (
            <div key={i} className="depth-card bg-[#fafafa] dark:bg-white/5 p-12 rounded-3xl 
  border border-black/5 dark:border-white/5 
  flex flex-col items-start gap-12 
  group transform transition-all duration-500 
  hover:scale-[1.04]">
              <div className="w-14 h-14 bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-center text-black dark:text-white shadow-sm group-hover:scale-110 transition-transform">
                {v.icon}
              </div>
              <div>
                <div className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase mb-4">{v.tag}</div>
                <h3 className="text-3xl font-black text-[#1a1a1a] dark:text-white mb-6 tracking-tight">{v.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg font-medium">
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 grid grid-cols-2 md:grid-cols-4 gap-20 border-t border-black/5 dark:border-white/5 pt-24">
           <div className="flex flex-col gap-4">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Global Coverage</div>
              <div className="text-4xl font-black text-black dark:text-white tracking-tighter">100+ Nodes</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Distributed Core</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Site Performance</div>
              <div className="text-4xl font-black text-black dark:text-white tracking-tighter">99.9%</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">Lighthouse Peak</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Response Delay</div>
              <div className="text-4xl font-black text-black dark:text-white tracking-tighter">&lt;15ms</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">TTFB Optimized</p>
           </div>
           <div className="flex flex-col gap-4">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Integrity Type</div>
              <div className="text-4xl font-black text-black dark:text-white tracking-tighter">Tier-1</div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest italic">DAL Hardened</p>
           </div>
        </div>
      </div>
    </section>
  );
};
