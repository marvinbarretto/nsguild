import { defineField, defineType } from 'sanity';

export const publicationType = defineType({
    name: 'publication',
    title: 'Publication',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),
        defineField({
            name: 'document',
            title: 'document',
            type: 'file',
            options: {
                accept: '.pdf',
            },
            validation: (rule) => rule.required(),
        })
    ],
});
  