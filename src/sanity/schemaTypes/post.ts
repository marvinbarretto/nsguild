// ./src/sanity/schemaTypes/post.ts
import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: 'News',
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "author",
      type: "reference",
      to: { type: "author" },
    }),
    defineField({
      name: "mainImage",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
    }),
    defineField({
      name: "body",
      type: "blockContent"
    }),
  ],

  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});




// import {defineArrayMember, defineField, defineType} from 'sanity'

// export const postType = defineType({
//   name: 'post',
//   title: 'Post',
//   type: 'document',
//   fields: [
//     defineField({
//       name: 'title',
//       type: 'string',
//       description: 'This is the title of the post. It will show up in the header.',
//       validation: (rule) => rule.required(),
//     }),
//     defineField({
//       name: 'slug',
//       type: 'slug',
//       description: 'This is the what will appear in the URL.. Press the "generate" button to create a slug derived from the title above.',
//       options: {source: 'title'},
//       validation: (rule) => rule.required(),
//     }),


//     defineField({
//       name: 'publishedAt',
//       type: 'datetime',
//       initialValue: () => new Date().toISOString(),
//       validation: (rule) => rule.required(),
//     }),

//     defineField({
//       name: 'body',
//       type: 'array',
//       of: [
//         { type: 'block' }, // Rich text content
//         { type: 'image', options: { hotspot: true } }, // Support images in body
//         {
//           type: 'reference',
//           to: [{ type: 'event' }],
//         }, // Allow embedding events
//       ],
//     }),
//     defineField({
//       name: 'images',
//       title: 'Images',
//       type: 'array',
//       of: [{ type: 'image', options: { hotspot: true } }],
//       options: {
//           layout: 'grid',
//           sortable: true
//       }
//     }),
//     {
//       name: "attachPublication",
//       type: "boolean",
//       title: "Attach a Publication?",
//       description: "Enable this if you want to link a publication to this post.",
//       initialValue: false, // Default to 'off'

//     },
//     defineField({
//       name: "attachedPublication",
//       type: "reference",
//       title: "Attached Publication",
//       to: [{ type: "publication" }],
//       // Only show this field if the toggle is enabled
//       hidden: ({ parent }) => !parent.attachPublication,
//     }),
//   ],
// })