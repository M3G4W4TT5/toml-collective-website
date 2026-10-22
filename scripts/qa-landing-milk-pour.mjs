import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4322";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
const route = base + "/landing-page-draft/";
const out = fileURLToPath(
  new URL("../artifacts/landing-milk-pour/", import.meta.url),
);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
  ...(process.env.TOML_BROWSER_PATH
    ? { executablePath: process.env.TOML_BROWSER_PATH }
    : {}),
});
const result = { views: [], interactions: [], errors: [] };
const open = async (options = {}) => {
  const context = await browser.newContext({
    deviceScaleFactor: 1,
    ...options,
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => result.errors.push(error.message));
  await page.addInitScript(() => {
    window.milkProbe = { ready: false, covered: false, frames: [] };
    new MutationObserver(() => {
      if (document.documentElement?.hasAttribute("data-landing-milk-pending"))
        window.milkProbe.covered = true;
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-landing-milk-pending"],
    });
    document.addEventListener("milk-pour:ready", () => {
      window.milkProbe.ready = true;
      const sample = () => {
        const p = Number(
          document.querySelector(".milk-pour-overlay").dataset.progress,
        );
        window.milkProbe.frames.push({ p, time: performance.now() });
        if (p < 1) requestAnimationFrame(sample);
      };
      sample();
    });
  });
  return { page, context };
};
const ready = async (page) => {
  for (let i = 0; i < 100; i++) {
    if (await page.evaluate(() => window.milkProbe.ready)) return;
    await delay(50);
  }
  assert.fail("Milk-pour island did not initialize");
};
const progress = (page) =>
  page
    .locator(".milk-pour-overlay")
    .evaluate((el) => Number(el.dataset.progress));
const skipped = async (page) => {
  await ready(page);
  assert.equal(await progress(page), 1);
  assert.equal(await page.evaluate(() => window.milkProbe.covered), false);
  assert.equal(
    await page
      .locator(".milk-pour-overlay")
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
};
try {
  for (const [width, height] of [
    [1920, 1080],
    [1366, 768],
    [390, 844],
    [360, 800],
    [844, 390],
  ]) {
    const { page, context } = await open({ viewport: { width, height } });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await ready(page);
    assert.ok((await progress(page)) < 0.5, "First direct entry must animate");
    assert.equal(
      await page
        .locator(".milk-controls, .milk-prototype, .milk-underlay")
        .count(),
      0,
    );
    const state = await page.evaluate(() => {
      const overlay = document.querySelector(".milk-pour-overlay");
      const landing = document.querySelector("[data-landing-draft]");
      return {
        fixed: getComputedStyle(overlay).position,
        pointerEvents: getComputedStyle(overlay).pointerEvents,
        hidden: landing.inert || landing.getAttribute("aria-hidden") === "true",
        overflow: getComputedStyle(document.body).overflowY,
        covered: window.milkProbe.covered,
      };
    });
    assert.equal(state.fixed, "fixed");
    assert.equal(state.pointerEvents, "none");
    assert.equal(state.hidden, false);
    assert.notEqual(state.overflow, "hidden");
    assert.equal(state.covered, true);
    await page.waitForFunction(
      () =>
        Number(document.querySelector(".milk-pour-overlay").dataset.progress) >=
        0.21,
    );
    await page.screenshot({ path: `${out}/${width}x${height}-impact.png` });
    const before = await page.locator(".milk-pour-overlay").boundingBox();
    await page.mouse.wheel(0, Math.round(height * 0.6));
    await page.waitForFunction(() => window.scrollY > 100);
    const after = await page.locator(".milk-pour-overlay").boundingBox();
    assert.deepEqual(after, before, "Scrolling must not displace the overlay");
    assert.ok((await progress(page)) < 1, "The page must scroll while pouring");
    await page.waitForFunction(
      () =>
        Number(document.querySelector(".milk-pour-overlay").dataset.progress) >=
        0.5,
    );
    await page.screenshot({ path: `${out}/${width}x${height}-scrolling.png` });
    await page.waitForFunction(
      () =>
        document.querySelector(".milk-pour-overlay").style.display === "none",
    );
    const frames = await page.evaluate(() => window.milkProbe.frames);
    const middle = frames.filter(({ p }) => p > 0.05 && p < 0.95);
    const first = middle[0];
    const last = middle.at(-1);
    const speed = ((last.p - first.p) * 2500) / (last.time - first.time);
    assert.ok(Math.abs(speed - 1.5) < 0.04, `Observed speed ${speed}`);
    await page.screenshot({ path: `${out}/${width}x${height}-complete.png` });
    result.views.push({
      width,
      height,
      speed,
      frames: frames.length,
      scrolling: true,
      controls: false,
    });

    await page.reload({ waitUntil: "domcontentloaded" });
    await skipped(page);
    await context.close();
  }
  result.interactions.push(
    "First direct entry plays at 1.5x; content stays active, no controls; wheel scrolling leaves the overlay fixed; reload skips",
  );

  {
    const { page, context } = await open();
    await page.goto(base + "/work/", { waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".milk-pour-overlay").count(), 0);
    await page.evaluate(() => {
      location.href = "/landing-page-draft/";
    });
    await page.waitForURL(route);
    await skipped(page);
    assert.ok(
      (await page.evaluate(() => document.referrer)).endsWith("/work/"),
    );
    await context.close();
  }
  result.interactions.push(
    "A first landing visit reached from another site page skips without an early black cover",
  );

  {
    const { page, context } = await open();
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await ready(page);
    assert.ok((await progress(page)) < 1);
    await page.evaluate(() => {
      location.href = "/work/";
    });
    await page.waitForURL(base + "/work/");
    await page.goBack({ waitUntil: "domcontentloaded" });
    await ready(page);
    assert.equal(await progress(page), 1);
    await page.goForward({ waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      location.href = "/landing-page-draft/";
    });
    await page.waitForURL(route);
    await skipped(page);
    await context.close();
  }
  result.interactions.push(
    "Navigating away during the pour finishes it; Back/Forward and subsequent internal visits do not replay",
  );

  for (const mode of [
    "reduced-motion",
    "storage-blocked",
    "no-javascript",
    "blocked-bundle",
  ]) {
    const { page, context } = await open({
      ...(mode === "reduced-motion" ? { reducedMotion: "reduce" } : {}),
      ...(mode === "no-javascript" ? { javaScriptEnabled: false } : {}),
    });
    if (mode === "storage-blocked")
      await page.addInitScript(() => {
        Storage.prototype.getItem = () => {
          throw new Error("Unavailable storage");
        };
      });
    if (mode === "blocked-bundle")
      await page.route("**/*.js", (request) => request.abort());
    await page.goto(route, { waitUntil: "domcontentloaded" });
    if (["reduced-motion", "storage-blocked"].includes(mode))
      await skipped(page);
    if (mode === "blocked-bundle")
      await page.waitForFunction(
        () =>
          !document.documentElement.hasAttribute("data-landing-milk-pending"),
        null,
        { timeout: 8000 },
      );
    assert.equal(
      await page.evaluate(() =>
        document.documentElement.hasAttribute("data-landing-milk-pending"),
      ),
      false,
    );
    assert.equal(await page.locator(".milk-controls").count(), 0);
    await page.evaluate(() => window.scrollTo(0, 400));
    assert.ok((await page.evaluate(() => window.scrollY)) > 0);
    await context.close();
    result.interactions.push(`${mode}: no blocking cover or scroll lock`);
  }
  assert.deepEqual(result.errors, []);
  console.log(
    `Passed ${result.views.length} landing viewports and ${result.interactions.length} behavior groups; no page errors.`,
  );
} finally {
  await writeFile(
    `${out}/browser-results.json`,
    JSON.stringify(result, null, 2) + "\n",
  );
  await browser.close();
}
