import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({
      name: "website",
      title: "V4 website design content",
      description:
        "These fields power the V4 design. Blank values use TOML’s supplied deck baseline during design review.",
      type: "object",
      fields: [
        defineField({
          name: "headline",
          title: "Hero heading (one line per phrase)",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "intro",
          title: "Hero introduction",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "hero",
          title: "Hero image",
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Image description", type: "string" }],
        }),
        defineField({
          name: "selectedWork",
          title: "Selected work (in order)",
          type: "array",
          of: [{ type: "reference", to: [{ type: "caseStudy" }] }],
          validation: (Rule) => Rule.max(4),
        }),
        defineField({
          name: "services",
          title: "Services in display order",
          type: "array",
          of: [{ type: "string" }],
        }),
      ],
    }),
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "detailsTitle",
      title: "Second heading",
      type: "string",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "details",
      title: "Second paragraph",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().max(1000),
    }),
  ],
});
