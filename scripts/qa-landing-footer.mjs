import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4325";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
const out = fileURLToPath(
  new URL("../artifacts/landing-footer/", import.meta.url),
);
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.TOML_BROWSER_PATH
    ? { executablePath: process.env.TOML_BROWSER_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const result = { views: [], interactions: [], errors: [] };
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page = await context.newPage();
page.on("pageerror", (error) => result.errors.push(error.message));
async function scrollTo(top) {
  await page.evaluate(
    (top) => window.scrollTo({ top, behavior: "instant" }),
    top,
  );
  await page.waitForTimeout(100);
}
async function bottom() {
  await scrollTo(
    await page.evaluate(() => document.documentElement.scrollHeight),
  );
  await page.waitForFunction(
    () =>
      document.querySelector("[data-landing-footer]").dataset.visible ===
      "true",
  );
}
try {
  await page.goto(base + "/landing-page-draft", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    () => document.querySelector("[data-landing-draft]").dataset.enhanced,
  );
  await page.evaluate(() => document.fonts.ready);
  for (const [width, height] of [
    [320, 568],
    [320, 740],
    [390, 844],
    [560, 740],
    [560, 700],
    [767, 390],
    [768, 1024],
    [768, 640],
    [820, 1180],
    [844, 390],
    [1024, 768],
    [1199, 900],
    [1200, 800],
    [1440, 700],
    [1440, 640],
    [1440, 900],
    [1920, 1080],
    [2460, 1522],
    [2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await scrollTo(0);
    assert.equal(
      await page.evaluate(() =>
        Boolean(
          document
            .elementFromPoint(innerWidth / 2, innerHeight / 2)
            .closest(".landing-footer"),
        ),
      ),
      false,
    );
    const mainHeight = await page
      .locator(".landing-draft main")
      .evaluate((el) => el.getBoundingClientRect().bottom + scrollY);
    await scrollTo(mainHeight - height / 2);
    const half = await page.evaluate(() => ({
      main: document
        .querySelector(".landing-draft main")
        .getBoundingClientRect().bottom,
      footer: document
        .querySelector(".landing-footer")
        .getBoundingClientRect()
        .toJSON(),
      revealed: Boolean(
        document
          .elementFromPoint(10, innerHeight - 10)
          .closest(".landing-footer"),
      ),
    }));
    assert.ok(Math.abs(half.main - height / 2) < 2);
    assert.equal(half.footer.top, 0);
    assert.equal(half.footer.height, height);
    assert.equal(half.revealed, true);
    if ([390, 1440].includes(width) && height > 800) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: out + `draft-${width}-half.png` });
    }
    await bottom();
    const layout = await page.evaluate(() => {
      const footer = document.querySelector(".landing-footer");
      const legal = footer.querySelector(".landing-footer-legal");
      const newsletter = footer.querySelector(".landing-footer-newsletter");
      const news = newsletter.getBoundingClientRect();
      const image = newsletter.querySelector("picture").getBoundingClientRect();
      const caption = newsletter.querySelector("span");
      const contacts = document.createTreeWalker(
        footer.querySelector(".landing-footer-offices"),
        NodeFilter.SHOW_TEXT,
      );
      let overlap = false;
      while (contacts.nextNode()) {
        if (!contacts.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(contacts.currentNode);
        for (const rect of range.getClientRects()) {
          if (
            rect.left < news.right &&
            rect.right > news.left &&
            rect.top < news.bottom &&
            rect.bottom > news.top
          )
            overlap = true;
        }
      }
      return {
        width: innerWidth,
        height: innerHeight,
        horizontalOverflow:
          document.documentElement.scrollWidth > innerWidth + 1,
        footerOverflow: footer.scrollHeight - footer.clientHeight,
        mainBottom: document
          .querySelector(".landing-draft main")
          .getBoundingClientRect().bottom,
        clocks: getComputedStyle(
          footer.querySelector(".landing-footer-clock-row"),
        ).display,
        postal: [...footer.querySelectorAll(".landing-footer-postal")].map(
          (el) => getComputedStyle(el).display,
        ),
        legalBottom: legal.getBoundingClientRect().bottom,
        heroVisibility: getComputedStyle(
          document.querySelector(".landing-hero-heading"),
        ).visibility,
        newsletter: {
          overlap,
          right: news.right,
          bottom: news.bottom,
          imageWidth: image.width,
          imageHeight: image.height,
          socialTop: footer
            .querySelector(".landing-footer-social")
            .getBoundingClientRect().top,
          captionLines: Math.round(
            caption.getBoundingClientRect().height /
              parseFloat(getComputedStyle(caption).lineHeight),
          ),
        },
      };
    });
    assert.equal(layout.horizontalOverflow, false, JSON.stringify(layout));
    assert.ok(
      layout.mainBottom <= 0 && layout.mainBottom >= -2,
      JSON.stringify(layout),
    );
    const shortScreen = (width < 576 && height < 800) || height <= 640;
    if (shortScreen) {
      const legalBottom = await page
        .locator(".landing-footer")
        .evaluate((el) => {
          el.scrollTop = el.scrollHeight;
          const bottom = el
            .querySelector(".landing-footer-legal")
            .getBoundingClientRect().bottom;
          el.scrollTop = 0;
          return bottom;
        });
      assert.ok(legalBottom <= height + 1, JSON.stringify(layout));
    } else {
      assert.ok(layout.footerOverflow <= 1, JSON.stringify(layout));
      assert.ok(layout.legalBottom <= height + 1, JSON.stringify(layout));
    }
    assert.equal(layout.newsletter.overlap, false, JSON.stringify(layout));
    assert.ok(
      layout.newsletter.bottom < layout.newsletter.socialTop,
      JSON.stringify(layout),
    );
    assert.equal(layout.newsletter.captionLines, 1, JSON.stringify(layout));
    assert.ok(
      Math.abs(
        layout.newsletter.imageWidth / layout.newsletter.imageHeight - 3.5,
      ) < 0.01,
    );
    assert.deepEqual(layout.postal, ["block", "block", "block"]);
    assert.equal(
      layout.clocks,
      width >= 768 && height >= 640 ? "grid" : "none",
    );
    assert.equal(layout.heroVisibility, "hidden");
    result.views.push(layout);
    if ([320, 390, 820, 1440, 2460].includes(width) && height !== 700) {
      await page.waitForTimeout(600);
      await page.screenshot({ path: out + `draft-${width}-footer.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.clock.setFixedTime(new Date("2026-10-21T12:34:56Z"));
  await bottom();
  await page.waitForFunction(
    () =>
      document.querySelector("[data-landing-time]").textContent === "13:34:56",
  );
  assert.deepEqual(
    await page.locator("[data-landing-time]").allTextContents(),
    ["13:34:56", "14:34:56", "06:34:56"],
  );
  await page.clock.setFixedTime(new Date("2026-10-21T12:34:57Z"));
  await page.waitForFunction(
    () =>
      document.querySelector("[data-landing-time]").textContent === "13:34:57",
  );
  result.interactions.push(
    "Three live clocks follow London, Prishtina and Calgary time zones and update every second",
  );
  assert.deepEqual(
    await page
      .locator(".landing-footer-social a")
      .evaluateAll((links) => links.map((el) => el.getAttribute("href"))),
    [
      "http://www.linkedin.com/company/19117671/",
      "https://instagram.com/toml.collective",
      "https://www.behance.net/toml-collective/",
      "https://vimeo.com/tomlcollective",
    ],
  );
  assert.equal(await page.locator(".landing-footer-office").count(), 3);
  await page.mouse.move(0, 0);
  const marquee = page.locator(".landing-footer-marquee-track").first();
  const before = await marquee.evaluate(
    (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
  );
  await page.waitForTimeout(300);
  const after = await marquee.evaluate(
    (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
  );
  assert.ok(after < before);
  assert.equal(
    await marquee.evaluate((el) => getComputedStyle(el).animationDuration),
    "20s",
  );
  assert.equal(
    await page
      .locator(".landing-footer-square")
      .first()
      .evaluate((el) => getComputedStyle(el).color),
    "rgb(255, 83, 47)",
  );
  result.interactions.push(
    "Source social destinations, four links, orange squares and continuous left-moving marquee verified",
  );
  const newsletter = page.getByRole("link", {
    name: "Subscribe to our newsletter on TOML Journal",
    exact: true,
  });
  assert.equal(
    await newsletter.getAttribute("href"),
    "https://www.tomljournal.com/subscribe",
  );
  assert.equal(
    await newsletter.locator("span").textContent(),
    "SUBSCRIBE TO OUR NEWSLETTER",
  );
  await page.waitForFunction(() => {
    const img = document.querySelector(".landing-footer-newsletter img");
    return (
      img.complete &&
      img.naturalWidth === 800 &&
      img.currentSrc.endsWith("tomljournal-logo-animation.gif")
    );
  });
  const destination = await context.newPage();
  await destination.goto(base + "/landing-page-draft", {
    waitUntil: "domcontentloaded",
  });
  await destination.waitForFunction(
    () => document.querySelector("[data-landing-draft]").dataset.enhanced,
  );
  await destination.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await destination.route("https://www.tomljournal.com/subscribe", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Newsletter destination</title>",
    }),
  );
  await destination
    .getByRole("link", {
      name: "Subscribe to our newsletter on TOML Journal",
      exact: true,
    })
    .click();
  assert.equal(destination.url(), "https://www.tomljournal.com/subscribe");
  await destination.close();
  result.interactions.push(
    "Newsletter caption and supplied animated image appear above socials without covering contacts; clicking the image reaches the exact subscription URL",
  );
  await page.locator(".landing-footer-back").click();
  await page.waitForFunction(() => scrollY < 1);
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector(".landing-hero-heading"))
        .visibility === "visible",
  );
  await page.locator(".landing-footer-email").focus();
  await page.waitForFunction(
    () =>
      document.querySelector(".landing-draft main").getBoundingClientRect()
        .bottom <= 0,
  );
  result.interactions.push(
    "Back to top restores hero; keyboard focus reveals fixed footer links above the foreground content",
  );
  await page.setViewportSize({ width: 320, height: 320 });
  await bottom();
  const compact = await page.locator(".landing-footer").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
    return {
      scrollable: el.scrollHeight > el.clientHeight,
      legalBottom: el
        .querySelector(".landing-footer-legal")
        .getBoundingClientRect().bottom,
    };
  });
  assert.equal(compact.scrollable, true);
  assert.ok(compact.legalBottom <= 321);
  result.interactions.push(
    "Extremely short mobile view retains every address and scrolls internally to the legal links",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await marquee.evaluate((el) => getComputedStyle(el).animationName),
    "none",
  );
  await page.waitForFunction(() => {
    const img = document.querySelector(".landing-footer-newsletter img");
    return (
      img.complete && img.currentSrc.endsWith("tomljournal-logo-still.webp")
    );
  });
  result.interactions.push("Reduced motion stops the marquee");
  result.interactions.push(
    "Reduced motion selects a static frame of the supplied newsletter animation",
  );
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const fallback = await noJs.newPage();
  await fallback.goto(base + "/landing-page-draft", {
    waitUntil: "domcontentloaded",
  });
  assert.equal(
    await fallback
      .locator(".landing-footer")
      .evaluate((el) => getComputedStyle(el).position),
    "relative",
  );
  assert.deepEqual(
    await fallback
      .locator(".landing-footer-postal")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).display)),
    ["block", "block", "block"],
  );
  await noJs.close();
  result.interactions.push(
    "No-JavaScript footer remains in normal flow with every address visible",
  );
  assert.deepEqual(result.errors, []);
  console.log(
    `${result.views.length} footer layouts and ${result.interactions.length} interaction groups passed`,
  );
} finally {
  await writeFile(
    out + "browser-results.json",
    JSON.stringify(result, null, 2),
  );
  await browser.close();
}
