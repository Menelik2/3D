import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
import { sendConsultationNotification } from "@/lib/email";

function optionalDate(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

function optionalText(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || body.name || "").trim();
    const email = String(body.email || "").trim();
    const consultationType = String(
      body.type || body.consultationType || ""
    ).trim();

    if (!fullName || !email || !consultationType) {
      return NextResponse.json(
        { error: "Name, email and consultation type are required." },
        { status: 400 }
      );
    }

    const phone = optionalText(body.phone);
    const preferredDate = optionalDate(body.date || body.preferredDate);
    const preferredTime = optionalText(body.time || body.preferredTime);
    const notes = optionalText(body.notes);

    const row = {
      consultation_type: consultationType,
      full_name: fullName,
      email,
      phone,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      notes,
      status: "PENDING" as const,
    };

    const clients = [];
    const admin = tryCreateAdminClient();
    if (admin) clients.push(admin);
    clients.push(await createClient());

    let insertError: { message: string } | null = null;
    let saved = false;

    for (const client of clients) {
      // Anon may INSERT, but has no SELECT policy. Never .select() / RETURNING.
      const { error } = await client.from("consultations").insert(row);
      if (!error) {
        saved = true;
        insertError = null;
        break;
      }
      insertError = error;
    }

    if (!saved) {
      console.error("Consultation insert error:", insertError?.message);
      return NextResponse.json(
        { error: "Could not save consultation request." },
        { status: 500 }
      );
    }

    void sendConsultationNotification({
      fullName,
      email,
      phone,
      consultationType,
      preferredDate,
      preferredTime,
      notes,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
