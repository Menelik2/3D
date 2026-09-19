import Link from "next/link";
import { notFound } from "next/navigation";
import { getCmsClient } from "@/lib/cms";
import { GalleryForm } from "@/components/admin/GalleryForm";
import { GalleryImagesManager } from "@/components/admin/GalleryImagesManager";
import { GallerySharePanel } from "@/components/admin/GallerySharePanel";
import { DeleteButton } from "@/components/admin/DeleteButton";

type Props = { params: Promise<{ id: string }> };

export default async function EditGalleryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await getCmsClient();

  const { data: gallery } = await supabase
    .from("client_galleries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!gallery) notFound();

  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption, sort_order")
    .eq("gallery_id", id)
    .order("sort_order", { ascending: true });

  let wishCount = 0;
  const { count } = await supabase
    .from("gallery_wishes")
    .select("id", { count: "exact", head: true })
    .eq("gallery_id", id);
  wishCount = count ?? 0;

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/galleries"
            className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
          >
            ← Galleries
          </Link>
          <h1 className="mt-3 text-2xl font-light tracking-tight">
            {gallery.title}
          </h1>
          <p className="mt-1 text-xs text-muted font-mono">/g/{gallery.token}</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={`/g/${gallery.token}`}
            target="_blank"
            className="text-[10px] uppercase tracking-widest text-accent hover:underline"
          >
            Preview ↗
          </Link>
          <DeleteButton
            endpoint={`/api/cms/galleries/${id}`}
            redirectTo="/admin/galleries"
          />
        </div>
      </div>

      <GallerySharePanel token={gallery.token} title={gallery.title} />

      <section className="border border-border bg-card/20 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted">
              Best Wishes
            </h2>
            <p className="mt-1 text-sm text-foreground/90">
              {wishCount} message{wishCount === 1 ? "" : "s"} on this gallery
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/admin/wishes?gallery=${id}`}
              className="text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              Manage wishes →
            </Link>
            <Link
              href="/admin/wishes/new"
              className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground"
            >
              + Add wish
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-widest text-muted mb-4">
          Photos ({images?.length ?? 0})
        </h2>
        <GalleryImagesManager galleryId={id} initial={images ?? []} />
      </section>

      <section className="border border-border bg-card/20 p-6">
        <h2 className="text-xs uppercase tracking-widest text-muted mb-6">
          Gallery settings
        </h2>
        <GalleryForm initial={gallery} />
      </section>
    </div>
  );
}
