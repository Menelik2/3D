import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getWriteClient() {
  try {
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return createAdminClient();
    }
  } catch {
    /* fall through */
  }
  return createClient();
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: leadId } = await context.params;
    const body = await request.json();
    const noteBody = String(body.body || "").trim();

    if (!noteBody) {
      return NextResponse.json({ error: "Note body is required." }, { status: 400 });
    }

    const supabase = await getWriteClient();

    // Optional author from session
    let authorId: string | null = null;
    try {
      const sessionClient = await createClient();
      const {
        data: { user },
      } = await sessionClient.auth.getUser();
      authorId = user?.id ?? null;
    } catch {
      /* ignore */
    }

    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: leadId,
        body: noteBody,
        author_id: authorId,
      })
      .select("id, body, created_at, author_id")
      .single();

    if (error) {
      console.error("Note insert error:", error.message);
      return NextResponse.json(
        { error: error.message || "Could not save note." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, note: data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
