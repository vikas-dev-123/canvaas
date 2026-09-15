"use client";

import Link from "next/link";
import React, { useEffect } from "react";

type NavLink = { href: string; label: string };

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  user?: null | { userId: string; email: string; role: string };
  onSignOut: () => void;
};

const MobileNav = ({ open, onClose, links, user, onSignOut }: MobileNavProps) => {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`md:hidden fixed inset-0 z-[140] bg-black/95 backdrop-blur-md flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="text-3xl font-black uppercase tracking-tight text-white hover:opacity-60 transition-opacity"
        >
          {link.label}
        </Link>
      ))}

      {user ? (
        <button
          onClick={() => {
            onClose();
            onSignOut();
          }}
          className="text-3xl font-black uppercase tracking-tight text-white/70 hover:opacity-60 transition-opacity text-left"
        >
          Sign Out
        </button>
      ) : (
        <Link
          href="/agency"
          onClick={onClose}
          className="text-3xl font-black uppercase tracking-tight text-white/70 hover:opacity-60 transition-opacity"
        >
          Sign In
        </Link>
      )}
    </div>
  );
};

export default MobileNav;
