import Link from "next/link";
import { getCmsClient } from "@/lib/cms";
import { WishesTable, type WishRow } from "@/components/admin/WishesTable";

type GalleryJoin = {
  id: string;
  title: string;
  client_name: string | null;
  token: string;
} | null;

export default async function AdminWishesPage({
  searchParams,
}: {
  searchParams: Promise<{ gallery?: string }>;
}) {
  const { gallery: galleryFilter } = await searchParams;

  let wishes: WishRow[] = [];
  let errorMsg: string | null = null;

  try {
    const supabase = await getCmsClient();
    let q = supabase
      .from("gallery_wishes")
      .select(
        "id, gallery_id, author_name, message, created_at, client_galleries(id, title, client_name, token)"
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (galleryFilter) {
      q = q.eq("gallery_id", galleryFilter);
    }

    const { data, error } = await q;

    if (error) {
      if (/relation|does not exist|gallery_wishes/i.test(error.message)) {
        errorMsg =
          "Wishes table missing. Run supabase/gallery-wishes.sql in the Supabase SQL Editor.";
      } else {
        errorMsg = error.message;
      }
    } else {
      wishes = (data ?? []).map((row) => {
        const g = row.client_galleries as unknown as GalleryJoin;
        return {
          id: row.id,
          gallery_id: row.gallery_id,
          author_name: row.author_name,
          message: row.message,
          created_at: row.created_at,
          gallery_title: g?.title ?? null,
          gallery_token: g?.token ?? null,
          client_name: g?.client_name ?? null,
        };
      });
    }
  } catch {
    errorMsg = "Could not load wishes. Check Supabase keys.";
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-light tracking-tight">Best Wishes</h1>
          <p className="mt-1 text-sm text-muted">
            Guest messages on private galleries. Edit, add, or permanently
            delete from the database.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs text-muted">{wishes.length} shown</p>
          <Link
            href="/admin/wishes/new"
            className="inline-flex bg-accent px-5 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-accent-hover"
          >
            + New wish
          </Link>
        </div>
      </div>

      {galleryFilter ? (
        <p className="text-xs text-muted">
          Filtered by gallery.{" "}
          <Link href="/admin/wishes" className="text-accent hover:underline">
            Clear filter
          </Link>
        </p>
      ) : null}

      {errorMsg && (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          {errorMsg}
        </div>
      )}

      <WishesTable wishes={wishes} />
    </div>
  );
}
