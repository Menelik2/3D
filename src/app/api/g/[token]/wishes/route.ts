import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@supabase/supabase-js";

const NAME_MAX = 80;
const MESSAGE_MAX = 800;

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function db() {
  return tryCreateAdminClient() ?? publicClient();
}

async function resolveGallery(token: string) {
  const supabase = db();
  if (!supabase) return { error: "Database not configured.", status: 503 as const };

  const { data, error } = await supabase
    .from("client_galleries")
    .select("id, is_published")
    .eq("token", token)
    .maybeSingle();

  if (error) return { error: error.message, status: 500 as const };
  if (!data || !data.is_published) {
    return { error: "Gallery not found.", status: 404 as const };
  }
  return { gallery: data };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    if (!token || token.length < 6) {
      return NextResponse.json({ error: "Invalid gallery link." }, { status: 400 });
    }

    const resolved = await resolveGallery(token);
    if ("error" in resolved && resolved.error) {
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status ?? 500 }
      );
    }
    const gallery = resolved.gallery!;

    const supabase = db();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured." }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("gallery_wishes")
      .select("id, author_name, message, created_at")
      .eq("gallery_id", gallery.id)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      // Table may not exist yet
      if (/relation|does not exist|gallery_wishes/i.test(error.message)) {
        return NextResponse.json({ items: [], needsMigration: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

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
            "Wishes are not configured. Ask the studio to set SUPABASE_SERVICE_ROLE_KEY and run gallery-wishes.sql.",
        },
        { status: 503 }
      );
    }

    const { data: gallery, error: gErr } = await admin
      .from("client_galleries")
      .select("id, is_published")
      .eq("token", token)
      .maybeSingle();

    if (gErr) {
      return NextResponse.json({ error: gErr.message }, { status: 500 });
    }
    if (!gallery || !gallery.is_published) {
      return NextResponse.json({ error: "Gallery not found." }, { status: 404 });
    }

    let body: { name?: string; message?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Your message is required." }, { status: 400 });
    }
    if (name.length > NAME_MAX) {
      return NextResponse.json(
        { error: `Name must be ${NAME_MAX} characters or fewer.` },
        { status: 400 }
      );
    }
    if (message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: `Message must be ${MESSAGE_MAX} characters or fewer.` },
        { status: 400 }
      );
    }

    const { data: row, error: insErr } = await admin
      .from("gallery_wishes")
      .insert({
        gallery_id: gallery.id,
        author_name: name,
        message,
      })
      .select("id, author_name, message, created_at")
      .single();

    if (insErr) {
      if (/relation|does not exist|gallery_wishes/i.test(insErr.message)) {
        return NextResponse.json(
          {
            error:
              "Wishes table is missing. Run supabase/gallery-wishes.sql in the Supabase SQL Editor.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, item: row });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
