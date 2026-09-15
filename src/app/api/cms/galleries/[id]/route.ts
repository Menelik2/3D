import { NextResponse } from "next/server";
import { getCmsClient, parseBool } from "@/lib/cms";

const BUCKET = "galleries";

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function storagePathFromUrl(url: string, galleryId: string): string | null {
  try {
    const u = new URL(url);
    const marker = `/object/public/${BUCKET}/`;
    const idx = u.pathname.indexOf(marker);
    if (idx >= 0) {
      return decodeURIComponent(u.pathname.slice(idx + marker.length));
    }
    if (url.includes(`/${BUCKET}/`)) {
      const after = url.split(`/${BUCKET}/`)[1];
      if (after) return decodeURIComponent(after.split("?")[0]!);
    }
    if (url.includes(galleryId + "/")) {
      const i = url.indexOf(galleryId + "/");
      return decodeURIComponent(url.slice(i).split("?")[0]!);
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const t = String(body.title).trim();
      if (!t) {
        return NextResponse.json({ error: "Title is required." }, { status: 400 });
      }
      updates.title = t;
    }
    if (body.client_name !== undefined)
      updates.client_name = optionalText(body.client_name);
    if (body.client_email !== undefined)
      updates.client_email = optionalText(body.client_email);
    if (body.cover_image_url !== undefined)
      updates.cover_image_url = optionalText(body.cover_image_url);
    if (body.notes !== undefined) updates.notes = optionalText(body.notes);
    if (body.is_published !== undefined)
      updates.is_published = parseBool(body.is_published);
    if (body.allow_client_upload !== undefined)
      updates.allow_client_upload = parseBool(body.allow_client_upload, true);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    let { data, error } = await supabase
      .from("client_galleries")
      .update(updates)
      .eq("id", id)
      .select("id, token, title, is_published")
      .single();

    if (error && /allow_client_upload/i.test(error.message) && "allow_client_upload" in updates) {
      const { allow_client_upload: _, ...rest } = updates;
      if (Object.keys(rest).length === 0) {
        return NextResponse.json({
          ok: true,
          item: { id },
          warning:
            "Run supabase/client-upload.sql to enable the client-upload toggle.",
        });
      }
      const retry = await supabase
        .from("client_galleries")
        .update(rest)
        .eq("id", id)
        .select("id, token, title, is_published")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** Hard-delete gallery + all image rows + storage files. */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await getCmsClient();

    const { data: images } = await supabase
      .from("gallery_images")
      .select("id, image_url")
      .eq("gallery_id", id);

    const urls = (images ?? []).map((r: { image_url: string }) => r.image_url);
    const paths: string[] = [];
    for (const url of urls) {
      const p = storagePathFromUrl(url, id);
      if (p) paths.push(p);
    }

    const { error: imgErr } = await supabase
      .from("gallery_images")
      .delete()
      .eq("gallery_id", id);

    if (imgErr) {
      return NextResponse.json({ error: imgErr.message }, { status: 500 });
    }

    const { error } = await supabase
      .from("client_galleries")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (paths.length > 0) {
      try {
        await supabase.storage.from(BUCKET).remove(paths);
      } catch {
        /* ignore */
      }
    }

    return NextResponse.json({
      ok: true,
      deleted_images: images?.length ?? 0,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
