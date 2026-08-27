import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  try {
    const supabase = await createClient();
    const [
      { count: newLeads },
      { count: totalLeads },
      { count: consultations },
      { count: projects },
      { count: portfolio },
    ] = await Promise.all([
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "NEW"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("status", "PENDING"),
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .in("status", [
          "PRE_PRODUCTION",
          "PRODUCTION",
          "EDITING",
          "COLOR_GRADING",
          "CLIENT_REVIEW",
        ]),
      supabase
        .from("portfolio_items")
        .select("*", { count: "exact", head: true })
        .eq("is_published", true),
    ]);

    return {
      newLeads: newLeads ?? 0,
      totalLeads: totalLeads ?? 0,
      consultations: consultations ?? 0,
      projects: projects ?? 0,
      portfolio: portfolio ?? 0,
      connected: true,
    };
  } catch {
    return {
      newLeads: null,
      totalLeads: null,
      consultations: null,
      projects: null,
      portfolio: null,
      connected: false,
    };
  }
}

async function getRecentLeads() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("leads")
      .select("id, reference_number, full_name, status, project_types, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminDashboardPage() {
  const counts = await getCounts();
  const recent = await getRecentLeads();

  const cards = [
    {
      label: "New inquiries",
      value: counts.newLeads === null ? "—" : String(counts.newLeads),
      href: "/admin/leads",
      hint: "Status = NEW",
    },
    {
      label: "Total leads",
      value: counts.totalLeads === null ? "—" : String(counts.totalLeads),
      href: "/admin/leads",
      hint: "All time",
    },
    {
      label: "Pending consultations",
      value: counts.consultations === null ? "—" : String(counts.consultations),
      href: "/admin/consultations",
      hint: "Awaiting confirmation",
    },
    {
      label: "Active projects",
      value: counts.projects === null ? "—" : String(counts.projects),
      href: "/admin/projects",
      hint: "In production pipeline",
    },
    {
      label: "Published work",
      value: counts.portfolio === null ? "—" : String(counts.portfolio),
      href: "/admin/portfolio",
      hint: "Live on site",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            META Pictures operations overview.
          </p>
        </div>
        <span
          className={`text-[10px] uppercase tracking-widest ${
            counts.connected ? "text-emerald-500/90" : "text-amber-500/90"
          }`}
        >
          {counts.connected ? "Supabase connected" : "Supabase not connected — check .env.local"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-border bg-card/40 p-5 transition hover:border-accent/40"
          >
            <p className="text-[10px] uppercase tracking-widest text-muted">{c.label}</p>
            <p className="mt-2 text-3xl font-light">{c.value}</p>
            <p className="mt-1 text-xs text-muted/70">{c.hint}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-muted">Recent leads</h2>
          <Link href="/admin/leads" className="text-[10px] uppercase tracking-widest text-accent hover:underline">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Types</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted text-sm">
                    No leads yet. Submissions from Start a Project appear here.
                  </td>
                </tr>
              ) : (
                recent.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/60 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-xs text-foreground/90">
                      {lead.reference_number}
                    </td>
                    <td className="px-4 py-3">{lead.full_name}</td>
                    <td className="px-4 py-3 text-muted text-xs">
                      {(lead.project_types as string[] | null)?.slice(0, 2).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                        {String(lead.status).replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {lead.created_at
                        ? new Date(lead.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs uppercase tracking-widest text-muted">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/leads", title: "Manage leads", desc: "Pipeline & notes" },
            { href: "/admin/portfolio", title: "Portfolio CMS", desc: "Publish work" },
            { href: "/admin/consultations", title: "Consultations", desc: "Bookings" },
            { href: "/admin/settings", title: "Site settings", desc: "Contact & brand" },
          ].map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="border border-border bg-card/30 p-5 transition hover:border-accent/40"
            >
              <h3 className="text-sm font-medium">{q.title}</h3>
              <p className="mt-1 text-xs text-muted">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
