"use client";

import React from "react";
import { PenTool, Database } from "lucide-react";

const TeamSection = () => {
  return (
    <section id="architects" className="py-40 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-32">
          <h2 className="text-[10px] font-black tracking-[0.8em] uppercase text-slate-400 mb-8">
            The Founders
          </h2>
          <h3 className="text-5xl md:text-8xl font-black text-[#1a1a1a] dark:text-white tracking-tighter leading-none">
            The Brother&apos;s <br />
            <span className="text-slate-200 dark:text-white/20">
              Vision 
            </span>
          </h3>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">

          {/* Suyash */}
          <div
            className="depth-card bg-[#fafafa] dark:bg-white/5 p-16 rounded-[2.5rem]
            border border-black/5 dark:border-white/5
            flex flex-col items-center text-center
            group relative overflow-hidden
            transform transition-all duration-500
            hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-white/5"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-24 h-24 bg-black dark:bg-white rounded-3xl flex items-center justify-center mb-10 transform group-hover:rotate-6 transition-transform shadow-xl">
              <PenTool className="w-12 h-12 text-white dark:text-black" />
            </div>

            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-3">
              Interface Architect
            </div>

            <h4 className="text-4xl font-black text-black dark:text-white mb-6">
              Suyash Tiwari
            </h4>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              Redefining the relationship between human creativity and digital
              structure. Suyash focuses on visual fluidness and UX integrity.
            </p>
          </div>

          {/* Vikash */}
          <div
            className="depth-card bg-[#fafafa] dark:bg-white/5 p-16 rounded-[2.5rem]
            border border-black/5 dark:border-white/5
            flex flex-col items-center text-center
            group relative overflow-hidden
            transform transition-all duration-500
            hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-white/5"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-white opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="w-24 h-24 bg-black dark:bg-white rounded-3xl flex items-center justify-center mb-10 transform group-hover:-rotate-6 transition-transform shadow-xl">
              <Database className="w-12 h-12 text-white dark:text-black" />
            </div>

            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-3">
              System Architect
            </div>

            <h4 className="text-4xl font-black text-black dark:text-white mb-6">
              Vikas Dev Pandey
            </h4>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
              Engineering the foundation that powers the vision. Vikas is
              responsible for DAL integrity and global system architecture.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-32 text-center">
          <div className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mb-8">
            Direct Channel
          </div>

          <a
            href="mailto:vikaspandey0234@gmail.com"
            className="text-2xl md:text-4xl font-black text-black dark:text-white
            hover:opacity-60 transition-opacity
            border-b-4 border-black/10 dark:border-white/10 pb-2"
          >
            vikaspandey0234@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
