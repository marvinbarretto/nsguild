import { defineField, defineType } from 'sanity';

export const contactType = defineType({
    name: 'contact',
    title: 'Contact',
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
        })
    ]
});