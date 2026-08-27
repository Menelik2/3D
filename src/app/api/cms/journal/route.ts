import { NextResponse } from "next/server";
import { getCmsClient, slugify, parseBool } from "@/lib/cms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const slug = String(body.slug || "").trim() || slugify(title);
    const isPublished = parseBool(body.is_published, false);

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("journal_posts")
      .insert({
        title,
        slug,
        excerpt: body.excerpt || null,
        body: body.body || null,
        category: body.category || null,
        cover_image_url: body.cover_image_url || null,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .select("id, slug")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
