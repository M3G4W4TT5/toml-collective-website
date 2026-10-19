# TOML Collective V4 implementation brief

## Scope and source priority

The user authorized implementation of the entire website on 19 October 2026, using TOML’s own slide mockups first. This supersedes the homepage-only scope recorded in the attached meeting notes. The attachments are reference material, not authorization to publish, connect new services, or migrate Journal.

Primary design: [TOML Website Complete V4](https://docs.google.com/presentation/d/1zFy6OV4zFV8ALTcfW34H0G7DUTb-IsGkiTf46qINOj4/edit). All 15 slides, editable copy, source images and 10 comment threads (including replies and the resolved Vvitaverse instruction) were reviewed. The UX handoff is documentation, not a public page. Off-canvas remnants and the older duplicate testimonial were excluded.

The supplied meeting notes and requirements attachment informed behavior and outstanding inputs. Where the live deck comments or the user’s answers differ, those newer directions govern.

## Confirmed in this conversation

- Implement all mapped pages, using the deck’s visual system and copy as the baseline.
- Use the old [TOML website](https://www.tomlcollective.com/) for missing case and artist content.
- Journal navigation goes directly to `https://www.tomljournal.com`. `/journal` is only a redirect, with no local Journal landing page or migration.
- Use **Nertil Muhaxhiri**; retain him in the Members listing for this draft. Do not add him to Core Team based on the conflicting slide badge.
- Build a provisional House page from the supplied teaser, photograph and visit-enquiry content.
- Use the [supplied showreel](https://drive.google.com/drive/folders/1CiRLaFajde-9XxrNMr7s7nHwrAAD5wTR). It opens in an accessible dialog with native playback controls, sound controlled by the visitor, no background autoplay, and pause on close.
- Spotify URLs are unavailable. Preserve the five designed playlist tiles with clearly labelled unavailable states.
- Direct Playwright use was authorized because the app browser connection was unavailable.

## Visual baseline

Canvas `#FAFAFA`, ink `#141414`, accent `#FF532F`, supporting text `#656565`, rules `#D6D6D6`; homepage testimonial blue `#0D2481`. Arial supplies the main type hierarchy. Locally hosted Questrial, Archivo Black and Anton reproduce the specified special treatments; their OFL licenses are included with the font files.

Use a 1280px content area with fluid 80px desktop gutters at 1440px, spacious rectangular imagery, pill CTAs, full-width color bands, secondary section navigation and the oversized footer wordmark. The homepage footer signature is smaller than the inner-page version, as in the deck. Mobile reflows the same content and provides the five primary destinations through Menu. No new tracking is installed.

## Comment-derived changes

- Replace Elja/UNM with Vvitaverse in the homepage’s fourth Selected Work slot and lead Work selection. Elja remains available as an additional case.
- Surface Siebert’s Generation Wealth, Corporate Bonds and Don’t be that guy campaigns from the Siebert case.
- Include the supplied Carvago and RH45 material.
- Add **London / Clockwise Wood Green** to Contact; preserve the newer deck’s London / Prishtina / Toronto locations rather than copying older office information from the legacy footer.
- Keep artist attribution and original portfolio links. Nertil’s old-site artwork contains its own project marks; those remain embedded in the original artwork.
- Membership badges are not treated as an authoritative roster. Discipline filters are functional; their draft assignments follow the disciplines shown by TOML.

## Editorial architecture

`src/data/website.ts` is the review baseline, sourced from the deck, Drive material and legacy site. `src/data/deck-assets.json` maps consumed slide objects to local WebP assets. `src/data/legacy-content.json` records legacy source URLs, original asset URLs and available text. No expiring Drive/Slides download links are included in served code.

Published Sanity cases and members override matching baseline slugs and can introduce additional routes. Existing slug validation, duplicate detection and published perspective remain in use. Home’s new `website` fields support the hero heading, introduction, image, service order and selected case references. Case/member schemas add disciplines, categories, galleries, credits and body content. Existing unrelated CMS documents and legacy Home fields are preserved.

These schema changes are local; the client dataset and hosted Studio were not changed. Baseline case/member records remain code-backed until a reviewed content migration. Unpublishing an override currently reveals its baseline rather than deleting that baseline route. Full roster management, About/House copy and curated Journal article editing should be finalized with the visual design and migrated deliberately; this is not an unrestricted page builder.

## Review-stage gaps and release inputs

- Five TOML-owned Spotify links.
- Approved replacements for the source’s Elvira, Vita and Debora initial portraits; final team roster and the 10 / 25 / 50+ counts. Lum appears only in source drawer copy and has no card/portrait; no roster entry was invented.
- Approved high-resolution House photography; the current image and standalone layout are provisional.
- Final project selection sheet and taxonomy; current content reflects supplied sources and the old site.
- Final approval of credits, metrics, recognition and testimonial wording. Fast Company recognition is explicitly Virtyt Pula’s membership, distinct from The Drum client recommendations.
- Corporate Bonds uses TOML’s supplied exported artwork and links to the full Behance case. Don’t be that guy links to the supplied Behance article; those pages rejected automated retrieval, so no unseen article copy was invented.
- Confirm the current policy’s suitability for the new site. The Privacy route links to the policy PDF found on the old site; no legal wording was invented. Cookies retains a clear pending-information state.
- Enable and accept-test enquiry delivery only after existing production delivery prerequisites are approved. Preview validation works, retains typed content and never claims a message was sent. Newsletter stays on the separate Journal site.
- Review the local visual baseline before remote publication or content migration. No push, deployment, DNS change or external message was performed in this implementation pass.
