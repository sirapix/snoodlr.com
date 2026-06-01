import type { APIRoute } from "astro";

export const prerender = false;

const CONTACT_TO = "motaz@sirapix.com";
const MAX_NAME_LENGTH = 120;
const MAX_COMPANY_LENGTH = 160;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 4000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name: string;
  email: string;
  company: string;
  message: string;
  locale: "en" | "ar";
  path: string;
  website: string;
};

function env(name: keyof ImportMetaEnv) {
  const value = import.meta.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function singleLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function multiLine(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function readPayload(request: Request): Promise<ContactPayload> {
  const contentType = request.headers.get("content-type") ?? "";
  const data: Record<string, unknown> = {};

  if (contentType.includes("application/json")) {
    Object.assign(data, await request.json().catch(() => ({})));
  } else {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      data[key] = typeof value === "string" ? value : value.name;
    }
  }

  const locale = singleLine(data.locale, 8) === "ar" ? "ar" : "en";
  const fallbackPath = locale === "ar" ? "/ar/contact" : "/contact";

  return {
    name: singleLine(data.name, MAX_NAME_LENGTH),
    email: singleLine(data.email, MAX_EMAIL_LENGTH).toLowerCase(),
    company: singleLine(data.company, MAX_COMPANY_LENGTH),
    message: multiLine(data.message, MAX_MESSAGE_LENGTH),
    locale,
    path: singleLine(data.path, 80) || fallbackPath,
    website: singleLine(data.website, 160)
  };
}

function wantsJson(request: Request) {
  return request.headers.get("accept")?.includes("application/json") ?? false;
}

function fallbackPath(payload: Pick<ContactPayload, "locale" | "path">) {
  if (payload.path === "/ar/contact" || payload.locale === "ar") return "/ar/contact";
  return "/contact";
}

function respond(request: Request, status: number, body: Record<string, unknown>, path = "/contact") {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const url = new URL(path, request.url);
  url.searchParams.set("contact", body.ok ? "sent" : "error");
  return Response.redirect(url, 303);
}

function validate(payload: ContactPayload) {
  if (!payload.name) return "Please enter your name.";
  if (!EMAIL_PATTERN.test(payload.email)) return "Please enter a valid email address.";
  if (!payload.message) return "Please enter a message.";
  return null;
}

function buildEmail(payload: ContactPayload, request: Request) {
  const submittedAt = new Date().toISOString();
  const pageUrl = new URL(fallbackPath(payload), request.url).toString();
  const userAgent = request.headers.get("user-agent") ?? "Unknown";
  const company = payload.company || "Not provided";

  const text = [
    "New Snoodlr contact message",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Company: ${company}`,
    `Language: ${payload.locale}`,
    `Source page: ${pageUrl}`,
    `Submitted: ${submittedAt}`,
    `User agent: ${userAgent}`,
    "",
    "Message:",
    payload.message
  ].join("\n");

  const html = `
    <h2>New Snoodlr contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Company:</strong> ${escapeHtml(company)}</p>
    <p><strong>Language:</strong> ${escapeHtml(payload.locale)}</p>
    <p><strong>Source page:</strong> ${escapeHtml(pageUrl)}</p>
    <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)}</p>
    <p><strong>User agent:</strong> ${escapeHtml(userAgent)}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(payload.message)}</p>
  `;

  return { text, html };
}

export const POST: APIRoute = async ({ request }) => {
  const payload = await readPayload(request);
  const redirectPath = fallbackPath(payload);

  if (payload.website) {
    return respond(request, 200, { ok: true }, redirectPath);
  }

  const validationError = validate(payload);
  if (validationError) {
    return respond(request, 422, { ok: false, message: validationError }, redirectPath);
  }

  const apiKey = env("EMAIL_API_KEY") || env("RESEND_API_KEY");
  const from = env("EMAIL_FROM") || env("RESEND_FROM");

  if (!apiKey || !from) {
    console.error("Contact relay is missing EMAIL_API_KEY/RESEND_API_KEY or EMAIL_FROM/RESEND_FROM.");
    return respond(request, 503, { ok: false, message: "Contact email is not configured." }, redirectPath);
  }

  const { text, html } = buildEmail(payload, request);
  const subject = `New Snoodlr contact message from ${payload.name}`;

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [CONTACT_TO],
      subject,
      text,
      html,
      reply_to: payload.email,
      tags: [
        { name: "source", value: "snoodlr.com" },
        { name: "form", value: "contact" },
        { name: "locale", value: payload.locale }
      ]
    })
  });

  if (!resendResponse.ok) {
    const errorBody = await resendResponse.text().catch(() => "");
    console.error("Contact relay failed.", { status: resendResponse.status, body: errorBody });
    return respond(request, 502, { ok: false, message: "We could not send your message. Please try again." }, redirectPath);
  }

  return respond(request, 200, { ok: true }, redirectPath);
};
