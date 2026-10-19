import { createClient } from '@sanity/client';
import { site } from './site';

export type HomeContent = {
  title: string;
  intro: string;
  detailsTitle: string;
  details: string;
  source: 'demo' | 'sanity';
};

const demo: HomeContent = {
  title: 'A small website starts here',
  intro: 'This is labelled demonstration content for a new client site. Replace it after the brief and editorial approval.',
  detailsTitle: 'Made for real content',
  details: 'The page is built as static HTML. When a client Sanity project is configured, published content is fetched during the build.',
  source: 'demo',
};

export async function getHomeContent(): Promise<HomeContent> {
  const projectId = site.projectId;
  if (!projectId) return demo;

  const client = createClient({
    projectId,
    dataset: site.dataset,
    apiVersion: '2025-05-01',
    perspective: 'published',
    useCdn: false,
  });
  const page = await client.fetch<unknown>(
    '*[_type == "homePage" && _id == "home"][0]{title, intro, detailsTitle, details}',
  );
  if (!page || typeof page !== 'object'
    || !('title' in page) || typeof page.title !== 'string' || !page.title.trim()
    || !('intro' in page) || typeof page.intro !== 'string' || !page.intro.trim()
    || !('detailsTitle' in page) || typeof page.detailsTitle !== 'string' || !page.detailsTitle.trim()
    || !('details' in page) || typeof page.details !== 'string' || !page.details.trim()) {
    throw new Error('Published Sanity home document is missing required content. Publish document ID "home" before building.');
  }
  return { title: page.title, intro: page.intro, detailsTitle: page.detailsTitle, details: page.details, source: 'sanity' };
}
