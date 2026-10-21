import { createHash } from "node:crypto";
import {
  readdir,
  readFile,
  mkdir,
  access,
  writeFile,
  rename,
} from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const source = path.join(root, "public/media");
const generated = path.join(source, "responsive");
const manifestPath = path.join(root, "src/generated/images.json");
const widths = [320, 640, 960];
await mkdir(generated, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });
const manifest = {};

// Original files remain untouched. Variants are content-addressed, cached and reproducible.
for (const name of (await readdir(source)).sort()) {
  if (!/\.(webp|png|jpe?g)$/i.test(name)) continue;
  const buffer = await readFile(path.join(source, name));
  const { width, height } = await sharp(buffer).metadata();
  if (!width || !height) continue;
  const hash = createHash("sha256")
    .update("webp-q85-v1")
    .update(buffer)
    .digest("hex")
    .slice(0, 12);
  const sources = [];
  for (const size of widths.filter((size) => size < width)) {
    const filename = `${path.parse(name).name}-${hash}-${size}.webp`;
    const destination = path.join(generated, filename);
    try {
      await access(destination);
    } catch {
      const temporary = `${destination}.${process.pid}.tmp`;
      await sharp(buffer)
        .resize({ width: size, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(temporary);
      await rename(temporary, destination);
    }
    sources.push({ src: `/media/responsive/${filename}`, width: size });
  }
  sources.push({ src: `/media/${name}`, width });
  manifest[`/media/${name}`] = { width, height, sources };
}
const content = JSON.stringify(manifest, null, 2) + "\n";
if ((await readFile(manifestPath, "utf8").catch(() => "")) !== content) {
  const temporary = `${manifestPath}.${process.pid}.tmp`;
  await writeFile(temporary, content);
  await rename(temporary, manifestPath);
}
console.log(
  `Prepared responsive sources for ${Object.keys(manifest).length} local images.`,
);
