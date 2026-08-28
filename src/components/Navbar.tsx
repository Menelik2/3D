"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    href: "/services",
    label: "Services",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125m3.75 0v-1.5c0-.621-.504-1.125-1.125-1.125m0 0h-1.5m-16.5 0h16.5m-16.5 0c-.621 0-1.125-.504-1.125-1.125V5.625c0-.621.504-1.125 1.125-1.125h16.5c.621 0 1.125.504 1.125 1.125v12.75" />
      </svg>
    ),
  },
  {
    href: "/#showreel",
    label: "Showreel",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
      </svg>
    ),
  },
  {
    href: "/work",
    label: "Projects",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    href: "/journal",
    label: "Blog",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    href: "/contact",
    label: "Contact",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const desktopLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const logo = logoUrl?.trim() || "/brand/meta-logo.jpg";

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
    if (href === "/" || href === "/#showreel") {
      if (href === "/#showreel") return false;
      return pathname === "/";
    }
    return pathname === href || pathname?.startsWith(href + "/");
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled || open
            ? "bg-background/85 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 md:h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-90"
            onClick={() => setOpen(false)}
          >
            <picture>
              <source srcSet="/brand/meta-logo-sm.webp" type="image/webp" />
              <source srcSet="/brand/meta-logo-sm.jpg" type="image/jpeg" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt="META Pictures"
                width={120}
                height={68}
                className="h-8 w-auto md:h-9 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                decoding="async"
              />
            </picture>
            <span className="sr-only">META Pictures</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {desktopLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-active={active ? "true" : "false"}
                  className={`nav-link-underline relative px-3.5 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/start-a-project"
              className="btn-primary ml-3 !py-2 !px-4 !text-[10px]"
            >
              Start a Project
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden relative z-[60] flex h-10 w-10 items-center justify-center text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`hamburger-line block h-px w-5 bg-current ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`hamburger-line block h-px w-5 bg-current ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`hamburger-line block h-px w-5 bg-current ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`menu-backdrop fixed inset-0 z-[55] md:hidden bg-black/70 backdrop-blur-sm ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Left sidebar panel */}
      <aside
        data-open={open ? "true" : "false"}
        className={`menu-panel fixed top-0 left-0 z-[56] md:hidden flex h-full w-[min(300px,86vw)] flex-col bg-[#0a0a0a] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          boxShadow: open ? "8px 0 48px rgba(225, 29, 72, 0.15)" : "none",
        }}
        aria-hidden={!open}
      >
        {/* Red neon edge */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-[2px] transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, #e11d48 12%, #e11d48 88%, transparent 100%)",
            boxShadow:
              "0 0 12px rgba(225,29,72,0.9), 0 0 28px rgba(225,29,72,0.45)",
            opacity: open ? 1 : 0,
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, #e11d48 0%, #e11d48 40%, transparent 100%)",
            boxShadow: "0 0 12px rgba(225,29,72,0.6)",
            opacity: open ? 1 : 0,
          }}
        />

        {/* Logo */}
        <div className="menu-logo flex items-center gap-3 px-6 pt-8 pb-6">
          <Link href="/" onClick={() => setOpen(false)} className="block">
            <picture>
              <source srcSet="/brand/meta-logo-sm.webp" type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo}
                alt="META Pictures"
                width={140}
                height={80}
                className="h-11 w-auto object-contain"
              />
            </picture>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href + link.label} className="menu-item">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3.5 rounded-sm px-4 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active
                        ? "bg-accent/15 text-accent"
                        : "text-white/55 hover:bg-white/[0.04] hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <span
                      className={`shrink-0 transition-colors duration-300 ${
                        active
                          ? "text-accent"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {link.icon}
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="menu-cta mt-6 px-4">
            <Link
              href="/start-a-project"
              onClick={() => setOpen(false)}
              className="btn-primary flex w-full items-center justify-center !px-4 !py-3.5 !text-[10px]"
            >
              Start a Project
            </Link>
          </div>
        </nav>

        {/* Social + copyright */}
        <div className="menu-footer mt-auto border-t border-white/[0.06] px-6 py-6">
          <div className="flex items-center gap-4 text-white/40">
            {[
              {
                href: "https://instagram.com",
                label: "Instagram",
                path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
              },
              {
                href: "https://facebook.com",
                label: "Facebook",
                path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
              },
              {
                href: "https://youtube.com",
                label: "YouTube",
                path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
              },
              {
                href: "https://tiktok.com",
                label: "TikTok",
                path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-all duration-300 hover:text-accent hover:scale-110"
                aria-label={s.label}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
          <p className="mt-5 text-[9px] uppercase tracking-[0.18em] text-white/25 leading-relaxed">
            © {new Date().getFullYear()} META Pictures
            <br />
            All rights reserved
          </p>
        </div>
      </aside>
    </>
  );
}
