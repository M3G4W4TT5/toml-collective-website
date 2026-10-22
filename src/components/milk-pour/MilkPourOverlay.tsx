import {
  forwardRef,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import maskSource from "../../assets/milk-pour/carton-mask.svg?raw";
import { DURATION_MS, evaluateScene } from "./animation";
import { clamp } from "./geometry";
import "../../styles/components/milk-pour.css";

export interface MilkPourController {
  replay(): void;
  play(): void;
  pause(): void;
  seek(progress: number): void;
  setSpeed(speed: number): void;
}
interface Props {
  autoPlay?: boolean;
  onUpdate?: (progress: number, playing: boolean) => void;
  onReady?: (reducedMotion: boolean) => void;
  onError?: () => void;
}

/** Decorative, reusable viewport effect. The harness owns content and controls. */
export const MilkPourOverlay = forwardRef<MilkPourController, Props>(
  function MilkPourOverlay(props, ref) {
    const id = `milk-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
    const artwork = maskSource
      .replace(/^.*?<svg[^>]*>/s, "")
      .replace(/<\/svg>\s*$/, "")
      .replace(/id="([^"]+)"/g, `id="${id}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`);
    const svg = useRef<SVGSVGElement>(null);
    const mask = useRef<SVGMaskElement>(null);
    const carton = useRef<SVGGElement>(null);
    const surface = useRef<SVGPathElement>(null);
    const stream = useRef<SVGPathElement>(null);
    const crests = useRef<(SVGPathElement | null)[]>([]);
    const droplets = useRef<(SVGPathElement | null)[]>([]);
    const callbacks = useRef(props);
    callbacks.current = props;
    const controller = useRef<MilkPourController | null>(null);
    useImperativeHandle(
      ref,
      () => ({
        replay: () => controller.current?.replay(),
        play: () => controller.current?.play(),
        pause: () => controller.current?.pause(),
        seek: (p) => controller.current?.seek(p),
        setSpeed: (s) => controller.current?.setSpeed(s),
      }),
      [],
    );

    useLayoutEffect(() => {
      let frame = 0;
      let progress = 1;
      let playing = false;
      let speed = 1;
      let previousTime = 0;
      let lastNotification = 0;
      let width = 1;
      let height = 1;
      let disposed = false;
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");

      const notify = () => callbacks.current.onUpdate?.(progress, playing);
      const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      };
      const failOpen = () => {
        stop();
        playing = false;
        progress = 1;
        if (svg.current) svg.current.style.display = "none";
        document.documentElement.removeAttribute("data-milk-boot");
        notify();
        callbacks.current.onError?.();
      };
      const renderAt = (p: number) => {
        progress = clamp(p);
        const root = svg.current;
        if (!root || disposed) return;
        root.dataset.progress = progress.toFixed(5);
        root.style.display = progress >= 1 ? "none" : "block";
        if (progress >= 1) return;
        const scene = evaluateScene(progress, width, height);
        root.setAttribute("viewBox", `0 0 ${width} ${height}`);
        mask.current?.setAttribute("width", String(width + 8));
        mask.current?.setAttribute("height", String(height + 8));
        carton.current?.setAttribute("transform", scene.transform);
        surface.current?.setAttribute("d", scene.surface);
        stream.current?.setAttribute("d", scene.stream);
        scene.crests.forEach((path, i) =>
          crests.current[i]?.setAttribute("d", path),
        );
        scene.droplets.forEach((drop, i) => {
          droplets.current[i]?.setAttribute("d", drop.path);
          droplets.current[i]?.setAttribute("transform", drop.transform);
        });
      };
      const tick = (now: number) => {
        frame = 0;
        if (!playing || disposed || document.hidden) return;
        try {
          const elapsed = previousTime ? now - previousTime : 0;
          previousTime = now;
          renderAt(progress + (elapsed * speed) / DURATION_MS);
          if (progress >= 1) {
            playing = false;
            stop();
            notify();
          } else {
            if (now - lastNotification > 50) {
              notify();
              lastNotification = now;
            }
            frame = requestAnimationFrame(tick);
          }
        } catch {
          failOpen();
        }
      };
      const start = () => {
        if (!document.hidden && !frame && playing)
          frame = requestAnimationFrame(tick);
      };
      const resize = () => {
        try {
          const bounds = svg.current?.getBoundingClientRect();
          width = Math.max(1, bounds?.width || window.innerWidth);
          height = Math.max(1, bounds?.height || window.innerHeight);
          // A completed SVG is display:none; measure the viewport instead.
          renderAt(progress);
        } catch {
          failOpen();
        }
      };
      const replay = () => {
        stop();
        renderAt(0);
        resize();
        playing = true;
        notify();
        start();
      };
      controller.current = {
        replay,
        play() {
          if (progress >= 1) {
            replay();
            return;
          }
          playing = true;
          previousTime = 0;
          notify();
          start();
        },
        pause() {
          playing = false;
          stop();
          notify();
        },
        seek(p) {
          stop();
          playing = false;
          renderAt(p);
          notify();
        },
        setSpeed(s) {
          speed = clamp(s, 0.1, 4);
          previousTime = 0;
        },
      };
      const visibility = () => {
        stop();
        if (!document.hidden) start();
      };
      const preference = () => {
        if (media.matches) {
          playing = false;
          stop();
          renderAt(1);
          notify();
        }
        callbacks.current.onReady?.(media.matches);
      };
      try {
        resize();
        if (!media.matches && callbacks.current.autoPlay !== false) replay();
        callbacks.current.onReady?.(media.matches);
        document.dispatchEvent(new Event("milk-pour:ready"));
        notify();
      } catch {
        failOpen();
      }
      window.addEventListener("resize", resize);
      window.visualViewport?.addEventListener("resize", resize);
      document.addEventListener("visibilitychange", visibility);
      media.addEventListener("change", preference);
      return () => {
        disposed = true;
        stop();
        controller.current = null;
        window.removeEventListener("resize", resize);
        window.visualViewport?.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", visibility);
        media.removeEventListener("change", preference);
        document.documentElement.removeAttribute("data-milk-boot");
      };
    }, []);

    return (
      <svg
        ref={svg}
        className="milk-pour-overlay"
        aria-hidden="true"
        focusable="false"
        style={{ display: "none" }}
      >
        <defs>
          <mask
            ref={mask}
            id={`${id}-reveal`}
            x="-4"
            y="-4"
            width="1928"
            height="1088"
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            style={{ maskType: "luminance" }}
          >
            <rect
              x="-4"
              y="-4"
              width="calc(100% + 8px)"
              height="calc(100% + 8px)"
              fill="white"
            />
            <g ref={carton} dangerouslySetInnerHTML={{ __html: artwork }} />
            <g fill="black">
              <path ref={surface} data-milk-surface="" />
              <path ref={stream} data-milk-stream="" />
              {[0, 1].map((i) => (
                <path
                  key={i}
                  ref={(el) => {
                    crests.current[i] = el;
                  }}
                  data-milk-crest={i}
                />
              ))}
              {Array.from({ length: 42 }, (_, i) => (
                <path
                  key={i}
                  ref={(el) => {
                    droplets.current[i] = el;
                  }}
                  data-milk-drop={i}
                />
              ))}
            </g>
          </mask>
        </defs>
        <rect
          x="-4"
          y="-4"
          width="calc(100% + 8px)"
          height="calc(100% + 8px)"
          fill="black"
          mask={`url(#${id}-reveal)`}
        />
      </svg>
    );
  },
);
