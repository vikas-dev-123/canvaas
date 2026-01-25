"use client";

import React from "react";
import { Logo } from "./logo";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black border-t border-black/5 dark:border-white/5 py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-20 mb-32">
          
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-4 mb-10">
              <Logo hideText className="h-12 w-12" />
              <span className="text-4xl font-black tracking-tighter dark:text-white">
                Canvas.
              </span>
            </div>

            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-sm mb-12 font-medium leading-relaxed">
              Crafted with integrity by Suyash Tiwari and Vikas Dev Pandey. 
              A new standard for the structural web.
            </p>
          </div>

          {/* System */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">
              System
            </h4>
            <ul className="space-y-6 text-sm font-bold text-slate-700 dark:text-slate-400">
              <li>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                  Visual Logic
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                  Core Security
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                  Edge Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">
              Connect
            </h4>
            <ul className="space-y-6 text-sm font-bold text-slate-700 dark:text-slate-400">
              <li>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">
                  Enterprise
                </Link>
              </li>
              <li>
                <a
                  href="mailto:vikaspandey0234@gmail.com"
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  Direct Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-black/5 dark:border-white/5 flex flex-col justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
          <p>© 2025 CANVAS_ARCHITECTS. CRAFTED_BY_SUYASH_&_VIKAS.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
