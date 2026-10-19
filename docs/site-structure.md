# Website structure — V4 draft

Implemented locally on 19 October 2026 using the user’s expanded full-site scope. See [design brief](design-brief.md) for source priority, confirmed decisions and publication inputs.

| Route | Implementation |
| --- | --- |
| `/` | V4 homepage; selected work, services, blue testimonial, Journal/House previews, contact band and shared footer |
| `/work` | Responsive case grid, discipline filters, count and empty state; approach section and showreel dialog |
| `/work/[slug]` | Nine source-backed baseline cases plus any published Sanity additions |
| `/about` | Story, collective, values, recognition and wider TOML activities |
| `/about/approach` | Source diagram, three team tiers, client benefits, project rhythm and ways to work together |
| `/about/our-story` | Founder’s supplied story and timeline |
| `/about/house-of-toml` | User-approved provisional House page and preselected visit enquiry |
| `/people` | Six source core-team cards and accessible profile drawers |
| `/people/members` | Twelve source members, discipline filters, portfolio attribution and enquiry panels |
| `/people/members/[slug]` | Local portfolio templates populated with legacy galleries and supplied copy; full name Nertil Muhaxhiri |
| `/journal` | Redirect to the existing Journal domain; primary navigation links directly there |
| `/playlist` | Five V4 tiles; explicit unavailable states pending owned Spotify links; track-sharing enquiry |
| `/contact` | Supplied contact information, six form fields, eight enquiry types, named contacts and House teaser |
| `/privacy-policy` | Link to TOML’s existing policy PDF; final review pending |
| `/cookies` | Clearly labelled pending information |
| Unknown routes | Custom 404 with a route back to Work |

Baseline cases: Siebert, ETH Zürich Space, UBS / The Red Thread, Vvitaverse, Carvago, RH45, Elja / UNM, Siebert / Generation Wealth and Siebert / Corporate Bonds. Don’t be that guy is linked from Siebert to the supplied Behance article.

The deck’s first four lead cards are retained in order, with the comment-requested Vvitaverse substitution. Additional supplied cases follow them. Sources and extra gallery content intentionally extend some pages beyond the long-slide mockup height.

## CMS and publishing

Home, cases and members still use published Sanity reads at build time. Schema extensions are in the repository only. No source documents, seed fixtures, drafts, uploaded media or webhooks were written to Sanity during this pass. Existing infrastructure and disabled mail/indexing settings remain in place.

`src/lib/website-content.ts` combines the review baseline with published overrides by slug. The baseline must be migrated to CMS before CMS-only unpublishing/removal is the editorial authority. New gallery fields preserve descriptions and published credits. Final CMS structure follows visual review, as discussed in the meeting.

Contact enquiry type, company and timing are retained in the bounded plain-text mail payload when sending is configured. Review mode presents validation and an email fallback without sending. The existing server validation, honeypot, origin check, hostname-bound Turnstile verification, fixed sender and local simulation are preserved.

## Verification

See project-root `design-qa.md` and local `artifacts/design-qa/` for normalized source comparisons and browser evidence. Routine verification includes Astro/TypeScript checks, the unit suite, static site build, Studio build and Worker dry run. Hosted Studio acceptance, dataset migration and real inbox delivery remain separate release checks.
