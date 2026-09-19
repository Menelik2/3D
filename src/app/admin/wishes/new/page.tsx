import Link from "next/link";
import { getCmsClient } from "@/lib/cms";
import { WishForm, type GalleryOption } from "@/components/admin/WishForm";

export default async function NewWishPage() {
  const supabase = await getCmsClient();
  const { data } = await supabase
    .from("client_galleries")
    .select("id, title, client_name")
    .order("created_at", { ascending: false });

  const galleries: GalleryOption[] = data ?? [];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <Link
          href="/admin/wishes"
          className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
        >
          ← Best Wishes
        </Link>
        <h1 className="mt-3 text-2xl font-light tracking-tight">New wish</h1>
        <p className="mt-1 text-sm text-muted">
          Manually add a guest message to a private gallery.
        </p>
      </div>

      {galleries.length === 0 ? (
        <div className="border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          No galleries yet.{" "}
          <Link href="/admin/galleries/new" className="underline">
            Create a gallery
          </Link>{" "}
          first.
        </div>
      ) : (
        <WishForm galleries={galleries} />
      )}
    </div>
  );
}
