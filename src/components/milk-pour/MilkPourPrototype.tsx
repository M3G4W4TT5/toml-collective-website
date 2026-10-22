import { useRef, useState } from "react";
import { MilkPourOverlay, type MilkPourController } from "./MilkPourOverlay";

export default function MilkPourPrototype() {
  const effect = useRef<MilkPourController>(null);
  const [progress, setProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [failed, setFailed] = useState(false);
  const [background, setBackground] = useState("white");
  const [showContent, setShowContent] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const revealed = progress >= 0.985 || showContent;

  return (
    <main
      className="milk-prototype"
      data-background={background}
      data-revealed={revealed}
    >
      <div className="milk-underlay" />
      <section
        className="milk-sample"
        aria-hidden={!revealed}
        inert={!revealed}
      >
        <a className="milk-wordmark" href="/">
          TOML.
        </a>
        <div className="milk-sample-body">
          <p className="milk-eyebrow">Milk-pour prototype / 01</p>
          <h1>
            A fresh
            <br />
            perspective.
          </h1>
          <p>The page is yours.</p>
          <a className="milk-sample-link" href="#prototype-controls">
            Try another pour <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="milk-sample-note">TOML Collective · Motion study</p>
      </section>
      <MilkPourOverlay
        ref={effect}
        onUpdate={(p, active) => {
          setProgress(p);
          setPlaying(active);
        }}
        onReady={(preference) => {
          setReduced(preference);
          setReady(true);
          setControlsOpen(window.innerWidth >= 768);
        }}
        onError={() => {
          setFailed(true);
          setReady(false);
        }}
      />
      <details
        className="milk-controls"
        id="prototype-controls"
        aria-label="Milk pour controls"
        open={controlsOpen}
        onToggle={(event) => setControlsOpen(event.currentTarget.open)}
      >
        <summary className="milk-controls-title">
          <strong>Milk pour</strong>
          <span role="status">
            {failed
              ? "Preview unavailable"
              : reduced
                ? "Reduced motion"
                : playing
                  ? "Playing"
                  : progress >= 1
                    ? "Revealed"
                    : "Paused"}
          </span>
          <output aria-label="Animation progress">
            {Math.round(progress * 100)}%
          </output>
          <span className="milk-controls-disclosure">Controls</span>
        </summary>
        <div className="milk-transport">
          <button
            type="button"
            disabled={!ready}
            onClick={() => effect.current?.replay()}
          >
            Replay
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={() =>
              playing ? effect.current?.pause() : effect.current?.play()
            }
          >
            {playing ? "Pause" : "Play"}
          </button>
          <label className="milk-speed">
            Speed
            <select
              aria-label="Speed"
              defaultValue="1"
              disabled={!ready}
              onChange={(event) =>
                effect.current?.setSpeed(Number(event.target.value))
              }
            >
              <option value="0.25">0.25×</option>
              <option value="0.5">0.5×</option>
              <option value="1">1×</option>
              <option value="1.5">1.5×</option>
              <option value="2">2×</option>
            </select>
          </label>
        </div>
        <label className="milk-scrubber">
          Timeline
          <input
            aria-label="Timeline"
            type="range"
            min="0"
            max="1000"
            step="1"
            value={Math.round(progress * 1000)}
            disabled={!ready}
            onChange={(event) =>
              effect.current?.seek(Number(event.target.value) / 1000)
            }
          />
        </label>
        <div className="milk-debug">
          <label>
            Background
            <select
              aria-label="Background"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
            >
              <option value="white">White</option>
              <option value="checkerboard">Checkerboard</option>
              <option value="colour">Cobalt</option>
            </select>
          </label>
          <label className="milk-content-toggle">
            <input
              type="checkbox"
              checked={showContent}
              onChange={(event) => setShowContent(event.target.checked)}
            />
            Show page during pour
          </label>
        </div>
        <noscript>
          <p>JavaScript is disabled. The page remains fully revealed.</p>
        </noscript>
      </details>
    </main>
  );
}
