import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCmsClient } from "@/lib/cms";
import { getContactConfig, getSocialConfig } from "@/lib/site-config";

const PIPELINE = [
  "NEW",
  "CONTACTED",
  "CONSULTATION_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
] as const;

type LeadRow = {
  id: string;
  reference_number: string;
  full_name: string;
  email: string;
  status: string;
  project_types: string[] | null;
  budget_range: string | null;
  created_at: string;
};

type ConsultRow = {
  id: string;
  full_name: string;
  consultation_type: string;
  preferred_date: string | null;
  status: string;
  created_at: string;
};

type ProjectRow = {
  id: string;
  title: string;
  status: string;
  category: string | null;
  production_date: string | null;
};

type SiteSnapshot = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  socialCount: number;
};

async function loadSiteSnapshot(): Promise<SiteSnapshot> {
  const contact = getContactConfig();
  const social = getSocialConfig();
  let email = contact.email;
  let phone = contact.phone;
  let whatsapp = contact.whatsapp;
  let address = contact.address;
  let socialCount = [
    social.instagram,
    social.youtube,
    social.tiktok,
    social.facebook,
    social.telegram,
  ].filter(Boolean).length;

  try {
    const supabase = await getCmsClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["contact", "social"]);

    for (const row of data ?? []) {
      if (row.key === "contact" && row.value && typeof row.value === "object") {
        const v = row.value as Record<string, string>;
        if (v.email?.trim()) email = v.email.trim();
        if (v.phone?.trim()) phone = v.phone.trim();
        if (v.whatsapp?.trim()) whatsapp = v.whatsapp.trim();
        if (v.address?.trim()) address = v.address.trim();
      }
      if (row.key === "social" && row.value && typeof row.value === "object") {
        const v = row.value as Record<string, string>;
        socialCount = ["instagram", "youtube", "tiktok", "facebook", "telegram"]
          .map((k) => v[k]?.trim())
          .filter(Boolean).length;
      }
    }
  } catch {
    /* keep env defaults */
  }

  return { email, phone, whatsapp, address, socialCount };
}

async function loadDashboard() {
  try {
    const supabase = await createClient();

    const [
      newLeadsRes,
      totalLeadsRes,
      pendingConsultRes,
      activeProjectsRes,
      publishedRes,
      completedRes,
      leadsByStatusRes,
      recentLeadsRes,
      consultsRes,
      projectsRes,
      site,
    ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "NEW"),
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
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "COMPLETED"),
      supabase.from("leads").select("status"),
      supabase
        .from("leads")
        .select(
          "id, reference_number, full_name, email, status, project_types, budget_range, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("consultations")
        .select("id, full_name, consultation_type, preferred_date, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("projects")
        .select("id, title, status, category, production_date")
        .in("status", [
          "PRE_PRODUCTION",
          "PRODUCTION",
          "EDITING",
          "COLOR_GRADING",
          "CLIENT_REVIEW",
        ])
        .order("updated_at", { ascending: false })
        .limit(5),
      loadSiteSnapshot(),
    ]);

    const statusCounts: Record<string, number> = {};
    for (const row of leadsByStatusRes.data ?? []) {
      const s = (row as { status: string }).status;
      statusCounts[s] = (statusCounts[s] ?? 0) + 1;
    }

    return {
      connected: true,
      counts: {
        newLeads: newLeadsRes.count ?? 0,
        totalLeads: totalLeadsRes.count ?? 0,
        pendingConsultations: pendingConsultRes.count ?? 0,
        activeProjects: activeProjectsRes.count ?? 0,
        publishedWork: publishedRes.count ?? 0,
        completedLeads: completedRes.count ?? 0,
      },
      statusCounts,
      recentLeads: (recentLeadsRes.data ?? []) as LeadRow[],
      consultations: (consultsRes.data ?? []) as ConsultRow[],
      projects: (projectsRes.data ?? []) as ProjectRow[],
      site,
    };
  } catch {
    return {
      connected: false,
      counts: {
        newLeads: null as number | null,
        totalLeads: null as number | null,
        pendingConsultations: null as number | null,
        activeProjects: null as number | null,
        publishedWork: null as number | null,
        completedLeads: null as number | null,
      },
      statusCounts: {} as Record<string, number>,
      recentLeads: [] as LeadRow[],
      consultations: [] as ConsultRow[],
      projects: [] as ProjectRow[],
      site: await loadSiteSnapshot(),
    };
  }
}

function fmt(n: number | null) {
  return n === null ? "—" : String(n);
}

function statusLabel(s: string) {
  return s.replace(/_/g, " ");
}

export default async function AdminDashboardPage() {
  const data = await loadDashboard();
  const { counts, statusCounts, recentLeads, consultations, projects, connected, site } =
    data;

  const maxPipeline = Math.max(1, ...PIPELINE.map((s) => statusCounts[s] ?? 0));

  const kpis = [
    {
      label: "New inquiries",
      value: fmt(counts.newLeads),
      href: "/admin/leads",
      hint: "Needs response",
      accent: true,
    },
    {
      label: "Total leads",
      value: fmt(counts.totalLeads),
      href: "/admin/leads",
      hint: "All time",
      accent: false,
    },
    {
      label: "Consultations",
      value: fmt(counts.pendingConsultations),
      href: "/admin/consultations",
      hint: "Pending",
      accent: false,
    },
    {
      label: "Active projects",
      value: fmt(counts.activeProjects),
      href: "/admin/projects",
      hint: "In production",
      accent: false,
    },
    {
      label: "Completed",
      value: fmt(counts.completedLeads),
      href: "/admin/leads",
      hint: "Closed wins",
      accent: false,
    },
    {
      label: "Published work",
      value: fmt(counts.publishedWork),
      href: "/admin/portfolio",
      hint: "Live on site",
      accent: false,
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-accent mb-2">Dashboard</p>
          <h1 className="text-3xl font-light tracking-tight">Operations overview</h1>
          <p className="mt-2 text-sm text-muted max-w-xl">
            Leads, consultations, and productions for META Pictures. Signed in as single admin.
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <span
            className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-widest ${
              connected ? "text-emerald-500/90" : "text-amber-500/90"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {connected ? "Database connected" : "Database offline — check .env.local"}
          </span>
          <Link
            href="/start-a-project"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            Open public inquiry form →
          </Link>
        </div>
      </div>

      {/* Saved site settings snapshot */}
      <section className="border border-border bg-card/20 p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xs uppercase tracking-widest text-muted">Site contact (saved)</h2>
          <Link
            href="/admin/settings"
            className="text-[10px] uppercase tracking-widest text-accent hover:underline"
          >
            Edit settings →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Email</p>
            <p className="text-foreground/90 break-all">{site.email || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Phone</p>
            <p className="text-foreground/90">{site.phone || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-1">WhatsApp</p>
            <p className="text-foreground/90">{site.whatsapp || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted mb-1">Social links</p>
            <p className="text-foreground/90">{site.socialCount} configured</p>
          </div>
        </div>
        {site.address ? (
          <p className="mt-4 text-xs text-muted">{site.address}</p>
        ) : null}
      </section>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`group border p-5 transition hover:border-accent/50 ${
              c.accent
                ? "border-accent/30 bg-accent/5"
                : "border-border bg-card/40"
            }`}
          >
            <p className="text-[10px] uppercase tracking-widest text-muted">{c.label}</p>
            <p
              className={`mt-3 text-3xl font-light tabular-nums ${
                c.accent ? "text-accent" : ""
              }`}
            >
              {c.value}
            </p>
            <p className="mt-1 text-xs text-muted/70 group-hover:text-muted">{c.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 border border-border bg-card/20 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-muted">Lead pipeline</h2>
            <Link
              href="/admin/leads"
              className="text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              Manage →
            </Link>
          </div>
          <div className="space-y-3">
            {PIPELINE.map((status) => {
              const count = statusCounts[status] ?? 0;
              const pct = Math.round((count / maxPipeline) * 100);
              return (
                <div key={status} className="flex items-center gap-4">
                  <span className="w-36 shrink-0 text-[10px] uppercase tracking-wider text-muted truncate">
                    {statusLabel(status)}
                  </span>
                  <div className="flex-1 h-1.5 bg-border overflow-hidden">
                    <div
                      className="h-full bg-accent/80 transition-all"
                      style={{ width: `${count === 0 ? 0 : Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-xs tabular-nums text-muted">{count}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-border bg-card/20 p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-widest text-muted">Quick actions</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/leads", title: "Review new leads", desc: "Status & notes" },
              { href: "/admin/consultations", title: "Confirm bookings", desc: "Consultations" },
              { href: "/admin/portfolio", title: "Publish portfolio", desc: "CMS" },
              { href: "/admin/settings", title: "Site settings", desc: "Contact & social" },
              { href: "/admin/media", title: "Media assets", desc: "Logo & showreel" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between border border-border/80 px-4 py-3 transition hover:border-accent/40 hover:bg-white/[0.02]"
              >
                <div>
                  <p className="text-sm">{a.title}</p>
                  <p className="text-[10px] uppercase tracking-widest text-muted">{a.desc}</p>
                </div>
                <span className="text-muted text-xs">→</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-muted">Recent leads</h2>
          <Link
            href="/admin/leads"
            className="text-[10px] uppercase tracking-widest text-accent hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Reference</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Types</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-muted">
                    No leads yet. When someone submits{" "}
                    <Link href="/start-a-project" className="text-accent hover:underline">
                      Start a Project
                    </Link>
                    , they appear here.
                  </td>
                </tr>
              ) : (
                recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-border/60 hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link href={`/admin/leads/${lead.id}`} className="hover:text-accent">
                        {lead.reference_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="hover:text-accent text-foreground/90"
                      >
                        {lead.full_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{lead.email}</td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {lead.project_types?.slice(0, 2).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{lead.budget_range || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                          lead.status === "NEW"
                            ? "border-accent/40 text-accent"
                            : "border-border text-muted"
                        }`}
                      >
                        {statusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border border-border bg-card/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-muted">Consultations</h2>
            <Link
              href="/admin/consultations"
              className="text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              All →
            </Link>
          </div>
          {consultations.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No consultation requests yet.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {consultations.map((c) => (
                <li key={c.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm">{c.full_name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {c.consultation_type}
                      {c.preferred_date ? ` · ${c.preferred_date}` : ""}
                    </p>
                  </div>
                  <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted shrink-0">
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-border bg-card/20 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-muted">Active projects</h2>
            <Link
              href="/admin/projects"
              className="text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              All →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No active productions. Confirm a lead to start a project.
            </p>
          ) : (
            <ul className="divide-y divide-border/60">
              {projects.map((p) => (
                <li key={p.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm">{p.title}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {p.category || "—"}
                      {p.production_date ? ` · ${p.production_date}` : ""}
                    </p>
                  </div>
                  <span className="border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted shrink-0">
                    {statusLabel(p.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
