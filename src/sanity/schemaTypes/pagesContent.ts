import { defineType, defineField } from 'sanity';

export const pagesContentType = defineType({
    name: 'pagesContent',
    title: 'Page Content',
    type: 'document',
    fields: [
        defineField({
            name: 'newsPageDescription',
            type: 'text',
            title: 'News Page Description',
        }),
        defineField({
            name: 'eventsPageDescription',
            type: 'text',
            title: 'Events Page Description',
        }),
        defineField({
            name: 'distaffPageDescription',
            type: 'text',
            title: 'Distaff & Shuttle Page Description',
        }),
        defineField({
            name: 'equipmentPageDescription',
            type: 'text',
            title: 'Equipment Page Description',
        }),
    ]
});