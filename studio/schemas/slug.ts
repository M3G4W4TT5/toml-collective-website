import { defineField } from 'sanity';

export function urlSlug(source: string) {
  return defineField({
    name: 'slug', title: 'URL slug', type: 'slug',
    options: { source, maxLength: 96 },
    validation: (Rule) => Rule.required().custom((value) => (
      typeof value?.current === 'string' && value.current.length <= 96
        && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
        ? true : 'Use lowercase letters, numbers and single hyphens (maximum 96 characters).'
    )),
  });
}
