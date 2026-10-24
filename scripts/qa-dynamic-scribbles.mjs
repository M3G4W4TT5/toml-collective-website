import { chromium } from "playwright";
import assert from "node:assert/strict";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4321";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const out = "artifacts/dynamic-scribbles";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  ...(process.env.TOML_BROWSER_PATH
    ? { executablePath: process.env.TOML_BROWSER_PATH }
    : {}),
  headless: true,
  args: ["--no-sandbox"],
  ignoreDefaultArgs: ["--hide-scrollbars"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [],
  results = [];
page.on("pageerror", (error) => errors.push(error.message));
const settle = () => page.waitForTimeout(400);
async function inspect(label) {
  await settle();
  const state = await page.evaluate(() => {
    const groups = [...document.querySelectorAll("[data-marker-id]")];
    const alignment = groups.map((group) => {
      const id = group.dataset.markerId;
      const surface = group.closest("[data-marker-surface]");
      const elements = [
        ...surface.querySelectorAll(
          `[data-mark="${id}"], [data-mark-join="${id}"]`,
        ),
      ];
      const svg = group.closest("svg"),
        matrix = svg.getScreenCTM();
      const ink = group.querySelector(":scope > path");
      const b = ink.getBBox();
      const p = new DOMPoint(b.x, b.y).matrixTransform(matrix),
        q = new DOMPoint(b.x + b.width, b.y + b.height).matrixTransform(matrix);
      const rects = elements.flatMap((el) => {
        const r = document.createRange();
        r.selectNodeContents(el);
        return [...r.getClientRects()];
      });
      const left = Math.min(...rects.map((r) => r.left)),
        right = Math.max(...rects.map((r) => r.right));
      const top = Math.min(...rects.map((r) => r.top)),
        bottom = Math.max(...rects.map((r) => r.bottom));
      return {
        id,
        lines: Number(group.dataset.lines),
        tolerance: Math.max(24, rects[0].height * 0.7),
        horizontalError: Math.max(Math.abs(left - p.x), Math.abs(right - q.x)),
        contained:
          p.y < top + rects[0].height && q.y > bottom - rects.at(-1).height,
      };
    });
    return {
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      alignment,
      marks: groups.length,
    };
  });
  assert.equal(state.overflow, false, `${label}: overflow`);
  for (const mark of state.alignment) {
    assert.ok(
      mark.horizontalError < mark.tolerance,
      `${label} ${mark.id}: alignment ${mark.horizontalError}`,
    );
    assert.ok(mark.contained, `${label} ${mark.id}: vertical alignment`);
  }
  results.push({ label, ...state });
}
try {
  await page.goto(base + "/dynamic-scribbles-test/", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await inspect(`${width}px`);
    if ([390, 1440].includes(width)) {
      for (const surface of await page.locator("[data-marker-surface]").all()) {
        await surface.scrollIntoViewIfNeeded();
        await settle();
      }
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await settle();
      const raster = await page.screenshot();
      const { data, info } = await sharp(raster)
        .raw()
        .toBuffer({ resolveWithObject: true });
      let orange = 0;
      for (let i = 0; i < data.length; i += info.channels)
        if (
          data[i] > 220 &&
          data[i + 1] > 75 &&
          data[i + 1] < 160 &&
          data[i + 2] < 130
        )
          orange++;
      assert.ok(
        orange > 3000,
        `Visible marker pixels at ${width}px: ${orange}`,
      );
      await page.screenshot({ path: `${out}/${width}-top.png` });
      await page.locator("#scribble-services").scrollIntoViewIfNeeded();
      await settle();
      await page
        .locator("#scribble-services")
        .screenshot({ path: `${out}/${width}-services.png` });
      // A full-page capture can change classic-scrollbar width mid-frame.
      // Reserve the gutter and settle the expanded viewport before capturing.
      await page.evaluate(
        () => (document.documentElement.style.overflowY = "scroll"),
      );
      const height = await page.evaluate(
        () => document.documentElement.scrollHeight,
      );
      await page.setViewportSize({ width, height });
      await settle();
      await page.screenshot({ path: `${out}/${width}.png` });
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(
        () => (document.documentElement.style.overflowY = ""),
      );
      await settle();
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => (document.documentElement.style.fontSize = "24px"));
  await inspect("150% root font");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "";
    document.querySelector(".scribble-test").style.fontFamily = "Georgia";
    document.querySelector(".scribble-prose").style.letterSpacing = "2px";
  });
  await inspect("font substitution and letter spacing");
  await page.evaluate(() => {
    document.querySelector(".scribble-test").style.fontFamily = "";
    document.querySelector(".scribble-prose").style.letterSpacing = "";
  });
  for (const zoom of [0.8, 1.25, 2]) {
    await page.evaluate((z) => (document.body.style.zoom = z), zoom);
    await inspect(`CSS zoom ${zoom}`);
    if (zoom === 2) await page.screenshot({ path: `${out}/zoom-200.png` });
  }
  await page.evaluate(() => {
    document.body.style.zoom = "";
    document.documentElement.style.scrollbarGutter = "stable both-edges";
  });
  await inspect("reserved scrollbar gutters");
  await page.evaluate(
    () => (document.documentElement.style.scrollbarGutter = ""),
  );
  await page.locator('[name="joining"]').uncheck();
  await settle();
  assert.equal(await page.locator('[data-marker-id="services"]').count(), 0);
  assert.equal(await page.locator('[data-marker-id="service-0"]').count(), 1);
  await page.locator('[name="joining"]').check();
  await settle();
  assert.equal(
    await page.locator('[data-marker-id="services"] > path').count(),
    1,
  );
  await page.locator("#scribble-services").scrollIntoViewIfNeeded();
  await settle();
  assert.ok(
    Number(
      await page
        .locator('[data-marker-id="services"]')
        .getAttribute("data-lines"),
    ) >= 2,
  );
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  const selected = await page
    .locator('[data-mark="service-0"]')
    .evaluate((el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      return s.toString();
    });
  assert.equal(selected, "Content Production");
  await page.evaluate(() => getSelection().removeAllRanges());
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await settle();
  await page.locator("[data-marker-replay]").click();
  await page.waitForTimeout(230);
  assert.ok(
    await page.evaluate(() => document.getAnimations().length > 0),
    "Replay animates visible marks",
  );
  // Pause the real reveal at half time and verify there is visible drawn ink.
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      a.pause();
      a.currentTime = Number(a.effect.getTiming().duration) / 2;
    }),
  );
  await page.screenshot({ path: `${out}/mid-draw.png` });
  const mid = await sharp(await page.locator(".scribble-hero").screenshot())
    .raw()
    .toBuffer({ resolveWithObject: true });
  let inkPixels = 0;
  for (let i = 0; i < mid.data.length; i += mid.info.channels)
    if (
      mid.data[i] > 220 &&
      mid.data[i + 1] > 75 &&
      mid.data[i + 1] < 160 &&
      mid.data[i + 2] < 130
    )
      inkPixels++;
  assert.ok(inkPixels > 1000, `Mid-animation visible ink: ${inkPixels}`);
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => a.finish()),
  );
  await page.waitForTimeout(3000);
  const before = await page
    .locator('[data-marker-id="hero"] > path')
    .getAttribute("d");
  await page.setViewportSize({ width: 1100, height: 1000 });
  await page.waitForTimeout(40);
  assert.equal(
    await page.locator('[data-marker-id="hero"]').getAttribute("visibility"),
    "hidden",
  );
  await page.waitForTimeout(220);
  assert.equal(
    await page.locator('[data-marker-id="hero"]').getAttribute("visibility"),
    "visible",
  );
  assert.notEqual(
    await page.locator('[data-marker-id="hero"] > path').getAttribute("d"),
    before,
  );
  await page.waitForTimeout(3000);
  assert.equal(
    await page.locator('[data-marker-id="long"]').getAttribute("visibility"),
    "hidden",
  );
  await page.locator('[data-mark="long"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(80);
  assert.equal(
    await page.locator('[data-marker-id="long"]').getAttribute("visibility"),
    "visible",
  );
  assert.ok(
    await page.evaluate(() => document.getAnimations().length > 0),
    "Scroll entry animation",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settle();
  assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
  // Controls affect generated ink and output values.
  await page.locator('[name="color"]').fill("#0d2481");
  await settle();
  assert.equal(
    await page.locator('[data-marker-id="hero"] > path').getAttribute("fill"),
    "#0d2481",
  );
  for (const [name, value] of [
    ["thickness", "45"],
    ["position", "80"],
    ["irregularity", "90"],
    ["speed", "2"],
  ]) {
    await page.locator(`[name="${name}"]`).evaluate((el, v) => {
      el.value = v;
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
    await settle();
    assert.equal(
      await page.locator(`[data-value="${name}"]`).textContent(),
      `${value}${name === "speed" ? "×" : "%"}`,
    );
  }
  assert.deepEqual(errors, []);
  await writeFile(
    `${out}/results.json`,
    JSON.stringify(
      {
        results,
        interactions: [
          "joining",
          "text selection",
          "replay",
          "hide during resize",
          "redraw after settling",
          "scroll entry",
          "reduced motion including live change",
          "all controls",
        ],
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    `PASS: ${results.length} geometry scenarios; joining, selection, replay, resize, scroll, reduced motion and controls.`,
  );
} finally {
  await browser.close();
}
