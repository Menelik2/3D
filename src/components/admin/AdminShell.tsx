"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Renders admin chrome for authenticated routes only.
 * /admin/login stays a clean full-page form (no sidebar).
 * Mobile: collapsible drawer. Desktop (md+): fixed sidebar.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin =
    pathname === "/admin/login" || pathname?.startsWith("/admin/login/");

  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  // Close drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Escape key + body scroll lock while drawer open
  useEffect(() => {
    if (!mobileOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar open={mobileOpen} onClose={closeMobile} />

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      <div className="min-h-screen flex flex-col md:pl-56">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={openMobile}
              className="md:hidden flex h-9 w-9 shrink-0 items-center justify-center border border-border text-muted hover:text-foreground hover:border-foreground/30"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <span className="hidden sm:block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <p className="text-[10px] uppercase tracking-widest text-muted truncate">
              META Pictures · Operations
            </p>
          </div>

          <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-muted/50 truncate max-w-[40%]">
            Single admin · Metapictures23@gmail.com
          </span>
          <span className="sm:hidden text-[10px] uppercase tracking-widest text-muted/50">
            Admin
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
