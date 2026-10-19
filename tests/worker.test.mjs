import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker/index.ts";

const message = {
  name: "Test visitor",
  email: "visitor@example.invalid",
  message: "A local test enquiry only.",
};
const env = {
  CONTACT_FORM_ENABLED: "0",
  CONTACT_DEV_MODE: "1",
  ASSETS: { fetch: () => new Response("static asset") },
};
function submission(
  origin = "http://localhost",
  fields = message,
  headers = {},
) {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) body.set(key, value);
  return new Request(`${origin}/api/contact`, {
    method: "POST",
    body,
    headers,
  });
}

test("static pages, API 404s, and method errors have distinct routes", async () => {
  assert.equal(
    await (await worker.fetch(new Request("https://client.test/"), env)).text(),
    "static asset",
  );
  assert.equal(
    (await worker.fetch(new Request("https://client.test/api/unknown"), env))
      .status,
    404,
  );
  const method = await worker.fetch(
    new Request("https://client.test/api/contact"),
    env,
  );
  assert.equal(method.status, 405);
  assert.equal(method.headers.get("Allow"), "POST");
});

test("localhost always simulates even if hosted sending is enabled", async (t) => {
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("Local mode must never contact a provider");
  });
  const response = await worker.fetch(submission(), {
    ...env,
    CONTACT_FORM_ENABLED: "1",
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, mode: "local_mock" });
  assert.equal(
    (await worker.fetch(submission(), { ...env, CONTACT_DEV_MODE: "0" }))
      .status,
    503,
  );
});

test("disabled hosted forms fail closed despite a local simulation flag", async (t) => {
  t.mock.method(globalThis, "fetch", () => {
    throw new Error("Disabled forms must not send");
  });
  assert.equal(
    (await worker.fetch(submission("https://client.test"), env)).status,
    503,
  );
});

test("bad fields, honeypots, origins, content types, and oversized streams are rejected", async () => {
  for (const fields of [
    { ...message, email: "bad" },
    { ...message, name: "A\nB" },
    { ...message, website: "bot" },
  ]) {
    assert.equal(
      (await worker.fetch(submission("http://localhost", fields), env)).status,
      400,
    );
  }
  assert.equal(
    (
      await worker.fetch(
        submission("http://localhost", message, {
          Origin: "https://other.test",
        }),
        env,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await worker.fetch(
        new Request("http://localhost/api/contact", {
          method: "POST",
          body: "{}",
        }),
        env,
      )
    ).status,
    415,
  );
  // No Content-Length: the streaming limit must still apply.
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(16001));
      controller.close();
    },
  });
  const request = new Request("http://localhost/api/contact", {
    method: "POST",
    body,
    duplex: "half",
    headers: { "Content-Type": "multipart/form-data; boundary=test" },
  });
  assert.equal((await worker.fetch(request, env)).status, 413);
});

const hosted = {
  ...env,
  CONTACT_FORM_ENABLED: "1",
  TURNSTILE_SECRET_KEY: "test-only-secret",
  RESEND_API_KEY: "test-only-key",
  CONTACT_RECIPIENT: "inbox@example.invalid",
  CONTACT_SENDER: "sender@example.invalid",
};

test("hosted acceptance verifies Turnstile, then sends with a fixed sender and visitor Reply-To", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push([url, options]);
    return Response.json(
      calls.length === 1
        ? { success: true, hostname: "client.test" }
        : { id: "test-message-id" },
    );
  });
  const response = await worker.fetch(
    submission("https://client.test", {
      ...message,
      "cf-turnstile-response": "test-token",
    }),
    hosted,
  );
  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  assert.equal(
    calls[0][0],
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  );
  assert.equal(calls[1][0], "https://api.resend.com/emails");
  const mail = JSON.parse(calls[1][1].body);
  assert.equal(mail.from, hosted.CONTACT_SENDER);
  assert.deepEqual(mail.to, [hosted.CONTACT_RECIPIENT]);
  assert.equal(mail.reply_to, message.email);
});

test("a valid token for another hostname never reaches the mail provider", async (t) => {
  const verify = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ success: true, hostname: "other.test" }),
  );
  const response = await worker.fetch(
    submission("https://client.test", {
      ...message,
      "cf-turnstile-response": "test-token",
    }),
    hosted,
  );
  assert.equal(response.status, 403);
  assert.equal(verify.mock.callCount(), 1);
});

test("mail provider rejection cannot be reported as acceptance", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () =>
    ++calls === 1
      ? Response.json({ success: true, hostname: "client.test" })
      : new Response("Rejected", { status: 429 }),
  );
  const response = await worker.fetch(
    submission("https://client.test", {
      ...message,
      "cf-turnstile-response": "test-token",
    }),
    hosted,
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});

test("new enquiry context is retained in the delivered plain-text message", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push([url, options]);
    return Response.json(
      calls.length === 1
        ? { success: true, hostname: "client.test" }
        : { id: "test-message-id" },
    );
  });
  const response = await worker.fetch(
    submission("https://client.test", {
      ...message,
      company: "Example studio",
      timing: "November",
      enquiryType: "Working with a TOML member",
      "cf-turnstile-response": "test-token",
    }),
    hosted,
  );
  assert.equal(response.status, 200);
  const mail = JSON.parse(calls[1][1].body);
  for (const expected of [
    "Example studio",
    "November",
    "Working with a TOML member",
    message.message,
  ])
    assert.ok(mail.text.includes(expected));
});

test("enquiry context rejects invalid choices, multiline and oversized fields", async () => {
  for (const extra of [
    { enquiryType: "Unexpected" },
    { company: "a".repeat(201) },
    { timing: "first\nsecond" },
  ]) {
    assert.equal(
      (
        await worker.fetch(
          submission("http://localhost", { ...message, ...extra }),
          env,
        )
      ).status,
      400,
    );
  }
});
