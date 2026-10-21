import { chromium } from "playwright";
import assert from "node:assert/strict";
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4321";
assert.ok(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(base).hostname),
  "Browser QA requires a local preview server.",
);
const out = path.join(root, "artifacts/refactor-qa");
await mkdir(path.join(out, "screenshots"), { recursive: true });
const files = await readdir(path.join(root, "dist"), { recursive: true });
const routes = files
  .filter((file) => file.endsWith(".html") && !file.startsWith("journal/"))
  .map((file) => "/" + file.replace(/index\.html$/, ""));
const representative = [
  "/",
  "/work/",
  "/work/siebert/",
  "/about/approach/",
  "/people/",
  "/people/members/",
  "/people/members/nertil/",
  "/contact/",
  "/playlist/",
];
const browser = await chromium.launch({
  headless: true,
  ...(process.env.TOML_BROWSER_PATH
    ? { executablePath: process.env.TOML_BROWSER_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ deviceScaleFactor: 1 });
const result = { views: [], interactions: [], errors: [] };
page.on("pageerror", (error) => result.errors.push(error.message));
async function visit(route) {
  const response = await page.goto(base + route, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => {
        image.loading = "eager";
        return image.decode().catch(() => {});
      }),
    );
  });
}
try {
  for (const width of [320, 390, 560, 767, 768, 820, 1024, 1199, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [390, 1440].includes(width) ? routes : representative) {
      await visit(route);
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        broken: [...document.images]
          .filter((image) => !image.naturalWidth)
          .map((image) => image.currentSrc),
        headings: document.querySelectorAll("h1").length,
        robots: document.querySelector('meta[name="robots"]')?.content,
        menu:
          getComputedStyle(document.querySelector(".menu-toggle")).display !==
          "none",
      }));
      assert.equal(state.overflow, false, `Overflow: ${width}px ${route}`);
      assert.deepEqual(state.broken, [], `Broken images: ${route}`);
      assert.equal(state.headings, 1, `Page title: ${route}`);
      assert.equal(state.robots, "noindex, nofollow", `Indexing: ${route}`);
      assert.equal(state.menu, width < 1200, `Navigation: ${width}px ${route}`);
      result.views.push({ width, route, ...state });
      if ([390, 820, 1440].includes(width) && representative.includes(route)) {
        const name =
          route === "/" ? "home" : route.slice(1, -1).replaceAll("/", "-");
        await page.screenshot({
          path: path.join(out, "screenshots", `${name}-${width}.png`),
          fullPage: true,
        });
      }
    }
    console.log(`Layout checks passed at ${width}px.`);
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await visit("/work/");
  const total = await page.locator("[data-filter-item]").count();
  await page.getByRole("button", { name: "Digital", exact: true }).click();
  const selected = await page.locator("[data-filter-item]:visible").count();
  assert.ok(selected > 0 && selected < total);
  assert.match(
    await page.locator("[data-filter-count]").textContent(),
    new RegExp(String(selected).padStart(2, "0")),
  );
  await page.getByRole("button", { name: "All", exact: true }).click();
  assert.equal(await page.locator("[data-filter-item]:visible").count(), total);
  result.interactions.push("Work filters, counts and reset");
  await visit("/people/members/");
  await page.getByRole("button", { name: "Writing", exact: true }).click();
  assert.ok((await page.locator("[data-filter-item]:visible").count()) > 0);
  result.interactions.push("Member filters");

  await visit("/people/");
  const profile = page.getByRole("button", { name: "Meet Elza", exact: true });
  await profile.click();
  assert.equal(
    await page.locator("#profile-elza").evaluate((dialog) => dialog.open),
    true,
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("#profile-elza").open,
  );
  assert.equal(
    await profile.evaluate((button) => button === document.activeElement),
    true,
  );
  assert.equal(
    await page
      .locator("body")
      .evaluate((body) => body.classList.contains("scroll-lock")),
    false,
  );
  result.interactions.push("Profile dialog, Escape and focus restoration");

  await visit("/");
  await page
    .getByRole("button", { name: "Watch the reel", exact: true })
    .click();
  await page.locator("video").evaluate((video) => video.play());
  await page.waitForFunction(
    () => document.querySelector("video").currentTime > 0,
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.querySelector("video").paused);
  assert.equal(
    await page.locator("video").evaluate((video) => video.paused),
    true,
  );
  result.interactions.push("Showreel playback and pause on close");

  for (const width of [390, 820]) {
    await page.setViewportSize({ width, height: 900 });
    await visit("/");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "true",
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page.locator(".menu-toggle").getAttribute("aria-expanded"),
      "false",
    );
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForFunction(
      () =>
        document.querySelector(".menu-toggle").getAttribute("aria-expanded") ===
        "false",
    );
  }
  result.interactions.push("Phone/tablet menu and reset on desktop resize");

  await visit(
    "/contact/?type=Working+with+a+TOML+member&member=Nertil+Muhaxhiri",
  );
  assert.equal(
    await page.locator("[data-contact-form]").getAttribute("data-ready"),
    "false",
  );
  assert.equal(
    await page.locator('[name="enquiryType"]').inputValue(),
    "Working with a TOML member",
  );
  assert.match(
    await page.locator('[name="message"]').inputValue(),
    /Nertil Muhaxhiri/,
  );
  await page.locator('[name="message"]').fill("");
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  assert.ok((await page.locator('[aria-invalid="true"]').count()) > 0);
  await page.locator('[name="name"]').fill("Local review");
  await page.locator('[name="email"]').fill("review@example.invalid");
  await page
    .locator('[name="message"]')
    .fill("Local review only; no email should be sent.");
  let submissions = 0;
  page.on("request", (request) => {
    if (request.url().includes("/api/contact")) submissions++;
  });
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  assert.match(
    await page.locator("[data-form-status]").textContent(),
    /has not been sent/,
  );
  assert.equal(submissions, 0);
  assert.match(
    await page.locator('[name="message"]').inputValue(),
    /Local review/,
  );
  result.interactions.push("Contact context, validation and disabled delivery");

  await visit("/");
  const before = await page
    .locator("h1")
    .evaluate((h) => parseFloat(getComputedStyle(h).fontSize));
  await page.evaluate(() => {
    const theme = document.documentElement.style;
    theme.setProperty("--font-heading", "Georgia, serif");
    theme.setProperty("--heading-scale", "1.1");
    theme.setProperty("--accent", "rgb(0, 128, 96)");
    theme.setProperty("--content-width", "70rem");
  });
  assert.match(
    await page.locator("h1").evaluate((h) => getComputedStyle(h).fontFamily),
    /Georgia/,
  );
  assert.ok(
    (await page
      .locator("h1")
      .evaluate((h) => parseFloat(getComputedStyle(h).fontSize))) > before,
  );
  assert.equal(
    await page
      .locator(".brand .dot")
      .evaluate((dot) => getComputedStyle(dot).color),
    "rgb(0, 128, 96)",
  );
  assert.equal(
    await page
      .locator(".home-hero")
      .evaluate((hero) => hero.getBoundingClientRect().width),
    1120,
  );
  result.interactions.push(
    "Central font, colour, size and content-width controls",
  );
  await visit("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  result.interactions.push("Reduced motion");
  assert.deepEqual(result.errors, []);
  console.log(
    `Passed ${result.views.length} views and ${result.interactions.length} interaction checks.`,
  );
} finally {
  await writeFile(
    path.join(out, "browser-results.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  await browser.close();
}
