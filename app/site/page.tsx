import { pricingCards } from "@/lib/constant";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";

import { ChevronRight, ArrowUpRight, Sparkles } from "lucide-react";

import React from "react";
 
import  Footer  from "@/components/pages/footer";
import TeamSection from "@/components/pages/team";
import { Features } from "@/components/pages/features";
import { EditorDemo } from "@/components/pages/editor";
 
 

const Page = () => {
    return (
        <>
          <div className="relative bg-white dark:bg-black pt-40 pb-32 lg:pt-60 lg:pb-52 overflow-hidden">
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
                <div className="absolute top-0 right-0 -mr-64 opacity-[0.03] dark:opacity-[0.05] pointer-events-none select-none animate-float-slow">
                  <span className="text-[50rem] font-black leading-none dark:text-white">
                    CORE
                  </span>
                </div>
              </div>     
            <Features/>
            <EditorDemo/>
            <section id="pricing" className="py-40 bg-[#fafafa] dark:bg-[#050505] transition-colors">
        <div className="mb-32 text-center">
          <h2 className="text-[10px] font-black tracking-[0.8em] uppercase text-slate-400 mb-8">Economic Structure</h2>
          <h3 className="text-6xl md:text-9xl font-black text-[#1a1a1a] dark:text-white tracking-tighter leading-none">Invest in <br /><span className="text-slate-200 dark:text-white/20">Integrity.</span></h3> 
        </div>
            <div className="flex justify-center gap-8 flex-wrap mt-16">
              {pricingCards.map((card) => (
                <Card
                  key={card.title}
                  className={clsx(
                    "w-[320px] bg-white dark:bg-white/5 rounded-[2rem] border border-border p-8 flex flex-col transition-all hover:scale-[1.02] hover:shadow-2xl",
                    {
                      "ring-2 ring-black dark:ring-white shadow-2xl":
                        card.title === "Unlimited Saas",
                    }
                  )}
                >
                  {/* HEADER */}
                  <CardHeader className="p-0 mb-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3">
                      Pricing Tier
                    </div>
            
                    <CardTitle
                      className={clsx(
                        "text-3xl font-black tracking-tight",
                        {
                          "text-muted-foreground":
                          card.title !== "Unlimited Saas",
                        }
                      )}
                    >
                      {card.title}
                    </CardTitle>
            
                    <CardDescription className="mt-3 text-sm font-medium">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
            
                  {/* PRICE */}
                  <CardContent className="p-0 mb-8">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black tracking-tight">
                        {card.price}
                      </span>
                      <span className="text-xs text-muted-foreground font-bold uppercase mb-1">
                        /mo
                      </span>
                    </div>
                  </CardContent>
            
                  {/* FEATURES + CTA */}
                  <CardFooter className="p-0 flex flex-col gap-8 flex-1">
                    <div className="space-y-3">
                      {card.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-3 text-sm font-medium text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-emerald-500" />
                          <p>{feature}</p>
                        </div>
                      ))}
                    </div>
            
                    <Link
                      href={`/agency?plan=${card.priceId}`}
                      className={clsx(
                        "mt-auto w-full py-4 text-center rounded-xl font-black text-[11px] tracking-[0.25em] uppercase transition-all",
                        card.title === "Unlimited Saas"
                          ? "bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02]"
                          : "border border-border hover:bg-black/5 dark:hover:bg-white/10"
                        )}
                        >
                      Get Started
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

        </section>
            <TeamSection />
            <section className="py-40 bg-white dark:bg-black overflow-hidden relative border-t border-black/5 dark:border-white/5 transition-colors">
              <div className="absolute -bottom-32 left-0 -ml-32 opacity-[0.02] dark:opacity-[0.05] pointer-events-none select-none animate-float-slow">
                <span className="text-[40rem] font-black leading-none dark:text-white">CANVAS</span>
              </div>
              <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-7xl md:text-[11rem] font-black text-[#1a1a1a] dark:text-white mb-16 tracking-[-0.05em] leading-[0.75]">
                  BUILD <br /><span className="text-slate-200 dark:text-white/20">OUR_CORE.</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-10 justify-center items-center mt-20">
<Link
                href="/agency"
                className="px-12 py-6 border-2 border-black/10 dark:border-white/10 text-black dark:text-white font-black text-lg tracking-widest uppercase hover:bg-black/5 dark:hover:bg-white/5 transition-all inline-flex items-center justify-center gap-3"
              >
                    AUTHORIZE_GATE
                  </Link>
                </div>
              </div>
            </section>
            <Footer /> 
        </>
    );
};

export default Page;
