import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin";

const BUCKET = "galleries";
const MAX_FILES = 20;
const MAX_BYTES = 12 * 1024 * 1024; // 12 MB per file (after client compress usually smaller)
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
 * Public customer upload for a private gallery token.
 * Requires SUPABASE_SERVICE_ROLE_KEY on the server.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token || token.length < 6) {
      return NextResponse.json({ error: "Invalid gallery link." }, { status: 400 });
    }

    const admin = tryCreateAdminClient();
    if (!admin) {
      return NextResponse.json(
        {
          error:
            "Upload is not configured. Ask the studio to set SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 503 }
      );
    }

    // Prefer select with allow_client_upload; fall back if column missing
    let gallery: {
      id: string;
      is_published: boolean;
      allow_client_upload?: boolean | null;
      cover_image_url?: string | null;
    } | null = null;

    {
      const { data, error } = await admin
        .from("client_galleries")
        .select("id, is_published, allow_client_upload, cover_image_url")
        .eq("token", token)
        .maybeSingle();

      if (error && /allow_client_upload/i.test(error.message)) {
        const retry = await admin
          .from("client_galleries")
          .select("id, is_published, cover_image_url")
          .eq("token", token)
          .maybeSingle();
        if (retry.error) {
          return NextResponse.json({ error: retry.error.message }, { status: 500 });
        }
        gallery = retry.data
          ? { ...retry.data, allow_client_upload: true }
          : null;
      } else if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        gallery = data;
      }
    }

    if (!gallery || !gallery.is_published) {
      return NextResponse.json({ error: "Gallery not found." }, { status: 404 });
    }

    if (gallery.allow_client_upload === false) {
      return NextResponse.json(
        { error: "Uploads are disabled for this gallery." },
        { status: 403 }
      );
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

    const { data: maxRow } = await admin
      .from("gallery_images")
      .select("sort_order")
      .eq("gallery_id", gallery.id)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    let order = (maxRow?.sort_order ?? -1) + 1;
    const inserted: { id: string; image_url: string; caption: string | null; sort_order: number }[] =
      [];

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

      const ext =
        type.includes("webp")
          ? "webp"
          : type.includes("png")
            ? "png"
            : type.includes("gif")
              ? "gif"
              : "jpg";
      const path = `${gallery.id}/client/${Date.now()}-${i}-${safeName(file.name) || "photo"}.${ext}`;

      const buf = Buffer.from(await file.arrayBuffer());
      const { error: upErr } = await admin.storage.from(BUCKET).upload(path, buf, {
        contentType: type || "image/jpeg",
        upsert: false,
        cacheControl: "31536000",
      });

      if (upErr) {
        return NextResponse.json(
          {
            error: upErr.message.includes("Bucket not found")
              ? `Storage bucket "${BUCKET}" is missing.`
              : upErr.message,
          },
          { status: 500 }
        );
      }

      const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(path);
      const image_url = pub.publicUrl;

      const { data: row, error: insErr } = await admin
        .from("gallery_images")
        .insert({
          gallery_id: gallery.id,
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
      await admin
        .from("client_galleries")
        .update({ cover_image_url: inserted[0].image_url })
        .eq("id", gallery.id);
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
