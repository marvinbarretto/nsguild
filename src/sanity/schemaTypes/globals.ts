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
        name: 'description',
        description: 'This is the description of the site. It will be picked up by search engines.',
        title: 'Description',
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
      }),
      defineField({
        name: 'metaDescriptions',
        title: 'Meta Descriptions',
        description: 'General descriptions of the pages picked up by search engines',
        type: 'object',
        fields: [
          defineField({
            name: 'homepage',
            title: 'Homepage Description',
            type: 'string',
          }),
          defineField({
            name: 'news',
            title: 'News Page Description',
            type: 'string',
          }),
          defineField({
            name: 'events',
            title: 'Events Page Description',
            type: 'string',
          }),
          defineField({
            name: 'gallery',
            title: 'Gallery Page Description',
            type: 'string',
          }),
          defineField({
            name: 'publications',
            title: 'Distaff & Shuttle Page Description',
            type: 'string',
          }),
          defineField({
            name: 'equipment',
            title: 'Equipment Page Description',
            type: 'string',
          }),
          defineField({
            name: 'contact',
            title: 'Contact Page Description',
            type: 'string',
          }),
        ],
      })

    ]
});
