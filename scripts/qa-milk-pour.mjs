import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4322";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
const out = path.join(root, "artifacts/milk-pour-prototype");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
  ...(process.env.TOML_BROWSER_PATH
    ? { executablePath: process.env.TOML_BROWSER_PATH }
    : {}),
});
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
const results = {
  browser: await browser.version(),
  views: [],
  interactions: [],
  errors: [],
  consoleErrors: [],
  playback: [],
};
page.on("pageerror", (error) => results.errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") results.consoleErrors.push(message.text());
});
const seek = async (p) => {
  if (!(await page.locator(".milk-controls").evaluate((el) => el.open))) {
    await page.locator("summary").click();
  }
  const pause = page.getByRole("button", { name: "Pause", exact: true });
  if (await pause.count()) await pause.click();
  const slider = page.getByRole("slider", { name: "Timeline", exact: true });
  if (Number(await slider.inputValue()) === p * 1000) {
    await slider.fill(String(p === 0 ? 1 : p * 1000 - 1));
  }
  await slider.fill(String(p * 1000));
  await page.waitForFunction(
    (p) =>
      Math.abs(
        Number(document.querySelector(".milk-pour-overlay").dataset.progress) -
          p,
      ) < 0.001,
    p,
  );
};
const visit = async () => {
  assert.equal((await page.goto(base + "/milk-pour-prototype/")).status(), 200);
  await page.waitForFunction(
    () => !document.querySelector(".milk-controls button").disabled,
  );
  await page.evaluate(() => document.fonts.ready);
};
const snapshot = () =>
  page.locator(".milk-pour-overlay").evaluate((el) => el.outerHTML);
const pixels = async () =>
  sharp(await page.screenshot())
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
const pixel = (image, x, y) => [
  ...image.data.subarray(
    (y * image.info.width + x) * 3,
    (y * image.info.width + x) * 3 + 3,
  ),
];
try {
  for (const [width, height] of [
    [1920, 1080],
    [1366, 768],
    [390, 844],
    [360, 800],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await visit();
    for (const p of [0, 0.19, 0.22, 0.5, 0.7, 0.83, 0.94, 1]) {
      await seek(p);
      const state = await page.evaluate(() => {
        const controls = document
          .querySelector(".milk-controls")
          .getBoundingClientRect();
        const svg = document.querySelector(".milk-pour-overlay");
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          controlsFit:
            controls.left >= 0 &&
            controls.right <= innerWidth &&
            controls.top >= 0 &&
            controls.bottom <= innerHeight,
          contentHidden: document.querySelector(".milk-sample").inert,
          overlayHidden: getComputedStyle(svg).display === "none",
          pointerEvents: getComputedStyle(svg).pointerEvents,
          mask: getComputedStyle(svg.querySelector("mask")).maskType,
          boot: document.documentElement.hasAttribute("data-milk-boot"),
        };
      });
      assert.equal(state.overflow, false);
      assert.equal(state.controlsFit, true);
      assert.equal(state.contentHidden, p < 0.985);
      assert.equal(state.overlayHidden, p === 1);
      assert.equal(state.pointerEvents, "none");
      assert.equal(state.mask, "luminance");
      assert.equal(state.boot, false);
      results.views.push({ width, height, progress: p, ...state });
      if ([0.22, 0.5, 0.83, 0.94, 1].includes(p)) {
        if (width < 768) await page.locator("summary").click();
        await page.screenshot({
          path: path.join(out, `${width}x${height}-${Math.round(p * 100)}.png`),
        });
        if (width < 768) await page.locator("summary").click();
      }
    }
  }
  await page.setViewportSize({ width: 1920, height: 1080 });
  await visit();
  await seek(0.5);
  const a = await snapshot();
  await seek(0.72);
  await seek(0.5);
  assert.equal(await snapshot(), a);
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await seek(0.5);
  assert.equal(await snapshot(), a);
  results.interactions.push(
    "Deterministic seek and replay, including all paths and transforms",
  );

  // Pixel evidence: both the carton panels and liquid reveal the actual underlay.
  await page.getByLabel("Background", { exact: true }).selectOption("colour");
  await seek(0.5);
  const blue = await pixels();
  assert.deepEqual(pixel(blue, 1600, 900), [36, 72, 255]);
  assert.deepEqual(pixel(blue, 80, 80), [0, 0, 0]);
  const bluePanelPixels = [];
  for (let y = 190; y < 400; y += 10)
    for (let x = 1040; x < 1230; x += 10)
      if (pixel(blue, x, y).join() === "36,72,255")
        bluePanelPixels.push([x, y]);
  assert.ok(bluePanelPixels.length > 40, "carton panels are cutouts too");
  await page.screenshot({ path: path.join(out, "transparency-cobalt.png") });
  await page
    .getByLabel("Background", { exact: true })
    .selectOption("checkerboard");
  const checker = await pixels();
  const checkerColors = new Set();
  for (let x = 1500; x < 1600; x++)
    checkerColors.add(pixel(checker, x, 900).join());
  assert.ok(
    checkerColors.has("196,196,196") && checkerColors.has("255,255,255"),
  );
  await page.screenshot({
    path: path.join(out, "transparency-checkerboard.png"),
  });
  await page.getByLabel("Show page during pour", { exact: true }).check();
  assert.equal(
    await page.locator(".milk-sample").evaluate((el) => el.inert),
    false,
  );
  await page.screenshot({ path: path.join(out, "transparency-content.png") });
  await page.getByLabel("Show page during pour", { exact: true }).uncheck();
  await page.getByLabel("Background", { exact: true }).selectOption("white");
  results.interactions.push(
    "Cobalt/checkerboard pixel proof in liquid and original panel cutouts; content toggle",
  );

  await seek(0.5);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(
    () =>
      document.querySelector(".milk-pour-overlay").getAttribute("viewBox") ===
      "0 0 390 844",
  );
  assert.equal(
    await page.locator(".milk-pour-overlay").getAttribute("viewBox"),
    "0 0 390 844",
  );
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForFunction(
    () =>
      document.querySelector(".milk-pour-overlay").getAttribute("viewBox") ===
      "0 0 844 390",
  );
  assert.equal(
    await page.locator(".milk-pour-overlay").getAttribute("viewBox"),
    "0 0 844 390",
  );
  assert.equal(
    await page.locator(".milk-pour-overlay").getAttribute("data-progress"),
    "0.50000",
  );
  results.interactions.push(
    "Resize/orientation during a paused frame preserves time and recomputes geometry",
  );

  await page.setViewportSize({ width: 1366, height: 768 });
  await page.getByLabel("Speed", { exact: true }).selectOption("0.25");
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await page.waitForTimeout(700);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await snapshot();
  await page.waitForTimeout(200);
  assert.equal(await snapshot(), paused);
  const p = Number(
    await page.locator(".milk-pour-overlay").getAttribute("data-progress"),
  );
  assert.ok(p > 0.04 && p < 0.15, `quarter speed: ${p}`);
  await page.getByRole("button", { name: "Play", exact: true }).click();
  await page.waitForTimeout(200);
  assert.ok(
    Number(
      await page.locator(".milk-pour-overlay").getAttribute("data-progress"),
    ) > p,
  );
  await page.getByLabel("Speed", { exact: true }).selectOption("1");
  results.interactions.push(
    "Quarter-speed playback, pause freezes paths, play resumes",
  );

  // Record real RAF playback; these are wall-clock frames, not scrubbed stills.
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(170);
    results.playback.push(
      Number(
        await page.locator(".milk-pour-overlay").getAttribute("data-progress"),
      ),
    );
    await page.screenshot({
      path: path.join(out, `playback-${String(i).padStart(2, "0")}.png`),
    });
  }
  await page.waitForFunction(
    () => document.querySelector(".milk-pour-overlay").style.display === "none",
  );
  assert.equal(
    await page.locator(".milk-sample").evaluate((el) => el.inert),
    false,
  );
  assert.ok(results.playback.filter((p) => p > 0 && p < 1).length >= 6);
  results.interactions.push(
    "Full real-time RAF playback to completion and restored page interaction",
  );

  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit();
  assert.equal(
    await page
      .locator(".milk-pour-overlay")
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
  assert.equal(
    await page.locator(".milk-sample").evaluate((el) => el.inert),
    false,
  );
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await seek(0.5);
  assert.equal(
    await page
      .locator(".milk-pour-overlay")
      .evaluate((el) => getComputedStyle(el).display),
    "block",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForFunction(
    () =>
      document.querySelector('[role="status"]').textContent.trim() !==
      "Reduced motion",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(
    () => document.querySelector(".milk-pour-overlay").style.display === "none",
  );
  assert.equal(
    await page
      .locator(".milk-pour-overlay")
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  results.interactions.push(
    "Reduced motion skips on load and preference change; explicit manual replay remains available",
  );

  await seek(1);
  await page.getByRole("link", { name: "TOML.", exact: true }).click();
  await page.goBack();
  await page.waitForFunction(
    () => !document.querySelector(".milk-controls button").disabled,
  );
  await page.getByRole("button", { name: "Replay", exact: true }).click();
  await seek(0.22);
  results.interactions.push(
    "Navigate away/back and replay; no Astro client router is installed",
  );

  const nojs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await nojs.newPage();
  await fallback.goto(base + "/milk-pour-prototype/");
  assert.equal(await fallback.locator("h1").isVisible(), true);
  assert.equal(await fallback.locator(".milk-boot").isVisible(), false);
  await nojs.close();
  const broken = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await broken.route("**/*.js", (route) => route.abort());
  const brokenPage = await broken.newPage();
  await brokenPage.goto(base + "/milk-pour-prototype/");
  await brokenPage.waitForFunction(
    () => !document.documentElement.hasAttribute("data-milk-boot"),
    null,
    { timeout: 8000 },
  );
  assert.equal(await brokenPage.locator("h1").isVisible(), true);
  await broken.close();
  results.interactions.push(
    "No-JavaScript page and failed hydration watchdog both fail open",
  );
  assert.deepEqual(results.errors, []);
  assert.deepEqual(results.consoleErrors, []);
  console.log(
    `Passed ${results.views.length} frames / five viewports, ${results.interactions.length} interaction groups; no page errors.`,
  );
} finally {
  await writeFile(
    path.join(out, "browser-results.json"),
    JSON.stringify(results, null, 2) + "\n",
  );
  await browser.close();
}
