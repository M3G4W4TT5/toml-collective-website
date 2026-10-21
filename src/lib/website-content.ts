import { sanityClient as client } from "./sanity-client";
import { getCases, getMembers } from "./collections";
import { projects, members, type Project, type Member } from "../data/website";
type Media = { src?: string; alt?: string; credit?: string };
type ProjectDocument = Omit<Partial<Project>, "gallery"> & {
  gallery?: Media[];
};
type MemberDocument = Omit<Partial<Member>, "gallery"> & {
  shortName?: string;
  portfolioUrl?: string;
  gallery?: Media[];
};
// The supplied V4 deck is the baseline. Published editorial records override it by slug.
// No baseline documents are created or published as a side effect of building.
const media = (value: unknown, fallback: string) =>
  typeof value === "string" &&
  (value.startsWith("https://") || /^\/(?!\/)/.test(value))
    ? value
    : fallback;
export async function getWebsiteProjects(): Promise<Project[]> {
  const records = await getCases();
  if (!client || !records.length) return projects;
  const detail = await client.fetch<ProjectDocument[]>(
    '*[_type=="caseStudy" && defined(slug.current)]{...,"slug":slug.current,"image":image.asset->url,"imageAlt":image.alt,"imageCredit":image.credit,"gallery":gallery[]{"src":asset->url,alt,credit}}',
  );
  const result = [...projects];
  for (const r of records) {
    const d = detail.find((x) => x.slug === r.slug) || {};
    const index = result.findIndex((x) => x.slug === r.slug);
    const base = index >= 0 ? result[index] : null;
    const next: Project = {
      slug: r.slug,
      title: r.title,
      headline: d.headline || r.title,
      summary: r.description || base?.summary || "",
      discipline: d.discipline || base?.discipline || "",
      categories: d.categories || base?.categories || [],
      client: d.client || base?.client || r.title,
      partner: d.partner || base?.partner,
      image: media(d.image, base?.image || ""),
      imageAlt: d.imageAlt,
      imageCredit: d.imageCredit,
      galleryDescriptions: d.gallery?.map((x) => ({
        alt: x.alt || "",
        credit: x.credit || "",
      })),
      gallery:
        Array.isArray(d.gallery) && d.gallery.length
          ? d.gallery.map((x) => media(x.src, "")).filter(Boolean)
          : base?.gallery || [],
      sections: d.sections || base?.sections || [],
      outcomes: d.outcomes || base?.outcomes || [],
      outcomeLabel: d.outcomeLabel || base?.outcomeLabel || "The work",
      outcomeNote: d.outcomeNote || base?.outcomeNote,
      source: base?.source,
      campaigns: base?.campaigns,
    };
    if (index >= 0) result[index] = next;
    else result.push(next);
  }
  return result;
}
export async function getLatestWebsiteProjects(): Promise<Project[]> {
  const all = await getWebsiteProjects();
  if (!client) return all.slice(0, 4);
  const latest = await client.fetch<{ slug: string }[]>(
    '*[_type=="caseStudy" && defined(slug.current)] | order(_createdAt desc, _id asc)[0...4]{"slug":slug.current}',
  );
  // Seed cases have no publication dates. Keep their existing order until
  // published case articles are available, without inventing recency metadata.
  return latest.length
    ? latest.flatMap(({ slug }) => all.find((item) => item.slug === slug) ?? [])
    : all.slice(0, 4);
}
export async function getWebsiteMembers(): Promise<Member[]> {
  const records = await getMembers();
  if (!client || !records.length) return members;
  const detail = await client.fetch<MemberDocument[]>(
    '*[_type=="member" && defined(slug.current)]{...,"slug":slug.current,"image":image.asset->url,"imageAlt":image.alt,"imageCredit":image.credit,"gallery":gallery[]{"src":asset->url,alt,credit}}',
  );
  const result = [...members];
  for (const r of records) {
    const d = detail.find((x) => x.slug === r.slug) || {};
    const index = result.findIndex((x) => x.slug === r.slug);
    const base = index >= 0 ? result[index] : null;
    const next: Member = {
      slug: r.slug,
      name: d.shortName || base?.name || r.title,
      fullName: r.title,
      discipline: d.discipline || base?.discipline || "",
      categories: d.categories || base?.categories || [],
      image: media(d.image, base?.image || ""),
      imageAlt: d.imageAlt,
      imageCredit: d.imageCredit,
      galleryDescriptions: d.gallery?.map((x) => ({
        alt: x.alt || "",
        credit: x.credit || "",
      })),
      gallery:
        Array.isArray(d.gallery) && d.gallery.length
          ? d.gallery.map((x) => media(x.src, "")).filter(Boolean)
          : base?.gallery || [],
      bio: r.description || base?.bio || "",
      source: media(d.portfolioUrl, base?.source || ""),
    };
    if (index >= 0) result[index] = next;
    else result.push(next);
  }
  return result;
}

export async function getHomepageDesign() {
  const defaults = {
    headline: "Thoughtful ideas.\nBeautifully made.",
    intro:
      "A creative collective making brands, campaigns, films and digital experiences. A close core team, with a wider circle of people we love working with.",
    hero: "/media/home-hero.webp",
    heroAlt: "Floating islands and classical columns above a cloudscape",
    selectedWork: projects.slice(0, 4),
    services: [
      "Strategy",
      "Film & content",
      "Brand identity",
      "Motion",
      "Campaigns",
      "Digital experiences",
    ],
  };
  if (!client) return defaults;
  const home = await client.fetch<{
    headline?: string;
    intro?: string;
    hero?: string;
    heroAlt?: string;
    selectedWork?: string[];
    services?: string[];
  } | null>(
    '*[_type=="homePage" && _id=="home"][0].website{headline,intro,"hero":hero.asset->url,"heroAlt":hero.alt,"selectedWork":selectedWork[]->slug.current,services}',
  );
  const all = await getWebsiteProjects();
  const selectedDefaults = defaults.selectedWork.map(
    (p) => all.find((item) => item.slug === p.slug) || p,
  );
  if (!home) return { ...defaults, selectedWork: selectedDefaults };
  const selected = home.selectedWork
    ?.map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
  return {
    headline: home.headline || defaults.headline,
    intro: home.intro || defaults.intro,
    hero: media(home.hero, defaults.hero),
    heroAlt: home.heroAlt || defaults.heroAlt,
    selectedWork: selected?.length ? selected : selectedDefaults,
    services: home.services?.length ? home.services : defaults.services,
  };
}
