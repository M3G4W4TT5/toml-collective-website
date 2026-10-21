import assert from "node:assert/strict";
import test from "node:test";
import { sanityImageSources } from "../src/lib/responsive-images.ts";

test("image transformations apply only to Sanity's image CDN", () => {
  for (const url of [
    "/media/local.webp",
    "https://example.com/image.jpg",
    "https://cdn.sanity.io.example.com/images/photo.jpg",
    "https://cdn.sanity.io/files/project/dataset/file.pdf",
  ]) {
    assert.equal(sanityImageSources(url), undefined);
  }
});

test("responsive descriptors respect native image width and preserve existing crop settings", () => {
  const sources = sanityImageSources(
    "https://cdn.sanity.io/images/project/production/photo-600x400.jpg?rect=10,10,300,200&fit=crop",
  ).split(", ");
  assert.ok(sources.length > 1);
  for (const source of sources) {
    const [address, descriptor] = source.split(" ");
    const url = new URL(address);
    const width = Number(descriptor.slice(0, -1));
    assert.ok(width <= 600);
    assert.equal(Number(url.searchParams.get("w")), width);
    assert.equal(url.searchParams.get("rect"), "10,10,300,200");
    assert.equal(url.searchParams.get("fit"), "crop");
    assert.equal(url.searchParams.get("auto"), "format");
  }
});
