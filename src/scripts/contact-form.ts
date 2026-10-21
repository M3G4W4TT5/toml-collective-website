for (const form of document.querySelectorAll<HTMLFormElement>(
  "[data-contact-form]",
)) {
  const params = new URLSearchParams(location.search);
  const type = form.elements.namedItem("enquiryType") as HTMLSelectElement;
  const message = form.elements.namedItem("message") as HTMLTextAreaElement;
  const queryType = params.get("type");
  if (queryType && Array.from(type.options).some((o) => o.value === queryType))
    type.value = queryType;
  const member = params.get("member");
  if (member && !message.value)
    message.value = `I’d like to discuss a project with ${member.slice(0, 200)}.\n\n`;
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const errors: Record<string, string> = {
    name: "Please add your name.",
    email: "Enter a valid email address.",
    enquiryType: "Choose an enquiry type.",
    message: "Tell us a little about what you have in mind.",
  };
  for (const [name] of Object.entries(errors)) {
    const input = form.elements.namedItem(name) as
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const error = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (error) {
      error.id = `${form.id}-${name}-error`;
      input.setAttribute("aria-describedby", error.id);
    }
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    });
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let first: HTMLElement | null = null;
    for (const [name, text] of Object.entries(errors)) {
      const input = form.elements.namedItem(name) as HTMLInputElement;
      const valid = input.checkValidity() && input.value.trim().length > 0;
      const error = form.querySelector<HTMLElement>(
        `[data-error-for="${name}"]`,
      );
      if (error) error.textContent = valid ? "" : text;
      input.setAttribute("aria-invalid", String(!valid));
      if (!valid && !first) first = input;
    }
    if (first) {
      first.focus();
      return;
    }
    if (!status) return;
    if (form.dataset.ready !== "true") {
      status.textContent =
        "Please email hello@tomlcollective.com to send your enquiry. Your message has not been sent.";
      return;
    }
    const button = form.querySelector<HTMLButtonElement>("[type=submit]");
    if (button) button.disabled = true;
    status.textContent = "Sending…";
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        mode?: string;
      };
      if (!response.ok || result.ok !== true) throw new Error("Not accepted");
      form.reset();
      status.textContent =
        result.mode === "local_mock"
          ? "Local preview complete. No email was sent."
          : "Thanks for the introduction. We’ve received your message and will be in touch.";
    } catch {
      status.textContent =
        "That didn’t send. Please try again, or email hello@tomlcollective.com.";
    } finally {
      if (button) button.disabled = false;
      const widget = form.querySelector<HTMLElement>(".cf-turnstile");
      if (widget)
        (
          window as Window & {
            turnstile?: { reset: (selector: string) => void };
          }
        ).turnstile?.reset(`#${CSS.escape(widget.id)}`);
    }
  });
}
