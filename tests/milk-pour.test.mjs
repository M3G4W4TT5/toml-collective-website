import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import ts from "typescript";

// Use the existing TypeScript compiler, with no runtime/test dependency added.
const root = new URL("../", import.meta.url);
const dataUrl = (source) =>
  `data:text/javascript;base64,${Buffer.from(ts.transpile(source, { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 })).toString("base64")}`;
const geometrySource = (
  await readFile(new URL("src/components/milk-pour/geometry.ts", root), "utf8")
).replace(
  /import carton from [^;]+;/,
  `const carton = ${await readFile(new URL("src/assets/milk-pour/carton-geometry.json", root), "utf8")};`,
);
const geometryUrl = dataUrl(geometrySource);
const { openingAt, transformPoint } = await import(geometryUrl);
const animationSource = (
  await readFile(new URL("src/components/milk-pour/animation.ts", root), "utf8")
).replace('"./geometry"', JSON.stringify(geometryUrl));
const { evaluateScene, splashEnvelope } = await import(
  dataUrl(animationSource)
);
const sizes = [
  [1920, 1080],
  [1366, 768],
  [390, 844],
  [360, 800],
  [844, 390],
];

test("the approved carton and paint-inverted mask remain byte-exact", async () => {
  for (const [name, hash] of [
    [
      "carton-approved.svg",
      "0580092d1647b618050338a55f2080599e67743527770e5a5eee3009a01a644e",
    ],
    [
      "carton-mask.svg",
      "876daa54b43f1b03751f6e3b8c1209f5e30ae37e0a739edd1bd0fb301454c082",
    ],
  ])
    assert.equal(
      createHash("sha256")
        .update(await readFile(new URL(`src/assets/milk-pour/${name}`, root)))
        .digest("hex"),
      hash,
    );
});

test("opening follows the same uniform transform as the carton through tilt and lift", () => {
  const pose = { x: 1110, y: 285, angle: -38, scale: 2.25 };
  const opening = openingAt(pose);
  assert.ok(Math.abs(opening.x - 1039.8191) < 0.01);
  assert.ok(Math.abs(opening.y - 237.606) < 0.01);
  assert.deepEqual(transformPoint({ x: 46, y: 70 }, pose), { x: 1110, y: 285 });
  for (const [w, h] of sizes)
    for (let i = 0; i <= 100; i++) {
      const scene = evaluateScene(i / 100, w, h);
      assert.deepEqual(scene.opening, openingAt(scene.pose));
      assert.ok(!/NaN|Infinity/.test(scene.stream + scene.surface));
    }
});

test("carton clears the highest conservative surface bound continuously and exits early", () => {
  for (const [w, h] of sizes) {
    let previous;
    for (let i = 0; i <= 1000; i++) {
      const scene = evaluateScene(i / 1000, w, h);
      assert.ok(
        scene.bounds.bottom <=
          scene.surfaceY -
            scene.waveAmp * 1.6 -
            scene.crestHeight -
            scene.clearance +
            0.001,
        `clearance at ${w}x${h}, ${i}`,
      );
      assert.ok(
        scene.bounds.left >= 0 && scene.bounds.right <= w,
        "carton fits horizontally",
      );
      if (previous)
        assert.ok(
          Math.abs(scene.pose.y - previous.pose.y) < h * 0.008,
          "no lift teleport",
        );
      previous = scene;
    }
    assert.ok(
      evaluateScene(0.94, w, h).bounds.bottom < 0,
      "carton exits before the last stream",
    );
    assert.ok(evaluateScene(0.94, w, h).stream.length > 0);
    assert.ok(
      evaluateScene(1, w, h).surfaceY < -10,
      "last black band clears above viewport",
    );
  }
});

test("first burst dominates later crests; seeking reproduces the evolving scene", () => {
  const first = Math.max(
    ...Array.from({ length: 200 }, (_, i) => splashEnvelope(0.14 + i * 0.001)),
  );
  const later = Math.max(
    ...Array.from({ length: 660 }, (_, i) => splashEnvelope(0.34 + i * 0.001)),
  );
  assert.ok(first > later * 1.5);
  for (const p of [0.19, 0.23, 0.39, 0.51, 0.69, 0.88]) {
    assert.deepEqual(
      evaluateScene(p, 1920, 1080),
      evaluateScene(p, 1920, 1080),
    );
  }
  const a = evaluateScene(0.39, 1920, 1080);
  const b = evaluateScene(0.51, 1920, 1080);
  assert.notDeepEqual(a.crests, b.crests);
  assert.notDeepEqual(evaluateScene(0.22, 1920, 1080).droplets, b.droplets);
  assert.ok(
    evaluateScene(0.22, 1920, 1080).droplets.some(
      (drop) => drop.path.length > 0,
    ),
  );
});

test("initial splays settle into a smooth stream by mid-pour without later spray", () => {
  let previous = splashEnvelope(0.22);
  for (let i = 221; i <= 1000; i++) {
    const envelope = splashEnvelope(i / 1000);
    assert.ok(envelope <= previous + 1e-9, "no later splash rebound");
    previous = envelope;
  }
  assert.ok(splashEnvelope(0.22) > 0.99);
  assert.ok(splashEnvelope(0.39) < 0.1);
  for (const [w, h] of sizes)
    for (const p of [0.5, 0.65, 0.83, 0.94]) {
      const scene = evaluateScene(p, w, h);
      assert.equal(scene.crestHeight, 0);
      assert.ok(scene.waveAmp > 0, "rolling surface remains after splays settle");
      assert.ok(scene.crests.every((path) => path === ""));
      assert.ok(scene.droplets.every((drop) => drop.path === ""));
      assert.ok(
        scene.stream.length > 0,
        "continuous stream remains after splays settle",
      );
      assert.ok(
        Math.abs(scene.footRadius - (28 * scene.pose.scale) / 2.25) < 1e-9,
      );
    }
});

test("splash and stream closing edges stay below the local moving surface", () => {
  for (const [w, h] of sizes)
    for (let i = 141; i < 1000; i++) {
      const scene = evaluateScene(i / 1000, w, h);
      for (const join of [...scene.joins.crests, ...scene.joins.stream]) {
        assert.ok(join.overlap >= 1.5, "every closing edge is submerged");
        assert.ok(join.y >= join.surface + join.overlap - 0.001);
        assert.ok(scene.joins.bottom >= join.y);
      }
    }
});
