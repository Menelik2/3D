"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link
          href="/admin"
          className="text-xs font-semibold uppercase tracking-cinematic text-foreground"
        >
          META Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
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
      <div className="border-t border-border p-4 space-y-2">
        <Link
          href="/"
          className="block text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← View site
        </Link>
        <p className="text-[10px] text-muted/50">Staff only · RLS enforced</p>
      </div>
    </aside>
  );
}
