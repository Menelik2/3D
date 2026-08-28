import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const notifyTo =
  process.env.EMAIL_NOTIFY_TO?.trim() || "Metapictures23@gmail.com";
const fromAddress =
  process.env.EMAIL_FROM?.trim() || "META Pictures <onboarding@resend.dev>";

function getClient(): Resend | null {
  if (!resendApiKey) return null;
  return new Resend(resendApiKey);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string | null | undefined): string {
  if (!value?.trim()) return "";
  return `<tr>
    <td style="padding:8px 12px 8px 0;color:#888;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#111;">${escapeHtml(value)}</td>
  </tr>`;
}

export type LeadEmailPayload = {
  reference?: string | null;
  fullName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  company?: string | null;
  preferredContact?: string | null;
  projectTypes?: string[];
  projectTitle?: string | null;
  projectDescription?: string | null;
  creativeIdea?: string | null;
  city?: string | null;
  location?: string | null;
  preferredDate?: string | null;
  budgetRange?: string | null;
  source?: string | null;
};

export async function sendLeadNotification(
  lead: LeadEmailPayload
): Promise<{ sent: boolean; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — skipping lead notification");
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const ref = lead.reference ? ` #${lead.reference}` : "";
  const subject = `New project inquiry${ref} — ${lead.fullName}`;

  const types =
    lead.projectTypes && lead.projectTypes.length > 0
      ? lead.projectTypes.join(", ")
      : null;

  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fafafa;color:#111;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#e11d48;margin:0 0 8px;">META Pictures</p>
    <h1 style="font-size:20px;font-weight:500;margin:0 0 4px;">New project inquiry</h1>
    ${lead.reference ? `<p style="color:#666;font-size:13px;margin:0 0 20px;">Reference ${escapeHtml(lead.reference)}</p>` : ""}
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Name", lead.fullName)}
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone)}
      ${row("WhatsApp", lead.whatsapp)}
      ${row("Company", lead.company)}
      ${row("Preferred contact", lead.preferredContact)}
      ${row("Project types", types)}
      ${row("Title", lead.projectTitle)}
      ${row("Description", lead.projectDescription)}
      ${row("Creative idea", lead.creativeIdea)}
      ${row("City", lead.city)}
      ${row("Location", lead.location)}
      ${row("Preferred date", lead.preferredDate)}
      ${row("Budget", lead.budgetRange)}
      ${row("Source", lead.source)}
    </table>
    <p style="margin-top:24px;font-size:12px;color:#999;">Reply directly to this email to respond to the client.</p>
  </div>`;

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to: [notifyTo],
      replyTo: lead.email,
      subject,
      html,
    });
    if (error) {
      console.error("[email] lead notify failed:", error);
      return { sent: false, error: String(error.message || error) };
    }
    return { sent: true };
  } catch (e) {
    console.error("[email] lead notify error:", e);
    return { sent: false, error: e instanceof Error ? e.message : "send failed" };
  }
}

export type ConsultationEmailPayload = {
  id?: string;
  fullName: string;
  email: string;
  phone?: string | null;
  consultationType: string;
  preferredDate?: string | null;
  preferredTime?: string | null;
  notes?: string | null;
};

export async function sendConsultationNotification(
  c: ConsultationEmailPayload
): Promise<{ sent: boolean; error?: string }> {
  const client = getClient();
  if (!client) {
    console.warn(
      "[email] RESEND_API_KEY not set — skipping consultation notification"
    );
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const subject = `Consultation request — ${c.fullName} (${c.consultationType})`;

  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#fafafa;color:#111;">
    <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#e11d48;margin:0 0 8px;">META Pictures</p>
    <h1 style="font-size:20px;font-weight:500;margin:0 0 20px;">New consultation request</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      ${row("Name", c.fullName)}
      ${row("Email", c.email)}
      ${row("Phone", c.phone)}
      ${row("Type", c.consultationType)}
      ${row("Preferred date", c.preferredDate)}
      ${row("Preferred time", c.preferredTime)}
      ${row("Notes", c.notes)}
    </table>
    <p style="margin-top:24px;font-size:12px;color:#999;">Reply directly to this email to respond to the client.</p>
  </div>`;

  try {
    const { error } = await client.emails.send({
      from: fromAddress,
      to: [notifyTo],
      replyTo: c.email,
      subject,
      html,
    });
    if (error) {
      console.error("[email] consultation notify failed:", error);
      return { sent: false, error: String(error.message || error) };
    }
    return { sent: true };
  } catch (e) {
    console.error("[email] consultation notify error:", e);
    return {
      sent: false,
      error: e instanceof Error ? e.message : "send failed",
    };
  }
}
