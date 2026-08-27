import { NextResponse } from "next/server";
import { getCmsClient, slugify, parseBool } from "@/lib/cms";

export async function GET() {
  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, title, slug, category, year, is_published, is_featured, sort_order")
      .order("sort_order", { ascending: true });
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
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const slug = String(body.slug || "").trim() || slugify(title);
    const supabase = await getCmsClient();

    const { data, error } = await supabase
      .from("portfolio_items")
      .insert({
        title,
        slug,
        category: String(body.category || "Other").trim() || "Other",
        description: body.description || null,
        client_name: body.client_name || null,
        year: body.year ? Number(body.year) : null,
        cover_image_url: body.cover_image_url || null,
        video_url: body.video_url || null,
        is_published: parseBool(body.is_published, false),
        is_featured: parseBool(body.is_featured, false),
        sort_order: body.sort_order != null ? Number(body.sort_order) : 0,
      })
      .select("id, slug")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
