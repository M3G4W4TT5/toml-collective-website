import {
  below,
  cartonBounds,
  cartonTransform,
  clamp,
  curve,
  mix,
  openingAt,
  smooth,
  type Pose,
} from "./geometry";

export const DURATION_MS = 2500;
export const IMPACT = 0.14;
const TAU = Math.PI * 2;
const n = (v: number) => Number(v.toFixed(3));
const xy = (x: number, y: number) => `${n(x)} ${n(y)}`;
const FILL_KEYS = [
  [0, 0],
  [0.14, 0],
  [0.22, 0.095],
  [0.5, 0.472],
  [0.7, 0.68],
  [0.83, 0.83],
  [0.94, 0.941],
  [1, 1.035],
] as const;

// Low, outward-spreading splash with deep curved gaps and short rounded tips.
// The reference's thin base stays near the waterline, rather than forming a mound.
const SPLASH_CURVES = [
  [31, 56, 20, 44, 22, 32],
  [23, 20, 37, 21, 39, 30],
  [40, 39, 33, 44, 38, 51],
  [43, 64, 53, 62, 57, 55],
  [63, 43, 59, 32, 55, 24],
  [51, 17, 51, 10, 59, 9],
  [67, 8, 69, 19, 72, 25],
  [78, 38, 70, 56, 79, 61],
  [84, 64, 87, 64, 92, 63],
  [100, 63, 105, 65, 112, 62],
  [122, 58, 126, 49, 130, 42],
  [134, 41, 130, 35, 134, 31],
  [138, 24, 147, 28, 147, 35],
  [148, 41, 138, 46, 139, 54],
  [141, 65, 153, 65, 160, 59],
  [164, 56, 164, 51, 170, 51],
  [180, 51, 180, 60, 175, 64],
  [168, 70, 166, 73, 177, 74],
];

// Stable, seeded events. Nothing random is evaluated during rendering.
function seeded(seed: number) {
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
const random = seeded(0x544f4d4c);
const launches = Array.from({ length: 12 }, (_, i) => {
  const first = i < 7;
  return {
    birth: first
      ? IMPACT + 0.015 + random() * 0.05
      : 0.235 + (i - 7) * 0.023 + random() * 0.01,
    life: first ? 0.135 + random() * 0.055 : 0.085 + random() * 0.065,
    side: i % 2 ? 1 : -1,
    height: 0.65 + random() * 0.35,
    spread: 0.55 + random() * 0.45,
    size: 0.65 + random() * 0.6,
    stretch: first && i % 4 === 1 ? 1.7 : 0.7 + random() * 0.7,
  };
});

export function splashEnvelope(p: number) {
  if (p <= IMPACT) return 0;
  // One initial impact, then a continuous collapse into the pool by mid-pour.
  // Squaring the decay lets the tips settle early without a lingering tiny fan.
  return smooth(IMPACT, 0.19, p) * (1 - smooth(0.215, 0.49, p)) ** 2;
}

export function evaluateScene(progress: number, width: number, height: number) {
  const p = clamp(progress);
  const compact = width < 768;
  const scale = Math.min(width / (compact ? 300 : 853.333), height / 480);
  const unit = scale / 2.25;
  const fill = curve(p, FILL_KEYS);
  const surfaceY = height * (1 - fill);
  const envelope = splashEnvelope(p);
  const crestHeight = 150 * unit * envelope;
  const waveAmp =
    Math.min(height * 0.02, 22 * unit) *
    smooth(IMPACT, 0.23, p) *
    (1 - smooth(0.86, 1, p));
  const impactX = width * (compact ? 0.46 : 0.482);
  const pose: Pose = {
    x: width * (compact ? 0.61 : 0.578125),
    y: curve(p, [
      [0, height * 0.264],
      [0.48, height * 0.264],
      [0.65, height * 0.13],
      [0.83, -height * 0.01],
      [0.94, -110 * scale],
      [1, -165 * scale],
    ]),
    scale,
    angle: curve(p, [
      [0, -22],
      [0.06, -24],
      [0.22, -38],
      [0.5, -65],
      [0.83, -75],
      [1, -75],
    ]),
  };
  const lowerExtent = cartonBounds({ ...pose, y: 0 }).bottom;
  const clearance = Math.max(12, 22 * unit);
  // Conservative rotated bounds clear even the highest possible nearby crest.
  pose.y = below(
    pose.y,
    surfaceY - waveAmp * 1.6 - crestHeight - clearance - lowerExtent,
    9 * unit,
  );
  const opening = openingAt(pose);
  const time = (p * DURATION_MS) / 1000;
  const waveCount = compact ? 3 : 6;
  function surfaceAt(x: number) {
    const phase = (x / width) * TAU;
    const distance = Math.abs(x - impactX) / Math.max(width * 0.4, 1);
    const ripple =
      Math.cos(distance * 19 - time * 7) * Math.exp(-distance * 2.8);
    return (
      surfaceY +
      -6 *
        unit *
        envelope *
        Math.exp(-(((x - impactX) / (145 * unit + 1)) ** 2)) +
      waveAmp *
        (Math.sin(phase * waveCount - time * 1.4) * 0.68 +
          Math.sin(phase * (waveCount * 1.63) + time * 0.9 + 0.7) * 0.27 +
          ripple * envelope * 0.45)
    );
  }
  // Hermite-to-Bezier surface with changing phase/spacing, fewer crests on phones.
  const segments = compact ? 12 : 24;
  const step = (width + 8) / segments;
  let surface = `M ${xy(-4, surfaceAt(-4))}`;
  for (let i = 0; i < segments; i++) {
    const x0 = -4 + i * step;
    const x1 = x0 + step;
    const slope = (x: number) => (surfaceAt(x + 1) - surfaceAt(x - 1)) / 2;
    surface += ` C ${xy(x0 + step / 3, surfaceAt(x0) + (slope(x0) * step) / 3)} ${xy(x1 - step / 3, surfaceAt(x1) - (slope(x1) * step) / 3)} ${xy(x1, surfaceAt(x1))}`;
  }
  surface += ` L ${xy(width + 4, height + 8)} L -4 ${n(height + 8)} Z`;
  if (p <= IMPACT) surface = "";
  const impactY = surfaceAt(impactX);
  const growth = smooth(0.055, IMPACT, p);
  const endY = mix(opening.y, impactY + 9 * unit, growth);
  const endX = mix(opening.x, impactX, growth);
  const flowWidth = mix(4.5, 11, smooth(0.16, 0.48, p)) * unit;
  const reach = Math.max(0, endY - opening.y);
  const bend = Math.min(110 * unit, reach * 0.27);
  const landed = p > IMPACT;
  const footRadius = landed ? (28 + 24 * envelope) * unit : 0;
  const flare = flowWidth + footRadius;
  const neckDistance = Math.min(reach * 0.18, footRadius + 9 * unit);
  const neckY = endY - neckDistance;
  const overlap = Math.max(3, 7 * unit);
  const immersedBottom = surfaceY + waveAmp * 1.6 + overlap * 3;
  const joinAt = (x: number, depth = overlap) => ({
    x,
    y: surfaceAt(x) + depth,
    surface: surfaceAt(x),
    overlap: depth,
  });
  const streamOverlap = Math.max(1.5, 2 * unit);
  const streamLeft = joinAt(endX - flare, streamOverlap);
  const streamRight = joinAt(endX + flare, streamOverlap);
  const leftJoin = p > IMPACT ? streamLeft.y : endY + 6 * unit;
  const rightJoin = p > IMPACT ? streamRight.y : endY + 6 * unit;
  const bottom = p > IMPACT ? immersedBottom : endY + 6 * unit;
  const surfaceSlope = (x: number) => (surfaceAt(x + 1) - surfaceAt(x - 1)) / 2;
  const footHandle = footRadius * 0.5523;
  const leftHandle = xy(
    endX - flare + footHandle,
    leftJoin + surfaceSlope(endX - flare) * footHandle,
  );
  const rightHandle = xy(
    endX + flare - footHandle,
    rightJoin - surfaceSlope(endX + flare) * footHandle,
  );
  const stream =
    p <= 0.055
      ? ""
      : `M ${xy(opening.x - flowWidth * 0.35, opening.y - 2 * unit)} C ${xy(opening.x - bend, opening.y + reach * 0.09)} ${xy(endX - flowWidth, opening.y + reach * 0.43)} ${xy(endX - flowWidth, neckY)} C ${xy(endX - flowWidth, neckY + footHandle + streamOverlap)} ${leftHandle} ${xy(endX - flare, leftJoin)} L ${xy(endX - flare, bottom)} L ${xy(endX + flare, bottom)} L ${xy(endX + flare, rightJoin)} C ${rightHandle} ${xy(endX + flowWidth, neckY + footHandle + streamOverlap)} ${xy(endX + flowWidth, neckY)} C ${xy(endX + flowWidth, opening.y + reach * 0.43)} ${xy(opening.x - bend * 0.8 + flowWidth, opening.y + reach * 0.13)} ${xy(opening.x + flowWidth * 0.35, opening.y + 2 * unit)} Z`;

  const crestJoins: ReturnType<typeof joinAt>[] = [];
  const crests = ["", ""];
  if (envelope > 0) {
    const span = unit * envelope;
    const fold = smooth(0.215, 0.37, p);
    const at = (referenceX: number, referenceY: number) => {
      const u = (referenceX - 94) * 2.1;
      const v = (referenceY - 70) * 1.7;
      // Spatially varying timing and curvature fold each part of the splash
      // separately, while preserving one connected silhouette and fixed seeking.
      const delay = 0.006 + 0.008 * (0.5 + 0.5 * Math.sin(u * 0.019 + 1.1));
      const growth = smooth(IMPACT + delay, 0.185 + delay, p);
      const x =
        impactX +
        u * span * growth * (1 + 0.045 * Math.sin(time * 6.7 + u * 0.018));
      return xy(
        x,
        surfaceAt(x) +
          v *
            span *
            growth *
            (0.96 + 0.06 * Math.sin(time * 7.7 + u * 0.022)) *
            (1 - fold * 0.28),
      );
    };
    const left = joinAt(impactX - 190 * span);
    const right = joinAt(impactX + 208 * span);
    crestJoins.push(left, right);
    let crown = "M " + xy(left.x, left.y);
    crown +=
      " C " +
      xy(left.x + 25 * span, left.y + surfaceSlope(left.x) * 25 * span) +
      " " +
      at(28, 72) +
      " " +
      at(30, 65);
    for (const [x1, y1, x2, y2, x3, y3] of SPLASH_CURVES) {
      crown += " C " + at(x1, y1) + " " + at(x2, y2) + " " + at(x3, y3);
    }
    crown +=
      " C " +
      at(184, 74) +
      " " +
      xy(right.x - 25 * span, right.y - surfaceSlope(right.x) * 25 * span) +
      " " +
      xy(right.x, right.y);
    crown +=
      " L " +
      xy(right.x, immersedBottom) +
      " L " +
      xy(left.x, immersedBottom) +
      " Z";
    crests[0] = crown;
  }
  const droplets = launches.map((drop) => {
    const age = (p - drop.birth) / drop.life;
    if (age <= 0 || age >= 1) return { path: "", transform: "" };
    const launchEnvelope =
      drop.birth < 0.215 ? 1 : splashEnvelope(drop.birth) * 0.72;
    if (launchEnvelope <= 0) return { path: "", transform: "" };
    const arc = 4 * age * (1 - age);
    const x =
      impactX +
      drop.side * unit * launchEnvelope * (25 + 250 * drop.spread * age);
    const amplitude =
      unit * (drop.birth < 0.215 ? 275 : 195) * launchEnvelope * drop.height;
    const y = height * (1 - curve(drop.birth, FILL_KEYS)) - amplitude * arc;
    // The rising pool catches each ballistic drop; it does not ride the waterline.
    if (age > 0.2 && y >= surfaceAt(x)) return { path: "", transform: "" };
    const size =
      unit * drop.size * launchEnvelope * Math.min(1, age * 12, (1 - age) * 10);
    const vx = drop.side * unit * launchEnvelope * 250 * drop.spread;
    const vy = -4 * amplitude * (1 - 2 * age);
    const angle = (Math.atan2(vy, vx) * 180) / Math.PI - 90;
    const radius = 6 * size;
    const length = 11 * size * drop.stretch;
    // Rounded droplets rotate with their trajectory instead of forming a fixed spray.
    return {
      path: `M ${xy(x, y)} m 0 ${n(-length)} c ${n(radius * 0.65)} 0 ${n(radius)} ${n(length * 0.5)} ${n(radius)} ${n(length * 1.1)} c 0 ${n(length * 0.65)} ${n(-radius * 0.4)} ${n(length * 0.9)} ${n(-radius)} ${n(length * 0.9)} c ${n(-radius * 0.6)} 0 ${n(-radius)} ${n(-length * 0.25)} ${n(-radius)} ${n(-length * 0.9)} c 0 ${n(-length * 0.7)} ${n(radius * 0.65)} ${n(-length * 1.1)} ${n(radius)} ${n(-length * 1.1)} Z`,
      transform: `rotate(${angle} ${x} ${y})`,
    };
  });
  return {
    progress: p,
    pose,
    transform: cartonTransform(pose),
    opening,
    impactX,
    impactY,
    surfaceY,
    surface,
    stream,
    crests,
    droplets,
    envelope,
    crestHeight,
    waveAmp,
    footRadius,
    clearance,
    joins: {
      stream: [streamLeft, streamRight],
      crests: crestJoins,
      bottom: immersedBottom,
      overlap,
    },
    bounds: cartonBounds(pose),
    complete: p >= 1,
  };
}

export type Scene = ReturnType<typeof evaluateScene>;
