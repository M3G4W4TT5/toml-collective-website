import { useEffect, useRef } from "react";
import { MilkPourOverlay, type MilkPourController } from "./MilkPourOverlay";

/** First-entry decoration only; the real landing page remains interactive below. */
export default function LandingMilkPour() {
  const effect = useRef<MilkPourController>(null);
  const releaseCover = () =>
    document.documentElement.removeAttribute("data-landing-milk-pending");

  useEffect(() => {
    // Finish before a possible back/forward-cache snapshot, rather than resuming.
    const finish = () => {
      effect.current?.seek(1);
      releaseCover();
    };
    window.addEventListener("pagehide", finish);
    return () => window.removeEventListener("pagehide", finish);
  }, []);

  return (
    <MilkPourOverlay
      ref={effect}
      autoPlay={false}
      onReady={(reducedMotion) => {
        if (
          !reducedMotion &&
          document.documentElement.hasAttribute("data-landing-milk-pending")
        ) {
          effect.current?.setSpeed(1.5);
          effect.current?.replay();
        }
        releaseCover();
      }}
      onError={releaseCover}
    />
  );
}
