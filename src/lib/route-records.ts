export type RouteRecord = {
  _id: string;
  title: string;
  slug: string;
  description: string;
};

// API writes can bypass CMS validation. Never turn an invalid slug into a path.
export function readRouteRecords(
  value: unknown,
  collection: string,
): RouteRecord[] {
  if (!Array.isArray(value))
    throw new Error(`Invalid ${collection} response from Sanity.`);
  const slugs = new Set<string>();
  return value.map((record: unknown) => {
    if (
      !record ||
      typeof record !== "object" ||
      !("_id" in record) ||
      typeof record._id !== "string" ||
      !("title" in record) ||
      typeof record.title !== "string" ||
      !record.title.trim() ||
      !("slug" in record) ||
      typeof record.slug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug) ||
      record.slug.length > 96
    ) {
      throw new Error(
        `Invalid published ${collection} entry: title and a lowercase URL slug are required.`,
      );
    }
    if (slugs.has(record.slug))
      throw new Error(`Duplicate ${collection} slug: ${record.slug}`);
    slugs.add(record.slug);
    const description =
      "description" in record ? record.description : undefined;
    if (description != null && typeof description !== "string") {
      throw new Error(`Invalid ${collection} text for ${record.slug}.`);
    }
    return {
      _id: record._id,
      title: record.title,
      slug: record.slug,
      description: description ?? "",
    };
  });
}
