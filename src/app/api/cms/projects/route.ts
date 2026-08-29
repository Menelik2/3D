import { NextResponse } from "next/server";
import { getCmsClient, slugify } from "@/lib/cms";

export async function GET() {
  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, title, slug, status, category, budget, production_date, delivery_date, created_at"
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
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

    const slug = String(body.slug || "").trim() || slugify(title);
    const supabase = await getCmsClient();

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        slug,
        status: body.status || "IDEA",
        category: body.category || null,
        description: body.description || null,
        budget: body.budget != null && body.budget !== "" ? Number(body.budget) : null,
        location: body.location || null,
        production_date: body.production_date || null,
        delivery_date: body.delivery_date || null,
        cover_image_url: body.cover_image_url || null,
      })
      .select("id, slug")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
