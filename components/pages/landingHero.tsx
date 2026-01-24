"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";

const LandingHero = () => {
  return (
    <div className="relative pt-40 pb-32 lg:pt-60 lg:pb-52 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2 glass rounded-full mb-12 shadow-sm border border-black/5 dark:border-white/5">
            <Sparkles className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              Visionary Build by Two Architects
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-7xl md:text-[9.5rem] font-black text-[#1a1a1a] dark:text-white tracking-[-0.05em] leading-[0.8] mb-12">
            Craft <br />
            <span className="text-slate-200 dark:text-white/20">
              the Future.
            </span>
          </h1>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-end mt-20">
            <p className="text-2xl text-slate-400 dark:text-slate-500 leading-relaxed font-medium">
              Canvaas isn&apos;t just a tool; it&apos;s our vision for a structurally
              sound internet. Built by a duo of architects who believe integrity
              should never be a compromise.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                href="/agency"
                className="px-12 py-10 bg-black dark:bg-white text-white dark:text-black font-black text-lg tracking-widest uppercase hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-2xl inline-flex items-center justify-center group"
              >
                CONNECT_CORE
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/agency"
                className="px-12 py-6 border-2 border-black/10 dark:border-white/10 text-black dark:text-white font-black text-lg tracking-widest uppercase hover:bg-black/5 dark:hover:bg-white/5 transition-all inline-flex items-center justify-center gap-3"
              >
                THE_MANIFESTO
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Background text */}
      <div className="absolute top-0 right-0 -mr-64 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none">
        <span className="text-[50rem] font-black leading-none dark:text-white">
          CORE
        </span>
      </div>
    </div>
  );
};

export default LandingHero;
