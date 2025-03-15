// ./src/sanity/schemaTypes/blockContent.ts
import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h3' },
        { title: 'Subheading', value: 'h4' },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: "Link",
            name: "link",
            type: "object",
            fields: [
              defineField({
                name: "internalLink",
                title: "Internal Page",
                type: "string",
                options: {
                  list: [
                    { title: "Contact Page", value: "/contact" },
                    { title: "Photo Gallery", value: "/photo-gallery" },
                    { title: "Events", value: "/events" },
                    { title: "Publications", value: "/publications" },
                  ],
                  layout: "dropdown",
                },
              }),
              {
                name: "externalUrl",
                type: "url",
                title: "External URL",
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
  ],
});

