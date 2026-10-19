import { createMailProvider, type ContactMessage } from "./mail.ts";
import { enquiryTypes } from "../src/lib/enquiry-types.ts";

const json = (
  status: number,
  body: { ok: boolean; error?: string; mode?: string },
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

function field(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function boundedForm(
  request: Request,
  contentType: string,
): Promise<FormData | null> {
  if (
    Number(request.headers.get("Content-Length") || 0) > 16000 ||
    !request.body
  )
    return null;
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16000) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    const body = new Uint8Array(length);
    let position = 0;
    for (const chunk of chunks) {
      body.set(chunk, position);
      position += chunk.byteLength;
    }
    return await new Response(body, {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return null;
  }
}

function valid(data: ContactMessage): boolean {
  return (
    data.name.length >= 2 &&
    data.name.length <= 100 &&
    !/[\r\n]/.test(data.name) &&
    data.email.length <= 200 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) &&
    data.message.length >= 10 &&
    data.message.length <= 5000
  );
}

async function verifyTurnstile(
  token: string,
  secret: string,
  request: Request,
  hostname: string,
): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) body.set("remoteip", ip);
  const reply = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!reply.ok) return false;
  const result = (await reply.json()) as {
    success?: boolean;
    hostname?: string;
  };
  return result.success === true && result.hostname === hostname;
}

export async function handleContact(
  request: Request,
  env: WorkerEnv,
): Promise<Response> {
  const url = new URL(request.url);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const origin = request.headers.get("Origin");
  if (origin && origin !== url.origin)
    return json(403, { ok: false, error: "origin" });
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.startsWith("multipart/form-data;"))
    return json(415, { ok: false, error: "content_type" });
  const form = await boundedForm(request, contentType);
  if (!form) return json(413, { ok: false, error: "invalid_or_large_form" });
  if (field(form, "website"))
    return json(400, { ok: false, error: "rejected" });

  const data: ContactMessage = {
    name: field(form, "name"),
    email: field(form, "email"),
    message: field(form, "message"),
  };
  if (!valid(data)) return json(400, { ok: false, error: "invalid_fields" });
  const company = field(form, "company");
  const timing = field(form, "timing");
  const enquiryType = field(form, "enquiryType");

  if (
    company.length > 200 ||
    timing.length > 200 ||
    /[\r\n]/.test(company + timing) ||
    (enquiryType && !enquiryTypes.includes(enquiryType))
  )
    return json(400, { ok: false, error: "invalid_fields" });
  const context = [
    enquiryType && `Enquiry: ${enquiryType}`,
    company && `Company: ${company}`,
    timing && `Hoping to start: ${timing}`,
  ]
    .filter(Boolean)
    .join("\n");
  if (context) data.message = `${context}\n\n${data.message}`;
  if (data.message.length > 5000)
    return json(400, { ok: false, error: "invalid_fields" });

  // Localhost is always a simulation, even when real credentials happen to exist in .dev.vars.
  if (local)
    return env.CONTACT_DEV_MODE === "1"
      ? json(200, { ok: true, mode: "local_mock" })
      : json(503, { ok: false, error: "local_mode_disabled" });
  if (env.CONTACT_FORM_ENABLED !== "1" || !env.TURNSTILE_SECRET_KEY) {
    return json(503, { ok: false, error: "not_configured" });
  }
  const provider = createMailProvider(env);
  if (!provider) return json(503, { ok: false, error: "mail_not_configured" });

  try {
    const verified = await verifyTurnstile(
      field(form, "cf-turnstile-response"),
      env.TURNSTILE_SECRET_KEY,
      request,
      url.hostname,
    );
    if (!verified)
      return json(403, { ok: false, error: "verification_failed" });
    const accepted = await provider.send(data);
    return accepted
      ? json(200, { ok: true })
      : json(503, { ok: false, error: "delivery_failed" });
  } catch {
    return json(503, { ok: false, error: "temporarily_unavailable" });
  }
}
