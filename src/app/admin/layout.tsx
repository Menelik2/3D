import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin | META Pictures",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/90 px-6 backdrop-blur">
          <p className="text-[10px] uppercase tracking-widest text-muted">
            Operations dashboard
          </p>
          <span className="text-[10px] uppercase tracking-widest text-muted/60">
            Auth + RBAC · enforce via Supabase RLS
          </span>
        </header>
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
