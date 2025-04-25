import { defineType, defineField } from 'sanity';

export const photoGalleryType = defineType({
  name: "photoGallery",
  title: "Photo Gallery",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Gallery Title",
      type: "string",
      description: "Give this gallery a name",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title", // ✅ Generates slug from the title
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "relatedEvent",
      title: "Related Event",
      type: "reference",
      to: [{ type: 'event' }],
      description: "Link this gallery to a specific event.",
    }),
  ],
});
