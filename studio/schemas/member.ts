import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";
import { urlSlug } from "./slug";
import { imageField, galleryField, categoryField } from "./visualFields";

export const member = defineType({
  name: "member",
  title: "Member / talent",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    urlSlug("name"),
    defineField({
      name: "shortName",
      title: "Name on listing card",
      type: "string",
    }),
    defineField({ name: "discipline", title: "Discipline", type: "string" }),
    categoryField([
      "Design",
      "Film & photography",
      "Animation & VFX",
      "Writing",
    ]),
    imageField(),
    galleryField(),
    defineField({
      name: "portfolioUrl",
      title: "Original portfolio URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["https"] }),
    }),
    defineField({ name: "bio", title: "Biography", type: "text", rows: 4 }),
  ],
  preview: { select: { title: "name" } },
});
