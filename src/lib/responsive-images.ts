export const imageSizes = {
  full: "(min-width: 90rem) 1280px, calc(100vw - 3rem)",
  half: "(min-width: 90rem) 618px, (min-width: 75rem) calc((100vw - 10rem - 2.75rem) / 2), (min-width: 48rem) calc((100vw - 6rem - 1.75rem) / 2), calc(100vw - 3rem)",
  third:
    "(min-width: 90rem) 404px, (min-width: 75rem) calc((100vw - 10rem - 4.25rem) / 3), (min-width: 48rem) calc((100vw - 6rem - 1.75rem) / 2), calc((100vw - 3rem - 1.25rem) / 2)",
};

/** Only Sanity's image CDN supports these transformations; other URLs stay intact. */
export function sanityImageSources(src: string): string | undefined {
  if (!src.startsWith("https://cdn.sanity.io/images/")) return;
  const url = new URL(src);
  const dimensions = url.pathname.match(/-(\d+)x\d+\.[^/.]+$/);
  const nativeWidth = dimensions ? Number(dimensions[1]) : 1600;
  const widths = [320, 640, 960, 1280, 1600].filter(
    (width) => width <= nativeWidth,
  );
  if (nativeWidth < 1600 && !widths.includes(nativeWidth))
    widths.push(nativeWidth);
  return widths
    .map((width) => {
      url.searchParams.set("w", String(width));
      url.searchParams.set("auto", "format");
      if (!url.searchParams.has("fit")) url.searchParams.set("fit", "max");
      return `${url} ${width}w`;
    })
    .join(", ");
}
