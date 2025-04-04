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
        defineField({
            name: 'programmeFile',
            title: 'Programme File (PDF or Word)',
            type: 'file',
            options: {
              accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            },
            description: 'Upload a programme of events (PDF or Word).',
            validation: (rule) => rule.required().error('A programme file is required.'),
          })
    ]
});
