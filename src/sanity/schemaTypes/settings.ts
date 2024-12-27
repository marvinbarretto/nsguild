import {defineField, defineType} from 'sanity';
import {linkType} from './link';

export const settingsType = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // defineField({
    //   name: 'siteDescription',
    //   title: 'Site Description',
    //   type: 'text',
    // }),
    defineField({
      name: 'welcomeWidget',
      title: 'Welcome Widget',
      type: 'array',
      of: [
        { type: 'block' }, // Enables rich text editing with headings, lists, etc.
        { type: 'image', options: { hotspot: true } }, // Allows inserting images.
      ],
      description: 'Rich text area for a welcome message to display on the homepage.',
    }),
    defineField({
      name: 'homepageImage',
      title: 'Homepage Image',
      type: 'image',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
    }),

  ],
});

