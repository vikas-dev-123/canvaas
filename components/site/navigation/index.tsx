"use client";

import { ModeToggle } from "@/components/global/mode-toggle";
import { Logo } from "@/components/pages/logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import MobileNav from "./mobile-nav";

type NavigationProps = {
  user?: null | { userId: string; email: string; role: string };
};

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#team", label: "Team" },
];

const Navigation = ({ user }: NavigationProps) => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/agency/sign-in");
    router.refresh();
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[150] transition-all duration-700
        ${
          scrolled
            ? "bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 py-4"
            : "bg-white/60 dark:bg-black/60 backdrop-blur-xl py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* LEFT – Logo */}
            <aside className="flex items-center gap-3">
              <Link href="#top">
                <Logo className="h-10" />
              </Link>
            </aside>

            {/* CENTER – Nav links */}
            <div className="hidden md:block">
              <ul className="flex items-center gap-10">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT – Actions */}
            <aside className="flex items-center gap-3">
              <div className="hidden md:block">
                {!user ? (
                  <Link
                    href="/agency"
                    className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl hover:shadow-black/20"
                  >
                    Start for Free
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 border border-black/20 dark:border-white/20 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                  >
                    Sign Out
                  </button>
                )}
              </div>
              <ModeToggle />

              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
              >
                <span
                  className={`block w-6 h-[2px] bg-black dark:bg-white transition-transform duration-300 ${
                    menuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-[2px] bg-black dark:bg-white transition-opacity duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-6 h-[2px] bg-black dark:bg-white transition-transform duration-300 ${
                    menuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </button>
            </aside>
          </div>
        </div>
      </nav>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} user={user} onSignOut={handleLogout} />
    </>
  );
};

export default Navigation;
