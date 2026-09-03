import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/email";

/** Empty strings break Postgres DATE columns — normalize to null. */
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

/** Matches the DB trigger format: MP-YYMMDD-XXXXXX */
function generateLeadReference(): string {
  const now = new Date();
  const yy = String(now.getUTCFullYear()).slice(-2);
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `MP-${yy}${mm}${dd}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.fullName || body.full_name || "").trim();
    const email = String(body.email || "").trim();

    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Full name and email are required." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const projectTypes = body.projectTypes || body.project_types || [];

    const supabase = await createClient();

    const company = optionalText(body.company);
    const phone = optionalText(body.phone);
    const whatsapp = optionalText(body.whatsapp);
    const preferredContact =
      optionalText(body.preferredContact || body.preferred_contact) || "email";
    const projectTitle = optionalText(body.title || body.project_title);
    const projectDescription = optionalText(
      body.description || body.project_description
    );
    const creativeIdea = optionalText(body.creativeIdea || body.creative_idea);
    const city = optionalText(body.city);
    const location = optionalText(body.location);
    const preferredDate = optionalDate(
      body.preferredDate || body.preferred_date
    );
    const budgetRange = optionalText(body.budget || body.budget_range);
    const source = optionalText(body.source) || "website";
    const typesArr = Array.isArray(projectTypes) ? projectTypes : [];

    const payload = {
      full_name: fullName,
      company,
      email,
      phone,
      whatsapp,
      preferred_contact: preferredContact,
      project_types: typesArr,
      project_title: projectTitle,
      project_description: projectDescription,
      creative_idea: creativeIdea,
      references_text: optionalText(body.references || body.references_text),
      visual_style: optionalText(body.visualStyle || body.visual_style),
      preferred_date: preferredDate,
      alternative_date: optionalDate(
        body.alternativeDate || body.alternative_date
      ),
      city,
      location,
      indoor_outdoor: optionalText(
        body.indoorOutdoor || body.indoor_outdoor
      ),
      expected_duration: optionalText(body.duration || body.expected_duration),
      budget_range: budgetRange,
      source,
      status: "NEW" as const,
    };

    // Anon may INSERT leads, but has no SELECT policy. `.insert().select()`
    // (RETURNING) is then rejected as an RLS violation even though the write
    // is allowed. Insert without RETURNING and mint the reference here.
    let referenceNumber = "";
    let insertError: { message: string; code?: string } | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      referenceNumber = generateLeadReference();
      const { error } = await supabase.from("leads").insert({
        ...payload,
        reference_number: referenceNumber,
      });
      if (!error) {
        insertError = null;
        break;
      }
      insertError = error;
      // Unique reference collision — retry with a new number.
      if (error.code !== "23505") break;
    }

    if (insertError) {
      console.error("Lead insert error:", insertError.message);
      return NextResponse.json(
        {
          error:
            "Could not save your request. Please try again or contact us directly.",
        },
        { status: 500 }
      );
    }

    // Fire-and-forget email — never block the client on mail failures
    void sendLeadNotification({
      reference: referenceNumber,
      fullName,
      email,
      phone,
      whatsapp,
      company,
      preferredContact,
      projectTypes: typesArr,
      projectTitle,
      projectDescription,
      creativeIdea,
      city,
      location,
      preferredDate,
      budgetRange,
      source,
    });

    return NextResponse.json({
      ok: true,
      reference: referenceNumber,
      reference_number: referenceNumber,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
