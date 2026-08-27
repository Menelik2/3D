"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "bg-background/85 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 md:h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_rgba(225,29,72,0.8)]" />
            <span className="text-[13px] font-semibold tracking-[0.22em] uppercase text-foreground group-hover:text-accent transition-colors">
              META Pictures
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-px bg-accent" />
                  )}
                </Link>
              );
            })}
            <Link href="/start-a-project" className="btn-primary ml-4 !py-2.5 !px-5">
              Start a Project
            </Link>
          </nav>

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

      <div
        className={`fixed inset-0 z-40 bg-background/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-6 px-6 pt-16">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`text-2xl font-light uppercase tracking-[0.2em] transition-colors ${
                isActive(link.href) ? "text-accent" : "text-foreground hover:text-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/behind-the-scenes"
            onClick={() => setOpen(false)}
            className="text-sm uppercase tracking-[0.2em] text-muted hover:text-foreground"
          >
            Behind the Scenes
          </Link>
          <Link
            href="/faq"
            onClick={() => setOpen(false)}
            className="text-sm uppercase tracking-[0.2em] text-muted hover:text-foreground"
          >
            FAQ
          </Link>
          <Link
            href="/start-a-project"
            onClick={() => setOpen(false)}
            className="btn-primary mt-8"
          >
            Start a Project
          </Link>
        </nav>
      </div>
    </>
  );
}
