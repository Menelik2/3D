import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        consultation_type: consultationType,
        full_name: fullName,
        email,
        phone,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        notes,
        status: "PENDING",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Consultation insert error:", error.message);
      return NextResponse.json(
        { error: "Could not save consultation request." },
        { status: 500 }
      );
    }

    void sendConsultationNotification({
      id: data.id,
      fullName,
      email,
      phone,
      consultationType,
      preferredDate,
      preferredTime,
      notes,
    });

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
