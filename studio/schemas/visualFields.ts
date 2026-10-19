import { defineField } from "sanity";
export const imageField = () =>
  defineField({
    name: "image",
    title: "Lead / listing image",
    type: "image",
    options: { hotspot: true },
    fields: [
      { name: "alt", title: "Image description", type: "string" },
      { name: "credit", title: "Published credit", type: "string" },
    ],
  });
export const galleryField = () =>
  defineField({
    name: "gallery",
    title: "Project / portfolio gallery",
    type: "array",
    of: [
      {
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt", title: "Image description", type: "string" },
          { name: "credit", title: "Published credit", type: "string" },
        ],
      },
    ],
  });
export const categoryField = (choices: string[]) =>
  defineField({
    name: "categories",
    title: "Filter categories",
    type: "array",
    of: [{ type: "string" }],
    options: { list: choices },
  });
