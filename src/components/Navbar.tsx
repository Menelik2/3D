"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || open
            ? "bg-background/90 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-semibold tracking-cinematic uppercase text-foreground hover:text-accent transition-colors"
            onClick={() => setOpen(false)}
          >
            META Pictures
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-widest text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/start-a-project"
              className="ml-2 inline-flex items-center justify-center rounded-none border border-accent bg-accent px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-accent-hover"
            >
              Start a Project
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden relative z-50 flex h-10 w-10 items-center justify-center text-foreground"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-all duration-500 md:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/behind-the-scenes"
            onClick={() => setOpen(false)}
            className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            Behind the Scenes
          </Link>
          <Link
            href="/faq"
            onClick={() => setOpen(false)}
            className="text-2xl font-light uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/start-a-project"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex items-center justify-center border border-accent bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white"
          >
            Start a Project
          </Link>
        </nav>
      </div>
    </>
  );
}
