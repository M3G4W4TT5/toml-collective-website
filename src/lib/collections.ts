import { createClient } from '@sanity/client';
import { site } from './site';
import { readRouteRecords } from './route-records';

const client = site.projectId ? createClient({
  projectId: site.projectId,
  dataset: site.dataset,
  apiVersion: '2025-05-01',
  perspective: 'published',
  useCdn: false,
}) : null;

export async function getCases() {
  if (!client) return [];
  return readRouteRecords(await client.fetch<unknown>(
    '*[_type == "caseStudy" && defined(slug.current)] | order(title asc){_id, title, "slug": slug.current, "description": summary}',
  ), 'case');
}

export async function getMembers() {
  if (!client) return [];
  return readRouteRecords(await client.fetch<unknown>(
    '*[_type == "member" && defined(slug.current)] | order(name asc){_id, "title": name, "slug": slug.current, "description": bio}',
  ), 'member');
}
