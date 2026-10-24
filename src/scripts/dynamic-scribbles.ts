/** Isolated prototype: actual text fragments, in surface-local SVG coordinates. */
type Box = { x: number; y: number; width: number; height: number };
type Point = { x: number; y: number; width: number };
type Mark = {
  id: string;
  elements: HTMLElement[];
  surface: HTMLElement;
  svg: SVGSVGElement;
  group: SVGGElement;
  signature: string;
  changed: number;
  boxes: Box[];
  ready: boolean;
  played: boolean;
  animation?: Animation;
  reveal?: SVGPathElement;
  defs?: SVGDefsElement;
};
const host = document.querySelector<HTMLElement>("[data-scribble-test]");
if (host) {
  const form = host.querySelector<HTMLFormElement>("[data-marker-controls]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const settings = {
    color: "#ff532f",
    thickness: 76,
    position: 58,
    irregularity: 55,
    joining: true,
    speed: 1,
  };
  const ns = "http://www.w3.org/2000/svg";
  const svgNode = <K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string> = {},
  ) => {
    const el = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) =>
      el.setAttribute(key, value),
    );
    return el;
  };
  let marks: Mark[] = [];
  let revision = 0;
  let frame = 0;
  const round = (n: number) => Math.round(n * 10) / 10;
  const noise = (n: number) =>
    (Math.sin(n * 12.9898 + 78.233) * 43758.5453) % 1;
  const pathThrough = (points: Point[]) =>
    points
      .map((p, i) => `${i ? "L" : "M"}${round(p.x)},${round(p.y)}`)
      .join(" ");

  function setup() {
    marks.forEach((mark) => mark.animation?.cancel());
    host!
      .querySelectorAll(".dynamic-marker-layer")
      .forEach((svg) => svg.remove());
    marks = [];
    host!
      .querySelectorAll<HTMLElement>("[data-marker-surface]")
      .forEach((surface) => {
        const svg = svgNode("svg", {
          class: "dynamic-marker-layer",
          "aria-hidden": "true",
          focusable: "false",
        });
        surface.prepend(svg);
        const groups = new Map<string, HTMLElement[]>();
        surface.querySelectorAll<HTMLElement>("[data-mark]").forEach((el) => {
          const key =
            settings.joining && el.dataset.markJoin
              ? el.dataset.markJoin
              : el.dataset.mark!;
          groups.set(key, [...(groups.get(key) ?? []), el]);
        });
        groups.forEach((elements, id) => {
          const group = svgNode("g", {
            "data-marker-id": id,
            visibility: "hidden",
          });
          svg.append(group);
          marks.push({
            id,
            elements,
            surface,
            svg,
            group,
            signature: "",
            changed: 0,
            boxes: [],
            ready: false,
            played: false,
          });
        });
      });
  }

  function measure(mark: Mark, origin: DOMRect): Box[] {
    const boxes: Box[] = [];
    for (const el of mark.elements) {
      // Text-node ranges avoid duplicate ancestor boxes for nested inline markup.
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const range = document.createRange();
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width > 0.5 && rect.height > 0.5)
            boxes.push({
              x: rect.left - origin.left,
              y: rect.top - origin.top,
              width: rect.width,
              height: rect.height,
            });
        }
      }
    }
    boxes.sort((a, b) => (Math.abs(a.y - b.y) < 2 ? a.x - b.x : a.y - b.y));
    return boxes.reduce<Box[]>((lines, box) => {
      const previous = lines.at(-1);
      if (
        previous &&
        Math.abs(previous.y - box.y) < 2 &&
        Math.abs(previous.height - box.height) < 2
      ) {
        previous.width =
          Math.max(previous.x + previous.width, box.x + box.width) - previous.x;
      } else lines.push({ ...box });
      return lines;
    }, []);
  }

  function draw(mark: Mark) {
    mark.animation?.cancel();
    const points: Point[] = [];
    const rough = settings.irregularity / 100;
    const seed = [...mark.id].reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0,
    );
    mark.boxes.forEach((box, line) => {
      const direction = line % 2 ? -1 : 1;
      const width = (box.height * settings.thickness) / 100;
      const pad = Math.min(5, box.height * 0.09);
      const start = direction > 0 ? box.x - pad : box.x + box.width + pad;
      const end = direction > 0 ? box.x + box.width + pad : box.x - pad;
      const y = box.y + (box.height * settings.position) / 100;
      const previous = points.at(-1);
      if (previous) {
        // A return at the edge of the two text lines, not a diagonal through copy.
        const side = direction < 0 ? 1 : -1;
        const bend = side * Math.min(6, box.height * 0.12);
        const middleY = (previous.y + y) / 2;
        for (let j = 1; j < 16; j++) {
          const t = j / 16,
            u = 1 - t;
          points.push({
            x:
              u * u * u * previous.x +
              3 * u * u * t * (previous.x + bend) +
              3 * u * t * t * (start + bend) +
              t * t * t * start,
            y:
              u * u * u * previous.y +
              3 * u * u * t * middleY +
              3 * u * t * t * middleY +
              t * t * t * y,
            width: width * (0.12 + 0.88 * Math.pow(Math.abs(2 * t - 1), 4)),
          });
        }
      }
      const steps = Math.max(8, Math.ceil(box.width / 9));
      for (let j = 0; j <= steps; j++) {
        const t = j / steps;
        points.push({
          x: start + (end - start) * t,
          y:
            y +
            rough *
              box.height *
              (0.025 * Math.sin(t * 7 + seed + line) + 0.009 * noise(j + seed)),
          width:
            width *
            (1 +
              rough *
                (0.08 * noise(j + seed + line * 19) +
                  0.06 * Math.sin(t * 9 + line))),
        });
      }
    });
    if (points.length < 2) return;
    const upper: Point[] = [],
      lower: Point[] = [];
    points.forEach((p, i) => {
      const before = points[Math.max(0, i - 1)],
        after = points[Math.min(points.length - 1, i + 1)];
      const dx = after.x - before.x,
        dy = after.y - before.y,
        length = Math.hypot(dx, dy) || 1;
      const uneven = rough * p.width * 0.045 * noise(i + seed);
      upper.push({
        x: p.x - (dy / length) * (p.width / 2 + uneven),
        y: p.y + (dx / length) * (p.width / 2 + uneven),
        width: 0,
      });
      lower.push({
        x: p.x + (dy / length) * (p.width / 2 - uneven),
        y: p.y - (dx / length) * (p.width / 2 - uneven),
        width: 0,
      });
    });
    let ribbon = `${pathThrough(upper)} ${pathThrough(lower.reverse()).replace(/^M/, "L")} Z`;
    // Small transparent dry-nib slivers; their size follows the measured line height.
    if (rough > 0)
      mark.boxes.forEach((box, i) => {
        const y =
          box.y +
          box.height *
            (settings.position / 100 + (settings.thickness / 200) * 0.79);
        const x = box.x + box.width * (0.2 + 0.13 * (i % 3));
        ribbon += ` M${x},${y} l${box.width * 0.17},${-rough * box.height * 0.015} l${-box.width * 0.08},${rough * box.height * 0.045} Z`;
      });
    const id = `dynamic-ink-${mark.id}-${revision++}`;
    const mask = svgNode("mask", {
      id,
      maskUnits: "userSpaceOnUse",
      visibility: "visible",
      x: "-100",
      y: "-100",
      width: String(mark.surface.getBoundingClientRect().width + 200),
      height: String(mark.surface.getBoundingClientRect().height + 200),
    });
    const reveal = svgNode("path", {
      d: pathThrough(points),
      fill: "none",
      stroke: "white",
      visibility: "visible", // Mask content must not inherit the waiting group’s hidden state.
      "stroke-width": String(Math.max(...points.map((p) => p.width)) * 1.8),
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      pathLength: "1",
    });
    mask.append(reveal);
    const defs = svgNode("defs");
    defs.append(mask);
    const ink = svgNode("path", {
      d: ribbon,
      fill: settings.color,
      "fill-rule": "evenodd",
      mask: `url(#${id})`,
    });
    // Keep black text legible even when the colour picker selects very dark ink.
    const rgb = settings.color
      .match(/[a-f\d]{2}/gi)!
      .map((v) => parseInt(v, 16));
    const luminance = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    ink.setAttribute("opacity", luminance < 100 ? ".42" : ".81");
    mark.defs?.remove();
    mark.svg.prepend(defs);
    mark.defs = defs;
    mark.group.replaceChildren(ink);
    mark.group.dataset.lines = String(mark.boxes.length);
    mark.reveal = reveal;
    reveal.style.strokeDasharray = "1";
    reveal.style.strokeDashoffset = "1";
    mark.ready = true;
    mark.played = false;
  }

  function play(mark: Mark) {
    if (!mark.reveal) return;
    mark.animation?.cancel();
    mark.group.setAttribute("visibility", "visible");
    mark.group.dataset.state = "drawn";
    mark.reveal.style.strokeDashoffset = "0";
    if (!reduced.matches) {
      const duration =
        Math.min(2400, Math.max(500, mark.reveal.getTotalLength() * 1.1)) /
        settings.speed;
      mark.animation = mark.reveal.animate(
        [{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }],
        { duration, easing: "linear" },
      );
    }
    const ink = mark.group.querySelector("path")!;
    if (reduced.matches) ink.removeAttribute("mask");
    else if (mark.animation)
      mark.animation.onfinish = () => ink.removeAttribute("mask");
    mark.played = true;
  }

  function tick(now: number) {
    // Small prototype: read all fragments before writing. This also catches font
    // substitutions, letter-spacing and position-only shifts ResizeObserver misses.
    const readings = marks.map((mark) => {
      const origin = mark.surface.getBoundingClientRect();
      const boxes = measure(mark, origin);
      const signature = JSON.stringify(
        [
          origin.width,
          origin.height,
          origin.left + scrollX,
          origin.top + scrollY,
          ...boxes.flatMap((b) => [b.x, b.y, b.width, b.height]),
        ].map(round),
      );
      const visible = boxes.some(
        (b) =>
          origin.top + b.y + b.height > 0 &&
          origin.top + b.y < innerHeight &&
          origin.left + b.x + b.width > 0 &&
          origin.left + b.x < innerWidth,
      );
      return { mark, origin, boxes, signature, visible };
    });
    for (const { mark, origin, boxes, signature, visible } of readings) {
      if (signature !== mark.signature) {
        mark.signature = signature;
        mark.boxes = boxes;
        mark.changed = now;
        mark.ready = false;
        mark.played = false;
        mark.animation?.cancel();
        mark.group.setAttribute("visibility", "hidden");
        mark.group.dataset.state = "settling";
        mark.svg.setAttribute(
          "viewBox",
          `0 0 ${origin.width} ${origin.height}`,
        );
      }
      if (!mark.ready && now - mark.changed >= 160 && boxes.length) draw(mark);
      if (mark.ready && !mark.played && visible) play(mark);
    }
    host!.dataset.ready = "true";
    frame = requestAnimationFrame(tick);
  }
  function invalidate() {
    marks.forEach((mark) => {
      mark.signature = "";
    });
  }
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", () => {
    const values = new FormData(form);
    settings.color = String(values.get("color"));
    for (const key of [
      "thickness",
      "position",
      "irregularity",
      "speed",
    ] as const) {
      settings[key] = Number(values.get(key));
      form.querySelector<HTMLOutputElement>(`[data-value="${key}"]`)!.value =
        `${settings[key]}${key === "speed" ? "×" : "%"}`;
    }
    const joining = values.has("joining");
    if (joining !== settings.joining) {
      settings.joining = joining;
      setup();
    }
    invalidate();
  });
  host
    .querySelector("[data-marker-replay]")!
    .addEventListener("click", invalidate);
  reduced.addEventListener("change", () => {
    marks.forEach((mark) => mark.animation?.cancel());
    invalidate();
  });
  window.addEventListener("pagehide", () => cancelAnimationFrame(frame));
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      invalidate();
      frame = requestAnimationFrame(tick);
    }
  });
  setup();
  frame = requestAnimationFrame(tick);
}
