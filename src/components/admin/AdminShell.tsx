"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

/**
 * Renders admin chrome for authenticated routes only.
 * /admin/login stays a clean full-page form (no sidebar).
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin =
    pathname === "/admin/login" || pathname?.startsWith("/admin/login/");

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="pl-56 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <p className="text-[10px] uppercase tracking-widest text-muted">
              META Pictures · Operations
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted/50">
            Single admin · Metapictures23@gmail.com
          </span>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
