import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

const BUCKET = "galleries";
const MAX_FILES = 30;
const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Admin multipart upload → Storage + gallery_images rows.
 * Uses service role when available (bypasses Storage RLS).
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    if (!galleryId) {
      return NextResponse.json({ error: "Missing gallery id." }, { status: 400 });
    }

    const supabase = await getCmsClient();

    const { data: gallery, error: gErr } = await supabase
      .from("client_galleries")
      .select("id, cover_image_url")
      .eq("id", galleryId)
      .maybeSingle();

    if (gErr) {
      return NextResponse.json({ error: gErr.message }, { status: 500 });
    }
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found." }, { status: 404 });
    }

    const form = await request.formData();
    const files = form.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No images selected." }, { status: 400 });
    }
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} images per upload.` },
        { status: 400 }
      );
    }

    const { data: maxRow } = await supabase
      .from("gallery_images")
      .select("sort_order")
      .eq("gallery_id", galleryId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    let order = (maxRow?.sort_order ?? -1) + 1;
    const inserted: {
      id: string;
      image_url: string;
      caption: string | null;
      sort_order: number;
    }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i]!;
      const type = (file.type || "").toLowerCase();
      if (!ALLOWED.has(type) && !type.startsWith("image/")) {
        return NextResponse.json(
          { error: `${file.name} is not a supported image.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: `${file.name} is too large (max 12 MB).` },
          { status: 400 }
        );
      }

      const ext = type.includes("webp")
        ? "webp"
        : type.includes("png")
          ? "png"
          : type.includes("gif")
            ? "gif"
            : "jpg";

      const path = `${galleryId}/admin/${Date.now()}-${i}-${safeName(file.name) || "photo"}.${ext}`;
      const buf = Buffer.from(await file.arrayBuffer());

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, buf, {
        contentType: type || "image/jpeg",
        upsert: false,
        cacheControl: "31536000",
      });

      if (upErr) {
        return NextResponse.json(
          {
            error: upErr.message.includes("Bucket not found")
              ? `Storage bucket "${BUCKET}" is missing. Create a public bucket named "${BUCKET}" in Supabase → Storage.`
              : upErr.message,
          },
          { status: 500 }
        );
      }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const image_url = pub.publicUrl;

      const { data: row, error: insErr } = await supabase
        .from("gallery_images")
        .insert({
          gallery_id: galleryId,
          image_url,
          caption: null,
          sort_order: order++,
        })
        .select("id, image_url, caption, sort_order")
        .single();

      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
      if (row) inserted.push(row);
    }

    if (!gallery.cover_image_url && inserted[0]?.image_url) {
      await supabase
        .from("client_galleries")
        .update({ cover_image_url: inserted[0].image_url })
        .eq("id", galleryId);
    }

    return NextResponse.json({
      ok: true,
      items: inserted,
      count: inserted.length,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
