const carousel = document.querySelector<HTMLElement>(
  "[data-landing-testimonials]",
);
if (carousel) {
  const slides = [
    ...carousel.querySelectorAll<HTMLElement>("[data-testimonial-slide]"),
  ];
  const controls = carousel.querySelector<HTMLElement>(
    ".landing-testimonial-controls",
  )!;
  const count = carousel.querySelector<HTMLElement>(
    "[data-testimonial-count]",
  )!;
  const previous = carousel.querySelector<HTMLButtonElement>(
    "[data-testimonial-previous]",
  )!;
  const next = carousel.querySelector<HTMLButtonElement>(
    "[data-testimonial-next]",
  )!;
  let current = 0;
  const show = (index: number) => {
    current = (index + slides.length) % slides.length;
    for (const [i, slide] of slides.entries()) slide.hidden = i !== current;
    count.textContent = `${current + 1} / ${slides.length}`;
  };
  carousel.classList.add("is-enhanced");
  controls.hidden = false;
  show(0);
  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(current + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  const surface = carousel.querySelector<HTMLElement>(
    ".landing-testimonial-slides",
  )!;
  let start: { x: number; y: number; time: number } | undefined;
  surface.addEventListener(
    "touchstart",
    (event) => {
      start =
        event.touches.length === 1
          ? {
              x: event.touches[0].clientX,
              y: event.touches[0].clientY,
              time: Date.now(),
            }
          : undefined;
    },
    { passive: true },
  );
  surface.addEventListener(
    "touchend",
    (event) => {
      if (!start || !event.changedTouches.length) return;
      const dx = event.changedTouches[0].clientX - start.x,
        dy = event.changedTouches[0].clientY - start.y,
        elapsed = Date.now() - start.time;
      start = undefined;
      if (
        Math.abs(dx) > 45 &&
        Math.abs(dx) > Math.abs(dy) * 1.3 &&
        elapsed < 1000
      )
        show(current + (dx < 0 ? 1 : -1));
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
