const clients = document.querySelector<HTMLElement>("[data-landing-clients]");
if (clients) {
  clients.classList.add("is-enhanced");
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
