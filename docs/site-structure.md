# Page structure

Requested on 19 October 2026. These are plain semantic pages with browser defaults; no visual design or final copy has been added.

| URL | Purpose / source |
| --- | --- |
| `/` | Existing Sanity Home content, within the plain shared layout |
| `/work` | Published case index |
| `/work/[slug]` | Sanity `caseStudy`: title, URL slug and optional summary |
| `/about` | About placeholder and links to the three child pages |
| `/about/approach` | Approach placeholder |
| `/about/our-story` | Our Story placeholder |
| `/about/house-of-toml` | House of TOML placeholder |
| `/people` | Core Team placeholder, with a link to Members |
| `/people/members` | Published member index |
| `/people/members/[slug]` | Sanity `member`: name, URL slug and optional biography |
| `/journal` | Journal placeholder |
| `/playlist` | Playlist placeholder |
| `/contact` | Contact placeholder; no recipient or contact copy supplied |
| `/privacy-policy` | Empty policy placeholder; legal wording awaits review |
| `/cookies` | Empty policy placeholder; cookie wording awaits review |

`src/lib/pages.ts` lists fixed pages and main navigation. `SitePage.astro` supplies shared semantic navigation, the main heading and policy links. The catch-all file generates only the explicitly listed fixed pages; unknown URLs remain 404s. The home page retains its CMS content and uses this same plain layout.

Case and member pages are generated at build time from the published Sanity perspective. Publishing an entry with a title/name and valid unique slug creates its URL on the next successful build; unpublishing removes it after the next successful build. Slugs use lowercase letters, numbers and single hyphens, up to 96 characters. Invalid or duplicate published paths fail the build. No example cases or people were created or published. Existing legacy demo documents, including `talent` drafts, are preserved; member routes use the new `member` type.

These schemas establish routing only. Rich content, media, core-team editing, journal entries and playlist integrations can be added when their requirements are supplied. Cases and members are allowed to have empty collections. Site indexing and contact sending retain their existing review settings.

## Verification and rollout

- Local Astro/TypeScript checks, all 14 tests, the CMS-backed build and Studio build pass.
- All 13 fixed pages, internal links and noindex metadata were checked in the build output.
- The two dynamic templates and their index links were checked using test-only fixtures in an isolated temporary checkout. No fixture data was written to Sanity.
- Publication approved on 19 October 2026. The updated code-managed Studio and schema have been deployed. Both existing Sanity webhook filters were expanded and verified as `(_type == "homePage" && _id == "home") || _type in ["caseStudy", "member"]`, with drafts and versions still excluded.
- Website publication uses the existing `main` deployment pipelines for both Workers. Check the commit’s CI and Cloudflare builds for deployment results. No case/member publishing acceptance test using real content has been performed.
