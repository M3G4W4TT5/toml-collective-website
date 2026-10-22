const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document
  .querySelectorAll<HTMLElement>("[data-culture-card]")
  .forEach((card) => {
    const video = card.querySelector<HTMLVideoElement>("[data-culture-video]");
    const slides = [
      ...card.querySelectorAll<HTMLImageElement>("[data-culture-slide]"),
    ];
    let visible = false;
    let active = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const canPlay = () => visible && !reducedMotion.matches && !document.hidden;

    const sync = () => {
      clearTimeout(timer);
      if (video) {
        if (canPlay()) {
          void video.play().catch(() => {
            // The poster remains visible when autoplay is unavailable.
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

    reducedMotion.addEventListener("change", sync);
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
