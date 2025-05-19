import { defineType, defineField } from 'sanity';

export const pagesContentType = defineType({
    name: 'pagesContent',
    title: 'Page Content',
    type: 'document',
    fields: [
        defineField({
            name: 'newsPageDescription',
            type: 'blockContent',
            title: 'News Page Description',
        }),
        defineField({
            name: 'eventsPageDescription',
            type: 'blockContent',
            title: 'Events Page Description',
        }),
        defineField({
            name: 'distaffPageDescription',
            type: 'blockContent',
            title: 'Distaff & Shuttle Page Description',
        }),
        defineField({
            name: 'equipmentPageDescription',
            type: 'blockContent',
            title: 'Equipment Page Description',
        }),
    ]
});