import { defineField, defineType } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons/DocumentText';
import { urlSlug } from './slug';

export const caseStudy = defineType({
  name: 'caseStudy', title: 'Case', type: 'document', icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    urlSlug('title'),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 3 }),
  ],
});
