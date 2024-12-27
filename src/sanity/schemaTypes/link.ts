import { defineField } from 'sanity';

export const linkType = defineField({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'url', type: 'url', title: 'URL' },
  ],
});
