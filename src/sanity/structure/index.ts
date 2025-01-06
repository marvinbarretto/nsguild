// ./structure/index.ts

import type { StructureResolver, StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singleton for homepage
      S.listItem()
        .title('Home Page')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),
      // Singleton for contact page
      S.listItem()
        .title('Contact Page')
        .id('contact')
        .child(
          S.document()
            .schemaType('contact')
            .documentId('contact')
        ),
      // Other document types
      ...S.documentTypeListItems().filter(
        (listItem) => !['homepage', 'contact'].includes(listItem.getId() as string)
      ),
    ])