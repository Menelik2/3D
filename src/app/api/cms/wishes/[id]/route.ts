import { NextResponse } from "next/server";
import { getCmsClient } from "@/lib/cms";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NAME_MAX = 80;
const MESSAGE_MAX = 800;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("gallery_wishes")
      .select(
        "id, gallery_id, author_name, message, created_at, client_galleries(id, title, client_name, token)"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Wish not found." }, { status: 404 });
    }

    return NextResponse.json({ item: data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const updates: Record<string, unknown> = {};

    if (body.author_name !== undefined || body.name !== undefined) {
      const name = String(body.author_name ?? body.name ?? "").trim();
      if (!name) {
        return NextResponse.json({ error: "Name is required." }, { status: 400 });
      }
      if (name.length > NAME_MAX) {
        return NextResponse.json(
          { error: `Name must be ${NAME_MAX} characters or fewer.` },
          { status: 400 }
        );
      }
      updates.author_name = name;
    }

    if (body.message !== undefined) {
      const message = String(body.message ?? "").trim();
      if (!message) {
        return NextResponse.json(
          { error: "Message is required." },
          { status: 400 }
        );
      }
      if (message.length > MESSAGE_MAX) {
        return NextResponse.json(
          { error: `Message must be ${MESSAGE_MAX} characters or fewer.` },
          { status: 400 }
        );
      }
      updates.message = message;
    }

    if (body.gallery_id !== undefined) {
      const galleryId = String(body.gallery_id).trim();
      if (!UUID_RE.test(galleryId)) {
        return NextResponse.json(
          { error: "Valid gallery_id is required." },
          { status: 400 }
        );
      }
      updates.gallery_id = galleryId;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { data, error } = await supabase
      .from("gallery_wishes")
      .update(updates)
      .eq("id", id)
      .select("id, gallery_id, author_name, message, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    }

    const supabase = await getCmsClient();
    const { error } = await supabase
      .from("gallery_wishes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
