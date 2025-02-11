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
