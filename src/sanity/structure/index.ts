
import type { StructureResolver, StructureBuilder } from 'sanity/structure';

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Home Page (Singleton)
      S.listItem()
        .title('Home')
        .id('homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),

      // News (Previously "Post")
      S.listItem()
        .title('News')
        .child(S.documentTypeList('post').title('News')),

      // Events
      S.listItem()
        .title('Events')
        .child(S.documentTypeList('event').title('Events')),

      // Photo Gallery (If there's a corresponding schema)
      S.listItem()
        .title('Photo Gallery')
        .child(S.documentTypeList('photoGallery').title('Photo Gallery')),

      // Publications
      S.listItem()
        .title('Publications')
        .child(S.documentTypeList('publication').title('Publications')),

      // Equipment
      S.listItem()
        .title('Equipment')
        .child(S.documentTypeList('equipment').title('Equipment')),

      // Contact Page (Singleton)
      S.listItem()
        .title('Contact')
        .id('contact')
        .child(S.document().schemaType('contact').documentId('contact')),

      S.divider(), // Separate content from settings

      // Global Settings (Singleton)
      S.listItem()
        .title('⚙️ Global Settings')
        .id('globals')
        .child(S.document().schemaType('globals').documentId('globals')),

      // Other document types not explicitly listed above
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['homepage', 'contact', 'globals', 'post', 'event', 'photoGallery', 'equipment', 'publication'].includes(
            listItem.getId() as string
          )
      ),
    ]);
