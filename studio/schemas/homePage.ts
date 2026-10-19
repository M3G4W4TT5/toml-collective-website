import { defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page title', type: 'string', validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: 'intro', title: 'Introduction', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(500) }),
    defineField({ name: 'detailsTitle', title: 'Second heading', type: 'string', validation: (Rule) => Rule.required().max(100) }),
    defineField({ name: 'details', title: 'Second paragraph', type: 'text', rows: 4, validation: (Rule) => Rule.required().max(1000) }),
  ],
});
