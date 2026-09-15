import Link from "next/link";
import { getCmsClient } from "@/lib/cms";

export default async function AdminGalleriesPage() {
  let items: Array<{
    id: string;
    token: string;
    title: string;
    client_name: string | null;
    is_published: boolean;
    cover_image_url: string | null;
    created_at: string;
  }> = [];
  let err: string | null = null;

  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("client_galleries")
      .select(
        "id, token, title, client_name, is_published, cover_image_url, created_at"
      )
      .order("created_at", { ascending: false });
    if (error) err = error.message;
    else items = data ?? [];
  } catch {
    err = "Could not load galleries. Run supabase/client-galleries.sql first.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Client galleries</h1>
          <p className="mt-1 text-sm text-muted">
            Private photo sets with a unique link and QR code for each client.
          </p>
        </div>
        <Link
          href="/admin/galleries/new"
          className="inline-flex self-start bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
        >
          + New gallery
        </Link>
      </div>

      {err && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {err}
        </div>
      )}

      {items.length === 0 && !err ? (
        <div className="border border-border px-4 py-16 text-center text-sm text-muted">
          No galleries yet.{" "}
          <Link href="/admin/galleries/new" className="text-accent hover:underline">
            Create one
          </Link>
        </div>
      ) : (
        <>
          <div className="md:hidden space-y-2">
            {items.map((g) => (
              <Link
                key={g.id}
                href={`/admin/galleries/${g.id}`}
                className="flex gap-3 border border-border bg-card/20 p-3 hover:border-accent/30"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-black/40">
                  {g.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={g.cover_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{g.title}</p>
                  <p className="text-xs text-muted truncate">
                    {g.client_name || "—"}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
                    {g.is_published ? "Published" : "Draft"}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-card/50 text-[10px] uppercase tracking-widest text-muted">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((g) => (
                  <tr key={g.id} className="border-b border-border/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/galleries/${g.id}`}
                        className="hover:text-accent"
                      >
                        {g.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {g.client_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {g.is_published ? "Published" : "Draft"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {new Date(g.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/galleries/${g.id}`}
                        className="text-[10px] uppercase tracking-widest text-muted hover:text-accent"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
