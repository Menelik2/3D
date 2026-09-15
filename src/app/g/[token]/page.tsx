import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
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

export async function generateMetadata({ params }: Props) {
  const { token } = await params;
  const supabase = publicClient();
  if (!supabase) return { title: "Gallery | META Pictures" };

  const { data } = await supabase
    .from("client_galleries")
    .select("title, client_name, is_published")
    .eq("token", token)
    .eq("is_published", true)
    .maybeSingle();

  if (!data) return { title: "Gallery | META Pictures", robots: { index: false } };

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
  const supabase = publicClient();
  if (!supabase) notFound();

  const { data: gallery } = await supabase
    .from("client_galleries")
    .select("id, title, client_name, is_published")
    .eq("token", token)
    .eq("is_published", true)
    .maybeSingle();

  if (!gallery) notFound();

  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption, sort_order")
    .eq("gallery_id", gallery.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="min-h-dvh bg-black text-white">
      <ClientGalleryViewer
        title={gallery.title}
        clientName={gallery.client_name}
        photos={images ?? []}
      />
    </div>
  );
}
