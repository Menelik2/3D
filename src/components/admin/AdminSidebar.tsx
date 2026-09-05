"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/consultations", label: "Consultations" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    onClose?.();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full max-h-dvh w-[min(100%,16rem)] flex-col border-r border-border bg-card transition-transform duration-200 ease-out md:translate-x-0 md:z-40 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Admin navigation"
    >
      <div className="flex h-14 sm:h-16 items-center justify-between border-b border-border px-4 sm:px-5 shrink-0">
        <Link
          href="/admin"
          onClick={() => onClose?.()}
          className="text-xs font-semibold uppercase tracking-cinematic text-foreground"
        >
          META Admin
        </Link>
        {/* Close — mobile only */}
        <button
          type="button"
          onClick={onClose}
          className="md:hidden flex h-8 w-8 items-center justify-center text-muted hover:text-foreground"
          aria-label="Close menu"
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
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto overscroll-contain p-3">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={`block rounded-sm px-3 py-2.5 text-xs uppercase tracking-widest transition-colors ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2 shrink-0 safe-area-pb">
        <Link
          href="/"
          onClick={() => onClose?.()}
          className="block text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← View site
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="block text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
