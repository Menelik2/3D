import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getCmsClient, parseBool } from "@/lib/cms";

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function generateToken(): string {
  return randomBytes(12).toString("base64url");
}

export async function GET() {
  try {
    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("client_galleries")
      .select(
        "id, token, title, client_name, client_email, cover_image_url, is_published, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
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

    const supabase = await getCmsClient();
    let token = generateToken();
    let data: { id: string; token: string } | null = null;
    let lastError: string | null = null;

    for (let i = 0; i < 3; i++) {
      token = generateToken();
      const { data: row, error } = await supabase
        .from("client_galleries")
        .insert({
          token,
          title,
          client_name: optionalText(body.client_name),
          client_email: optionalText(body.client_email),
          cover_image_url: optionalText(body.cover_image_url),
          notes: optionalText(body.notes),
          is_published: parseBool(body.is_published, true),
        })
        .select("id, token")
        .single();

      if (!error && row) {
        data = row;
        break;
      }
      lastError = error?.message || "Insert failed";
      if (error?.code !== "23505") break;
    }

    if (!data) {
      return NextResponse.json(
        { error: lastError || "Could not create gallery." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
