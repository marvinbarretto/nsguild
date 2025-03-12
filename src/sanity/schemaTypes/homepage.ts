import {defineField, defineType} from 'sanity';
import { blockContentType } from './blockContent';


export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: "banner",
      title: "Homepage Banner",
      type: "object",
      fields: [
        defineField({
          name: "isActive",
          title: "Show Banner?",
          type: "boolean",
          initialValue: false,  // Default: Banner is OFF
        }),
        defineField({
          name: "message",
          title: "Banner Message",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'welcomeWidget',
      title: 'Welcome Widget',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h3' },
            { title: 'Subheading', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Rich text area for a welcome message to display on the homepage.',
    }),
    defineField({
      name: 'homepageImage',
      title: 'Homepage Image',
      type: 'image',
    }),

  ],
});
