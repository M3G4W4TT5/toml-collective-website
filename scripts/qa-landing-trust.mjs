import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4326";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
const out = "artifacts/landing-trust";
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.TOML_BROWSER_PATH || "/opt/google/chrome/chrome",
  args: ["--no-sandbox"],
});
const result = { views: [], interactions: [], errors: [] };
const names = [
  "Stefano Marrone",
  "Hilary Taylor",
  "Josh Lanyon",
  "Lauren Yarmuth",
  "Ina Schultz",
  "Tia Johnston",
];
const context = await browser.newContext({
  deviceScaleFactor: 1,
  hasTouch: true,
});
const page = await context.newPage();
page.on("pageerror", (e) => result.errors.push(e.message));
async function scrollTo(selector) {
  await page.locator(selector).evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 100,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(1650);
}
async function visit(width, height) {
  await page.setViewportSize({ width, height });
  await page.goto(base + "/landing-page-draft", { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.locator(".landing-clients img").evaluateAll((imgs) =>
    Promise.all(
      imgs.map((img) => {
        img.loading = "eager";
        return img.decode();
      }),
    ),
  );
}
async function state() {
  return page.locator(".landing-testimonials").evaluate((el) => {
    const slide = el.querySelector("figure:not([hidden])"),
      quote = slide.querySelector("blockquote"),
      caption = slide.querySelector("figcaption"),
      controls = el.querySelector(".landing-testimonial-controls");
    const rect = (n) => n.getBoundingClientRect().toJSON(),
      css = getComputedStyle(el);
    return {
      rect: rect(el),
      quote: rect(quote),
      caption: rect(caption),
      controls: rect(controls),
      name: slide.querySelector(".landing-testimonial-name").textContent,
      visible: el.querySelectorAll("figure:not([hidden])").length,
      background: css.backgroundColor,
      color: getComputedStyle(quote).color,
      padding: parseFloat(css.paddingTop),
      leading: parseFloat(getComputedStyle(quote).lineHeight),
      count: el.querySelector("[data-testimonial-count]").textContent,
      portraits: el.querySelectorAll("img").length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
}
try {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [560, 740],
    [767, 390],
    [768, 1024],
    [820, 1180],
    [1024, 768],
    [1199, 900],
    [1200, 800],
    [1440, 900],
    [1597, 900],
    [1920, 1080],
    [2434, 1000],
    [2560, 1440],
  ]) {
    await visit(width, height);
    const order = await page
      .locator(".landing-surface")
      .evaluate((el) =>
        [...el.children]
          .filter((n) => n.tagName !== "SCRIPT")
          .map((n) => n.id || n.className),
      );
    assert.ok(
      order.indexOf("clients-and-partners") < order.indexOf("our-services"),
    );
    assert.equal(
      order[order.indexOf("our-services") + 1],
      "client-testimonials",
    );
    assert.equal(
      order[order.indexOf("client-testimonials") + 1],
      "start-a-conversation",
    );
    const colors = await page
      .locator(
        ".landing-services-square, .landing-work-square, .landing-story-square, .landing-footer-square, .landing-menu-case-label svg, .landing-instagram-label svg",
      )
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).color));
    assert.ok(colors.length >= 6);
    assert.ok(
      colors.every((color) => color === "rgb(255, 83, 47)"),
      colors.join(", "),
    );
    assert.equal(
      await page
        .locator(".landing-clients-group")
        .first()
        .locator("img")
        .count(),
      15,
    );
    await scrollTo(".landing-clients");
    if ([390, 1440, 2434].includes(width))
      await page
        .locator(".landing-clients")
        .screenshot({ path: `${out}/final-${width}-clients.png` });
    await scrollTo(".landing-testimonials");
    for (let i = 0; i < names.length; i++) {
      const current = await state();
      assert.equal(current.name, names[i]);
      assert.equal(current.visible, 1);
      assert.equal(current.background, "rgb(255, 83, 47)");
      assert.equal(current.color, "rgb(255, 255, 255)");
      assert.ok(Math.abs(current.padding - current.leading) < 0.1);
      assert.equal(current.portraits, 0);
      assert.equal(current.overflow, false);
      assert.ok(
        current.controls.bottom <= current.rect.bottom - current.padding + 1,
      );
      assert.ok(current.caption.right <= width);
      assert.ok(current.quote.right <= width);
      if ([390, 1440, 1597].includes(width) && [0, 4].includes(i)) {
        await page.waitForTimeout(350);
        await page.locator(".landing-testimonials").screenshot({
          path: `${out}/final-${width}-testimonial-${i + 1}.png`,
        });
      }
      await page
        .getByRole("button", { name: "Next testimonial", exact: true })
        .click();
    }
    assert.equal((await state()).name, names[0]);
    result.views.push({ width, height, firstSlide: await state() });
  }
  result.interactions.push(
    "14 responsive layouts; all six quotes, attribution, compact orange panel, source order, no portraits or clipping, and every section marker orange",
  );
  await visit(1440, 900);
  await scrollTo(".landing-clients");
  await page.mouse.move(0, 0);
  const x = () =>
    page
      .locator(".landing-clients-track")
      .evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
      );
  const a = await x();
  await page.waitForTimeout(600);
  const b = await x();
  assert.ok(
    a - b > 7 && a - b < 22,
    `Gentle leftward speed: ${a - b}px per 600ms`,
  );
  const widths = await page
    .locator(".landing-clients-group")
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  assert.ok(Math.abs(widths[0] - widths[1]) < 0.01);
  await page.getByRole("button", { name: "Pause logos", exact: true }).click();
  await page.mouse.move(0, 0);
  const paused = await x();
  await page.waitForTimeout(500);
  assert.equal(await x(), paused);
  await page.getByRole("button", { name: "Resume logos", exact: true }).click();
  await page.mouse.move(0, 0);
  const resumed = await x();
  await page.waitForTimeout(500);
  assert.ok((await x()) < resumed - 5);
  await page.locator(".landing-clients-window").focus();
  assert.equal(
    await page
      .locator(".landing-clients-track")
      .evaluate((el) => getComputedStyle(el).animationPlayState),
    "paused",
  );
  result.interactions.push(
    "All 15 logos; identical seamless-loop groups; gentle leftward motion; persistent pause/resume and keyboard focus pause",
  );
  await scrollTo(".landing-testimonials");
  await page
    .getByRole("button", { name: "Next testimonial", exact: true })
    .focus();
  await page.keyboard.press("ArrowLeft");
  assert.equal((await state()).name, names[5]);
  await page.keyboard.press("ArrowRight");
  assert.equal((await state()).name, names[0]);
  await page.keyboard.press("Enter");
  assert.equal((await state()).name, names[1]);
  assert.equal(
    await page
      .getByRole("button", { name: "Next testimonial", exact: true })
      .evaluate((el) => getComputedStyle(el).outlineColor),
    "rgb(255, 255, 255)",
  );
  result.interactions.push(
    "Carousel buttons wrap; keyboard arrows, Enter and white focus outline work",
  );
  await visit(390, 844);
  await scrollTo(".landing-testimonials");
  const box = await page.locator(".landing-testimonial-slides").boundingBox();
  const session = await context.newCDPSession(page);
  const y = box.y + 50;
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 330, y }],
  });
  for (let i = 1; i <= 6; i++)
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 330 - i * 40, y }],
    });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
  assert.equal((await state()).name, names[1]);
  result.interactions.push("Actual mobile touch gesture advances testimonials");
  for (const options of [
    { reducedMotion: "reduce" },
    { javaScriptEnabled: false },
  ]) {
    const plain = await browser.newPage({
      viewport: { width: 390, height: 844 },
      ...options,
    });
    await plain.goto(base + "/landing-page-draft", { waitUntil: "load" });
    assert.equal(
      await plain.locator(".landing-clients-group:visible").count(),
      1,
    );
    assert.equal(
      await plain.locator(".landing-clients-group:visible img").count(),
      15,
    );
    assert.equal(
      await plain
        .locator(".landing-clients-track")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    assert.equal(
      await plain.locator(".landing-clients-pause").isVisible(),
      false,
    );
    if (options.javaScriptEnabled === false)
      assert.equal(
        await plain.locator("[data-testimonial-slide]:visible").count(),
        6,
      );
    assert.equal(
      await plain.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await plain.close();
  }
  result.interactions.push(
    "Reduced motion shows static full logo list; no-JS exposes all logos and all six complete testimonials",
  );
  assert.deepEqual(result.errors, []);
  await writeFile(
    `${out}/browser-results.json`,
    JSON.stringify(result, null, 2),
  );
  console.log(
    `Passed ${result.views.length} trust layouts and ${result.interactions.length} interaction groups`,
  );
} finally {
  await browser.close();
}
