import { defineType, defineField } from 'sanity';

export const photoGalleryType = defineType({
  name: 'photoGallery',
  title: 'Photo Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      description: 'Give this gallery a name',
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      description: "Optional: Enter a custom date format (e.g., 'Easter 2024' or '5 May 2025')",
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: {
        layout: 'grid', // Displays images in a grid view
      },
    }),
  ],
});
