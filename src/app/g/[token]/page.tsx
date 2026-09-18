import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { ClientGalleryViewer } from "@/components/gallery/ClientGalleryViewer";

type Props = { params: Promise<{ token: string }> };

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Prefer service role for reliable reads if RLS policies are incomplete. */
function galleryDb() {
  return tryCreateAdminClient() ?? publicClient();
}

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const supabase = galleryDb();
  if (!supabase) return { title: "Gallery | META Pictures" };

  const { data } = await supabase
    .from("client_galleries")
    .select("title, client_name, is_published")
    .eq("token", token)
    .eq("is_published", true)
    .maybeSingle();

  if (!data)
    return { title: "Gallery | META Pictures", robots: { index: false } };

  return {
    title: `${data.title} | META Pictures`,
    description: data.client_name
      ? `Private photo gallery for ${data.client_name}`
      : "Private photo gallery",
    robots: { index: false, follow: false },
  };
}

export default async function PublicGalleryPage({ params }: Props) {
  const { token } = await params;
  const supabase = galleryDb();
  if (!supabase) notFound();

  const { data: gallery, error } = await supabase
    .from("client_galleries")
    .select("id, title, client_name, is_published")
    .eq("token", token)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[gallery] load error", error.message);
    notFound();
  }
  if (!gallery) notFound();

  const { data: images, error: imgErr } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption, sort_order")
    .eq("gallery_id", gallery.id)
    .order("sort_order", { ascending: true });

  if (imgErr) {
    console.error("[gallery] images error", imgErr.message);
  }

  const photos = (images ?? []).filter(
    (p) => typeof p.image_url === "string" && p.image_url.length > 0
  );

  return (
    <ClientGalleryViewer
      title={gallery.title}
      clientName={gallery.client_name}
      photos={photos}
    />
  );
}
