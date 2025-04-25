import { defineField, defineType } from 'sanity';

const richTextBlock = {
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Heading', value: 'h3' },
    { title: 'Subheading', value: 'h4' },
    { title: 'Quote', value: 'blockquote' },
  ],
};

export const homepageType = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Homepage',
      };
    },
  },
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
          initialValue: false,
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
      name: "carouselImages",
      title: "Carousel Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      description: "Images for the homepage carousel.",
    }),
    // defineField({
    //   name: 'carouselTransitionDuration',
    //   title: 'Carousel Transition Duration',
    //   type: 'number',
    //   initialValue: 4,
    //   description: 'Duration of transition between carousel images in seconds.',
    // }),
    defineField({
      name: 'whoWeAre',
      title: 'Who We Are',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text for the "Who We Are" section.',
    }),
    defineField({
      name: 'whatWeDo',
      title: 'What We Do',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text for the "What We Do" section.',
    }),
    defineField({
      name: 'whenWeMeet',
      title: 'When We Meet',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text for the "When We Meet" section.',
    }),
    defineField({
      name: 'whereWeMeet',
      title: 'Where We Meet',
      type: 'array',
      of: [richTextBlock],
      description: 'Rich text for the "Where We Meet" section.',
    }),
  ],
});
