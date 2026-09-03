import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin";
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

type InsertError = { message: string; code?: string } | null;

async function insertLead(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: { from: (table: string) => { insert: (row: Record<string, unknown>) => PromiseLike<{ error: InsertError }> } },
  row: Record<string, unknown>
): Promise<InsertError> {
  // Do NOT .select() / RETURNING. Anon INSERT is allowed, anon SELECT is not —
  // PostgREST then reports an RLS violation even though the row was written.
  const { error } = await client.from("leads").insert(row);
  return error ?? null;
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

    const payload: Record<string, unknown> = {
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
      indoor_outdoor: optionalText(body.indoorOutdoor || body.indoor_outdoor),
      expected_duration: optionalText(body.duration || body.expected_duration),
      budget_range: budgetRange,
      source,
      status: "NEW",
    };

    const clients = [];
    const admin = tryCreateAdminClient();
    if (admin) clients.push(admin);
    clients.push(await createClient());

    let referenceNumber = "";
    let insertError: InsertError = null;
    let saved = false;

    for (const client of clients) {
      if (saved) break;
      for (let attempt = 0; attempt < 3; attempt++) {
        referenceNumber = generateLeadReference();
        insertError = await insertLead(client, {
          ...payload,
          reference_number: referenceNumber,
        });
        if (!insertError) {
          saved = true;
          break;
        }
        // Unique reference collision — retry with a new number.
        if (insertError.code !== "23505") break;
      }
    }

    if (!saved) {
      console.error("Lead insert error:", insertError?.message, insertError?.code);
      return NextResponse.json(
        {
          error:
            "Could not save your request. Please try again or contact us directly.",
        },
        { status: 500 }
      );
    }

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
