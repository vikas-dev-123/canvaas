"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTypewriter } from "@/hooks";

const LEDE = "Deploy adaptive workflows that learn your agency, run funnels end to end, and keep every sub-account moving without you in the loop.";

const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

export const VideoHero = () => {
  const { displayed, done } = useTypewriter(LEDE, { speed: 18, startDelay: 500 });

  return (
    <section id="top" className="relative min-h-[92vh] flex flex-col justify-end overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {HERO_VIDEO_URL ? (
          <video
            className="w-full h-full object-cover opacity-70"
            src={HERO_VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.08),_transparent_60%)]">
            <div className="absolute top-0 right-0 -mr-64 opacity-[0.05] pointer-events-none select-none animate-float-slow">
              <span className="text-[50rem] font-black leading-none text-white">CORE</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-24 pt-40">
        {/* Blurred intro label */}
        <p
          aria-hidden
          className="pointer-events-none select-none mb-5 text-lg sm:text-2xl font-medium text-white/70"
          style={{ filter: "blur(4px)" }}
        >
          Hey there, meet the Canvaas control layer,
          <br />
          your agency&apos;s adaptive operations engine.
        </p>

        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full mb-8 bg-white/10 border border-white/10 backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
            Operational Agency Infrastructure
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-[0.95] mb-8 max-w-4xl">
          Run every sub-account <span className="text-white/40">from one core.</span>
        </h1>

        {/* Typewriter */}
        <p className="text-lg sm:text-2xl font-medium text-white/85 max-w-2xl min-h-[3.5em] mb-10">
          {displayed}
          {!done && <span className="typewriter-cursor inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px]" />}
        </p>

        {/* Pill CTAs */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/agency"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl"
          >
            Start for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/30 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VideoHero;
