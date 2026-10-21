for (const header of document.querySelectorAll<HTMLElement>(
  "[data-site-header]",
)) {
  const toggle = header.querySelector<HTMLButtonElement>(".menu-toggle");
  const nav = header.querySelector<HTMLElement>(".main-nav");
  if (!toggle || !nav) continue;

  const closeMenu = () => {
    nav.removeAttribute("data-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "Menu";
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.toggleAttribute("data-open", open);
    toggle.textContent = open ? "Close" : "Menu";
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      toggle.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      toggle.focus();
    }
  });
  nav.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).closest("a")) closeMenu();
  });
  // Follow the actual CSS state, so a new menu breakpoint needs no JS edit.
  new ResizeObserver(() => {
    if (getComputedStyle(toggle).display === "none") closeMenu();
  }).observe(header);
}
