const root = document.querySelector<HTMLElement>("[data-landing-draft]");
if (root) {
  const header = root.querySelector<HTMLElement>("[data-landing-header]")!;
  const menu = root.querySelector<HTMLButtonElement>("[data-landing-menu]")!;
  const navigation = root.querySelector<HTMLElement>("#landing-navigation")!;
  const navigationHome = navigation.parentElement!;
  const menuDialog = root.querySelector<HTMLDialogElement>(
    "#landing-mobile-menu",
  )!;
  const menuNavigation = menuDialog.querySelector<HTMLElement>(
    "[data-landing-menu-navigation]",
  )!;
  const menuClose = menuDialog.querySelector<HTMLButtonElement>(
    "[data-landing-menu-close]",
  )!;
  const cases = menuDialog.querySelector<HTMLElement>("#landing-menu-cases");
  const previousCase = menuDialog.querySelector<HTMLButtonElement>(
    "[data-landing-cases-previous]",
  );
  const nextCase = menuDialog.querySelector<HTMLButtonElement>(
    "[data-landing-cases-next]",
  );
  const main = root.querySelector<HTMLElement>("main")!;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let previousY = Math.max(0, window.scrollY);
  let menuOpen = false;
  let pendingMilkSwap = false;
  let revealAfterHide = false;

  const showHeader = (visible: boolean) => {
    header.dataset.hidden = String(!visible);
    header.inert = !visible;
  };
  const completeHiddenLogoSwap = () => {
    if (
      !pendingMilkSwap ||
      window.scrollY <= 0.5 ||
      header.dataset.hidden !== "true"
    )
      return;
    if (Number(getComputedStyle(header).opacity) !== 0) return;
    pendingMilkSwap = false;
    header.dataset.logo = "milk";
    if (revealAfterHide || menuOpen) showHeader(true);
  };
  const hideHeader = () => {
    pendingMilkSwap = header.dataset.logo !== "milk";
    showHeader(false);
    completeHiddenLogoSwap();
  };
  const restoreTopHeader = () => {
    pendingMilkSwap = false;
    revealAfterHide = false;
    header.dataset.logo = "wordmark";
    showHeader(true);
  };
  header.addEventListener("transitionend", (event) => {
    if (event.target === header && event.propertyName === "opacity")
      completeHiddenLogoSwap();
  });
  reducedMotion.addEventListener("change", completeHiddenLogoSwap);
  const updateHeader = () => {
    const y = Math.max(0, window.scrollY);
    header.dataset.scrolled = String(y > 0.5);
    if (y <= 0.5) restoreTopHeader();
    else if (!menuOpen && y !== previousY) {
      revealAfterHide = y < previousY;
      if (pendingMilkSwap || !revealAfterHide || header.dataset.logo !== "milk")
        hideHeader();
      else showHeader(true);
    }
    previousY = y;
  };
  header.dataset.scrolled = String(previousY > 0.5);
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("pageshow", () => {
    previousY = Math.max(0, window.scrollY);
    header.dataset.scrolled = String(previousY > 0.5);
    if (previousY <= 0.5) restoreTopHeader();
    else if (header.dataset.logo === "milk") showHeader(true);
    else {
      revealAfterHide = true;
      hideHeader();
    }
  });

  let closeTimer: number | undefined;
  const finishClosingMenu = () => {
    window.clearTimeout(closeTimer);
    menuDialog.close();
  };
  const closeMenu = (immediate = false) => {
    if (!menuOpen) return;
    window.clearTimeout(closeTimer);
    menu.setAttribute("aria-expanded", "false");
    menuDialog.dataset.open = "false";
    if (immediate || reducedMotion.matches) finishClosingMenu();
    else closeTimer = window.setTimeout(finishClosingMenu, 750);
  };
  menu.addEventListener("click", () => {
    window.clearTimeout(closeTimer);
    menuOpen = true;
    menu.setAttribute("aria-expanded", "true");
    menuNavigation.append(navigation);
    main.inert = true;
    document.body.classList.add("scroll-lock");
    showHeader(true);
    menuDialog.showModal();
    // Commit the offscreen position before starting the source's panel slide.
    menuDialog.getBoundingClientRect();
    getComputedStyle(menuDialog, "::backdrop").opacity;
    menuDialog.dataset.open = "true";
    menuClose.focus({ preventScroll: true });
    updateCases();
  });
  menuClose.addEventListener("click", () => closeMenu());
  menuDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMenu();
  });
  menuDialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [
      ...menuDialog.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex="0"]',
      ),
    ];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  menuDialog.addEventListener("transitionend", (event) => {
    if (
      event.target === menuDialog &&
      event.propertyName === "transform" &&
      menuDialog.dataset.open === "false"
    )
      finishClosingMenu();
  });
  menuDialog.addEventListener("close", () => {
    window.clearTimeout(closeTimer);
    menuOpen = false;
    menuDialog.dataset.open = "false";
    menu.setAttribute("aria-expanded", "false");
    navigationHome.append(navigation);
    document.body.classList.remove("scroll-lock");
    main.inert = false;
    if (getComputedStyle(menu).display !== "none")
      menu.focus({ preventScroll: true });
  });
  navigation.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (menuOpen && getComputedStyle(menu).display === "none") closeMenu(true);
  });
  reducedMotion.addEventListener("change", () => {
    if (
      menuOpen &&
      menuDialog.dataset.open === "false" &&
      reducedMotion.matches
    )
      finishClosingMenu();
  });

  const updateCases = () => {
    if (!cases || !previousCase || !nextCase) return;
    previousCase.disabled = cases.scrollLeft <= 1;
    const lastCard = cases.lastElementChild as HTMLElement | null;
    nextCase.disabled =
      !lastCard ||
      cases.scrollLeft >=
        Math.min(
          lastCard.offsetLeft - 35,
          cases.scrollWidth - cases.clientWidth,
        ) -
          1;
  };
  const stepCase = (direction: number) => {
    if (!cases) return;
    const cards = [...cases.querySelectorAll<HTMLElement>("li")];
    const current = cards.reduce(
      (closest, card, index) =>
        Math.abs(card.offsetLeft - 35 - cases.scrollLeft) <
        Math.abs(cards[closest].offsetLeft - 35 - cases.scrollLeft)
          ? index
          : closest,
      0,
    );
    const target =
      cards[Math.max(0, Math.min(cards.length - 1, current + direction))];
    if (target)
      cases.scrollTo({
        left: target.offsetLeft - 35,
        behavior: reducedMotion.matches ? "instant" : "smooth",
      });
  };
  previousCase?.addEventListener("click", () => stepCase(-1));
  nextCase?.addEventListener("click", () => stepCase(1));
  cases?.addEventListener("scroll", updateCases, { passive: true });
  window.addEventListener("resize", updateCases);

  root.dataset.enhanced = "true";
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -120px 0px" },
  );
  root
    .querySelectorAll("[data-landing-reveal]")
    .forEach((el) => reveal.observe(el));

  // Adapted from the reference's pushBeyondReality.js. Mark the sequence as
  // started before scheduling it, so repeated scroll events cannot replay it.
  const story = root.querySelector<HTMLElement>(".landing-stories")!;
  const storyLines = [
    ...story.querySelectorAll<HTMLElement>(".landing-story-line"),
  ];
  let storyStarted = false;
  const fadeInElement = (element: HTMLElement, delay: number) => {
    window.setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateX(0)";
      element.style.filter = "blur(0)";
    }, delay);
  };
  const revealStory = () => {
    if (storyStarted) return;
    const rect = story.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.75 || rect.bottom < 0) return;
    storyStarted = true;
    window.removeEventListener("scroll", revealStory);
    window.removeEventListener("resize", revealStory);
    window.setTimeout(
      () => {
        storyLines.forEach((line, index) => fadeInElement(line, index * 200));
      },
      reducedMotion.matches ? 0 : 300,
    );
  };
  window.addEventListener("scroll", revealStory, { passive: true });
  window.addEventListener("resize", revealStory);
  revealStory();

  const preview = root.querySelector<HTMLVideoElement>(
    "[data-landing-preview]",
  )!;
  const dialog = root.querySelector<HTMLDialogElement>("#landing-showreel")!;
  const player = dialog.querySelector<HTMLVideoElement>("video")!;
  let reelVisible = false;
  const syncPreview = () => {
    if (reducedMotion.matches || !reelVisible || dialog.open || document.hidden)
      preview.pause();
    else void preview.play().catch(() => {});
  };
  const visibility = new IntersectionObserver(
    ([entry]) => {
      reelVisible = entry.isIntersecting;
      syncPreview();
    },
    { threshold: 0 },
  );
  visibility.observe(preview);
  reducedMotion.addEventListener("change", syncPreview);
  document.addEventListener("visibilitychange", syncPreview);
  dialog.addEventListener("toggle", () => {
    syncPreview();
    if (dialog.open) void player.play().catch(() => {});
  });
  dialog.addEventListener("close", syncPreview);
}
