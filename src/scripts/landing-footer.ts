const footer = document.querySelector<HTMLElement>("[data-landing-footer]");
const reveal = document.querySelector<HTMLElement>(
  "[data-landing-footer-reveal]",
);
const draft = document.querySelector<HTMLElement>("[data-landing-draft]");
if (footer && reveal && draft) {
  const clocks = [
    ...footer.querySelectorAll<HTMLTimeElement>("[data-landing-time]"),
  ].map((element) => ({
    element,
    formatter: new Intl.DateTimeFormat("en-GB", {
      timeZone: element.dataset.timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }),
  }));
  let timer: number | undefined;
  const updateClocks = () => {
    const now = new Date();
    for (const { element, formatter } of clocks) {
      element.textContent = formatter.format(now);
      element.dateTime = now.toISOString();
    }
  };
  const syncClocks = () => {
    window.clearInterval(timer);
    if (document.hidden || footer.dataset.visible !== "true") return;
    updateClocks();
    timer = window.setInterval(updateClocks, 1000);
  };
  updateClocks();
  const updateVisibility = () => {
    const visible = reveal.getBoundingClientRect().top < window.innerHeight;
    if (footer.dataset.visible === String(visible)) return;
    footer.dataset.visible = String(visible);
    syncClocks();
  };
  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility);
  window.addEventListener("pageshow", updateVisibility);
  updateVisibility();
  document.addEventListener("visibilitychange", syncClocks);
  window.addEventListener("pageshow", syncClocks);
  const heroSpacer = draft.querySelector<HTMLElement>(".landing-hero-spacer");
  if (heroSpacer) {
    const heroVisibility = new IntersectionObserver(
      ([entry]) => {
        draft.dataset.heroCovered = String(!entry.isIntersecting);
      },
      { rootMargin: "-82px 0px 0px 0px" },
    );
    heroVisibility.observe(heroSpacer);
  }
  footer.addEventListener("focusin", () => {
    // Reveal keyboard-focused links from beneath the foreground content.
    if (reveal.getBoundingClientRect().top > 0) {
      reveal.scrollIntoView({ behavior: "instant", block: "start" });
    }
  });
}
