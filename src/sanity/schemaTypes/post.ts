import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'This is the title of the post. It will show up in the header.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'This is the what will appear in the URL.. Press the "generate" button to create a slug derived from the title above.',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),

    // defineField({
    //   name: 'blockContent',
    //   title: "Block Content",
    //   type: 'array',
    //   of: [
    //     defineArrayMember({
    //       title: 'Block',
    //       type: 'block',
    //       styles: [
    //         { title: 'H1', value: 'h1' },
    //         { title: 'H2', value: 'h2' },
    //         { title: 'H3', value: 'h3' },
    //         { title: 'H4', value: 'h4' },
    //         { title: 'Quote', value: 'blockquote' },
    //         { title: 'Normal', value: 'p' },
    //       ],
    //       lists: [
    //         { title: 'Bullet', value: 'bullet' },
    //         { title: 'Number', value: 'number' },
    //       ],
    //       marks: {
    //         decorators: [
    //           { title: 'Strong', value: 'strong' },
    //           { title: 'Emphasis', value: 'em' },
    //           { title: 'Code', value: 'code' },
    //           { title: 'Underline', value: 'underline' },
    //           { title: 'Strike', value: 'strike-through' },
    //         ],
    //         annotations: [
    //           { title: 'URL', name: 'link', type: 'object', fields: [{ title: 'URL', name: 'href', type: 'url' }] },
    //         ]
    //       }
    //     }),
    //     defineArrayMember({
    //       title: 'Image',
    //       type: 'image',
    //       fields: [{
    //         name: 'alt',
    //         title: 'Alternative Text',
    //         type: 'string',
    //       }]
    //     })
    //   ]
    // }),

    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    // defineField({
    //   name: 'file',
    //   title: 'Attach File (PDF)',
    //   type: 'file',
    //   options: {
    //     accept: '.pdf',
    //   },
    // }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        { type: 'block' }, // Rich text content
        { type: 'image', options: { hotspot: true } }, // Support images in body
        {
          type: 'reference',
          to: [{ type: 'event' }],
        }, // Allow embedding events
      ],
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      options: {
          layout: 'grid',
          sortable: true
      }
    }),
    {
      name: "attachPublication",
      type: "boolean",
      title: "Attach a Publication?",
      description: "Enable this if you want to link a publication to this post.",
      initialValue: false, // Default to 'off'

    },
    defineField({
      name: "attachedPublication",
      type: "reference",
      title: "Attached Publication",
      to: [{ type: "publication" }],
      // Only show this field if the toggle is enabled
      hidden: ({ parent }) => !parent.attachPublication,
    }),
  ],
})