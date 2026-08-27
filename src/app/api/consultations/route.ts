import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || body.name || "").trim();
    const email = String(body.email || "").trim();
    const consultationType = String(body.type || body.consultationType || "").trim();

    if (!fullName || !email || !consultationType) {
      return NextResponse.json(
        { error: "Name, email and consultation type are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        consultation_type: consultationType,
        full_name: fullName,
        email,
        phone: body.phone || null,
        preferred_date: body.date || body.preferredDate || null,
        notes: body.notes || null,
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

    return NextResponse.json({ ok: true, id: data.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
