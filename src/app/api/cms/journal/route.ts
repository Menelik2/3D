import { NextResponse } from "next/server";
import { getCmsClient, slugify, parseBool } from "@/lib/cms";
import { revalidateCms } from "@/lib/data/revalidate";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

export async function GET() {
  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("journal_posts")
      .select(
        "id, title, slug, category, is_published, published_at, created_at, updated_at"
      )
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const slug = String(body.slug || "").trim() || slugify(title);
    const isPublished = parseBool(body.is_published, false);
    const tags = parseTags(body.tags);

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("journal_posts")
      .insert({
        title,
        slug,
        excerpt: optionalText(body.excerpt),
        body: optionalText(body.body),
        category: optionalText(body.category),
        cover_image_url: optionalText(body.cover_image_url),
        tags,
        seo_title: optionalText(body.seo_title),
        seo_description: optionalText(body.seo_description),
        social_image_url: optionalText(body.social_image_url),
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .select("id, slug")
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

/**
 * Bulk hard-delete journal posts from the database.
 * Body: { ids: string[] }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const raw = Array.isArray(body.ids) ? body.ids : [];
    const ids = [
      ...new Set(
        raw
          .map((id: unknown) => String(id).trim())
          .filter((id: string) => UUID_RE.test(id))
      ),
    ];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "Provide at least one valid post id in ids[]." },
        { status: 400 }
      );
    }
    if (ids.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 posts per bulk delete." },
        { status: 400 }
      );
    }

    const supabase = await getCmsClient();

    // Fetch slugs first so we can revalidate public routes
    const { data: rows } = await supabase
      .from("journal_posts")
      .select("id, slug")
      .in("id", ids);

    const { error, count } = await supabase
      .from("journal_posts")
      .delete({ count: "exact" })
      .in("id", ids);

    if (error) {
      console.error("[cms/journal] bulk delete:", error.message);
      return NextResponse.json(
        { error: error.message || "Bulk delete failed." },
        { status: 500 }
      );
    }

    revalidateCms("journal");
    for (const row of rows ?? []) {
      if (row.slug) revalidateCms(`journal:${row.slug}`);
    }

    return NextResponse.json({
      ok: true,
      deleted: count ?? ids.length,
      ids,
    });
  } catch (e) {
    console.error("[cms/journal] bulk delete", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
