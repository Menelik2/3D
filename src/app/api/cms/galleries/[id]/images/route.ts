import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    const body = await request.json();

    // Support single URL or bulk array of URLs
    const rawUrls: string[] = [];
    if (Array.isArray(body.urls)) {
      for (const u of body.urls) {
        const s = String(u || "").trim();
        if (s) rawUrls.push(s);
      }
    }
    const single = String(body.image_url || body.url || "").trim();
    if (single) rawUrls.push(single);

    if (rawUrls.length === 0) {
      return NextResponse.json(
        { error: "At least one image_url is required." },
        { status: 400 }
      );
    }

    const caption = optionalText(body.caption);
    const supabase = await getCmsClient();

    const { data: maxRow } = await supabase
      .from("gallery_images")
      .select("sort_order")
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    let order = (maxRow?.sort_order ?? -1) + 1;

    const rows = rawUrls.map((image_url) => ({
      gallery_id: galleryId,
      image_url,
      caption: rawUrls.length === 1 ? caption : null,
      sort_order: order++,
    }));

    const { data, error } = await supabase
      .from("gallery_images")
      .insert(rows)
      .select("id, image_url, caption, sort_order");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Set cover if gallery has none
    const { data: gal } = await supabase
      .from("client_galleries")
      .select("cover_image_url")
      .eq("id", galleryId)
      .maybeSingle();

    if (gal && !gal.cover_image_url && rawUrls[0]) {
      await supabase
        .from("client_galleries")
        .update({ cover_image_url: rawUrls[0] })
        .eq("id", galleryId);
    }

    return NextResponse.json({ ok: true, items: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const imageId = String(body.image_id || body.id || "").trim();

    if (!imageId) {
      return NextResponse.json(
        { error: "image_id is required." },
        { status: 400 }
      );
    }

    const supabase = await getCmsClient();
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", imageId)
      .eq("gallery_id", galleryId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
