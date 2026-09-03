import { NextResponse } from "next/server";
import { getCmsClient, slugify, parseBool } from "@/lib/cms";
import { revalidateCms } from "@/lib/data/revalidate";

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function parseTags(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map(String).map((t) => t.trim()).filter(Boolean);
  }
  if (typeof v === "string") {
    return v
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.slug !== undefined) {
      updates.slug =
        String(body.slug).trim() || slugify(String(body.title || "post"));
    }
    if (body.excerpt !== undefined) updates.excerpt = optionalText(body.excerpt);
    if (body.body !== undefined) updates.body = optionalText(body.body);
    if (body.category !== undefined)
      updates.category = optionalText(body.category);
    if (body.cover_image_url !== undefined)
      updates.cover_image_url = optionalText(body.cover_image_url);
    if (body.tags !== undefined) updates.tags = parseTags(body.tags);
    if (body.seo_title !== undefined)
      updates.seo_title = optionalText(body.seo_title);
    if (body.seo_description !== undefined)
      updates.seo_description = optionalText(body.seo_description);
    if (body.social_image_url !== undefined)
      updates.social_image_url = optionalText(body.social_image_url);

    if (body.is_published !== undefined) {
      const published = parseBool(body.is_published);
      updates.is_published = published;
      if (published) {
        // Only set published_at if not already published (keep original date)
        // Caller can force via body.published_at
        if (body.published_at) {
          updates.published_at = body.published_at;
        } else {
          updates.published_at = new Date().toISOString();
        }
      } else {
        updates.published_at = null;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("journal_posts")
      .update(updates)
      .eq("id", id)
      .select("id, slug, is_published")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidateCms("journal");
    if (data?.slug) revalidateCms(`journal:${data.slug}`);
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await getCmsClient();

    const { data: row } = await supabase
      .from("journal_posts")
      .select("slug")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase
      .from("journal_posts")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateCms("journal");
    if (row?.slug) revalidateCms(`journal:${row.slug}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
