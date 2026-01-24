import { ModeToggle } from "@/components/global/mode-toggle";
import { Logo } from "@/components/pages/logo";
import { UserButton } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

type NavigationProps = {
    user?: null | User;
};

const Navigation = ({ user }: NavigationProps) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-[150] transition-all duration-700 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">

                    {/* LEFT – Logo */}
                    <aside className="flex items-center gap-3">
                        <Logo className="h-10" />
                    </aside>

                    {/* CENTER – Nav links (same as big navbar) */}
                    <nav className="hidden md:block">
                        <ul className="flex items-center gap-10">
                            <Link
                                href="#pricing"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                manifesto
                            </Link>
                            <Link
                                href="#about"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                             workstation
                            </Link>
                            <Link
                                href="#documentation"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                pricing
                            </Link>
                            <Link
                                href="#features"
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                the architects
                            </Link>
                        </ul>
                    </nav>

                    {/* RIGHT – Actions */}
                    <aside className="flex items-center gap-3">
                        {!user && (
                            <Link
                            href="/agency"
                            className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl hover:shadow-black/20 "
                            >
                                ENTRY_PROTOCOL
                            </Link>
                        )}
                        <UserButton />
                        <ModeToggle />
                    </aside>
                </div>
            </div>
        </nav>
    );
};



export default Navigation;
