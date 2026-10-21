import { sanityClient as client } from "./sanity-client";
import { readRouteRecords } from "./route-records";

export async function getCases() {
  if (!client) return [];
  return readRouteRecords(
    await client.fetch<unknown>(
      '*[_type == "caseStudy" && defined(slug.current)] | order(title asc){_id, title, "slug": slug.current, "description": summary}',
    ),
    "case",
  );
}

export async function getMembers() {
  if (!client) return [];
  return readRouteRecords(
    await client.fetch<unknown>(
      '*[_type == "member" && defined(slug.current)] | order(name asc){_id, "title": name, "slug": slug.current, "description": bio}',
    ),
    "member",
  );
}
