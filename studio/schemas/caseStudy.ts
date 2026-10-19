import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { urlSlug } from "./slug";
import { imageField, galleryField, categoryField } from "./visualFields";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    urlSlug("title"),
    defineField({
      name: "headline",
      title: "Display heading",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "discipline",
      title: "Discipline / collaboration credit",
      type: "string",
    }),
    categoryField(["Branding", "Digital", "Film & content", "Campaigns"]),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({
      name: "partner",
      title: "Agency / production partner credit",
      type: "string",
    }),
    imageField(),
    galleryField(),
    defineField({
      name: "sections",
      title: "Brief, thinking and making",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "title", type: "string", title: "Heading" },
            { name: "text", type: "text", title: "Body copy" },
          ],
        },
      ],
    }),
    defineField({
      name: "outcomeLabel",
      title: "Outcomes / recognition section label",
      type: "string",
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes or deliverables",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Figure or heading", type: "string" },
            { name: "detail", title: "Explanation", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "outcomeNote",
      title: "Attribution / source note",
      type: "text",
    }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3 }),
  ],
});
