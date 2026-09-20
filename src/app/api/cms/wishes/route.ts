import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NAME_MAX = 80;
const MESSAGE_MAX = 800;
const ADMIN_LIST_LIMIT = 5000;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const galleryId = searchParams.get("gallery_id")?.trim() || null;

    const supabase = await getCmsClient();
    let q = supabase
      .from("gallery_wishes")
      .select(
        "id, gallery_id, author_name, message, created_at, client_galleries(id, title, client_name, token)"
      )
      .order("created_at", { ascending: false })
      .limit(ADMIN_LIST_LIMIT);

    if (galleryId && UUID_RE.test(galleryId)) {
      q = q.eq("gallery_id", galleryId);
    }

    const { data, error } = await q;

    if (error) {
      if (/relation|does not exist|gallery_wishes/i.test(error.message)) {
        return NextResponse.json({
          items: [],
          needsMigration: true,
          error:
            "Wishes table missing. Run supabase/gallery-wishes.sql in Supabase.",
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const galleryId = String(body.gallery_id ?? "").trim();
    const name = String(body.author_name ?? body.name ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!UUID_RE.test(galleryId)) {
      return NextResponse.json(
        { error: "Valid gallery_id is required." },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
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

    const supabase = await getCmsClient();

    const { data: gallery, error: gErr } = await supabase
      .from("client_galleries")
      .select("id")
      .eq("id", galleryId)
      .maybeSingle();

    if (gErr) {
      return NextResponse.json({ error: gErr.message }, { status: 500 });
    }
    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found." }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("gallery_wishes")
      .insert({
        gallery_id: galleryId,
        author_name: name,
        message,
      })
      .select("id, gallery_id, author_name, message, created_at")
      .single();

    if (error) {
      if (/relation|does not exist|gallery_wishes/i.test(error.message)) {
        return NextResponse.json(
          {
            error:
              "Wishes table missing. Run supabase/gallery-wishes.sql in Supabase.",
          },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** Bulk hard-delete wishes from the database. Body: { ids: string[] } */
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
        { error: "Provide at least one valid id in ids[]." },
        { status: 400 }
      );
    }
    if (ids.length > 500) {
      return NextResponse.json(
        { error: "Maximum 500 wishes per bulk delete." },
        { status: 400 }
      );
    }

    const supabase = await getCmsClient();
    const { error, count } = await supabase
      .from("gallery_wishes")
      .delete({ count: "exact" })
      .in("id", ids);

    if (error) {
      console.error("[cms/wishes] bulk delete:", error.message);
      return NextResponse.json(
        { error: error.message || "Bulk delete failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      deleted: count ?? ids.length,
      ids,
    });
  } catch (e) {
    console.error("[cms/wishes] bulk delete", e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
