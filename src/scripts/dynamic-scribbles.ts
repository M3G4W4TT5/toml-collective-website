import { markerTexture } from "./marker-texture";

/** Isolated prototype: actual text fragments, in surface-local SVG coordinates. */
type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  owner: number;
};
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
  animations: Animation[];
  reveals: SVGPathElement[];
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
    texture: 30,
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
    marks.forEach((mark) =>
      mark.animations.forEach((animation) => animation.cancel()),
    );
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
            animations: [],
            reveals: [],
          });
        });
      });
  }

  function measure(mark: Mark, origin: DOMRect): Box[] {
    const boxes: Box[] = [];
    for (const [owner, el] of mark.elements.entries()) {
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
              owner,
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
    mark.animations.forEach((animation) => animation.cancel());
    const rough = settings.irregularity / 100;
    const seed = [...mark.id].reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0,
    );
    const strokes: Point[][] = [];
    const linePoints = (box: Box, line: number, reverse = false): Point[] => {
      const width = (box.height * settings.thickness) / 100;
      const pad = Math.min(5, box.height * 0.09);
      const start = reverse ? box.x + box.width + pad : box.x - pad;
      const end = reverse ? box.x - pad : box.x + box.width + pad;
      const steps = Math.max(8, Math.ceil(box.width / 9));
      return Array.from({ length: steps + 1 }, (_, j) => {
        const t = j / steps;
        return {
          x: start + (end - start) * t,
          y:
            box.y +
            (box.height * settings.position) / 100 +
            rough *
              box.height *
              (0.025 * Math.sin(t * 7 + seed + line) + 0.009 * noise(j + seed)),
          width:
            width *
            (1 +
              rough *
                (0.08 * noise(j + seed + line * 19) +
                  0.06 * Math.sin(t * 9 + line))),
        };
      });
    };
    for (let line = 0; line < mark.boxes.length; line++) {
      const box = mark.boxes[line],
        next = mark.boxes[line + 1];
      // Natural wrapping is a pen lift. Only explicitly grouped, distinct phrases
      // in the same column may connect, along their shared outside left edge.
      const join =
        next &&
        box.owner !== next.owner &&
        mark.elements.length > 1 &&
        Math.abs(box.x - next.x) < 2 &&
        next.y >= box.y + box.height;
      if (!join) {
        strokes.push(linePoints(box, line));
        continue;
      }
      const points = linePoints(box, line, true);
      const following = linePoints(next, line + 1);
      const start = points.at(-1)!,
        end = following[0];
      const outside = Math.min(start.x, end.x) - Math.min(8, box.height * 0.18);
      for (let j = 1; j < 20; j++) {
        const t = j / 20,
          u = 1 - t;
        points.push({
          x:
            u * u * u * start.x +
            3 * u * u * t * outside +
            3 * u * t * t * outside +
            t * t * t * end.x,
          y:
            u * u * u * start.y +
            3 * u * u * t * start.y +
            3 * u * t * t * end.y +
            t * t * t * end.y,
          width:
            Math.min(start.width, end.width) *
            (0.15 + 0.85 * Math.pow(Math.abs(2 * t - 1), 3)),
        });
      }
      strokes.push([...points, ...following]);
      line++;
    }
    const ribbon = strokes
      .map((points) => {
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
        return `${pathThrough(upper)} ${pathThrough(lower.reverse()).replace(/^M/, "L")} Z`;
      })
      .join(" ");
    const id = `dynamic-ink-${mark.id}-${revision++}`;
    const bounds = mark.surface.getBoundingClientRect();
    const maskAttributes = {
      maskUnits: "userSpaceOnUse",
      visibility: "visible",
      x: "-100",
      y: "-100",
      width: String(bounds.width + 200),
      height: String(bounds.height + 200),
    };
    const mask = svgNode("mask", { id, ...maskAttributes });
    mark.reveals = strokes.map((points) => {
      const reveal = svgNode("path", {
        d: pathThrough(points),
        fill: "none",
        stroke: "white",
        visibility: "visible",
        "stroke-width": String(Math.max(...points.map((p) => p.width)) * 1.25),
        "stroke-linecap": "butt",
        "stroke-linejoin": "round",
        pathLength: "1",
      });
      reveal.style.strokeDasharray = "1";
      reveal.style.strokeDashoffset = "1";
      mask.append(reveal);
      return reveal;
    });
    const defs = svgNode("defs");
    defs.append(mask);
    const ink = svgNode("path", {
      d: ribbon,
      fill: settings.color,
      "fill-rule": "nonzero",
      mask: `url(#${id})`,
    });
    // A separate luminance mask removes ink, revealing the actual background.
    // Coherent multi-scale fields replace repeated geometric cutouts.
    const texture = settings.texture / 100;
    mark.group.removeAttribute("mask");
    if (texture > 0) {
      const grain = svgNode("mask", { id: `${id}-grain`, ...maskAttributes });
      grain.append(
        svgNode("rect", {
          x: "-100",
          y: "-100",
          width: String(bounds.width + 200),
          height: String(bounds.height + 200),
          fill: "white",
        }),
      );
      mark.boxes.forEach((box, line) => {
        const height = ((box.height * settings.thickness) / 100) * 1.25 + 8;
        const width = box.width + 16;
        grain.append(
          svgNode("image", {
            x: String(box.x - 8),
            y: String(
              box.y + (box.height * settings.position) / 100 - height / 2,
            ),
            width: String(width),
            height: String(height),
            preserveAspectRatio: "none",
            href: markerTexture(
              width,
              height,
              seed * 65537 + line * 997,
              texture,
            ),
            "data-texture-field": String(line),
          }),
        );
      });
      defs.append(grain);
      mark.group.setAttribute("mask", `url(#${id}-grain)`);
    }
    const rgb = settings.color
      .match(/[a-f\d]{2}/gi)!
      .map((v) => parseInt(v, 16));
    ink.setAttribute(
      "opacity",
      0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2] < 100 ? ".42" : ".81",
    );
    mark.defs?.remove();
    mark.svg.prepend(defs);
    mark.defs = defs;
    mark.group.replaceChildren(ink);
    mark.group.dataset.lines = String(mark.boxes.length);
    mark.group.dataset.strokes = String(strokes.length);
    mark.ready = true;
    mark.played = false;
  }

  function play(mark: Mark) {
    mark.animations.forEach((animation) => animation.cancel());
    mark.animations = [];
    mark.group.setAttribute("visibility", "visible");
    mark.group.dataset.state = "drawn";
    const ink = mark.group.querySelector("path")!;
    if (reduced.matches) ink.removeAttribute("mask");
    else {
      const lengths = mark.reveals.map((path) => path.getTotalLength());
      const total = lengths.reduce((sum, length) => sum + length, 0);
      const duration =
        Math.min(3000, Math.max(500, total * 1.1)) / settings.speed;
      let delay = 0;
      mark.reveals.forEach((reveal, i) => {
        const part = (duration * lengths[i]) / total;
        const animation = reveal.animate(
          [{ strokeDashoffset: "1" }, { strokeDashoffset: "0" }],
          { duration: part, delay, easing: "linear", fill: "forwards" },
        );
        mark.animations.push(animation);
        delay += part;
      });
      const animations = [...mark.animations];
      Promise.all(animations.map((animation) => animation.finished))
        .then(() => {
          ink.removeAttribute("mask");
          animations.forEach((animation) => animation.cancel());
        })
        .catch(() => {
          /* Reflow/replay cancels the previous reveal. */
        });
    }
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
        mark.animations.forEach((animation) => animation.cancel());
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
      "texture",
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
    marks.forEach((mark) =>
      mark.animations.forEach((animation) => animation.cancel()),
    );
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
