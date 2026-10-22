import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4322";
assert.ok(
  [
    "localhost",
    "127.0.0.1",
    "toml-collective-website.toml-collective.workers.dev",
    "toml-collective-website-preview.toml-collective.workers.dev",
  ].includes(new URL(base).hostname),
);
const out = fileURLToPath(
  new URL("../artifacts/landing-culture/", import.meta.url),
);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
const result = { base, views: [], interactions: [], errors: [] };
page.on("pageerror", (error) => result.errors.push(error.message));
const section = page.locator(".landing-culture");
async function showSection() {
  await section.evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 100,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(1700);
}
try {
  for (const width of [320, 390, 560, 767, 768, 820, 1024, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + "/landing-page-draft/", { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    await showSection();
    await section.locator("img").evaluateAll(async (images) => {
      await Promise.all(
        images.map((img) => {
          img.loading = "eager";
          return img.decode();
        }),
      );
    });
    const layout = await section.evaluate((el) => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      previous: el.previousElementSibling.id,
      next: [...el.parentElement.children]
        .slice([...el.parentElement.children].indexOf(el) + 1)
        .find((node) => node.tagName === "SECTION")?.id,
      cards: [...el.querySelectorAll(".landing-culture-card")].map((card) => ({
        box: card.getBoundingClientRect().toJSON(),
        caption: card
          .querySelector(".landing-culture-caption")
          .getBoundingClientRect()
          .toJSON(),
      })),
    }));
    assert.equal(layout.overflow, false);
    assert.equal(layout.previous, "start-a-conversation");
    assert.equal(layout.next, "instagram");
    const [left, right] = layout.cards;
    assert.ok(left.box.left >= 20 && right.box.right <= width - 19);
    if (width >= 768) {
      assert.equal(left.box.top, right.box.top);
      assert.ok(right.box.left - left.box.right >= 31);
    } else assert.ok(right.box.top - left.box.bottom >= 31);
    for (const { box, caption } of layout.cards) {
      assert.ok(caption.top > box.top + 60);
      assert.ok(
        caption.bottom < box.bottom &&
          caption.left > box.left &&
          caption.right < box.right,
      );
    }
    result.views.push(layout);
    if ([390, 820, 1440].includes(width)) {
      await section.screenshot({ path: out + `section-${width}.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await showSection();
  const video = page.locator("[data-culture-video]");
  await page.waitForFunction(
    () => document.querySelector("[data-culture-video]").currentTime > 0,
  );
  assert.equal(
    await video.evaluate((v) => v.muted && v.loop && v.playsInline),
    true,
  );
  await page
    .getByRole("button", { name: "Pause TOML Journal video", exact: true })
    .click();
  assert.equal(await video.evaluate((v) => v.paused), true);
  await page
    .getByRole("button", { name: "Play TOML Journal video", exact: true })
    .click();
  await page.waitForFunction(
    () => !document.querySelector("[data-culture-video]").paused,
  );
  const active = () =>
    page
      .locator('[data-culture-slide][data-active="true"]')
      .getAttribute("src");
  const first = await active();
  await page.waitForFunction(
    (src) =>
      document
        .querySelector('[data-culture-slide][data-active="true"]')
        .getAttribute("src") !== src,
    first,
    { timeout: 7000 },
  );
  await page
    .getByRole("button", { name: "Pause House of TOML slideshow", exact: true })
    .click();
  const pausedSlide = await active();
  await page.waitForTimeout(5200);
  assert.equal(await active(), pausedSlide);
  await page
    .getByRole("button", { name: "Play House of TOML slideshow", exact: true })
    .click();
  await page.waitForFunction(
    (src) =>
      document
        .querySelector('[data-culture-slide][data-active="true"]')
        .getAttribute("src") !== src,
    pausedSlide,
    { timeout: 7000 },
  );
  result.interactions.push(
    "Muted inline video, slideshow advancement, and independent pause/resume controls",
  );
  await page.locator(".landing-culture-link").first().hover();
  await page.waitForTimeout(800);
  assert.equal(
    await page
      .locator(".landing-culture-media")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
    "matrix(1.05, 0, 0, 1.05, 0, 0)",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(300);
  assert.equal(await video.evaluate((v) => v.paused), true);
  result.interactions.push("Five-percent hover zoom and offscreen video pause");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await showSection();
  assert.equal(await video.evaluate((v) => v.paused), true);
  const reducedSlide = await active();
  await page.waitForTimeout(5200);
  assert.equal(await active(), reducedSlide);
  await page.locator(".landing-culture-link").first().focus();
  assert.equal(
    await page
      .locator(".landing-culture-media")
      .first()
      .evaluate((el) => getComputedStyle(el).transform),
    "none",
  );
  result.interactions.push(
    "Reduced motion stops autoplay, slideshow transitions, and hover zoom",
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(base + "/landing-page-draft/");
  assert.equal(
    await fallback
      .locator(".landing-culture-link")
      .first()
      .getAttribute("href"),
    "https://www.tomljournal.com",
  );
  assert.equal(
    await fallback.locator(".landing-culture-link").last().getAttribute("href"),
    "/about/house-of-toml/",
  );
  assert.equal(
    await fallback.locator("[data-culture-motion]:visible").count(),
    0,
  );
  assert.equal(
    await fallback
      .locator("[data-culture-slide]")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await noJs.close();
  result.interactions.push("No-JavaScript media and link fallbacks");
  assert.deepEqual(result.errors, []);
  console.log(
    `Passed ${result.views.length} culture layouts and ${result.interactions.length} interaction groups at ${base}`,
  );
} finally {
  await writeFile(
    out + "browser-results.json",
    JSON.stringify(result, null, 2),
  );
  await browser.close();
}
