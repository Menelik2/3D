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
  const supabase = publicClient();
  if (!supabase) notFound();

  // allow_client_upload may be missing until SQL migration runs
  let gallery: {
    id: string;
    title: string;
    client_name: string | null;
    is_published: boolean;
    allow_client_upload?: boolean | null;
  } | null = null;

  {
    const { data, error } = await supabase
      .from("client_galleries")
      .select("id, title, client_name, is_published, allow_client_upload")
      .eq("token", token)
      .eq("is_published", true)
      .maybeSingle();

    if (error && /allow_client_upload/i.test(error.message || "")) {
      const retry = await supabase
        .from("client_galleries")
        .select("id, title, client_name, is_published")
        .eq("token", token)
        .eq("is_published", true)
        .maybeSingle();
      gallery = retry.data
        ? { ...retry.data, allow_client_upload: true }
        : null;
    } else {
      gallery = data;
    }
  }

  if (!gallery) notFound();

  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, image_url, caption, sort_order")
    .eq("gallery_id", gallery.id)
    .order("sort_order", { ascending: true });

  const allowUpload = gallery.allow_client_upload !== false;

  return (
    <ClientGalleryViewer
      title={gallery.title}
      clientName={gallery.client_name}
      photos={images ?? []}
      token={token}
      allowUpload={allowUpload}
    />
  );
}
