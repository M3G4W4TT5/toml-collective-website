import carton from "../../assets/milk-pour/carton-geometry.json";

export type Point = { x: number; y: number };
export type Pose = Point & { scale: number; angle: number };
export const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (a: number, b: number, t: number) => {
  const n = clamp((t - a) / (b - a));
  return n * n * (3 - 2 * n);
};

/** Continuous monotone Hermite curve; no pauses at the composition guides. */
export function curve(t: number, keys: readonly (readonly [number, number])[]) {
  const i = Math.max(0, keys.findIndex((key) => key[0] >= t) - 1);
  const k = t >= keys.at(-1)![0] ? keys.length - 2 : i;
  const [x0, y0] = keys[k];
  const [x1, y1] = keys[k + 1];
  const slope = (j: number) => {
    if (j === 0) return (keys[1][1] - keys[0][1]) / (keys[1][0] - keys[0][0]);
    if (j === keys.length - 1)
      return (keys[j][1] - keys[j - 1][1]) / (keys[j][0] - keys[j - 1][0]);
    const a = (keys[j][1] - keys[j - 1][1]) / (keys[j][0] - keys[j - 1][0]);
    const b = (keys[j + 1][1] - keys[j][1]) / (keys[j + 1][0] - keys[j][0]);
    return a * b <= 0 ? 0 : (2 * a * b) / (a + b);
  };
  const u = clamp((t - x0) / (x1 - x0));
  return (
    (2 * u ** 3 - 3 * u ** 2 + 1) * y0 +
    (u ** 3 - 2 * u ** 2 + u) * (x1 - x0) * slope(k) +
    (-2 * u ** 3 + 3 * u ** 2) * y1 +
    (u ** 3 - u ** 2) * (x1 - x0) * slope(k + 1)
  );
}

export function transformPoint(point: Point, pose: Pose): Point {
  const radians = (pose.angle * Math.PI) / 180;
  const u = point.x - carton.localPivot[0];
  const v = point.y - carton.localPivot[1];
  return {
    x: pose.x + pose.scale * (Math.cos(radians) * u - Math.sin(radians) * v),
    y: pose.y + pose.scale * (Math.sin(radians) * u + Math.cos(radians) * v),
  };
}

export const openingAt = (pose: Pose) =>
  transformPoint(
    { x: carton.openingCentreLocal[0], y: carton.openingCentreLocal[1] },
    pose,
  );

export function cartonBounds(pose: Pose) {
  const corners = [
    { x: -2.25, y: 0 },
    { x: 94.25, y: 0 },
    { x: 94.25, y: 143.25 },
    { x: -2.25, y: 143.25 },
  ].map((point) => transformPoint(point, pose));
  return {
    left: Math.min(...corners.map((p) => p.x)),
    right: Math.max(...corners.map((p) => p.x)),
    top: Math.min(...corners.map((p) => p.y)),
    bottom: Math.max(...corners.map((p) => p.y)),
  };
}

export const cartonTransform = (p: Pose) =>
  `translate(${p.x} ${p.y}) rotate(${p.angle}) scale(${p.scale}) translate(-46 -70)`;

/** Soft minimum starts lifting ahead of the clearance limit without a clamp/pop. */
export function below(a: number, ceiling: number, softness: number) {
  const delta = (a - ceiling) / softness;
  return (
    a - softness * (Math.max(0, delta) + Math.log1p(Math.exp(-Math.abs(delta))))
  );
}
