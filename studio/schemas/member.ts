import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons/User';
import { urlSlug } from './slug';

export const member = defineType({
  name: 'member', title: 'Member / talent', type: 'document', icon: UserIcon,
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
    urlSlug('name'),
    defineField({ name: 'bio', title: 'Biography', type: 'text', rows: 4 }),
  ],
  preview: { select: { title: 'name' } },
});
