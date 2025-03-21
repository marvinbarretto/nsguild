import { defineField, defineType } from 'sanity';

export const globalsType = defineType({
    name: 'globals',
    title: 'Global Settings',
    type: 'document',
    fields: [
        defineField({
            name: 'footerText',
            title: 'Footer Text',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        // Add other global fields here as needed
    ]
});
