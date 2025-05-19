import { defineType, defineField } from "sanity";

export const equipmentType = defineType({
  name: "equipment",
  title: "Equipment",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Equipment Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "slug",
        title: "Slug",
        type: "slug",
        options: {
          source: "title", // ✅ Generates slug from the title
          maxLength: 96,
        },
        validation: (Rule) => Rule.required(), // ✅ Make slug required
      }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["For Sale", "For Loan"],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],  // ✅ Portable Text for rich descriptions
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    
  ],
});
