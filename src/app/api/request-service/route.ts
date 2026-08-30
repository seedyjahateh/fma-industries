import { NextResponse } from "next/server";
import { business } from "@/config/business";
import { MAX_PHOTOS, MAX_TOTAL_BYTES } from "@/lib/resizeImage";

/**
 * Service request intake.
 *
 * Sends the request to the business as an email, with any data-plate photos
 * attached, and sends the customer a confirmation. Uses the Resend REST API
 * directly over fetch so the project carries no email SDK dependency.
 *
 * Required env: RESEND_API_KEY, RESEND_FROM  (see .env.example)
 */

export const runtime = "nodejs";
/** Photo attachments can push a request past the default body limit. */
export const maxDuration = 30;

/* ---------------------------------------------------------------------------
   Rate limiting
   In-memory and therefore per-instance — it resets on cold start and doesn't
   coordinate across serverless instances. That's acceptable here: it exists to
   blunt casual form spam, not to be an authorization boundary. The honeypot
   does most of the real work.
--------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the map can't grow without bound
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const str = (data: FormData, key: string) => (data.get(key) ?? "").toString().trim();

function row(label: string, value: string) {
  if (!value) return "";
  return `<tr>
    <td style="padding:10px 16px 10px 0;vertical-align:top;color:#5e6a72;font-size:12px;text-transform:uppercase;letter-spacing:.08em;white-space:nowrap;">${esc(label)}</td>
    <td style="padding:10px 0;vertical-align:top;color:#111;font-size:15px;line-height:1.5;">${esc(value).replace(/\n/g, "<br>")}</td>
  </tr>`;
}

async function sendEmail(payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

/* ---------------------------------------------------------------------------
   Handler
--------------------------------------------------------------------------- */

export async function POST(request: Request) {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read the form. Please try again, or call us." },
      { status: 400 }
    );
  }

  // Honeypot: report success so the bot doesn't learn to adapt.
  if (str(data, "website")) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: `Too many requests. Please call us at ${business.phoneDisplay}.` },
      { status: 429 }
    );
  }

  const name = str(data, "name");
  const phone = str(data, "phone");
  const address = str(data, "address");
  const city = str(data, "city");

  if (!name || !phone || !address || !city) {
    return NextResponse.json(
      { ok: false, error: "Name, phone, address, and city are required." },
      { status: 400 }
    );
  }

  const urgency = str(data, "urgency");
  const isEmergency = urgency === "emergency";

  const fields = {
    propertyType: str(data, "propertyType"),
    company: str(data, "company"),
    service: str(data, "service"),
    urgencyLabel: str(data, "urgencyLabel"),
    symptoms: str(data, "symptoms"),
    description: str(data, "description"),
    equipmentMake: str(data, "equipmentMake"),
    equipmentModel: str(data, "equipmentModel"),
    equipmentSerial: str(data, "equipmentSerial"),
    accessNotes: str(data, "accessNotes"),
    email: str(data, "email"),
    contactWindow: str(data, "contactWindow"),
  };

  /* ----------------------------- attachments ----------------------------- */

  const photos = data.getAll("photos").filter((p): p is File => p instanceof File && p.size > 0);
  const attachments: { filename: string; content: string }[] = [];
  let totalBytes = 0;

  for (const [i, photo] of photos.slice(0, MAX_PHOTOS).entries()) {
    totalBytes += photo.size;
    if (totalBytes > MAX_TOTAL_BYTES) break;

    const buffer = Buffer.from(await photo.arrayBuffer());
    const extension = (photo.name.match(/\.[a-z0-9]+$/i)?.[0] ?? ".jpg").toLowerCase();
    attachments.push({
      filename: `dataplate-${i + 1}${extension}`,
      content: buffer.toString("base64"),
    });
  }

  /* ----------------------------- email body ----------------------------- */

  const heading = isEmergency ? "EMERGENCY SERVICE REQUEST" : "New service request";
  // Emergency reads alarm red; everything else uses the brand's safety yellow.
  const accent = isEmergency ? "#c8102e" : "#f5c400";
  const onAccent = isEmergency ? "#ffffff" : "#0e1417";

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#edeff0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #d8dee1;">
    <div style="background:${accent};padding:20px 24px;">
      <p style="margin:0;color:${onAccent};font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">${heading}</p>
      <p style="margin:6px 0 0;color:${onAccent};font-size:20px;font-weight:700;">${esc(fields.service || "Service request")}</p>
    </div>

    <div style="padding:20px 24px;border-bottom:1px solid #d8dee1;">
      <a href="tel:${esc(phone.replace(/[^\d+]/g, ""))}"
         style="display:inline-block;background:#0e1417;color:#fff;padding:14px 22px;text-decoration:none;font-size:16px;font-weight:700;">
        Call ${esc(name)} · ${esc(phone)}
      </a>
      ${
        fields.contactWindow
          ? `<p style="margin:10px 0 0;color:#666;font-size:13px;">Best time: ${esc(fields.contactWindow)}</p>`
          : ""
      }
    </div>

    <table style="width:100%;border-collapse:collapse;padding:8px 24px;margin:8px 24px;">
      ${row("Urgency", fields.urgencyLabel)}
      ${row("Property", fields.propertyType === "business" ? "Business" : fields.propertyType === "home" ? "Home" : "")}
      ${row("Business", fields.company)}
      ${row("Contact", name)}
      ${row("Phone", phone)}
      ${row("Email", fields.email)}
      ${row("Address", `${address}, ${city}, NC`)}
      ${row("Symptoms", fields.symptoms)}
      ${row("Description", fields.description)}
      ${row("Make", fields.equipmentMake)}
      ${row("Model", fields.equipmentModel)}
      ${row("Serial", fields.equipmentSerial)}
      ${row("Access notes", fields.accessNotes)}
      ${row("Photos", attachments.length ? `${attachments.length} attached` : "None supplied")}
    </table>

    <div style="padding:16px 24px;background:#edeff0;border-top:1px solid #d8dee1;">
      <a href="https://maps.google.com/?q=${encodeURIComponent(`${address}, ${city}, NC`)}"
         style="color:${accent};font-size:14px;font-weight:600;">Open in Maps →</a>
    </div>
  </div>
</body></html>`;

  /* ----------------------------- send ----------------------------- */

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    // In development the form stays testable without credentials.
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "\n[request-service] RESEND_API_KEY / RESEND_FROM not set — logging instead of sending.\n",
        { name, phone, address, city, ...fields, photos: attachments.length }
      );
      return NextResponse.json({ ok: true, delivered: false });
    }

    console.error("[request-service] Email is not configured — a lead was not delivered.");
    return NextResponse.json(
      { ok: false, error: `We couldn't send that. Please call us at ${business.phoneDisplay}.` },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      from,
      to: [business.email],
      subject: `${isEmergency ? "EMERGENCY · " : ""}${fields.service || "Service request"} — ${
        fields.company || name
      } (${city})`,
      html,
      reply_to: fields.email || undefined,
      ...(attachments.length ? { attachments } : {}),
    });
  } catch (error) {
    console.error("[request-service] Failed to deliver lead:", error);
    return NextResponse.json(
      { ok: false, error: `We couldn't send that. Please call us at ${business.phoneDisplay}.` },
      { status: 502 }
    );
  }

  // Customer confirmation is best-effort — never fail the request over it.
  if (fields.email) {
    try {
      await sendEmail({
        from,
        to: [fields.email],
        subject: `We received your request · ${business.name}`,
        html: `<!doctype html><html><body style="margin:0;padding:24px;background:#edeff0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
          <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #d8dee1;padding:32px;">
            <p style="margin:0;color:#0e1417;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">${esc(business.name)}</p>
            <h1 style="margin:14px 0 0;font-size:24px;color:#111;">Thanks, ${esc(name)}, we've got it.</h1>
            <p style="margin:18px 0 0;font-size:15px;line-height:1.6;color:#444;">
              We received your request for <strong>${esc(fields.service || "service")}</strong> at ${esc(address)}, ${esc(city)}, NC.
              We'll reach out at <strong>${esc(phone)}</strong> to confirm a time.
            </p>
            ${
              isEmergency
                ? `<p style="margin:18px 0 0;padding:16px;background:#fdf6d9;border-left:3px solid #f5c400;font-size:15px;line-height:1.6;color:#111;">
                     You marked this as an emergency. If the equipment is down right now, please call
                     <a href="${esc(business.phoneHref)}" style="color:#0e1417;font-weight:700;">${esc(business.phoneDisplay)}</a>
                     The phone is always faster than a form.
                   </p>`
                : ""
            }
            <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:#444;">
              Anything changes in the meantime, call <a href="${esc(business.phoneHref)}" style="color:#0e1417;font-weight:700;">${esc(business.phoneDisplay)}</a>.
            </p>
            <p style="margin:28px 0 0;padding-top:20px;border-top:1px solid #d8dee1;font-size:13px;color:#888;">
              ${esc(business.name)} · ${esc(business.address.city)}, ${esc(business.address.state)}<br>
              HVAC · Refrigeration · Kitchen Equipment · Plumbing · Electrical · Appliances
            </p>
          </div></body></html>`,
      });
    } catch (error) {
      console.warn("[request-service] Confirmation email failed (lead was still delivered):", error);
    }
  }

  return NextResponse.json({ ok: true, delivered: true });
}
