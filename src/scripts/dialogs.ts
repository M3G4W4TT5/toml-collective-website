for (const dialog of document.querySelectorAll<HTMLDialogElement>(
  "[data-dialog]",
)) {
  let trigger: HTMLButtonElement | null = null;
  const video = dialog.querySelector("video");
  for (const button of document.querySelectorAll<HTMLButtonElement>(
    "[data-open-dialog]",
  )) {
    if (button.dataset.openDialog !== dialog.id) continue;
    button.addEventListener("click", () => {
      if (dialog.open) return;
      trigger = button;
      dialog.showModal();
      document.body.classList.add("scroll-lock");
      video?.load();
    });
  }
  dialog
    .querySelector<HTMLButtonElement>("[data-close-dialog]")
    ?.addEventListener("click", () => dialog.close());
  if (dialog.hasAttribute("data-dismiss-backdrop")) {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        dialog.close();
    });
  }
  dialog.addEventListener("close", () => {
    video?.pause();
    if (!document.querySelector("dialog[open]"))
      document.body.classList.remove("scroll-lock");
    trigger?.focus();
  });
}
