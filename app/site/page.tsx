import { pricingCards } from "@/lib/constant";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";


import React from "react";
import LandingHero from "@/components/pages/landingHero";
import  Footer  from "@/components/pages/footer";
import TeamSection from "@/components/pages/team";
import { Features } from "@/components/pages/features";
import { EditorDemo } from "@/components/pages/editor";
 

const Page = () => {
    return (
        <>
            <LandingHero/>
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
