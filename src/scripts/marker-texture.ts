/** Seeded paper/ink coverage. Coordinates are physical stroke pixels, not a tiled stamp. */
const cache = new Map<string, string>();
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// Perlin's quintic fade has zero first/second derivatives at lattice boundaries.
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
function hash(x: number, y: number, seed: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ seed;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function field(x: number, y: number, seed: number) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  const u = fade(x - ix),
    v = fade(y - iy);
  return mix(
    mix(hash(ix, iy, seed), hash(ix + 1, iy, seed), u),
    mix(hash(ix, iy + 1, seed), hash(ix + 1, iy + 1, seed), u),
    v,
  );
}
function fractal(x: number, y: number, seed: number) {
  // Incommensurate frequencies and shifted origins suppress visible lattice repeats.
  return (
    field(x, y, seed) * 0.58 +
    field(x * 2.07 + 31.3, y * 2.07 - 17.1, seed + 91) * 0.28 +
    field(x * 4.31 - 9.2, y * 4.31 + 7.8, seed + 173) * 0.14
  );
}

export function markerTexture(
  width: number,
  height: number,
  seed: number,
  amount: number,
) {
  const key = [width.toFixed(2), height.toFixed(2), seed, amount].join(":");
  const previous = cache.get(key);
  if (previous) return previous;
  const canvas = document.createElement("canvas");
  // Supersample fine paper grain; cap each mask's work on extreme font/zoom settings.
  const scale = Math.min(2, Math.sqrt(220000 / (width * height)));
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d")!;
  const pixels = ctx.createImageData(canvas.width, canvas.height);
  const strength = Math.pow(amount, 1.25);
  const strokeScale = Math.max(0.7, height / 45);
  for (let row = 0; row < canvas.height; row++) {
    for (let col = 0; col < canvas.width; col++) {
      const x = col / scale / strokeScale;
      const y = row / scale / strokeScale;
      // Uneven ink supply/pressure produces correlated wet and dry regions.
      const load = fractal(x / 85, y / 19, seed + 11);
      const dry = smooth(0.29, 0.77, load);
      // Warp the fibre domain: tracks wander, split and fade instead of running
      // as equally spaced parallel cuts. Each scale has an independent seed.
      const warp = (field(x / 46, y / 13, seed + 37) - 0.5) * 3.8;
      const fibres = fractal(x / 49, (y + warp) / 1.1, seed + 53);
      const broken = fractal(x / 10, (y + warp * 0.6) / 0.63, seed + 107);
      const paper = fractal(x / 1.05, y / 0.87, seed + 211);
      const tooth = smooth(0.52, 0.79, paper + (load - 0.5) * 0.23);
      const tracks = smooth(0.47, 0.79, fibres * 0.76 + broken * 0.24);
      // Smooth density changes remain visible between fully open pores. Dry
      // areas expose more paper; wetter patches stay mostly uninterrupted.
      const erosion =
        (0.13 + dry * 0.72) * tracks + tooth * (0.12 + dry * 0.52);
      const pores = smooth(0.46 - amount * 0.13, 0.72 - amount * 0.13, erosion);
      const density =
        1 - strength * (0.09 + dry * 0.19 + tracks * 0.2 + tooth * 0.12);
      const coverage = clamp(density * (1 - strength * pores));
      const value = Math.round(255 * coverage);
      const i = (row * canvas.width + col) * 4;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
      pixels.data[i + 3] = 255;
    }
  }
  ctx.putImageData(pixels, 0, 0);
  const url = canvas.toDataURL("image/png");
  // Replays reuse identical grain. Bound memory during long resize/control sessions.
  if (cache.size >= 48) cache.delete(cache.keys().next().value!);
  cache.set(key, url);
  return url;
}
