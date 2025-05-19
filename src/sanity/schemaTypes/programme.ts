import { defineType, defineField } from 'sanity';

export const programmeType = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
      initialValue: 'Events Programme',
      // readOnly: true,
      // hidden: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      type: 'file',
      title: 'Programme File',
      options: {
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      file: 'file.asset',
    },
    prepare({ title, file }) {
      return {
        title: title || 'Untitled',
        subtitle: file ? 'PDF attached' : 'No file uploaded',
      };
    },
  },
});
