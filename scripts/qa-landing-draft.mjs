import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4325";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
const out = fileURLToPath(
  new URL("../artifacts/landing-page-draft/", import.meta.url),
);
await mkdir(out, { recursive: true });
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
const closeTo = (actual, expected, label) =>
  assert.ok(
    Math.abs(actual - expected) < 2,
    `${label}: ${actual} != ${expected}`,
  );
const rect = async (selector) =>
  page.locator(selector).evaluate((el) => el.getBoundingClientRect().toJSON());
async function scroll(y) {
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    y,
  );
  await page.waitForTimeout(80);
}
async function visit(width, height = 900) {
  await page.setViewportSize({ width, height });
  const response = await page.goto(base + "/landing-page-draft", {
    waitUntil: "domcontentloaded",
  });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() =>
    document
      .querySelector("[data-landing-draft]")
      ?.hasAttribute("data-enhanced"),
  );
  await page.evaluate(() => document.fonts.ready);
}
try {
  for (const width of [
    320, 390, 560, 767, 768, 820, 1024, 1199, 1200, 1440, 1920, 2560,
  ]) {
    const height = width < 768 ? 844 : 900;
    await visit(width, height);
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      headings: document.querySelectorAll("h1").length,
      story: document
        .querySelector(".landing-story-title")
        .getAttribute("aria-label"),
      projects: document.querySelectorAll(".landing-project").length,
      menu:
        getComputedStyle(document.querySelector(".landing-menu-toggle"))
          .display !== "none",
      robots: document.querySelector('meta[name="robots"]').content,
      type: getComputedStyle(document.querySelector("h1")).fontFamily,
      heroLines: Math.round(
        document.querySelector("h1").getBoundingClientRect().height /
          parseFloat(getComputedStyle(document.querySelector("h1")).lineHeight),
      ),
      color: getComputedStyle(document.querySelector(".landing-story-square"))
        .color,
      workColor: getComputedStyle(
        document.querySelector(".landing-work-square"),
      ).color,
    }));
    assert.equal(state.overflow, false, `Overflow at ${width}px`);
    assert.equal(state.headings, 1);
    assert.equal(state.story, "TELL YOUR STORY.");
    assert.equal(state.projects, 4);
    assert.equal(state.menu, width < 768);
    closeTo((await rect("#site-header")).height, 82, "Reference header height");
    if (width >= 768) {
      const navigation = await page
        .locator(".landing-navigation a")
        .evaluateAll((links) =>
          links.map((a) => ({
            size: parseFloat(getComputedStyle(a).fontSize),
            rect: a.getBoundingClientRect().toJSON(),
          })),
        );
      const expectedSize =
        width >= 2560
          ? 32
          : width >= 1920
            ? 28
            : width >= 1440
              ? 24
              : width >= 1200
                ? 22
                : width >= 1024
                  ? 20
                  : 18;
      const expectedGap =
        width >= 2560 ? 50 : width >= 1440 ? 35 : width >= 1024 ? 30 : 22;
      assert.equal(navigation[0].size, expectedSize);
      closeTo(
        navigation[0].rect.top,
        width >= 1920 ? 25 : width >= 1440 ? 24 : 28,
        "Reference nav vertical alignment",
      );
      for (let index = 1; index < navigation.length; index++)
        closeTo(
          navigation[index].rect.left - navigation[index - 1].rect.right,
          expectedGap,
          "Reference nav spacing",
        );
    }
    assert.equal(state.robots, "noindex, nofollow");
    assert.match(state.type, /FK Grotesk/);
    assert.ok(state.heroLines <= 3, `Hero exceeds three lines at ${width}px`);
    assert.equal(state.color, "rgb(255, 83, 47)");
    assert.equal(state.workColor, state.color);
    const before = {
      heading: await rect("h1"),
      reel: await rect(".landing-reel"),
      arrow: await rect(".landing-scroll-arrow"),
    };
    await scroll(80);
    closeTo((await rect("h1")).top, before.heading.top, "Fixed hero heading");
    closeTo(
      (await rect(".landing-reel")).top,
      before.reel.top - 80,
      "Scrolling reel",
    );
    assert.equal(
      await page.locator("#site-header").getAttribute("data-hidden"),
      "true",
    );
    assert.equal(
      await page.locator("#site-header").getAttribute("data-scrolled"),
      "true",
    );
    assert.equal(
      await page.locator("#site-header").evaluate((el) => el.inert),
      true,
    );
    assert.equal(
      await page.locator("#site-header").getAttribute("data-logo"),
      "wordmark",
    );
    await page.waitForFunction(
      () =>
        document.querySelector("#site-header").dataset.logo === "milk" &&
        getComputedStyle(document.querySelector("#site-header")).opacity ===
          "0",
    );
    await scroll(60);
    assert.equal(
      await page.locator("#site-header").getAttribute("data-hidden"),
      "false",
    );
    assert.equal(
      await page
        .locator(".landing-milk")
        .evaluate((el) => getComputedStyle(el).display),
      "block",
    );
    await scroll(0);
    assert.equal(
      await page.locator("#site-header").getAttribute("data-scrolled"),
      "false",
    );
    assert.equal(
      await page
        .locator(".landing-milk")
        .evaluate((el) => getComputedStyle(el).display),
      "none",
    );

    // Below the clamp point, the arrow is fixed relative to the viewport.
    const clampY = Math.max(0, before.reel.bottom - height);
    await scroll(clampY / 2);
    closeTo(
      (await rect(".landing-scroll-arrow")).bottom,
      before.arrow.bottom,
      "Arrow follows viewport",
    );
    // Past the clamp, the arrow moves with the bottom of the reel.
    await scroll(clampY + 120);
    const locked = {
      arrow: await rect(".landing-scroll-arrow"),
      reel: await rect(".landing-reel"),
    };
    await scroll(clampY + 180);
    closeTo(
      (await rect(".landing-scroll-arrow")).bottom,
      locked.arrow.bottom - 60,
      "Arrow follows reel after clamp",
    );
    closeTo(
      (await rect(".landing-reel")).bottom -
        (await rect(".landing-scroll-arrow")).bottom,
      locked.reel.bottom - locked.arrow.bottom,
      "Arrow stays inside reel",
    );

    for (const selector of [
      ".landing-stories",
      ".landing-intro",
      ".landing-project:first-child",
      ".landing-project:last-child",
    ]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
    }
    await page.evaluate(async () =>
      Promise.all(
        [...document.images].map((img) => {
          img.loading = "eager";
          return img.decode().catch(() => {});
        }),
      ),
    );
    assert.deepEqual(
      await page
        .locator("img")
        .evaluateAll((images) =>
          images.filter((img) => !img.naturalWidth).map((img) => img.src),
        ),
      [],
    );
    result.views.push({ width, height, ...state });
    console.log(`Landing layout and scroll checks passed at ${width}px.`);
  }
  result.interactions.push(
    "Fixed heading, scrolling reel, header direction/logo, arrow follow and clamp at all 12 widths",
  );

  await visit(1440);
  await page.evaluate(() => {
    window.cartonSwaps = [];
    const header = document.querySelector("#site-header");
    new MutationObserver(() => {
      if (header.dataset.logo === "milk")
        window.cartonSwaps.push(Number(getComputedStyle(header).opacity));
    }).observe(header, { attributes: true, attributeFilter: ["data-logo"] });
  });
  await scroll(200);
  await scroll(180);
  assert.equal(
    await page.locator("#site-header").getAttribute("data-logo"),
    "wordmark",
  );
  assert.equal(
    await page.locator("#site-header").getAttribute("data-hidden"),
    "true",
  );
  await page.waitForFunction(
    () =>
      document.querySelector("#site-header").dataset.logo === "milk" &&
      getComputedStyle(document.querySelector("#site-header")).opacity === "1",
  );
  assert.deepEqual(await page.evaluate(() => window.cartonSwaps), [0]);
  await scroll(0);
  await page.waitForTimeout(550);
  await scroll(200);
  await scroll(0);
  await page.waitForTimeout(600);
  assert.equal(
    await page.locator("#site-header").getAttribute("data-logo"),
    "wordmark",
  );
  result.interactions.push(
    "Carton swaps only at zero header opacity, including quick direction reversal; returning to top cancels pending swaps",
  );

  const carton = await sharp(
    fileURLToPath(new URL("../public/media/toml-milk.svg", import.meta.url)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = (x, y) =>
    carton.data[(y * carton.info.width + x) * carton.info.channels + 3];
  assert.equal(alpha(0, 0), 0);
  assert.ok(
    carton.data.some((value, index) => index % 4 === 3 && value === 255),
  );
  for (let y = 77; y <= 104; y++)
    for (let x = 50; x <= 77; x++)
      assert.equal(alpha(x, y), 0, "Carton front has no lettering");
  result.interactions.push(
    "Carton SVG has transparent background and front panel, with black outline preserved",
  );

  await visit(390, 844);
  assert.equal(await page.locator(".landing-menu-icon").isVisible(), true);
  assert.equal(await page.locator(".landing-menu-icon svg rect").count(), 2);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  const menuDialog = page.locator("#landing-mobile-menu");
  assert.equal(await menuDialog.evaluate((el) => el.open), true);
  assert.equal(await page.locator("main").evaluate((el) => el.inert), true);
  await page.waitForTimeout(100);
  const openingX = await menuDialog.evaluate(
    (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
  );
  assert.ok(openingX > 0 && openingX < 390, "Menu slides in from the right");
  await page.waitForFunction(
    () =>
      new DOMMatrix(
        getComputedStyle(document.querySelector("#landing-mobile-menu"))
          .transform,
      ).m41 === 0,
  );
  assert.equal(
    await menuDialog.evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(0, 0, 0)",
  );
  assert.equal(await menuDialog.locator(".landing-navigation a").count(), 4);
  assert.equal(
    (await menuDialog.locator(".landing-menu-case").count()) > 0,
    true,
  );
  await page.screenshot({ path: out + "draft-mobile-menu.png" });
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await menuDialog
      .locator(".landing-menu-case")
      .last()
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent.trim()),
    "Close",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".landing-menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await page.waitForTimeout(100);
  const closingX = await menuDialog.evaluate(
    (el) => new DOMMatrix(getComputedStyle(el).transform).m41,
  );
  assert.ok(closingX > 0 && closingX < 390, "Menu slides back to the right");
  assert.equal(await page.locator("main").evaluate((el) => el.inert), true);
  await page.waitForFunction(
    () =>
      !document.querySelector("#landing-mobile-menu").open &&
      !document.querySelector("main").inert,
  );
  assert.equal(await page.locator("main").evaluate((el) => el.inert), false);
  assert.equal(
    await page
      .locator(".landing-menu-toggle")
      .evaluate((el) => el === document.activeElement),
    true,
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.waitForTimeout(750);
  await page
    .locator("#landing-menu-cases")
    .evaluate((el) => el.scrollTo({ left: 0, behavior: "instant" }));
  await page.waitForFunction(
    () => document.querySelector("[data-landing-cases-previous]").disabled,
  );
  const nextCase = page.getByRole("button", { name: "Next case article" });
  await nextCase.click();
  await page.waitForFunction(
    () => document.querySelector("#landing-menu-cases").scrollLeft > 300,
  );
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Previous case article" }).click();
  await page.waitForFunction(
    () => document.querySelector("#landing-menu-cases").scrollLeft < 1,
  );
  for (let i = 0; i < 4 && (await nextCase.isEnabled()); i++) {
    await nextCase.click();
    await page.waitForTimeout(600);
  }
  assert.equal(
    await nextCase.isDisabled(),
    true,
    "Next disables at the final case",
  );
  for (const link of await menuDialog.locator(".landing-menu-case").all()) {
    const href = await link.getAttribute("href");
    assert.equal((await page.request.get(base + href)).status(), 200);
  }
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.waitForFunction(
    () =>
      !document.querySelector("#landing-mobile-menu").open &&
      !document.querySelector("main").inert,
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(
    () =>
      document
        .querySelector(".landing-menu-toggle")
        .getAttribute("aria-expanded") === "false",
  );
  await page.waitForFunction(
    () =>
      !document.querySelector("#landing-mobile-menu").open &&
      !document.querySelector("main").inert,
  );
  assert.equal(await page.locator("main").evaluate((el) => el.inert), false);
  assert.equal(
    await page
      .locator(".landing-header-navigation > .landing-navigation")
      .isVisible(),
    true,
  );
  result.interactions.push(
    "Black full-screen menu slides in/out over 700ms; keyboard loop, Escape, focus restoration, and desktop resize reset",
  );
  result.interactions.push(
    "Latest case carousel supports previous/next with disabled end states and valid case-page links",
  );

  await visit(1440);
  const initialStory = await page
    .locator(".landing-story-line")
    .evaluateAll((lines) =>
      lines.map((line) => {
        const style = getComputedStyle(line);
        return {
          opacity: style.opacity,
          blur: style.filter,
          x: new DOMMatrixReadOnly(style.transform).m41,
          duration: style.transitionDuration,
          easing: style.transitionTimingFunction,
        };
      }),
    );
  assert.ok(
    initialStory.every(
      (line) => line.opacity === "0" && line.blur === "blur(30px)",
    ),
  );
  assert.ok(
    initialStory[0].x > 0 && initialStory[1].x < 0 && initialStory[2].x > 0,
  );
  assert.ok(
    initialStory.every((line) =>
      line.duration.split(", ").every((duration) => duration === "1s"),
    ),
  );
  await page.evaluate(() => {
    window.landingAnimationStarts = [];
    document.querySelectorAll(".landing-story-line").forEach((line) =>
      line.addEventListener("transitionstart", (event) => {
        if (event.propertyName === "opacity")
          window.landingAnimationStarts.push({
            text: line.textContent.trim(),
            time: performance.now(),
          });
      }),
    );
    window.landingAnimationTrigger = performance.now();
    window.scrollTo({
      top:
        document.querySelector(".landing-stories").getBoundingClientRect().top +
        scrollY -
        innerHeight * 0.75 +
        1,
      behavior: "instant",
    });
  });
  await page.waitForFunction(() => window.landingAnimationStarts.length === 3);
  const sequence = await page.evaluate(() => ({
    starts: window.landingAnimationStarts,
    trigger: window.landingAnimationTrigger,
    y: scrollY,
  }));
  assert.deepEqual(
    sequence.starts.map((entry) => entry.text),
    ["TELL", "YOUR", "STORY"],
  );
  assert.ok(sequence.starts[0].time - sequence.trigger >= 250);
  assert.ok(sequence.starts[1].time - sequence.starts[0].time >= 100);
  assert.ok(sequence.starts[2].time - sequence.starts[1].time >= 100);
  await page.waitForTimeout(1100);
  assert.ok(
    await page
      .locator(".landing-story-line")
      .evaluateAll((lines) =>
        lines.every(
          (line) =>
            getComputedStyle(line).opacity === "1" &&
            getComputedStyle(line).filter === "blur(0px)" &&
            new DOMMatrixReadOnly(getComputedStyle(line).transform).m41 === 0,
        ),
      ),
  );
  await scroll(0);
  await scroll(sequence.y);
  await page.waitForTimeout(400);
  assert.equal(
    await page.evaluate(() => window.landingAnimationStarts.length),
    3,
  );
  result.interactions.push(
    "Reference story animation: 300ms start, staggered left/right/left, 30px blur, one second, once per page load",
  );

  await visit(1440);
  assert.equal(
    await page
      .locator(".landing-work-heading")
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  assert.equal(
    await page
      .locator(".landing-project")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "0",
  );
  assert.equal(
    await page
      .locator(".landing-project")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "1.5s",
  );
  assert.equal(
    await page
      .locator(".landing-work-heading > a")
      .evaluate((el) =>
        el
          .closest("[data-landing-reveal]")
          .classList.contains("landing-work-heading"),
      ),
    true,
  );
  const workY = await page
    .locator(".landing-project")
    .first()
    .evaluate(
      (el) => el.getBoundingClientRect().top + scrollY - innerHeight + 160,
    );
  await scroll(workY);
  await page.waitForTimeout(250);
  const fading = await page
    .locator(".landing-project")
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  assert.ok(fading > 0 && fading < 1);
  await page.waitForTimeout(1500);
  assert.equal(
    await page
      .locator(".landing-work-heading")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await scroll(0);
  await scroll(workY);
  assert.equal(
    await page
      .locator(".landing-project")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  result.interactions.push(
    "Selected Work heading/link and images fade in over 1500ms at the reference offset, once",
  );

  await visit(1440);
  assert.deepEqual(
    await page.locator(".landing-navigation a").allTextContents(),
    ["Work", "About", "People", "Journal"],
  );
  assert.equal(
    await page.locator(".landing-navigation a").last().getAttribute("href"),
    "https://www.tomljournal.com",
  );
  await page.waitForFunction(
    () => !document.querySelector("[data-landing-preview]").paused,
  );
  assert.equal(
    await page.locator(".landing-play, .landing-motion-toggle").count(),
    0,
  );
  const reelBox = await rect(".landing-reel");
  const triggerBox = await rect(".landing-reel-trigger");
  closeTo(triggerBox.width, reelBox.width, "Clickable reel width");
  closeTo(triggerBox.height, reelBox.height, "Clickable reel height");
  await page.mouse.click(reelBox.x + reelBox.width / 2, reelBox.y + 100);
  await page.waitForFunction(
    () => document.querySelector("#landing-showreel video").currentTime > 0,
  );
  assert.equal(
    await page.locator("[data-landing-preview]").evaluate((el) => el.paused),
    true,
  );
  await page.screenshot({ path: out + "draft-showreel-open.png" });
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator("#landing-showreel video").evaluate((el) => el.paused),
    true,
  );
  await page.waitForFunction(
    () => !document.querySelector("[data-landing-preview]").paused,
  );
  assert.equal(
    await page
      .getByRole("button", { name: "Play showreel", exact: true })
      .evaluate((el) => el === document.activeElement),
    true,
  );
  result.interactions.push(
    "Click anywhere on reel to open full playback; preview pauses, Escape closes and restores focus/playback",
  );

  await page.keyboard.press("Enter");
  await page.waitForFunction(
    () => document.querySelector("#landing-showreel").open,
  );
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.waitForFunction(
    () => !document.querySelector("#landing-showreel").open,
  );

  const touchContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touchContext.newPage();
  touchPage.on("pageerror", (error) => result.errors.push(error.message));
  await touchPage.goto(base + "/landing-page-draft", { waitUntil: "load" });
  await touchPage.waitForFunction(() =>
    document
      .querySelector("[data-landing-draft]")
      ?.hasAttribute("data-enhanced"),
  );
  const touchBox = await touchPage
    .locator(".landing-reel-trigger")
    .boundingBox();
  await touchPage.touchscreen.tap(
    touchBox.x + touchBox.width / 2,
    touchBox.y + 100,
  );
  await touchPage.waitForFunction(
    () =>
      document.querySelector("#landing-showreel").open &&
      document.querySelector("#landing-showreel video").currentTime > 0,
  );
  await touchPage.getByRole("button", { name: "Close", exact: true }).tap();
  assert.equal(
    await touchPage.locator("#landing-showreel").evaluate((el) => el.open),
    false,
  );
  await touchPage.getByRole("button", { name: "Menu", exact: true }).tap();
  await touchPage.waitForTimeout(750);
  const caseBox = await touchPage.locator("#landing-menu-cases").boundingBox();
  const touchSession = await touchContext.newCDPSession(touchPage);
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 300, y: caseBox.y + 64 }],
  });
  for (const x of [250, 200, 150, 100, 50]) {
    await touchSession.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: caseBox.y + 64 }],
    });
    await touchPage.waitForTimeout(30);
  }
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await touchPage.waitForFunction(
    () => document.querySelector("#landing-menu-cases").scrollLeft > 100,
  );
  assert.equal(await touchPage.evaluate(() => scrollY), 0);
  await touchPage.getByRole("button", { name: "Close", exact: true }).tap();
  await touchPage.waitForFunction(
    () =>
      !document.querySelector("#landing-mobile-menu").open &&
      !document.querySelector("main").inert,
  );
  await touchContext.close();
  result.interactions.push(
    "Full reel target works with keyboard and phone touch; removed controls are absent",
  );
  result.interactions.push(
    "Phone menu opens/closes by touch; horizontal case swipes leave the page fixed",
  );

  await page
    .getByRole("link", { name: "Scroll to Tell your story", exact: true })
    .click();
  await page.waitForFunction(() => {
    const bottom = document
      .querySelector(".landing-reel")
      .getBoundingClientRect().bottom;
    return bottom <= 0 && bottom >= -2;
  });
  result.interactions.push(
    "Scroll arrow stops just beyond the showreel, with its bottom edge out of view",
  );

  // A new document replays visible content fades after browser scroll restoration.
  const restoreY = await page
    .locator(".landing-intro")
    .evaluate((el) => el.getBoundingClientRect().top + scrollY - 100);
  await scroll(restoreY);
  await page.waitForTimeout(1600);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      scrollY > 0 &&
      document
        .querySelector("[data-landing-draft]")
        ?.hasAttribute("data-enhanced"),
  );
  assert.ok(
    await page
      .locator(".landing-intro")
      .evaluate((el) => parseFloat(getComputedStyle(el).opacity) < 1),
  );
  assert.equal(
    await page
      .locator("[data-landing-draft]")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
    "rgb(255, 255, 255)",
  );
  await page.waitForTimeout(1700);
  assert.equal(
    await page
      .locator(".landing-intro")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  result.interactions.push(
    "Content fades from white again after reload at a restored lower scroll position",
  );

  for (const width of [1440, 390]) {
    await visit(width, width === 390 ? 844 : 900);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: out + `draft-${width}-top.png` });
    await scroll(260);
    await page.waitForTimeout(600);
    await page.screenshot({ path: out + `draft-${width}-down.png` });
    await scroll(180);
    await page.waitForTimeout(600);
    await page.screenshot({ path: out + `draft-${width}-up.png` });
    for (const [name, selector] of [
      ["stories", ".landing-stories"],
      ["intro", ".landing-intro"],
      ["work", ".landing-work-heading"],
    ]) {
      const top = await page
        .locator(selector)
        .evaluate((el) => el.getBoundingClientRect().top + scrollY);
      await scroll(top - 100);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: out + `draft-${width}-${name}.png` });
    }
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit(390, 844);
  assert.equal(
    await page.locator("[data-landing-preview]").evaluate((el) => el.paused),
    true,
  );
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  assert.equal(
    await page
      .locator(".landing-story-line")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  result.interactions.push(
    "Reduced motion: static poster, visible text and no smooth scrolling",
  );
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  assert.equal(
    await page
      .locator("#landing-mobile-menu")
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "0s",
  );
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.waitForFunction(
    () =>
      !document.querySelector("#landing-mobile-menu").open &&
      !document.querySelector("main").inert,
  );
  assert.equal(await page.locator("main").evaluate((el) => el.inert), false);

  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base + "/landing-page-draft", { waitUntil: "load" });
  assert.equal(await staticPage.locator("h1").isVisible(), true);
  assert.equal(
    await staticPage
      .locator(".landing-story-line")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await noScript.close();
  result.interactions.push("No-JavaScript content remains visible");
  assert.deepEqual(result.errors, []);
  console.log(
    `Passed ${result.views.length} landing layouts and ${result.interactions.length} interaction groups.`,
  );
} finally {
  await writeFile(
    out + "browser-results.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  await browser.close();
}
