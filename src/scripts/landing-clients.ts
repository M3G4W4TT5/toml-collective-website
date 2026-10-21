const clients = document.querySelector<HTMLElement>("[data-landing-clients]");
if (clients) {
  const button = clients.querySelector<HTMLButtonElement>("button")!;
  clients.classList.add("is-enhanced");
  button.hidden = false;
  button.addEventListener("click", () => {
    const paused = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(paused));
    button.textContent = paused ? "Resume logos" : "Pause logos";
    clients.classList.toggle("is-paused", paused);
  });
  let visible = false;
  const sync = () =>
    clients.classList.toggle("is-active", visible && !document.hidden);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(clients);
  document.addEventListener("visibilitychange", sync);
}
