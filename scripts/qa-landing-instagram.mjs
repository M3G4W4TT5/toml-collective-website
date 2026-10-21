import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const base = process.env.TOML_QA_BASE_URL || "http://127.0.0.1:4325";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(base).hostname));
const out = fileURLToPath(
  new URL("../artifacts/landing-instagram/", import.meta.url),
);
await mkdir(out, { recursive: true });
const snapshot = JSON.parse(
  await readFile(
    new URL("../src/data/instagram-snapshot.json", import.meta.url),
    "utf8",
  ),
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.TOML_BROWSER_PATH
    ? { executablePath: process.env.TOML_BROWSER_PATH }
    : {}),
  args: ["--no-sandbox"],
});
const result = {
  views: [],
  interactions: [],
  errors: [],
  instagramRequests: [],
};
const context = await browser.newContext({
  deviceScaleFactor: 1,
  hasTouch: true,
});
await context.addInitScript(() => {
  Object.defineProperty(navigator, "share", {
    value: undefined,
    configurable: true,
  });
  Object.defineProperty(navigator, "clipboard", {
    value: {
      writeText: async (value) => {
        window.__sharedPost = value;
      },
    },
    configurable: true,
  });
});
const page = await context.newPage();
page.on("pageerror", (e) => result.errors.push(e.message));
page.on("request", (req) => {
  if (
    /instagram\.com|cdninstagram\.com|fbcdn\.net/.test(
      new URL(req.url()).hostname,
    )
  )
    result.instagramRequests.push(req.url());
});
async function visit(width, height = 900) {
  await page.setViewportSize({ width, height });
  await page.goto(base + "/landing-page-draft", {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () => document.querySelector("[data-landing-draft]").dataset.enhanced,
  );
  await page.locator("#instagram").evaluate((el) =>
    window.scrollTo({
      top: el.getBoundingClientRect().top + scrollY - 100,
      behavior: "instant",
    }),
  );
  await page.waitForTimeout(1700);
}
async function openPost(index = 0) {
  await page.locator(`[data-instagram-post="${index}"]`).click();
  await page.waitForFunction(
    () => document.querySelector("#landing-instagram-dialog").open,
  );
  await page.waitForTimeout(450);
}
async function closePost() {
  await page.keyboard.press("Escape");
  await page.waitForFunction(
    () => !document.querySelector("#landing-instagram-dialog").open,
  );
}
async function swipe(selector, direction = -1) {
  const box = await page.locator(selector).boundingBox();
  const y = Math.min(box.y + 50, 800),
    from = direction < 0 ? box.x + box.width - 40 : box.x + 40;
  const to = direction < 0 ? box.x + 40 : box.x + box.width - 40;
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: from, y }],
  });
  for (let step = 1; step <= 6; step++)
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: from + ((to - from) * step) / 6, y }],
    });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
  await page.waitForTimeout(450);
}
try {
  assert.equal(snapshot.posts.length, 11);
  assert.equal(
    snapshot.posts.some((p) => p.id === "DSnGTVUDDO8"),
    false,
  );
  for (let i = 1; i < snapshot.posts.length; i++)
    assert.ok(
      Date.parse(snapshot.posts[i - 1].publishedAt) >
        Date.parse(snapshot.posts[i].publishedAt),
    );
  let images = 0,
    videos = 0;
  for (const post of snapshot.posts) {
    assert.ok(
      (await stat(new URL("../public" + post.avatar, import.meta.url))).size >
        0,
    );
    for (const media of post.media) {
      assert.ok(
        (await stat(new URL("../public" + media.image, import.meta.url))).size >
          0,
      );
      images++;
      if (media.type === "video") {
        assert.ok(
          (await stat(new URL("../public" + media.src, import.meta.url))).size >
            0,
        );
        videos++;
      }
    }
  }
  result.interactions.push(
    `Dated public snapshot: 11 posts in chronological order, pinned older post excluded, ${images} local images and ${videos} local videos`,
  );
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [560, 740],
    [640, 844],
    [641, 844],
    [767, 390],
    [768, 1024],
    [820, 1180],
    [1024, 768],
    [1199, 900],
    [1200, 800],
    [1440, 900],
    [1920, 1080],
    [2560, 1440],
  ]) {
    await visit(width, height);
    const layout = await page.evaluate(() => {
      const grid = document.querySelector("#instagram");
      const items = [...grid.children].filter(
        (el) => getComputedStyle(el).display !== "none",
      );
      return {
        width: innerWidth,
        height: innerHeight,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        count: items.length - 1,
        grid: grid.getBoundingClientRect().toJSON(),
        tiles: items.map((el) => el.getBoundingClientRect().toJSON()),
        heading: document.querySelector("#landing-instagram-heading")
          .textContent,
        profile: document.querySelector(".landing-instagram-intro>a").href,
        gapToFooter:
          document
            .querySelector("[data-landing-footer-reveal]")
            .getBoundingClientRect().top - grid.getBoundingClientRect().bottom,
      };
    });
    assert.equal(layout.overflow, false, JSON.stringify(layout));
    assert.equal(
      layout.count,
      width < 768 ? 5 : width < 1024 ? 7 : width < 1200 ? 9 : 11,
    );
    assert.equal(layout.heading, "Posts from the collective");
    assert.equal(layout.profile, snapshot.profileUrl);
    for (const tile of layout.tiles)
      assert.ok(Math.abs(tile.width - tile.height) < 1);
    assert.ok(Math.abs(layout.gapToFooter) < 1, JSON.stringify(layout));
    result.views.push(layout);
    if ([390, 1440].includes(width))
      await page
        .locator("#instagram")
        .screenshot({ path: out + `draft-${width}-grid-region.png` });
    await openPost();
    const modal = await page.evaluate(() => {
      const dialog = document.querySelector("#landing-instagram-dialog"),
        card = dialog.querySelector(".instagram-dialog-card"),
        panel = dialog.querySelector(".instagram-post-panel"),
        media = dialog.querySelector(".instagram-post-media");
      return {
        modal: dialog.matches(":modal"),
        card: card.getBoundingClientRect().toJSON(),
        panel: panel.getBoundingClientRect().toJSON(),
        media: media.getBoundingClientRect().toJSON(),
        radius: getComputedStyle(dialog.querySelector(".instagram-media-next"))
          .borderRadius,
        number: dialog.querySelector(".instagram-post-number").textContent,
      };
    });
    assert.equal(modal.modal, true);
    assert.equal(modal.number, "1 / 11");
    assert.equal(modal.radius, "30px");
    assert.ok(modal.card.x >= -1 && modal.card.right <= width + 1);
    assert.ok(modal.media.height <= height - 149);
    if (width <= 640)
      assert.ok(Math.abs(modal.panel.top - modal.media.bottom) < 1);
    else {
      assert.equal(modal.panel.width, 300);
      assert.equal(modal.panel.top, 50);
    }
    if ([390, 1440].includes(width))
      await page.screenshot({ path: out + `draft-${width}-popup.png` });
    await closePost();
    assert.equal(
      await page
        .locator('[data-instagram-post="0"]')
        .evaluate((el) => el === document.activeElement),
      true,
    );
  }
  result.interactions.push(
    "14 responsive grids and native popup layouts; footer follows grid immediately; Escape restores focus",
  );
  await visit(1440, 900);
  await openPost();
  assert.equal(await page.locator(".instagram-post-previous").isHidden(), true);
  const first = await page
    .locator("[data-instagram-media] img")
    .getAttribute("src");
  await page
    .getByRole("button", { name: "Next image in post", exact: true })
    .click();
  assert.notEqual(
    await page.locator("[data-instagram-media] img").getAttribute("src"),
    first,
  );
  await page
    .getByRole("button", { name: "Show image 7 of 7", exact: true })
    .click();
  assert.equal(
    await page
      .locator('.instagram-media-dots button[aria-current="true"]')
      .getAttribute("aria-label"),
    "Show image 7 of 7",
  );
  await page
    .getByRole("button", { name: "Next image in post", exact: true })
    .click();
  assert.equal(
    await page.locator("[data-instagram-media] img").getAttribute("src"),
    first,
  );
  await page.getByRole("button", { name: "Share", exact: true }).click();
  assert.equal(
    await page.evaluate(() => window.__sharedPost),
    snapshot.posts[0].permalink,
  );
  assert.equal(
    await page.locator(".instagram-post-status").textContent(),
    "Post link copied",
  );
  result.interactions.push(
    "Carousel arrows, dots and wrap-around work; Share copies the original permalink",
  );
  await page
    .getByRole("button", { name: "Next Instagram post", exact: true })
    .click();
  await page.waitForFunction(() => {
    const video = document.querySelector("[data-instagram-media] video");
    return video && video.currentTime > 0;
  });
  assert.equal(
    await page.locator(".instagram-post-caption").textContent(),
    snapshot.posts[1].caption,
  );
  await page.evaluate(() => {
    window.__previousVideo = document.querySelector(
      "[data-instagram-media] video",
    );
  });
  await page
    .getByRole("button", { name: "Next Instagram post", exact: true })
    .click();
  assert.equal(await page.evaluate(() => window.__previousVideo.paused), true);
  await page.keyboard.press("ArrowLeft");
  assert.equal(
    await page.locator(".instagram-post-number").textContent(),
    "2 / 11",
  );
  await page.keyboard.press("ArrowLeft");
  assert.equal(
    await page.locator(".instagram-post-number").textContent(),
    "1 / 11",
  );
  for (let i = 0; i < 10; i++)
    await page
      .getByRole("button", { name: "Next Instagram post", exact: true })
      .click();
  assert.equal(
    await page.locator(".instagram-post-number").textContent(),
    "11 / 11",
  );
  assert.equal(await page.locator(".instagram-post-next").isHidden(), true);
  await page.locator(".instagram-post-previous").focus();
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() =>
      Boolean(document.activeElement.closest("#landing-instagram-dialog")),
    ),
    true,
  );
  await page
    .getByRole("button", { name: "Close Instagram post", exact: true })
    .click();
  result.interactions.push(
    "All 11 posts navigate in order, video plays and pauses on navigation, keyboard arrows work and native focus stays in dialog",
  );
  await page.locator('[data-instagram-post="0"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForFunction(
    () => document.querySelector("#landing-instagram-dialog").open,
  );
  await page.mouse.click(5, 5);
  await page.waitForFunction(
    () => !document.querySelector("#landing-instagram-dialog").open,
  );
  result.interactions.push(
    "Enter opens a post; explicit Close and backdrop dismiss it",
  );
  await visit(390, 844);
  await openPost();
  const old = await page
    .locator("[data-instagram-media] img")
    .getAttribute("src");
  await swipe(".instagram-post-media");
  assert.notEqual(
    await page.locator("[data-instagram-media] img").getAttribute("src"),
    old,
  );
  await swipe(".instagram-post-caption");
  assert.equal(
    await page.locator(".instagram-post-number").textContent(),
    "2 / 11",
  );
  await swipe(".instagram-post-caption", 1);
  assert.equal(
    await page.locator(".instagram-post-number").textContent(),
    "1 / 11",
  );
  await page
    .locator("#landing-instagram-dialog")
    .evaluate((el) => (el.scrollTop = el.scrollHeight));
  assert.ok(
    await page.locator(".instagram-post-actions").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight;
    }),
  );
  await closePost();
  result.interactions.push(
    "Real mobile touch gestures swipe carousel media and captions swipe between posts; long popup scrolls to every action",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPost(1);
  assert.equal(
    await page
      .locator("[data-instagram-media] video")
      .evaluate((el) => el.paused && el.controls),
    true,
  );
  await closePost();
  result.interactions.push(
    "Reduced motion avoids video autoplay while retaining native controls",
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
    await fallback.locator('[data-instagram-post="0"]').getAttribute("href"),
    snapshot.posts[0].permalink,
  );
  assert.equal(
    await fallback
      .locator("#instagram")
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  await noJs.close();
  result.interactions.push(
    "No-JavaScript grid stays visible and links to the original posts",
  );
  assert.deepEqual(result.instagramRequests, []);
  assert.deepEqual(result.errors, []);
  console.log(
    `Passed ${result.views.length} Instagram layouts and ${result.interactions.length} interaction groups with no Instagram runtime requests`,
  );
} finally {
  await writeFile(
    out + "browser-results.json",
    JSON.stringify(result, null, 2),
  );
  await browser.close();
}
