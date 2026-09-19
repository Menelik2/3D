import Link from "next/link";
import { notFound } from "next/navigation";
import { getCmsClient } from "@/lib/cms";
import { WishForm, type GalleryOption } from "@/components/admin/WishForm";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Props = { params: Promise<{ id: string }> };

type GalleryJoin = {
  id: string;
  title: string;
  client_name: string | null;
  token: string;
} | null;

export default async function EditWishPage({ params }: Props) {
  const { id } = await params;
  const supabase = await getCmsClient();

  const { data: wish } = await supabase
    .from("gallery_wishes")
    .select(
      "id, gallery_id, author_name, message, created_at, client_galleries(id, title, client_name, token)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!wish) notFound();

  const { data: galleryRows } = await supabase
    .from("client_galleries")
    .select("id, title, client_name")
    .order("created_at", { ascending: false });

  const galleries: GalleryOption[] = galleryRows ?? [];
  const g = wish.client_galleries as unknown as GalleryJoin;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/wishes"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            ← Best Wishes
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">
            Edit wish
          </h1>
          <p className="mt-1 text-xs text-muted">
            {g?.title ? `Gallery: ${g.title}` : null}
            {g?.token ? (
              <>
                {" · "}
                <Link
                  href={`/g/${g.token}`}
                  target="_blank"
                  className="text-accent hover:underline"
                >
                  Preview ↗
                </Link>
              </>
            ) : null}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Submitted {new Date(wish.created_at).toLocaleString()}
          </p>
        </div>
        <DeleteButton
          endpoint={`/api/cms/wishes/${id}`}
          redirectTo="/admin/wishes"
          confirmMessage="Permanently delete this wish from the database?"
        />
      </div>

      <WishForm
        initial={{
          id: wish.id,
          gallery_id: wish.gallery_id,
          author_name: wish.author_name,
          message: wish.message,
        }}
        galleries={galleries}
      />
    </div>
  );
}
