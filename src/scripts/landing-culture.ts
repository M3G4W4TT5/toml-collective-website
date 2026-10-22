const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document
  .querySelectorAll<HTMLElement>("[data-culture-card]")
  .forEach((card) => {
    const video = card.querySelector<HTMLVideoElement>("[data-culture-video]");
    const slides = [
      ...card.querySelectorAll<HTMLImageElement>("[data-culture-slide]"),
    ];
    const button = card.querySelector<HTMLButtonElement>(
      "[data-culture-motion]",
    );
    if (!button) return;

    const label = video ? "TOML Journal video" : "House of TOML slideshow";
    let paused = reducedMotion.matches;
    let visible = false;
    let active = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const canPlay = () => visible && !paused && !document.hidden;

    const sync = () => {
      clearTimeout(timer);
      button.textContent = paused ? "Play" : "Pause";
      button.setAttribute(
        "aria-label",
        `${paused ? "Play" : "Pause"} ${label}`,
      );
      if (video) {
        if (canPlay()) {
          void video.play().catch(() => {
            if (!canPlay()) return;
            paused = true;
            sync();
          });
        } else video.pause();
      } else if (canPlay()) {
        timer = setTimeout(async () => {
          const next = (active + 1) % slides.length;
          try {
            await slides[next].decode();
            if (!canPlay()) return;
            slides[active].dataset.active = "false";
            slides[active].setAttribute("aria-hidden", "true");
            slides[next].dataset.active = "true";
            slides[next].setAttribute("aria-hidden", "false");
            active = next;
          } catch {
            // Keep the current photograph visible if the next image cannot load.
          }
          sync();
        }, 5000);
      }
    };

    button.hidden = false;
    button.addEventListener("click", () => {
      paused = !paused;
      sync();
    });
    reducedMotion.addEventListener("change", () => {
      paused = reducedMotion.matches;
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    ).observe(card);
    sync();
  });
