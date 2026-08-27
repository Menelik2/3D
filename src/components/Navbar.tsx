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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo}
              alt="META Pictures"
              className="h-8 w-auto md:h-9 object-contain"
            />
            <span className="sr-only">META Pictures</span>
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
            <Link
              href="/start-a-project"
              className="btn-primary ml-3 !py-2 !px-4 !text-[10px]"
            >
              Start a Project
            </Link>
          </nav>

          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`block h-px w-5 bg-current transition ${
                  open ? "translate-y-[3.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition ${
                  open ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-xl pt-20 px-6">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 text-sm uppercase tracking-[0.2em] border-b border-border/60 ${
                  isActive(link.href) ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/start-a-project" className="btn-primary mt-8 self-start">
              Start a Project
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
