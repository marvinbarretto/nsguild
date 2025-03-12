import { defineType, defineField } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Homepage Banner",
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Banner Message",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isActive",
      title: "Show Banner?",
      type: "boolean",
      initialValue: false, // Default to hidden
    }),
    defineField({
      name: "link",
      title: "Optional Link",
      type: "url",
    }),
  ],
});
