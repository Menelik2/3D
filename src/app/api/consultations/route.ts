import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ConsultationInsert } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ConsultationInsert;

    if (!body.full_name?.trim() || !body.email?.trim() || !body.consultation_type) {
      return NextResponse.json(
        { error: "Name, email and consultation type are required." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("consultations")
      .insert({
        consultation_type: body.consultation_type,
        full_name: body.full_name.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        preferred_date: body.preferred_date || null,
        preferred_time: body.preferred_time || null,
        notes: body.notes?.trim() || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Consultation insert error:", error.message);
      return NextResponse.json(
        { error: "Failed to request consultation. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("Consultation API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
