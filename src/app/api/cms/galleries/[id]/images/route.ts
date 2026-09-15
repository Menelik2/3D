import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

const BUCKET = "galleries";

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

/** Extract storage object path from a public Supabase Storage URL. */
function storagePathFromUrl(url: string, galleryId: string): string | null {
  try {
    const u = new URL(url);
    // .../object/public/galleries/<path>
    const marker = `/object/public/${BUCKET}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx >= 0) {
      return decodeURIComponent(u.pathname.slice(idx + marker.length));
    }
    // Fallback: path under gallery id folder
    if (url.includes(`/${BUCKET}/`)) {
      const after = url.split(`/${BUCKET}/`)[1];
      if (after) return decodeURIComponent(after.split("?")[0]!);
    }
    // Our upload path is always `${galleryId}/...`
    if (url.includes(galleryId + "/")) {
      const i = url.indexOf(galleryId + "/");
      return decodeURIComponent(url.slice(i).split("?")[0]!);
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function removeStorageFiles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  urls: string[],
  galleryId: string
) {
  const paths: string[] = [];
  for (const url of urls) {
    const p = storagePathFromUrl(url, galleryId);
    if (p) paths.push(p);
  }
  if (paths.length === 0) return;
  try {
    await supabase.storage.from(BUCKET).remove(paths);
  } catch {
    // Storage miss is non-fatal; DB row is still removed
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    const body = await request.json();

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

/**
 * Hard-delete image row(s) from gallery_images + remove storage file(s).
 * Body: { image_id } or { image_ids: string[] }
 */
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    const body = await request.json().catch(() => ({}));

    const ids: string[] = [];
    if (Array.isArray(body.image_ids)) {
      for (const id of body.image_ids) {
        const s = String(id || "").trim();
        if (s) ids.push(s);
      }
    }
    const one = String(body.image_id || body.id || "").trim();
    if (one) ids.push(one);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "image_id or image_ids is required." },
        { status: 400 }
      );
    }

    const supabase = await getCmsClient();

    // Fetch rows first (for storage paths + cover check)
    const { data: rows, error: fetchErr } = await supabase
      .from("gallery_images")
      .select("id, image_url")
      .eq("gallery_id", galleryId)
      .in("id", ids);

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    const urls = (rows ?? []).map((r: { image_url: string }) => r.image_url);

    // Hard delete from database
    const { error: delErr, count } = await supabase
      .from("gallery_images")
      .delete({ count: "exact" })
      .eq("gallery_id", galleryId)
      .in("id", ids);

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    // Clear gallery cover if it pointed at a deleted image
    const { data: gal } = await supabase
      .from("client_galleries")
      .select("cover_image_url")
      .eq("id", galleryId)
      .maybeSingle();

    if (gal?.cover_image_url && urls.includes(gal.cover_image_url)) {
      const { data: next } = await supabase
        .from("gallery_images")
        .select("image_url")
        .eq("gallery_id", galleryId)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      await supabase
        .from("client_galleries")
        .update({ cover_image_url: next?.image_url ?? null })
        .eq("id", galleryId);
    }

    // Remove files from Storage bucket
    await removeStorageFiles(supabase, urls, galleryId);

    return NextResponse.json({
      ok: true,
      deleted: count ?? ids.length,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
