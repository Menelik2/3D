import { NextResponse } from "next/server";
import { getCmsClient, parseBool } from "@/lib/cms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = String(body.question || "").trim();
    const answer = String(body.answer || "").trim();
    if (!question || !answer) {
      return NextResponse.json({ error: "Question and answer are required." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("faqs")
      .insert({
        question,
        answer,
        category: body.category || null,
        sort_order: body.sort_order != null ? Number(body.sort_order) : 0,
        is_published: parseBool(body.is_published, true),
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
