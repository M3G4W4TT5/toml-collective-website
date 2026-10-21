import type { InstagramPost } from "../data/instagram";

const dialog = document.querySelector<HTMLDialogElement>(
  "#landing-instagram-dialog",
);
const payload = document.querySelector<HTMLScriptElement>(
  "#landing-instagram-data",
);
if (dialog && payload) {
  const posts: InstagramPost[] = JSON.parse(payload.textContent || "[]");
  const card = dialog.querySelector<HTMLElement>(".instagram-dialog-card")!;
  const mediaContent = dialog.querySelector<HTMLElement>(
    "[data-instagram-media]",
  )!;
  const dots = dialog.querySelector<HTMLElement>(".instagram-media-dots")!;
  const mediaPrevious = dialog.querySelector<HTMLButtonElement>(
    ".instagram-media-previous",
  )!;
  const mediaNext = dialog.querySelector<HTMLButtonElement>(
    ".instagram-media-next",
  )!;
  const postPrevious = dialog.querySelector<HTMLButtonElement>(
    ".instagram-post-previous",
  )!;
  const postNext = dialog.querySelector<HTMLButtonElement>(
    ".instagram-post-next",
  )!;
  const panel = dialog.querySelector<HTMLElement>(".instagram-post-panel")!;
  const caption = dialog.querySelector<HTMLElement>(".instagram-post-caption")!;
  const author = dialog.querySelector<HTMLAnchorElement>(
    ".instagram-post-author",
  )!;
  const link = dialog.querySelector<HTMLAnchorElement>(".instagram-post-link")!;
  const number = dialog.querySelector<HTMLElement>(".instagram-post-number")!;
  const title = dialog.querySelector<HTMLElement>("#instagram-dialog-title")!;
  const share = dialog.querySelector<HTMLButtonElement>(
    ".instagram-post-share",
  )!;
  const status = dialog.querySelector<HTMLElement>(".instagram-post-status")!;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let postIndex = 0;
  let mediaIndex = 0;
  let trigger: HTMLAnchorElement | undefined;

  const pauseVideo = () => mediaContent.querySelector("video")?.pause();
  const fitMedia = () => {
    const first = posts[postIndex].media[0];
    const availableWidth =
      innerWidth <= 640 ? innerWidth - 20 : Math.max(140, innerWidth - 460);
    const availableHeight = Math.max(150, innerHeight - 150);
    const scale = Math.min(
      1,
      availableWidth / first.width,
      availableHeight / first.height,
    );
    card.style.setProperty(
      "--instagram-media-width",
      `${Math.floor(first.width * scale)}px`,
    );
    card.style.setProperty(
      "--instagram-media-height",
      `${Math.floor(first.height * scale)}px`,
    );
  };
  const showMedia = (index: number) => {
    pauseVideo();
    const post = posts[postIndex];
    mediaIndex = (index + post.media.length) % post.media.length;
    const item = post.media[mediaIndex];
    const media =
      item.type === "video"
        ? document.createElement("video")
        : document.createElement("img");
    if (media instanceof HTMLVideoElement) {
      media.src = "src" in item ? (item.src ?? "") : "";
      media.poster = item.image;
      media.controls = true;
      media.playsInline = true;
      media.preload = "metadata";
      media.setAttribute(
        "aria-label",
        item.alt || `Video ${mediaIndex + 1} of ${post.media.length}`,
      );
    } else {
      media.src = item.image;
      media.alt = item.alt;
      media.draggable = false;
    }
    mediaContent.replaceChildren(media);
    for (const [i, dot] of [...dots.querySelectorAll("button")].entries())
      dot.setAttribute("aria-current", String(i === mediaIndex));
    if (
      media instanceof HTMLVideoElement &&
      dialog.open &&
      !reducedMotion.matches
    )
      void media.play().catch(() => {});
  };
  const renderCaption = (text: string) => {
    const parts = text.split(
      /(@[\p{L}\p{N}_]+(?:\.[\p{L}\p{N}_]+)*|#[\p{L}\p{N}_]+)/gu,
    );
    caption.replaceChildren();
    for (const part of parts) {
      if (part.startsWith("@") || part.startsWith("#")) {
        const anchor = document.createElement("a");
        anchor.textContent = part;
        anchor.href = part.startsWith("@")
          ? `https://www.instagram.com/${part.slice(1)}/`
          : `https://www.instagram.com/explore/tags/${encodeURIComponent(part.slice(1))}/`;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        caption.append(anchor);
      } else caption.append(document.createTextNode(part));
    }
  };
  const showPost = (index: number) => {
    postIndex = (index + posts.length) % posts.length;
    const post = posts[postIndex];
    fitMedia();
    author.href = post.profileUrl;
    author.querySelector("img")!.src = post.avatar;
    author.querySelector("span")!.textContent = `@${post.username}`;
    link.href = post.permalink;
    title.textContent = `Instagram post ${postIndex + 1} of ${posts.length}`;
    number.textContent = `${postIndex + 1} / ${posts.length}`;
    renderCaption(post.caption);
    postPrevious.hidden = postIndex === 0;
    postNext.hidden = postIndex === posts.length - 1;
    const carousel = post.media.length > 1;
    mediaPrevious.hidden = mediaNext.hidden = dots.hidden = !carousel;
    dialog.querySelector<HTMLElement>(".instagram-media-stack")!.hidden =
      !carousel;
    dots.replaceChildren(
      ...post.media.map((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute(
          "aria-label",
          `Show image ${index + 1} of ${post.media.length}`,
        );
        button.addEventListener("click", () => showMedia(index));
        return button;
      }),
    );
    panel.scrollTop = dialog.scrollTop = 0;
    status.textContent = "";
    share.title = "Share this post";
    showMedia(0);
  };

  for (const anchor of document.querySelectorAll<HTMLAnchorElement>(
    "[data-instagram-post]",
  )) {
    anchor.addEventListener("click", (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      )
        return;
      event.preventDefault();
      trigger = anchor;
      showPost(Number(anchor.dataset.instagramPost));
      dialog.showModal();
      document.body.classList.add("scroll-lock");
      const video = mediaContent.querySelector("video");
      if (video && !reducedMotion.matches) void video.play().catch(() => {});
    });
  }
  mediaPrevious.addEventListener("click", () => showMedia(mediaIndex - 1));
  mediaNext.addEventListener("click", () => showMedia(mediaIndex + 1));
  postPrevious.addEventListener("click", () => showPost(postIndex - 1));
  postNext.addEventListener("click", () => showPost(postIndex + 1));
  dialog
    .querySelector(".instagram-post-close")!
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    pauseVideo();
    mediaContent.replaceChildren();
    if (!document.querySelector("dialog[open]"))
      document.body.classList.remove("scroll-lock");
    trigger?.focus({ preventScroll: true });
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>(
          "a[href], button, video[controls], [tabindex]",
        ),
      ].filter(
        (el) =>
          el.getClientRects().length &&
          !el.hasAttribute("disabled") &&
          el.tabIndex >= 0,
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first && last) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last && first) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      showPost(postIndex + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  for (const surface of dialog.querySelectorAll<HTMLElement>(
    "[data-instagram-swipe]",
  )) {
    let start: { x: number; y: number; time: number } | undefined;
    surface.addEventListener(
      "touchstart",
      (event) => {
        if (
          event.touches.length !== 1 ||
          (event.target instanceof Element &&
            event.target.closest("button, a, video"))
        )
          return;
        start = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          time: Date.now(),
        };
      },
      { passive: true },
    );
    surface.addEventListener(
      "touchend",
      (event) => {
        if (!start || !event.changedTouches.length) return;
        const dx = event.changedTouches[0].clientX - start.x;
        const dy = event.changedTouches[0].clientY - start.y;
        const elapsed = Date.now() - start.time;
        start = undefined;
        if (
          Math.abs(dx) < 45 ||
          Math.abs(dx) < Math.abs(dy) * 1.3 ||
          elapsed > 1000
        )
          return;
        const step = dx < 0 ? 1 : -1;
        if (
          surface.classList.contains("instagram-post-media") &&
          posts[postIndex].media.length > 1
        )
          showMedia(mediaIndex + step);
        else showPost(postIndex + step);
      },
      { passive: true },
    );
    surface.addEventListener(
      "touchcancel",
      () => {
        start = undefined;
      },
      { passive: true },
    );
  }
  share.addEventListener("click", async () => {
    try {
      if (navigator.share)
        await navigator.share({ url: posts[postIndex].permalink });
      else {
        await navigator.clipboard.writeText(posts[postIndex].permalink);
        status.textContent = "Post link copied";
        share.title = "Post link copied";
      }
    } catch {
      status.textContent =
        "Share cancelled. The Instagram link opens the original post.";
    }
  });
  window.addEventListener("resize", () => {
    if (dialog.open) fitMedia();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pauseVideo();
  });
}
